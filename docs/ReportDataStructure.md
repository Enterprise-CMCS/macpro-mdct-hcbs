# Report Data Structure

This document is a high-level look at how HCBS stores report data.
It includes some justifications for the architectural decisions,
and looks ahead at possible challenges and changes.
For a more detailed description of report fields, see docs/ReportSchema.md.

HCBS takes an all-in-one approach to storing report data.
Whereas other MDCT apps may store questions, answers, and metadata separately
(in separate tables or even separate AWS services),
this app stores all three as a single object in a DynamoDB table.

## Description

The report object contains metadata as top-level keys:
properties like ID, modify date, status, submission count, and so on.
The top-level key `report.pages` is the entry point for questions and answers;
it lists every page that appears in the report when rendered in a browser.

A page object has top-level properties that dictate its URL, title, and so on.
The top-level key `page.elements` lists all of the "elements" on that page.
Here, "Element" is a flexible concept that expands to hold whatever we need.

An HCBS `PageElement` may be:

- A non-interactive element, like a header or paragraph
- An interactive element like an expandable accordion
- A single input, like a text field, dropdown menu, or radio button list
  - And radio buttons or checkboxes may have nested child `PageElement` arrays
- A group of related inputs ike an NDR
  (Numerator, Denominator, and auto-calculating Rate)
- A placeholder for something even more complicated,
  like a table listing the completion status of other pages

User input is stored directly on the `PageElement`, in the `answer` property.
For example: `{ type: "textbox", label: "First Name", answer: "Ben" }`.
So, question and answer data is tightly integrated.

## Page nesting & ordering

If a page is the first of a logical section of a report,
it will list that section's remaining pages in `page.childPageIds`.
This means that, even though the report may have a logical tree structure,
its actual storage structure is a flat array.

Each report also has a special "root" page with no elements.
It exists only to list the top-level pages as its children.

The flat array makes it easy to iterate over every page in the report,
while making it slightly more difficult to do so _in rendering order_.
A user clicking through the report would essentially
perform a depth-first traversal of that logical tree structure.

## Versioning & change management

One of the central challenges of reporting apps is handling change over time.
How do we add, change, and remove questions,
while still faithfully rendering questions and answers from previous years?

The all-in-one approach is intended to make the latter as easy as possible:
Each report stores all the questions that existed at the moment it was created.
The downside is that changes to existing reports will require migrations:
we will need to write one-time-use Extract, Transform, and Load (ETL) scripts.

Another consequence is that the schema of each `PageElement` becomes locked-in,
as soon as it is included in any production report.
So it's important to put things that are likely to change (like verbiage)
into the element templates rather than the React markup.

The report creation code pulls elements from annual folders in source control.
We expect to copy-paste these folders every year,
making whatever modifications are desired.
This does mean that the code will strictly grow over time!
But any system solving this problem would involve similar growth;
be it in source control, a "templates table" in a database, or somewhere else.

## Storage details

HCBS uses a single DynamoDB table to store all report types.
The partition key indicates the report type and the U.S. state abbreviation.
This makes it slightly easier to add new report types;
there is no need to create a new table.

To avoid DynamoDB item size limits, each report is split into multiple items:
one for top-level properties and one for each page in the report.
The sort key indicates the report's ID,
and for pages also includes the page ID.
When in storage, the top-level object's array of page objects
is replaced with an array of strings: the sort keys of its pages.

These details are hidden from the frontend.
Reports are reassembled into a single object immediately after any query,
and the partition key and sort key properties are deleted.

In theory, size problems are still possible.
For example, we may have a list of elements that users are allowed to expand,
or a free text field into which users may type a novel.
This would cause even a single page to exceed the DynamoDB item size limit.
We don't expect this to happen.
If it becomes a problem, one solution may be to move page storage to S3.

## Final note

As with most application architectures,
the choices we made when designing HCBS were speculative.
We do not know exactly what changes CMS will require in the coming years.
We hope that:

- The PageElement abstraction does a good job of keeping complexity manageable
- The number of ETLs required over time is minimized
- Version-controlling past reports gives meaningfully helpful visibility

Failing that, hopefully HCBS is not too difficult to change,
in whatever ways are needed.
