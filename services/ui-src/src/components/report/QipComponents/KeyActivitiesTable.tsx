import {
  Button,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Flex,
  VisuallyHidden,
} from "@chakra-ui/react";
import {
  KeyActivityTableTemplate,
  KeyActivityItem,
  AlertTypes,
  ElementType,
} from "types";
import { PageElementProps } from "../Elements";
import { useState, ChangeEvent, useEffect } from "react";
import addIcon from "assets/icons/add/icon_add_blue.svg";
import cancelIcon from "assets/icons/cancel/icon_cancel_primary.svg";
import closeIcon from "assets/icons/close/icon_close_primary.svg";
import { TextField } from "@cmsgov/design-system";
import { ErrorMessages } from "../../../constants";
import { Alert } from "components";
import { DateField } from "components/fields";

const initialValues = {
  title: "",
  completionDate: "",
};

const generateActivityId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const KeyActivitiesTableElement = (
  props: PageElementProps<KeyActivityTableTemplate>
) => {
  const { element, updateElement } = props;
  const { caption } = element;

  const [activities, setActivities] = useState<KeyActivityItem[]>(() =>
    (structuredClone(element.answer) || []).map((item) => ({
      ...item,
      id: item.id ?? generateActivityId(),
      completionDate: item.completionDate ?? "",
    }))
  );
  const [formValues, setFormValues] = useState(initialValues);
  const [errorMessages, setErrorMessages] = useState(initialValues);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"Add" | "Edit">("Add");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string>("");

  const resetForm = () => {
    setFormValues(initialValues);
    setSelectedItemId("");
  };

  useEffect(() => {
    setErrorMessages(initialValues);
  }, [modalOpen]);

  const validateField = (name: string, value: string) => {
    if (name === "title" && !value) {
      return ErrorMessages.requiredResponse;
    }
    if (name === "title") {
      const isDuplicate = activities.some(
        (item) =>
          item.id !== selectedItemId &&
          item.title.toLowerCase() === value.toLowerCase()
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

  const handleDeleteClick = (id: string) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const onDeleteConfirm = () => {
    if (!selectedDeleteId) return;

    const updatedItems = activities.filter(
      (item) => item.id !== selectedDeleteId
    );
    setActivities(updatedItems);
    updateElement({ answer: updatedItems });
    setDeleteModalOpen(false);
    setSelectedDeleteId("");
  };

  const onSubmit = () => {
    let errors = { ...initialValues };
    let hasError = false;

    errors.title = validateField("title", formValues.title);
    if (errors.title) hasError = true;

    setErrorMessages(errors);
    if (hasError) return;

    let updatedItems;

    if (modalMode === "Add") {
      updatedItems = [
        ...activities,
        { id: generateActivityId(), ...formValues },
      ];
    } else if (modalMode === "Edit") {
      updatedItems = activities.map((item) =>
        item.id === selectedItemId ? { ...item, ...formValues } : item
      );
    }

    if (!updatedItems) return;

    setActivities(updatedItems);
    updateElement({ answer: updatedItems });
    setModalOpen(false);
    resetForm();
  };

  const onAddClick = () => {
    setModalMode("Add");
    resetForm();
    setModalOpen(true);
  };

  const onEditClick = (activity: KeyActivityItem) => {
    setModalMode("Edit");
    setFormValues({
      title: activity.title,
      completionDate: activity.completionDate ?? "",
    });
    setSelectedItemId(activity.id);
    setModalOpen(true);
  };

  const rows = activities.map((activity) => {
    return (
      <Tr key={activity.id}>
        <Td
          width="100%"
          paddingY="spacer2 !important"
          paddingLeft="0 !important"
          paddingRight="spacer2 !important"
        >
          <Text fontWeight="heading_md" fontSize="heading_md">
            {activity.title}
          </Text>
          <Text>
            Expected completion date: {activity.completionDate || "N/A"}
          </Text>
        </Td>
        <Td minWidth="150px" whiteSpace="nowrap">
          <Flex alignItems="center">
            <Button
              variant={"outline"}
              aria-label={`Edit ${activity.title}`}
              maxWidth="79px"
              width="79px"
              onClick={() => onEditClick(activity)}
            >
              Edit
            </Button>
            <Button
              variant="plain"
              aria-label={`Delete ${activity.title}`}
              onClick={() => handleDeleteClick(activity.id)}
            >
              <Image src={cancelIcon} alt={"Delete Item"} />
            </Button>
          </Flex>
        </Td>
      </Tr>
    );
  });

  return (
    <>
      {activities.length === 0 && (
        <Alert
          status={AlertTypes.WARNING}
          title="Add at least one key activity"
        >
          Provide at least one key activity to support your Quality Improvement
          Plan.
        </Alert>
      )}
      <Button variant={"outline"} onClick={onAddClick} mb="24px">
        <Image src={addIcon} alt={"Add Item"} sx={sx.addIcon} />
        Add key activity
      </Button>

      {activities.length > 0 && (
        <>
          <Table variant="measure">
            <TableCaption>
              <VisuallyHidden>{caption}</VisuallyHidden>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Activity</Th>
                <Th minWidth="150px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>{rows}</Tbody>
          </Table>
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalMode} key activity</ModalHeader>
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
              <TextField
                label="Title or description"
                name="title"
                onBlur={handleChange}
                onChange={handleChange}
                errorMessage={errorMessages.title}
                value={formValues.title}
                hint="Provide a one-sentence title or description of the activity."
              />
              <DateField
                element={{
                  type: ElementType.Date,
                  id: "completion-date",
                  label: "Expected completion date",
                  helperText:
                    "Specify an expected completion date if one can be determined.",
                  required: false,
                  dateFormat: "MMYYYY",
                  answer: formValues.completionDate,
                }}
                updateElement={(updated) =>
                  setFormValues((prev) => ({
                    ...prev,
                    completionDate: (updated.answer as string) || "",
                  }))
                }
              />
            </Flex>
          </ModalBody>
          <ModalFooter gap="4">
            <Button colorScheme="blue" mr={3} onClick={onSubmit}>
              Save
            </Button>
            <Button variant="link" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure you want to remove this key activity?
          </ModalHeader>
          <Button
            className="close"
            leftIcon={<Image src={closeIcon} alt="Close" />}
            variant="link"
            fontWeight="bold"
            onClick={() => setDeleteModalOpen(false)}
          >
            Close
          </Button>
          <ModalBody>
            This action cannot be undone. It will remove the key activity from
            the Quality Improvement Plan.
          </ModalBody>
          <ModalFooter gap="4">
            <Button colorScheme="blue" mr={3} onClick={onDeleteConfirm}>
              Remove key activity
            </Button>
            <Button
              variant="link"
              fontWeight="bold"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const sx = {
  addIcon: {
    padding: "3px",
  },
};
