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
import { useState, ChangeEvent } from "react";
import { useDeleteConfirmModal } from "../useDeleteConfirmModal";
import cancelIcon from "assets/icons/cancel/icon_cancel_primary.svg";
import closeIcon from "assets/icons/close/icon_close_primary.svg";
import addIcon from "assets/icons/add/icon_add_blue.svg";
import { TextField } from "@cmsgov/design-system";
import { ErrorMessages, notAnsweredText } from "../../../constants";
import { Alert } from "components";
import { DateField } from "components/fields";
import { useStore } from "utils";

const initialValues = {
  title: "",
  completionDate: "",
};

const generateActivityId = () => `activity-${Math.floor(Math.random() * 1e6)}`;

export const KeyActivitiesTableElement = (
  props: PageElementProps<KeyActivityTableTemplate>
) => {
  const { element, updateElement, disabled = false } = props;
  const { caption } = element;
  const { saveReport } = useStore();

  const [activities, setActivities] = useState<KeyActivityItem[]>(() =>
    (structuredClone(element.answer) || []).map((item) => ({
      ...item,
      id: item.id ?? generateActivityId(),
      completionDate: item.completionDate ?? "",
    }))
  );
  const [formValues, setFormValues] = useState(initialValues);
  const [titleError, setTitleError] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"Add" | "Edit">("Add");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const { addButtonRef, getDeleteButtonRef, openDeleteModal } =
    useDeleteConfirmModal({
      items: activities,
      getId: (item) => item.id,
      getBody: () =>
        "This action cannot be undone. It will remove the key activity from the Quality Improvement Plan.",
      confirmLabel: "Remove key activity",
      header: "Are you sure you want to remove this key activity?",
      onConfirm: async (remaining) => {
        setActivities(remaining);
        updateElement({ answer: remaining });
        await saveReport();
      },
    });

  const resetForm = () => {
    setFormValues(initialValues);
    setSelectedItemId("");
    setTitleError("");
  };

  const validateTitle = (value: string) => {
    if (!value) {
      return ErrorMessages.requiredResponse;
    }
    const isDuplicate = activities.some(
      (item) =>
        item.id !== selectedItemId &&
        item.title.toLowerCase() === value.toLowerCase()
    );
    return isDuplicate ? "Title must be unique" : "";
  };

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "title") {
      setTitleError(validateTitle(value));
    }
  };

  const handleDeleteClick = (id: string) => openDeleteModal(id);

  const onSubmit = async () => {
    const error = validateTitle(formValues.title);
    setTitleError(error);
    if (error) return;

    const updatedItems =
      modalMode === "Add"
        ? [...activities, { id: generateActivityId(), ...formValues }]
        : activities.map((item) =>
            item.id === selectedItemId ? { ...item, ...formValues } : item
          );

    setActivities(updatedItems);
    updateElement({ answer: updatedItems });
    setFormModalOpen(false);
    resetForm();
    await saveReport();
  };

  const onAddClick = () => {
    setModalMode("Add");
    resetForm();
    setFormModalOpen(true);
  };

  const onEditClick = (activity: KeyActivityItem) => {
    setModalMode("Edit");
    setFormValues({
      title: activity.title,
      completionDate: activity.completionDate ?? "",
    });
    setSelectedItemId(activity.id);
    setTitleError("");
    setFormModalOpen(true);
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
            Expected completion month: {activity.completionDate || "N/A"}
          </Text>
        </Td>
        <Td minWidth="150px" whiteSpace="nowrap">
          <Flex alignItems="center">
            <Button
              variant={"outline"}
              aria-label={`${disabled ? "View" : "Edit"} ${activity.title}`}
              maxWidth="79px"
              width="79px"
              onClick={() => onEditClick(activity)}
            >
              {disabled ? "View" : "Edit"}
            </Button>
            {!disabled && (
              <Button
                ref={getDeleteButtonRef(activity.id)}
                variant="transparent"
                aria-label={`Delete ${activity.title}`}
                onClick={() => handleDeleteClick(activity.id)}
              >
                <Image src={cancelIcon} alt="" />
              </Button>
            )}
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
      <Button
        ref={addButtonRef}
        variant="outline"
        leftIcon={<Image src={addIcon} alt="" />}
        isDisabled={disabled}
        onClick={onAddClick}
        mb="24px"
      >
        Add key activity
      </Button>

      {rows.length > 0 && (
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
      )}

      <Modal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalMode} key activity</ModalHeader>
          <Button
            className="close"
            leftIcon={<Image src={closeIcon} alt="Close" />}
            variant="link"
            onClick={() => setFormModalOpen(false)}
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
                errorMessage={titleError}
                value={formValues.title}
                hint="Provide a one-sentence title or description of the activity."
                disabled={disabled}
              />
              <DateField
                disabled={disabled}
                element={{
                  type: ElementType.Date,
                  id: "completion-date",
                  label: "Expected completion month",
                  helperText:
                    "Specify an expected completion month if one can be determined.",
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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onSubmit}
              isDisabled={disabled}
            >
              Save
            </Button>
            <Button variant="link" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const KeyActivitiesTableExport = (element: KeyActivityTableTemplate) => {
  if (!element.answer?.length) {
    return notAnsweredText;
  }

  return (
    <Table variant="export" size="sm" sx={sx.keyActivitiesExport}>
      <TableCaption>
        <VisuallyHidden>{element.caption}</VisuallyHidden>
      </TableCaption>
      <Thead>
        <Tr>
          <Th>Activity</Th>
          <Th>Expected completion month</Th>
        </Tr>
      </Thead>
      <Tbody>
        {element.answer.map((activity) => (
          <Tr key={activity.id}>
            <Td>{activity.title}</Td>
            <Td>{activity.completionDate || "N/A"}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const sx = {
  keyActivitiesExport: {
    "tbody td": {
      color: "#000000",
    },
    "tbody td:first-of-type": {
      fontWeight: "bold",
    },
  },
};
