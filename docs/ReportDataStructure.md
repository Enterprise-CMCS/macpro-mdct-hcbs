# Report Data Structure

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

## Size concerns

Since all report data is stored together in a single object,
and since some reports may contain free-text fields or repeating structures,
it is possible to exceed the DynamoDB's maximum object size.

We don't see this problem in the present or near future,
but it does loom on the horizon.

One possible resolution would be to break out the pages into separate objects.
Perhaps `report.pages` would become an array of KSUIDs,
each of which would point to another DynamoDB object.
But that would be a very relational way to use a document database...

Another possible approach would involve S3.
Perhaps the DynamoDB entry would remain unchanged,
except that `report.pages` would change from an array of objects to an S3 key.
But spreading the data across multiple AWS services does not sound fun...

## Final note

As with most application architectures,
the choices we made when designing HCBS were speculative.
We do not know exactly what changes CMS will require in the coming years.
We hope that:

- The PageElement abstraction does a good job of keeping complexity manageable
- The number of ETLs required over time is minimized
- Version-controlling past reports gives meaningfully helpful visibility
- Report sizes are not _too_ painful to deal with

Failing that, hopefully HCBS is not too difficult to change,
in whatever ways are needed.
