import {
  assertExhaustive,
  ComplianceRules,
  ElementType,
  ImaTableTemplate,
  PageElement,
  RadioTemplate,
} from "types";

type ImaTableComplianceResult = {
  isNonCompliant: boolean | undefined;
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
  matches: (answer: string) => boolean
): ImaTableComplianceResult => {
  const answerRows = getEligibleAnswerRows(table);
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
    default:
      assertExhaustive(table.complianceRule);
      console.error(`Unknown compliance rule: ${table.complianceRule}`);
      return { isNonCompliant: undefined };
  }
};

const isRadioButtonNonCompliant = (element: RadioTemplate) => {
  const selectedValue = element.answer;
  if (typeof selectedValue !== "string") return false;

  const selectedChoice = element.choices?.find(
    (choice) => choice.value === selectedValue
  );
  const selectedChildIsNotCompliant =
    selectedChoice?.checkedChildren?.some(isElementNotCompliant) === true;
  return (
    selectedValue === element.nonCompliantOn || selectedChildIsNotCompliant
  );
};

const isElementNotCompliant = (
  element: Partial<PageElement>
): boolean | undefined => {
  switch (element.type) {
    case ElementType.ImaTable:
      return isImaTableNonCompliant(element as ImaTableTemplate).isNonCompliant;
    case ElementType.Radio:
      return isRadioButtonNonCompliant(element as RadioTemplate);
    default:
      return false;
  }
};

// Returns true when the configured controller element is non-compliant, including any selected child branch that is marked non-compliant
export const isNotCompliant = (
  controllerElementId: string,
  elements: Partial<PageElement>[]
) => {
  const controllingElement = elements.find(
    (element) => element.id === controllerElementId
  );
  if (!controllingElement) return false;
  return isElementNotCompliant(controllingElement);
};
