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
      return;
    }

    const hidden = elementIsHidden(hideCondition, currentPage.elements);
    if (hidden && answerKey) {
      form.unregister(answerKey); // unbind so future updates don't continue overwriting
    }
    setHideElement(hidden);
  }, [currentPage]);
  return hideElement;
};
