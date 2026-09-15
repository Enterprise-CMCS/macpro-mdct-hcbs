import {
  ElementType,
  ImaTableTemplate,
  PageElement,
  RadioTemplate,
} from "types";

const isRadioElement = (
  element: Partial<PageElement>
): element is Partial<RadioTemplate> => element.type === ElementType.Radio;

const isImaTableElement = (
  element: Partial<PageElement>
): element is Partial<ImaTableTemplate> =>
  element.type === ElementType.ImaTable;

const isElementNotCompliant = (element: Partial<PageElement>): boolean => {
  if (isRadioElement(element)) {
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
  }

  if (!isImaTableElement(element)) return false;

  const nonCompliantColumnIds = new Set(
    element.columns
      ?.filter((column) => column.nonCompliant)
      .map((column) => column.id)
  );
  const rows = (element.answer ?? element.rows ?? []).filter(
    (row) => !row.isUserCreated
  );
  return rows.some(
    (row) => row.answer && nonCompliantColumnIds.has(row.answer)
  );
};

// Returns true when the configured controller element is non-compliant
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
