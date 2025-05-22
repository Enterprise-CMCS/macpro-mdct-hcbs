/* eslint-disable no-console */
import { paginateScan, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createClient } from "./utils";

/**
 * This is a data migration function for the QMS elements
 * `performanceRateFacilityDischarges` and `performanceRateFacilityTransitions`.
 * During initial development, we stored the field labels and answers in arrays.
 * Going forward, we will store them in objects.
 * This migration will transform elements in existing reports to the new shape.
 *
 * IN ORDER TO RUN THIS SCRIPT YOU MUST SET THIS ENVIRONMENT VARIABLE
 *   - reportTable (eg "val-qms-reports")
 * AND UNCOMMENT THE `main()` CALL AT THE BOTTOM
 */
export const main = async () => {
  try {
    const TableName = process.env.reportTable;
    const client = createClient();

    console.info("Scanning for existing QMS reports");

    let reportCount = 0;
    let migratedCount = 0;
    for await (let dynamoPage of paginateScan({ client }, { TableName })) {
      for (let report of dynamoPage.Items ?? []) {
        reportCount += 1;
        for (let reportPage of report.pages) {
          for (let element of reportPage.elements) {
            if (needsMigration(element)) {
              migratedCount += 1;
              console.debug(
                `Updating an element in ${report.state} report '${report.name}'`
              );

              updateElement(element);
              await client.send(
                new PutCommand({
                  TableName,
                  Item: report,
                })
              );
            }
          }
        }
      }
    }

    console.info(
      `Migration complete! ${reportCount} reports scanned; ${migratedCount} elements updated.`
    );
    return { status: 200 };
  } catch (err) {
    console.error("Error!", err);
    return { status: 500 };
  }
};

const needsMigration = (element: any) => {
  return element.type === "performanceRate" && element.rateType === "Fields";
};

/** Update the given element _in-place_, so that the report can just be re-put. */
const updateElement = (element: any) => {
  const getFieldLabel = (fieldId: string) => {
    return element.fields.find((f) => f.id === fieldId)!.label;
  };

  const parseAnswerField = (fieldId: string) => {
    const value = element.answer[0].rates[fieldId];
    if (typeof value === "number") return value;
    if (!value) return undefined;
    return parseFloat(value);
  };

  element.type = "lengthOfStay";
  element.labels = {
    performanceTarget: `What is the 2028 state performance target for this assessment?`,
    actualCount: getFieldLabel("count-of-success"),
    denominator: getFieldLabel("fac-count"),
    expectedCount: getFieldLabel("expected-count-of-success"),
    populationRate: getFieldLabel("multi-plan"),
    actualRate: getFieldLabel("opr-min-stay"),
    expectedRate: getFieldLabel("epr-min-stay"),
    adjustedRate: getFieldLabel("rar-min-stay"),
  };

  if (element.answer) {
    element.answer = {
      performanceTarget: parseAnswerField("performanceTarget"),
      actualCount: parseAnswerField("count-of-success"),
      denominator: parseAnswerField("fac-count"),
      expectedCount: parseAnswerField("expected-count-of-success"),
      populationRate: parseAnswerField("multi-plan"),
      actualRate: parseAnswerField("opr-min-stay"),
      expectedRate: parseAnswerField("epr-min-stay"),
      adjustedRate: parseAnswerField("rar-min-stay"),
    };
  }

  delete element.rateType;
  delete element.rateCalc;
  delete element.fields;
};

// main(); // <- uncomment this to make the script actually, like, do stuff
