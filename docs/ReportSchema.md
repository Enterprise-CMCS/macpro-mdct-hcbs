# Report Schema

This document is a detailed look at the structure and fields of HCBS reports.
For a more general overview, see docs/ReportDataStructure.md.

Note that all HCBS report types (QMS, CI, TACM, PCP, WWL) use the same schema.
Top-level fields are treated identically. The pages can have the same elements.
The main exception is in how the QMS report treats measure sub-pages;
more on that below.

## Kafka Topics

Each report type is stored in a separate DynamoDB table,
and each table has a corresponding Kafka topic:

- `aws.mdct.hcbs.qms-reports.v0`
- `aws.mdct.hcbs.tacm-reports.v0`
- `aws.mdct.hcbs.ci-reports.v0`
- `aws.mdct.hcbs.pcp-reports.v0`
- `aws.mdct.hcbs.wwl-reports.v0`

In ephemeral development environments, each topic name is prefixed:
for example, `--hcbs--my-branch-name--aws.mdct.hcbs.qms-reports.v0`

## Report fields

- `id` (string): A [K-Sortable Unique Identifier](https://github.com/segmentio/ksuid?tab=readme-ov-file#what-is-a-ksuid) for this report.
- `state` (string): Two-letter abbreviation for the associated U.S. state or territory.
- `created` (number): Timestamp for report creation. Milliseconds since epoch.
- `lastEdited` (number): Timestamp for report modification.
- `lastEditedBy` (string): The full name of the modifying user.
- `lastEditedByEmail` (string): The email of the modifying user.
- `type` (string): The type of the report ("QMS", "TACM", etc)
- `status` (string): "Not started", "In progress", or "Submitted"
- `name` (string): The user-assigned name for this report.
  When a state has multiple reports of a given type within a given year,
  this name should differentiate them.
- `year` (number): The year for which data is being reported.
- `archived` (boolean): When `true`, this report is hidden from state users.
- `submissionCount` (number): Incremented by calls to the Submit API endpoint.
- `options` (object): Used only for QMS reports; see QMS section below.
- `pages` (object[]): Contains all question and answer data for this report.

## Page fields

Each object in the `report.pages` array represents a screen that the users see.
Except one: Each report has a special "root" page used only to indicate the
order of other top-level page's IDs. Those pages may in turn list child pages.
Thus, the order of the `report.pages` array is largely irrelevant;
instead, the frontend does a depth-first traversal of a logical tree structure.

The root page has only two properties:

- `id` (string): always the exact string "root".
- `childPageIds` (string[]): The `page.id` values of other pages in the report.

The remaining pages will have more properties:

- `id` (string): Identifier, unique within this report (but not across reports).
- `childPageIds` (string[], optional): The `page.id` values of other pages in the report.
- `title` (string): The title of the page, as displayed to the user
- `type` (string): One of "standard", "modal", "measure", "measureResults", or "reviewSubmit".
- `sidebar` (boolean, optional): If not `true`,
  the navigation sidebar will not be displayed on this page.
- `status` (string, optional): One of "Not started", "In progress", "Complete".
  Used only for QMS reports; see QMS section below.
- `hideNavButtons` (boolean, optional): If `true`,
  the usual previous/next buttons will not be displayed on this page.
  Usually only `true` for the Review & Submit page.
- `elements` (object[]): Contains all question and answer data for this page.
- `submittedView` (object[], optional): A separate array of page elements,
  used only on the Review & Submit page, after the report has been submitted.

## Element fields

Each object in the `page.elements` array represents something that the user sees.
Some are presentational, some are inputs or groups of related inputs, and some
are placeholders for report status and navigation aids.

Each element object has a `type` (string) field, indicating its role on the page.

- Presentational element types:
  - `header`: Renders an `<h1>`.
  - `subHeader`: Renders an `<h2>`.
  - `subHeaderMeasure`: When displaying this element,
    the frontend determines whether this measure is required or optional,
    and renders the result in an `<h2>`.
  - `nestedHeading`: Renders an `<h3>`.
  - `accordion`: Renders a disclosure widget, closed by default.
    Often used to provide detailed reporting instructions.
  - `paragraph`: Renders a `<p>`.
  - `measureDetails`: Displays info about the QMS measure for the current page:
    its CMIT number, the measure steward, and so on.
  - `divider`: Renders an `<hr>`
  - `submissionParagraph`: If the current report has been submitted,
    displays the submission date and submitter name.
  - `statusAlert`: May display an informational banner:
    - When on a measure page, displays if the measure has been completed.
    - When on the Review & Submit page, displays if the report is incomplete.
- Simple input element types:
  - `textbox`: A one-line text input field. Answer is a string.
  - `textAreaField`: A multi-line text input field. Answer is a string.
  - `numberField`: A text input field, with number parsing & masking.
    Answer is a number.
  - `date`: A text input field, with date parsing & masking.
    Answer is a string, with format `MM/dd/yyyy`.
  - `dropdown`: A select/combobox field.
    - The `options` property is a `{ label: string, value: string }[]`.
    - The answer is a string (the `value` of an option).
  - `radio`: A set of radio buttons.
    - The options and answer work as they do for `dropdown`
    - But beside `label` and `value`, there may be a `checkedChildren` property.
      This will be an array of elements, shown only if that option is selected.
  - `checkbox`: A set of checkboxes.
    - The options work just like they do for `radio`
    - Answer is a string array.
- Grouped input element types:
  - `listInput`: Allows the user to enter a list.
    - Renders as a textbox with an "add" button.
    - Answer is a string array.
  - `ndr`: A set of three numeric fields: numerator, denominator, and rate.
    - Rate is auto-calculated as soon as numerator and denominator are entered.
    - Answer is an object of type `{ numerator: number, denominator: number, rate: number }`.
  - `ndrBasic`: Similar to NDR, with the same answer shape.
    May have additional properties:
    - `multiplier`: May be applied to the rate during auto-calculation.
      For example, percentage rates would have `multiplier: 100`
    - `minPerformanceLevel`: A threshold which the `rate` should meet.
      If it does not, the user will be shown a warning.
    - `conditionalChildren`: Just like `checkedChildren` for a radio option.
      Shown only if `rate < minPerformanceLevel`.
  - `ndrEnhanced`: A set of rates with a shared denominator.
    - The `assessments` property is an array of `{ id: string, label: string }`
      corresponding to the numerators.
    - Answer is an object of type `{ denominator: number, rates: { numerator: number, rate: number }[] }`
  - `ndrFields`: A collection of rates sets with shared denominators.
    - The `fields` property is an array of `{ id: string, label: string }`
      corresponding to the denominators.
    - The `assessments` property works just like in `ndrEnhanced`.
    - Answer is an array of objects, each of which is the same shape
      as the answer for an `ndrEnhanced` element.
    - For example, if there are two `fields` and three `assessments`,
      there will be six rates in all.
      In this case, the answer will be an array containing two objects,
      each of which will have a `rates` property containing three objects.
  - `lengthOfStay`: A set of seven numeric fields,
    regarding the duration of hospital visits.
    - Five are inputs, two are auto-calculated from those inputs.
    - Answer is an object with numeric values, and these keys: `actualCount, denominator, expectedCount, populationRate, actualRate, expectedRate, adjustedRate`.
    - Used in QMS for LTSS-7 and LTSS-8.
  - `readmissionRate`: A set of nine numeric fields,
    regarding the frequency of repeated hospital visits.
    - Five are inputs, two are auto-calculated from those inputs.
    - Answer is an object with numeric values, and these keys: `stayCount, obsReadmissionCount, obsReadmissionRate, expReadmissionCount, expReadmissionRate, obsExpRatio, beneficiaryCount, outlierCount, outlierRate`.
    - Used in QMS for "MLTSS: Plan All-Cause Readmission".
  - `eligibilityTable`: A set of "Eligibility Requirement" objects.
    - Renders as a table with an "add" button.
    - Clicking the button allows the user to add a row to the table,
      specifying the details for this new requirement.
    - Answer is an array of objects with string values, and these keys: `title, description, recheck, frequency, elibigilityUpdate`.
    - The `recheck` input is rendered as a radio button; its possible values are `Yes` and `No`.
    - The `frequency` input is rendered as a radio button, if and only if `recheck` is `Yes`; its options are listed on the element as `frequencyOptions` with type `{ label: string, value: string }`.
    - The `eligibilityUpdate` input is also a radio button with options `Yes` and `No`.
    - Currently used only in the WWL report.
- Navigational element types:
  - `buttonLink`: Renders a link, with the appearance of a button.
  - `measureTable`: Renders a list of measures, including a link to each.
    - HCBS has only two of these, both in QMS.
    - One shows the required measures, the other shows the optional measures.
  - `measureResultsNavigationTable`: Renders a list of child pages, including a link to each.
    - These only appear on Measure pages in QMS.
      There are usually two child pages:
      One for FFS results, the other for MLTSS results.
  - `statusTable`: Renders a list of other pages on the report,
    showing the completion status of each.
    - This appears in every report, on the last page ("Review & Submit").
  - `measureFooter`: Renders a few buttons.
    - Usually includes previous/next navigation buttons.
    - Used only at the bottom of measure pages in QMS.
    - May also include buttons to reset the measure,
      complete the measure, or complete the section.

## QMS considerations

### Options

Most report types contain the same pages every time.
The QMS report has optional sections which may not be included in the template.
The options object indicates which of these are included.
For example: if, when a user creates a QMS report,
they indicate that their state is reporting on the POM survey,
then `report.options.pom` will be `true`,
and the POM pages will be included in `report.pages`.

The four possible option keys are `cahps, nciidd, nciad, pom`.

This concept is is separate from optional _measures_,
which are always present but can be left empty.

For other report types, `report.options` is always an empty object.

### Required pages

A QMS Measure is a specification defined by CMS, HEDIS or CQL.
Some measures are required, and others are optional, but _this can change_.
In some cases, the user may choose which of two measures they want to fill out.
For example:

- LTSS-6 is always required
- LTSS-3 is always optional
- Either LTSS-1 or FASI-1 is required.
  The default requirement is LTSS-1, but the user may substitute FASI-1.

The `report.pages[i].substitutable` field is a string
indicating which measure this one may be substituted for.
The `report.pages[i].required` field is mutable,
so it stays up-to-date as substitutions occur.

Additionally, Measure pages have dependent MeasureResults pages.
Whether these are required depends on the answers for the Measure page.
In particular, the element with `id: "delivery-method-radio"` asks the user
to indicate whether they are reporting on FFS results, MLTSS results, or both.
The two child pages will then correspond to FFS and MLTSS,
and the user must fill out whichever page(s) they said they would.

There are a few exceptions:

- "HCBS-10" only allows the MLTSS delivery method
- "MLTSS-5" has two unconditional child pages, unrelated to delivery methods.
- "MLTSS: Readmission" only allows the MLTSS delivery method

### Completion Logic

Generally, a page is complete if all of its elements are complete.
An element is complete if it is not required, and it has an answer.
(None of the presentational elements are required,
and the grouped input types have their own completion logic).

In QMS, the situation is more complicated:
for many pages, we rely on the user to indicate whether they are done.
If all of a MeasureResult page's elements are complete,
the user may mark that MeasureResult page as complete.
And if all of a Measure page's MeasureResults pages are complete,
the user may mark that Measure page as complete.

Since the completion of a QMS page isn't directly computable from its elements,
we record it in the separate `report.pages[i].status` field.
