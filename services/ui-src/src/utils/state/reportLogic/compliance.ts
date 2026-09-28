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

// TODO: not yet wired up to any real table (IMA doc II.F.2 investigation
//  referrals table isn't built yet). Two independent triggers, combined with OR:
//    1. any row answered with one of PARTIAL_SHARING_ANSWERS
//    2. every eligible row answered "not-referred" (mirrors AllNotReferred)
//  Update PARTIAL_SHARING_ANSWERS to match the real answer values once that
//  table is built.
const PARTIAL_SHARING_ANSWERS = [
  "no-info-shared",
  "status-only",
  "resolution-only",
];

const tableHasAnyPartialOrAllNotReferredAnswers = (
  table: ImaTableTemplate
): ImaTableComplianceResult => {
  const anyPartial = anyRowAnswers(table, (answer) =>
    PARTIAL_SHARING_ANSWERS.includes(answer)
  );
  const allNotReferred = allRowsAnswer(
    table,
    (answer) => answer === "not-referred"
  );

  const isNonCompliant =
    anyPartial.isNonCompliant || allNotReferred.isNonCompliant;

  return {
    isNonCompliant,
    nonCompliantRowIds: isNonCompliant
      ? [
          ...(anyPartial.nonCompliantRowIds ?? []),
          ...(allNotReferred.nonCompliantRowIds ?? []),
        ]
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
    // TODO: no table uses this rule yet. See IMA doc II.F.2.
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
