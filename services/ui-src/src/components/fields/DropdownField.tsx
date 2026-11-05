import { useState, useEffect } from "react";
import { PageElementProps } from "components/report/Elements";
import { DropdownTemplate } from "types";
import {
  Dropdown as CmsdsDropdownField,
  DropdownChangeObject,
} from "@cmsgov/design-system";
import { parseHtml } from "utils";

export const DropdownField = (props: PageElementProps<DropdownTemplate>) => {
  /**
   * TODO:
   * https://design.cms.gov/components/dropdown/?theme=core
   * WCAG 2.1 Level AA Conformance missing - Roll as custom dropdown
   */
  const dropdown = props.element;
  const defaultValue = dropdown.answer ?? dropdown.options[0].value;
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(dropdown.answer ?? dropdown.options[0].value);
  }, [dropdown.answer]);

  const onChangeHandler = async (event: DropdownChangeObject) => {
    const value = event.target.value;
    setDisplayValue(value);
    props.updateElement({ answer: value });
  };

  const parsedHint = dropdown.helperText && parseHtml(dropdown.helperText);
  const labelText = dropdown.label;

  return (
    <CmsdsDropdownField
      name={dropdown.id}
      label={labelText}
      hint={parsedHint}
      onChange={onChangeHandler}
      options={dropdown.options}
      value={displayValue}
      disabled={props.disabled}
    />
  );
};
