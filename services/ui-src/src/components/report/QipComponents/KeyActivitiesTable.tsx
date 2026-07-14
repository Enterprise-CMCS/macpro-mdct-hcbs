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
  Link,
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
import { Alert } from "components/alerts/Alert";
import { DateField } from "components/fields";

export const KeyActivitiesTableElement = (
  props: PageElementProps<KeyActivityTableTemplate>
) => {
  const { element, updateElement } = props;
  const { caption } = element;

  const initialValues = {
    title: "",
    completionDate: "",
  };

  const [activities, setActivities] = useState<KeyActivityItem[]>(
    structuredClone(element.answer) || []
  );
  const [formValues, setFormValues] = useState(initialValues);
  const [errorMessages, setErrorMessages] = useState(initialValues);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"Add" | "Edit">("Add");
  const [selectedItemTitle, setSelectedItemTitle] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteTitle, setSelectedDeleteTitle] = useState<string>("");

  const resetForm = () => {
    setFormValues(initialValues);
    setSelectedItemTitle("");
  };

  useEffect(() => {
    setErrorMessages(initialValues);
  }, [modalOpen]);

  const validateField = (name: string, value: string) => {
    if (name === "title" && !value) {
      return ErrorMessages.requiredResponse;
    }
    if (name === "title" && selectedItemTitle !== value) {
      const isDuplicate = activities.some(
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
    setSelectedDeleteTitle(title);
    setDeleteModalOpen(true);
  };

  const onDeleteConfirm = () => {
    if (!selectedDeleteTitle) return;

    const updatedItems = activities.filter(
      (item) => item.title !== selectedDeleteTitle
    );
    setActivities(updatedItems);
    updateElement({ answer: updatedItems });
    setDeleteModalOpen(false);
    setSelectedDeleteTitle("");
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
      updatedItems = [...activities, formValues];
    } else if (modalMode === "Edit") {
      updatedItems = activities.map((item) =>
        item.title === selectedItemTitle ? formValues : item
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
    setSelectedItemTitle(activity.title);
    setModalOpen(true);
  };

  const rows = activities.map((activity, index) => {
    return (
      <Tr key={`${activity.title}-${index}`}>
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
              as={Link}
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
              onClick={() => handleDeleteClick(activity.title)}
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
