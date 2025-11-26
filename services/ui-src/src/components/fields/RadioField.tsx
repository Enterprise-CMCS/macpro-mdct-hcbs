import React, { useState, useEffect, useContext } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { ChoiceTemplate, PageElement, RadioTemplate } from "types";
import { parseHtml, useStore } from "utils";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Page } from "components/report/Page";
import { ChoiceProps } from "@cmsgov/design-system/dist/react-components/types/ChoiceList/ChoiceList";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { ReportAutosaveContext } from "components/report/ReportAutosaveProvider";
import { Modal } from "components";

const formatChoices = (
  choices: ChoiceTemplate[],
  answer: string | undefined,
  updateElement: (element: Partial<RadioTemplate>) => void
): ChoiceProps[] => {
  return choices.map((choice, choiceIndex) => {
    if (!choice.checkedChildren) {
      return {
        ...choice,
        checked: choice.value === answer,
        checkedChildren: [],
      };
    }

    const setCheckedChildren = (checkedChildren: PageElement[]) => {
      updateElement({
        choices: [
          ...choices.slice(0, choiceIndex),
          { ...choice, checkedChildren },
          ...choices.slice(choiceIndex + 1),
        ],
      });
    };

    const checkedChildren = [
      <Box key="radio-sub-page" sx={sx.children}>
        <Page
          id="radio-children"
          setElements={setCheckedChildren}
          elements={choice.checkedChildren}
        />
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
      return "palette.gray_dark";
  }
};

export const RadioField = (props: PageElementProps<RadioTemplate>) => {
  const radio = props.element;
  const { clearMeasure, changeDeliveryMethods, currentPageId } = useStore();
  const { autosave } = useContext(ReportAutosaveContext);

  const initialDisplayValue = formatChoices(
    radio.choices,
    radio.answer,
    props.updateElement
  );
  const [displayValue, setDisplayValue] = useState(initialDisplayValue);
  const hideElement = useElementIsHidden(radio.hideCondition);
  const [eventToBeConfirmed, setEventToBeConfirmed] = useState<
    React.ChangeEvent<HTMLInputElement> | undefined
  >();

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(
      formatChoices(radio.choices, radio.answer, props.updateElement)
    );
  }, [radio.choices, radio.answer]);

  const {
    isOpen: radioModalIsOpen,
    onOpen: radioModalOnOpenHandler,
    onClose: radioModalOnCloseHandler,
  } = useDisclosure();

  const modalConfirmHandler = () => {
    onChangeHandler(eventToBeConfirmed as React.ChangeEvent<HTMLInputElement>);
    modalCloseCustomHandler();
  };

  const modalCloseCustomHandler = () => {
    setEventToBeConfirmed(undefined);
    radioModalOnCloseHandler();
  };

  // OnChange handles setting the visual of the radio on click, outside the normal blur
  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (
      radio.clickAction === "qmDeliveryMethodChange" &&
      radio.answer &&
      eventToBeConfirmed === undefined
    ) {
      setEventToBeConfirmed(event);
      return radioModalOnOpenHandler();
    }

    const newDisplayValue = formatChoices(
      radio.choices,
      value,
      props.updateElement
    );
    setDisplayValue(newDisplayValue);

    props.updateElement({ answer: value });

    if (!radio.clickAction || !currentPageId) {
      return;
    }

    switch (radio.clickAction) {
      case "qmReportingChange":
        if (value === "no") {
          clearMeasure(currentPageId, { [radio.id]: value });
          autosave();
        }
        return;
      case "qmDeliveryMethodChange":
        changeDeliveryMethods(currentPageId, value);
        autosave();
        return;
    }
  };

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
        name={radio.id}
        type={"radio"}
        label={labelText || ""}
        choices={displayValue}
        hint={parsedHint}
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
    "input:not(.ds-c-choice)": {
      width: "240px",
    },
    textarea: {
      maxWidth: "440px",
    },
  },
};
