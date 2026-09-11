import { useEffect, useState } from "react";
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
  const [hideElement, setHideElement] = useState<boolean>(false);

  useEffect(() => {
    if (!currentPage?.elements) {
      return;
    }

    const hidden = elementIsHidden(
      hideCondition,
      currentPage.elements,
      showWhenNonCompliant
    );
    setHideElement(hidden);
  }, [currentPage, hideCondition, showWhenNonCompliant]);

  return hideElement;
};
