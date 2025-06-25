import React, { useState, useEffect, useContext } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { get, useFormContext } from "react-hook-form";
import { ChoiceTemplate, RadioTemplate } from "types";
import { parseHtml, useStore } from "utils";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Page } from "components/report/Page";
import { ChoiceProps } from "@cmsgov/design-system/dist/react-components/types/ChoiceList/ChoiceList";
import { requiredResponse } from "../../constants";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { ReportAutosaveContext } from "components/report/ReportAutosaveProvider";
import { Modal } from "components";

const formatChoices = (
  parentKey: string,
  choices: ChoiceTemplate[],
  answer?: string
): ChoiceProps[] => {
  return choices.map((choice, choiceIndex) => {
    if (!choice?.checkedChildren) {
      return {
        ...choice,
        checked: choice.value === answer,
        checkedChildren: [],
      };
    }

    const children = choice.checkedChildren.map((child, childIndex) => ({
      ...child,
      formkey: `${parentKey}.choices.${choiceIndex}.checkedChildren.${childIndex}`,
    }));

    const checkedChildren = [
      <Box key="radio-sub-page" sx={sx.children}>
        <Page elements={children} />
      </Box>,
    ];

    return {
      ...choice,
      checkedChildren,
      checked: choice.value === answer,
    };
  });
};

const hintTextColor = (clickAction: string) => {
  switch (clickAction) {
    case "qmReportingChange":
    case "qmDeliveryMethodChange":
      return "palette.warn_darkest";
    default:
      return "palette.gray";
  }
};

export const RadioField = (props: PageElementProps<RadioTemplate>) => {
  const radio = props.element;
  const { clearMeasure, changeDeliveryMethods, currentPageId, setAnswers } =
    useStore();
  const { autosave } = useContext(ReportAutosaveContext);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;

  useEffect(() => {
    const options = { required: radio.required ? requiredResponse : false };
    form.setValue(key, radio.answer);
    form.register(key, options);
    if (radio.answer) {
      form.setValue(`${props.formkey}.type`, radio.type);
    }
  }, []);

  const [displayValue, setDisplayValue] = useState<ChoiceProps[]>([]);
  const hideElement = useElementIsHidden(radio.hideCondition, key);
  const [tempEvent, setTempEvent] =
    useState<React.ChangeEvent<HTMLInputElement> | null>(null);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(
      formatChoices(`${props.formkey}`, radio.choices, radio.answer) ?? []
    );
  }, [radio.answer]);

  const {
    isOpen: radioModalIsOpen,
    onOpen: radioModalOnOpenHandler,
    onClose: radioModalOnCloseHandler,
  } = useDisclosure();

  const modalConfirmHandler = () => {
    onChangeHandler(tempEvent as React.ChangeEvent<HTMLInputElement>);
    modalCloseCustomHandler();
  };

  const modalCloseCustomHandler = () => {
    setTempEvent(null);
    radioModalOnCloseHandler();
  };
  // OnChange handles setting the visual of the radio on click, outside the normal blur
  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (
      radio.clickAction === "qmDeliveryMethodChange" &&
      radio.answer &&
      tempEvent === null
    ) {
      setTempEvent(event);
      return radioModalOnOpenHandler();
    }

    const newValues = displayValue.map((choice) => {
      choice.checked = choice.value === value;
      return choice;
    });
    setDisplayValue(newValues);
    /**
     * This is not ideal but we need to unregister the current radio
     * element before setting the again values.
     * There is (seemingly) a bug in react hook form with yup validation:
     *
     * If a child of a radio choice has errors and then
     * the child element gets cleared from the page by switching to
     * radio option that doesn't have children, the children errors do
     * not get cleared from the form and it breaks so we have to clear here
     * manually by doing unregister.
     *
     * If there's a bug with saving radio values, it's probably this line.
     */
    form.unregister(props.formkey);
    form.setValue(name, value, { shouldValidate: true });
    form.setValue(`${props.formkey}.type`, radio.type);
    form.setValue(`${props.formkey}.label`, radio.label);
    form.setValue(`${props.formkey}.id`, radio.id);

    if (!radio.clickAction || !currentPageId) return;
    switch (radio.clickAction) {
      case "qmReportingChange":
        if (value === "no") {
          clearMeasure(currentPageId, { [radio.id]: value });
          autosave();
          event.stopPropagation(); // This action is doing its own effect outside of normal change.
        }
        return;
      case "qmDeliveryMethodChange":
        changeDeliveryMethods(currentPageId, value);
        // Update zustand state with latest form values
        setAnswers(form.getValues());
        return; // after the clear, allow normal setting of this page to occur
    }
  };

  // prepare error message, hint, and classes
  const formErrors = form?.formState?.errors;
  const errorMessage: string | undefined = get(formErrors, key)?.message;

  const parsedHint = (
    // This is as="span" because it is inside a CMSDS Hint, which is a <p>.
    <Box as="span" color={hintTextColor(radio.clickAction!)}>
      {radio.helperText && parseHtml(radio.helperText)}
    </Box>
  );
  const labelText = radio.label;

  if (hideElement) {
    return null;
  }
  return (
    <Box>
      <CmsdsChoiceList
        name={key}
        type={"radio"}
        label={labelText || ""}
        choices={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        onChange={onChangeHandler}
        {...props}
      />
      <Modal
        data-testid="confirm-modal"
        modalDisclosure={{
          isOpen: radioModalIsOpen,
          onClose: modalCloseCustomHandler,
        }}
        onConfirmHandler={modalConfirmHandler}
        content={{
          heading: "Are you sure?",
          subheading:
            "Warning: Changing this response will clear any data previously entered in the corresponding delivery system measure results sections.",
          actionButtonText: "Yes",
          closeButtonText: "No",
        }}
      ></Modal>
    </Box>
  );
};

const sx = {
  children: {
    padding: "0 22px",
    border: "4px #0071BC solid",
    borderWidth: "0 0 0 4px",
    margin: "0 14px",
    input: {
      width: "240px",
    },
    textarea: {
      width: "440px",
    },
  },
};
