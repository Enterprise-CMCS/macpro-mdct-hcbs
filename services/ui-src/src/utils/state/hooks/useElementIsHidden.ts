import { HideCondition } from "types";
import { elementIsHidden } from "../reportLogic/completeness";
import { useStore } from "../useStore";
import { currentPageSelector } from "../selectors";

export const useElementIsHidden = (
  hideCondition?: HideCondition,
  showWhenNonCompliant?: string[]
) => {
  if (!hideCondition && !showWhenNonCompliant) {
    // An element without a hide condition is never hidden.
    return false;
  }

  const currentPage = useStore(currentPageSelector);
  return currentPage?.elements
    ? elementIsHidden(hideCondition, currentPage.elements, showWhenNonCompliant)
    : false;
};
