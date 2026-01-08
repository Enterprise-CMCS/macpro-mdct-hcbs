import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Link,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
} from "@chakra-ui/react";
import { EligibilityTableTemplate, EligibilityTableItem } from "types";
import { PageElementProps } from "../Elements";
import { Fragment, useState, ChangeEvent, useEffect } from "react";
import addIcon from "assets/icons/add/icon_add_blue.svg";
import cancelIcon from "assets/icons/cancel/icon_cancel_primary.svg";
import closeIcon from "assets/icons/close/icon_close_primary.svg";
import { ChoiceList, TextField } from "@cmsgov/design-system";
import { ErrorMessages } from "../../../constants";
import { ExportRateTable } from "components/export/ExportedReportTable";

export const EligibilityTableElement = (
  props: PageElementProps<EligibilityTableTemplate>
) => {
  const { element, updateElement } = props;
  const { fieldLabels, modalInstructions, frequencyOptions } = element;

  const initialValues = {
    title: "",
    description: "",
    recheck: "",
    frequency: "",
    eligibilityUpdate: "",
  };

  const [eligibilityItems, setEligibilityItems] = useState<
    EligibilityTableItem[]
  >(structuredClone(element.answer) || []);
  const [formValues, setFormValues] = useState(initialValues);
  const [errorMessages, setErrorMessages] = useState(initialValues);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"Add" | "Edit">("Add");
  const [selectedItemTitle, setSelectedItemTitle] = useState<string>("");

  useEffect(() => {
    setErrorMessages(initialValues);
  }, [modalOpen]);

  useEffect(() => {
    // Clear the child radio if the parent radio is not "Yes"
    if (formValues.recheck !== "Yes") {
      setFormValues((prev) => ({ ...prev, frequency: "" }));
    }
  }, [formValues.recheck]);

  const validateField = (name: string, value: string) => {
    if (name === "frequency" && formValues.recheck !== "Yes") {
      return "";
    }

    if (!value) {
      return ErrorMessages.requiredResponse;
    }
    if (name === "title" && selectedItemTitle !== value) {
      const isDuplicate = eligibilityItems.some(
        (item) => item.title.toLowerCase() === value.toLowerCase()
      );
      if (isDuplicate) {
        return "Title must be unique";
      }
    }
    return "";
  };

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessages((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleDeleteClick = (title: string) => {
    const updatedItems = eligibilityItems.filter(
      (item) => item.title !== title
    );
    setEligibilityItems(updatedItems);
    updateElement({ answer: updatedItems });
  };

  const onSubmit = () => {
    let errors = { ...initialValues };
    let hasError = false;
    for (const key of Object.keys(formValues) as Array<
      keyof typeof formValues
    >) {
      errors[key] = validateField(key, formValues[key]);
      if (errors[key]) hasError = true;
    }

    setErrorMessages(errors);
    if (hasError) return;

    let updatedItems;

    if (modalMode === "Add") {
      updatedItems = [...eligibilityItems, formValues];
    } else if (modalMode === "Edit") {
      updatedItems = eligibilityItems.map((item) =>
        item.title === selectedItemTitle ? formValues : item
      );
    }

    if (!updatedItems) return;

    setEligibilityItems(updatedItems);
    updateElement({ answer: updatedItems });
    setModalOpen(false);
    setFormValues(initialValues);
  };

  const onAddClick = () => {
    setModalMode("Add");
    setFormValues(initialValues);
    setSelectedItemTitle("");
    setModalOpen(true);
  };

  const onEditClick = (eligibility: EligibilityTableItem) => {
    setModalMode("Edit");
    setFormValues(eligibility);
    setSelectedItemTitle(eligibility.title);
    setModalOpen(true);
  };

  const rows = eligibilityItems.map((eligibility, index) => {
    return (
      <Tr key={index}>
        <Td width="100%" padding="spacer2 !important">
          <Text fontWeight="heading_md" fontSize="heading_md">
            {eligibility.title}
          </Text>
          <Text>Recheck: {eligibility.recheck}</Text>
          <Text>Frequency: {eligibility.frequency || "N/A"}</Text>
          <Text>Eligibility Update: {eligibility.eligibilityUpdate}</Text>
        </Td>
        <Td>
          <Button
            as={Link}
            variant={"outline"}
            aria-label={`Edit ${eligibility.title}`}
            onClick={() => {
              onEditClick(eligibility);
            }}
          >
            Edit
          </Button>
        </Td>
        <Td>
          <Button
            variant="plain"
            aria-label={`Delete ${eligibility.title}`}
            onClick={() => {
              handleDeleteClick(eligibility.title);
            }}
          >
            <Image src={cancelIcon} alt={"Delete Item"} />
          </Button>
        </Td>
      </Tr>
    );
  });

  return (
    <Fragment>
      <Table variant="measure">
        <Thead>
          <Tr>
            <Th>Other Eligibility</Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>

      <Button
        variant={"outline"}
        onClick={() => {
          onAddClick();
        }}
      >
        <Image src={addIcon} alt={"Add Item"} sx={sx.addIcon} />
        Add eligibility
      </Button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalMode} other eligibility</ModalHeader>
          <Button
            className="close"
            leftIcon={<Image src={closeIcon} alt="Close" />}
            variant="link"
            onClick={() => setModalOpen(false)}
          >
            Close
          </Button>
          <ModalBody>
            <Flex direction="column" gap="2rem">
              <Text>{modalInstructions}</Text>
              <TextField
                label={fieldLabels.title}
                name="title"
                onBlur={handleChange}
                onChange={handleChange}
                errorMessage={errorMessages.title}
                value={formValues.title}
              />
              <TextField
                label={fieldLabels.description}
                name="description"
                onBlur={handleChange}
                onChange={handleChange}
                multiline
                errorMessage={errorMessages.description}
                value={formValues.description}
              />
              <ChoiceList
                name={"recheck"}
                type={"radio"}
                errorMessage={errorMessages.recheck}
                label={fieldLabels.recheck}
                choices={[
                  {
                    label: "No",
                    value: "No",
                    checked: formValues.recheck === "No",
                  },
                  {
                    label: "Yes",
                    value: "Yes",
                    checked: formValues.recheck === "Yes",
                    checkedChildren: [
                      <Box key="radio-sub-page" sx={sx.children}>
                        <ChoiceList
                          name={"frequency"}
                          type={"radio"}
                          label={fieldLabels.frequency}
                          errorMessage={errorMessages.frequency}
                          choices={frequencyOptions.map((option) => {
                            return {
                              label: option.label,
                              value: option.value,
                              checked: formValues.frequency === option.value,
                            };
                          })}
                          onChange={handleChange}
                        />
                      </Box>,
                    ],
                  },
                ]}
                onChange={handleChange}
              />
              <ChoiceList
                name={"eligibilityUpdate"}
                type={"radio"}
                errorMessage={errorMessages.eligibilityUpdate}
                label={fieldLabels.eligibilityUpdate}
                choices={[
                  {
                    label: "No",
                    value: "No",
                    checked: formValues.eligibilityUpdate === "No",
                  },
                  {
                    label: "Yes",
                    value: "Yes",
                    checked: formValues.eligibilityUpdate === "Yes",
                  },
                ]}
                onChange={handleChange}
              />
            </Flex>
          </ModalBody>
          <ModalFooter gap="4">
            <Button colorScheme="blue" mr={3} onClick={() => onSubmit()}>
              Save
            </Button>
            <Button variant="link" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

//The pdf rendering of EligibilityTableElement component
export const EligibilityTableElementExport = (
  element: EligibilityTableTemplate
) => {
  const { fieldLabels } = element;
  const exportElements = element.answer?.map((eligibility) => {
    const label = eligibility.title;
    const rows = [
      {
        indicator: fieldLabels.description,
        response: eligibility.description,
      },
      {
        indicator: fieldLabels.recheck,
        response: eligibility.recheck,
      },
      {
        indicator: fieldLabels.frequency,
        response: eligibility.frequency,
      },
      {
        indicator: fieldLabels.eligibilityUpdate,
        response: eligibility.eligibilityUpdate,
      },
    ];
    return { label, rows };
  });

  if (!exportElements) return <></>;
  return <>{ExportRateTable(exportElements)}</>;
};

const sx = {
  addIcon: {
    padding: "3px",
  },
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
