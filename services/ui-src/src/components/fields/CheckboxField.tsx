import React, { useState, useEffect, useContext } from "react";
import { Box, ListItem, UnorderedList, useDisclosure } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import {
  AlertTypes,
  CheckboxTemplate,
  ChoiceTemplate,
  PageElement,
} from "types";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { ChoiceProps } from "@cmsgov/design-system/dist/react-components/types/ChoiceList/ChoiceList";
import { Page } from "components/report/Page";
import { Alert } from "components/alerts/Alert";
import { ReportAutosaveContext } from "components/report/ReportAutosaveProvider";
import { useStore } from "utils";
import { Modal } from "components";

const formatChoices = (
  choices: ChoiceTemplate[],
  answer: string[],
  updateElement: (element: Partial<CheckboxTemplate>) => void
): ChoiceProps[] => {
  return choices.map((choice, choiceIndex) => {
    if (!choice.checkedChildren) {
      return {
        ...choice,
        checked: answer?.includes(choice.value),
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
      <Box key="checkbox-sub-page" sx={sx.children}>
        <Page
          id="checkbox-children"
          setElements={setCheckedChildren}
          elements={choice.checkedChildren}
        />
      </Box>,
    ];

    return {
      ...choice,
      checkedChildren,
      checked: answer?.includes(choice.value),
    };
  });
};

export const CheckboxField = (props: PageElementProps<CheckboxTemplate>) => {
  const checkbox = props.element;
  const { clearHiddenElements, currentPageId } = useStore();
  const { autosave } = useContext(ReportAutosaveContext);
  const initialDisplayValue = formatChoices(
    checkbox.choices,
    checkbox.answer ?? [],
    props.updateElement
  );
  const [displayValue, setDisplayValue] = useState(initialDisplayValue);
  const [pendingValue, setPendingValue] = useState<string>();
  const [showRemovalWarning, setShowRemovalWarning] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const closeModal = () => {
    setPendingValue(undefined);
    onClose();
  };

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(
      formatChoices(
        checkbox.choices,
        checkbox.answer ?? [],
        props.updateElement
      )
    );
  }, [checkbox.choices, checkbox.answer]);

  const changeSelection = (value: string) => {
    let set = new Set(checkbox.answer);

    if (set.has(value)) set.delete(value);
    else set.add(value);

    const newValue = [...set];
    const newDisplayValue = formatChoices(
      checkbox.choices,
      newValue,
      props.updateElement
    );
    setDisplayValue(newDisplayValue);
    props.updateElement({ answer: newValue });

    if (!checkbox.clickAction || !currentPageId) {
      return;
    }

    switch (checkbox.clickAction) {
      case "serviceTypeChange":
        clearHiddenElements(currentPageId, checkbox.id);
        autosave();
        return;
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      checkbox.clickAction === "serviceTypeChange" &&
      checkbox.answer?.includes(value)
    ) {
      setPendingValue(value);
      onOpen();
      return;
    }
    changeSelection(value);
  };

  const confirmSelection = () => {
    if (pendingValue !== undefined) {
      changeSelection(pendingValue);
      setShowRemovalWarning(true);
    }
    closeModal();
  };

  const labelText = checkbox.label;

  return (
    <Box>
      <CmsdsChoiceList
        name={checkbox.id}
        type={"checkbox"}
        label={labelText || ""}
        choices={displayValue}
        hint={
          checkbox.clickAction === "serviceTypeChange" && showRemovalWarning ? (
            <>
              {checkbox.helperText}
              <Box as="span" display="block" color="palette.warn_darkest">
                Warning: Changing this response will clear any data previously
                entered in the corresponding delivery system measure results
                sections.
              </Box>
            </>
          ) : (
            checkbox.helperText
          )
        }
        onChange={onChangeHandler}
        {...props}
      />
      {checkbox.clickAction === "serviceTypeChange" && (
        <Modal
          modalDisclosure={{ isOpen, onClose: closeModal }}
          onConfirmHandler={confirmSelection}
          content={{
            heading: "Are you sure?",
            subheading:
              "Warning: Changing this response will clear any data previously entered in the corresponding service sections.",
            actionButtonText: "Yes",
            closeButtonText: "No",
          }}
        />
      )}
      {displayValue.length === 0 && !!checkbox.emptyAlertDescription ? (
        <Box mt={2}>
          <Alert
            title={checkbox.emptyAlertTitle ?? ""}
            status={AlertTypes.WARNING}
          >
            {checkbox.emptyAlertDescription}
          </Alert>
        </Box>
      ) : null}
    </Box>
  );
};

export const CheckboxExport = (element: CheckboxTemplate) => {
  if (!element.answer || element.answer.length === 0) {
    return <></>;
  }
  const getLabel = (choiceId: string) =>
    element.choices.find((choice) => choice.value === choiceId)!.label;
  return (
    <UnorderedList sx={sx.checkboxExport}>
      {element.answer.map((choiceId) => (
        <ListItem key={choiceId}>{getLabel(choiceId)}</ListItem>
      ))}
    </UnorderedList>
  );
};

const sx = {
  children: {
    padding: "0 0 0 22px",
    border: "4px #0071BC solid",
    borderWidth: "0 0 0 4px",
    margin: "0 0 0 14px",
    "input:not(.ds-c-choice)": {
      width: "240px",
    },
    textarea: {
      maxWidth: "460px",
    },
  },
  checkboxExport: {
    listStyleType: "none",
    marginLeft: 0,
    "& > li + li": {
      marginTop: 1,
    },
  },
};
