import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { HideCondition } from "types";
import { elementIsHidden } from "../reportLogic/completeness";
import { useStore } from "../useStore";
import { currentPageSelector } from "../selectors";

export const useElementIsHidden = (
  hideCondition?: HideCondition,
  answerKey?: string
) => {
  const form = useFormContext();
  const currentPage = useStore(currentPageSelector);
  const [hideElement, setHideElement] = useState<boolean>(false);

  useEffect(() => {
    if (!hideCondition || !currentPage?.elements) {
      setHideElement(false);
      return;
    }

    const newHideState = elementIsHidden(hideCondition, currentPage.elements);
    if (!hideElement && newHideState && answerKey) {
      // Hiding - unbind so future updates don't continue overwriting
      form.unregister(answerKey);
      setHideElement(newHideState);
    } else if (hideElement && !newHideState && answerKey) {
      // Unhiding

      // form.clearErrors(answerKey); // continue to investigate
      setHideElement(newHideState);
    }
  }, [currentPage]);
  return hideElement;
};
