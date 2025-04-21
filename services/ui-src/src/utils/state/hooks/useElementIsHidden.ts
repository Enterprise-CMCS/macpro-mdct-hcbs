import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { HideCondition } from "types";
import { elementIsHidden } from "../reportLogic/completeness";

export const useElementIsHidden = (hideCondition?: HideCondition) => {
  // TODO: Existing bug: Page reload doesn't get set correctly, possible lifecycle issue with form default
  const form = useFormContext();
  const [hideElement, setHideElement] = useState<boolean>(false);

  useEffect(() => {
    const formValues = form.getValues() as any;
    if (formValues && Object.keys(formValues).length === 0) {
      return;
    }
    const hidden =
      formValues?.elements &&
      elementIsHidden(hideCondition, formValues.elements);
    setHideElement(hidden);
  }, [form.getValues()]);

  return hideElement;
};
