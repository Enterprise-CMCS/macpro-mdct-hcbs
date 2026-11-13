import {
  assertExhaustive,
  ComplianceRules,
  ElementType,
  ImaTableRow,
  ImaTableTemplate,
  PageElement,
  RadioTemplate,
} from "types";

type ImaTableComplianceResult = {
  isNonCompliant?: boolean;
  nonCompliantRowIds?: string[];
};

const getEligibleAnswerRows = (
  table: ImaTableTemplate,
  includeUnanswered = false
) =>
  (table.answer ?? table.rows)?.filter(
    (row) => (includeUnanswered || !!row.answer) && !row.isUserCreated
  );

const anyRowAnswers = (
  table: ImaTableTemplate,
  matches: (answer: string) => boolean,
  isEligible: (row: ImaTableRow) => boolean = () => true
): ImaTableComplianceResult => {
  const answerRows = getEligibleAnswerRows(table)?.filter(isEligible);
  if (!answerRows?.length) return { isNonCompliant: undefined };

  const nonCompliantRows = answerRows.filter((row) => matches(row.answer!));

  return {
    isNonCompliant: nonCompliantRows.length > 0,
    nonCompliantRowIds: nonCompliantRows.map((row) => row.id),
  };
};

const allRowsAnswer = (
  table: ImaTableTemplate,
  matches: (answer: string) => boolean
): ImaTableComplianceResult => {
  const answerRows = getEligibleAnswerRows(table, true);
  if (!answerRows?.length) return { isNonCompliant: undefined };

  const matchingRows = answerRows.filter((row) => matches(row.answer ?? ""));
  const isNonCompliant = matchingRows.length === answerRows.length;

  return {
    isNonCompliant,
    nonCompliantRowIds: isNonCompliant
      ? matchingRows.map((row) => row.id)
      : undefined,
  };
};

const tableHasAnyNoAnswers = (table: ImaTableTemplate) =>
  anyRowAnswers(table, (answer) => answer === "no");

const tableHasAnyNonYesAnswers = (table: ImaTableTemplate) =>
  anyRowAnswers(table, (answer) => answer !== "yes");

const tableHasAllNoAnswers = (table: ImaTableTemplate) =>
  allRowsAnswer(table, (answer) => answer === "no");

const tableHasAllNotReferredAnswers = (table: ImaTableTemplate) =>
  allRowsAnswer(table, (answer) => answer === "not-referred");

// TODO: not yet wired up to any real table (IMA doc II.D.2/II.E.2 data-
//  source tables aren't built yet). Only rows in RELEVANT_ROW_IDS count toward
//  compliance; noncompliance triggers if any of those rows are answered
//  NON_COMPLIANT_ANSWER. Other rows in the same table never affect compliance.
//  Update these literals to match the real row ids/answer value once that
//  table is built.
const RELEVANT_ROW_IDS = ["claims-data", "mfcu", "aps", "cps"];
const NON_COMPLIANT_ANSWER = "permissible-but-unused";

const tableHasAnyRelevantRowMatchingValue = (table: ImaTableTemplate) =>
  anyRowAnswers(
    table,
    (answer) => answer === NON_COMPLIANT_ANSWER,
    (row) => RELEVANT_ROW_IDS.includes(row.id)
  );

const tableHasAnyPartialOrAllNotReferredAnswers = (
  table: ImaTableTemplate
): ImaTableComplianceResult => {
  const answeredRows = getEligibleAnswerRows(table, true);
  if (!answeredRows?.length || answeredRows.some((row) => !row.answer)) {
    return { isNonCompliant: undefined };
  }

  const isNonCompliant = !answeredRows.some((row) => row.answer === "both");

  return {
    isNonCompliant,
    nonCompliantRowIds: isNonCompliant
      ? answeredRows.map((row) => row.id)
      : undefined,
  };
};

export const isImaTableNonCompliant = (
  table: ImaTableTemplate
): ImaTableComplianceResult => {
  switch (table.complianceRule) {
    case ComplianceRules.AnyNo:
      return tableHasAnyNoAnswers(table);
    case ComplianceRules.AnyNonYes:
      return tableHasAnyNonYesAnswers(table);
    case ComplianceRules.AllNo:
      return tableHasAllNoAnswers(table);
    case ComplianceRules.AllNotReferred:
      return tableHasAllNotReferredAnswers(table);
    // TODO: no table uses this rule yet. See IMA doc II.D.2/II.E.2.
    case ComplianceRules.AnyRelevantRowMatchesValue:
      return tableHasAnyRelevantRowMatchingValue(table);
    case ComplianceRules.AnyPartialOrAllNotReferred:
      return tableHasAnyPartialOrAllNotReferredAnswers(table);
    default:
      assertExhaustive(table.complianceRule);
      console.error(`Unknown compliance rule: ${table.complianceRule}`);
      return { isNonCompliant: undefined };
  }
};

const isRadioButtonNonCompliant = (element: RadioTemplate) => {
  if (typeof element.answer !== "string") return undefined;
  if (element.answer === element.nonCompliantOn) return true;
  return element.choices
    .find((choice) => choice.value === element.answer)
    ?.checkedChildren?.some(isElementNotCompliant);
};

const isElementNotCompliant = (element: PageElement): boolean | undefined => {
  switch (element.type) {
    case ElementType.ImaTable:
      return isImaTableNonCompliant(element).isNonCompliant;
    case ElementType.Radio:
      return isRadioButtonNonCompliant(element);
    default:
      return false;
  }
};

// Returns true when the configured controller element is non-compliant, including any selected child branch that is marked non-compliant
export const isNotCompliant = (
  controllerElementId: string,
  elements: PageElement[]
) => {
  const controllingElement = elements.find(
    (element) => element.id === controllerElementId
  );
  if (!controllingElement) return false;
  return isElementNotCompliant(controllingElement);
};
