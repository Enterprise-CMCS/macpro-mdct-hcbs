import { FormEvent, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { HiChevronDown } from "react-icons/hi";
import { InlineError, TextField } from "@cmsgov/design-system";
import { useFlags } from "launchdarkly-react-client-sdk";
import { Modal } from "components";
import { reportOptions } from "components/forms/AdminDashSelector";
import { ErrorMessages } from "../../../constants";
import { getReportName, ReportType } from "types/report";
import {
  isNotificationState,
  NotificationAssignment,
  NotificationStateNames,
} from "types/notification";
import { isEmail } from "utils/validation/inputValidation";

type Props = {
  modalDisclosure: { isOpen: boolean; onClose: () => void };
  assignment?: NotificationAssignment;
  onSubmit: (assignment: NotificationAssignment) => Promise<void>;
};

const MultiSelect = ({
  label,
  options,
  values,
  error,
  disabled,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  values: string[];
  error: string;
  disabled: boolean;
  onChange: (values: string[]) => void;
}) => {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <FormControl isInvalid={!!error} isRequired>
      <FormLabel id={`${id}-label`} sx={sx.label} requiredIndicator={null}>
        {label}
      </FormLabel>
      <InlineError id={`${id}-error`}>{error}</InlineError>
      <Menu closeOnSelect={false}>
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              variant="unstyled"
              className="ds-c-dropdown__button ds-c-field"
              rightIcon={<HiChevronDown />}
              sx={sx.menuButton}
              isDisabled={disabled}
              aria-label={`${label}, ${values.length} selected`}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
            >
              <span>
                {label} ({values.length})
              </span>
            </MenuButton>
            <MenuList
              rootProps={{
                sx: isOpen ? sx.openMenuRoot : sx.closedMenuRoot,
              }}
              sx={sx.menuList}
            >
              <MenuOptionGroup
                type="checkbox"
                value={values}
                onChange={(selected) =>
                  onChange(Array.isArray(selected) ? selected : [selected])
                }
              >
                {options.map((option) => (
                  <MenuItemOption key={option.value} value={option.value}>
                    {option.label}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </>
        )}
      </Menu>
    </FormControl>
  );
};

export const AddEditEmailModal = ({
  modalDisclosure,
  assignment,
  onSubmit,
}: Props) => {
  const flags = useFlags();
  const availableReports = reportOptions
    .filter(
      (option) =>
        !option.flagName ||
        flags?.[option.flagName] ||
        assignment?.reports.includes(option.value)
    )
    .map((option) => option.value);
  const [email, setEmail] = useState(assignment?.email ?? "");
  const [states, setStates] = useState<NotificationAssignment["states"]>(
    assignment?.states ?? []
  );
  const [reports, setReports] = useState<ReportType[]>(
    assignment?.reports ?? []
  );
  const [errors, setErrors] = useState({ email: "", states: "", reports: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (submitting) return;
    const address = email.trim();
    let emailError = "";
    if (!address) {
      emailError = ErrorMessages.requiredResponse;
    } else if (!isEmail(address)) {
      emailError = ErrorMessages.mustBeAnEmail;
    }
    const nextErrors = {
      email: emailError,
      states: states.length > 0 ? "" : ErrorMessages.requiredResponse,
      reports: reports.length > 0 ? "" : ErrorMessages.requiredResponse,
    };
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await onSubmit({ email: address, states, reports });
      modalDisclosure.onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to save the assignment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      modalDisclosure={modalDisclosure}
      content={{
        heading: assignment ? "Edit Assignments" : "Add Email",
        actionButtonText: "Save",
      }}
      footer={
        <ModalFooter sx={sx.footer}>
          <Button
            sx={sx.saveButton}
            type="submit"
            form="add-email-form"
            isLoading={submitting}
            isDisabled={submitting}
          >
            Save
          </Button>
          <Button variant="link" onClick={modalDisclosure.onClose}>
            Cancel
          </Button>
        </ModalFooter>
      }
    >
      <Text sx={sx.description}>
        {assignment
          ? "Edit states and reports assigned to the email displayed below to receive notifications."
          : "Enter an email address and select states and reports below for a user to receive notifications from the assigned states and reports."}
      </Text>
      <Flex
        as="form"
        id="add-email-form"
        noValidate
        sx={sx.form}
        onSubmit={handleSubmit}
      >
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          disabled={!!assignment || submitting}
          value={email}
          errorMessage={errors.email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((previous) => ({ ...previous, email: "" }));
          }}
        />
        <MultiSelect
          label="States"
          options={Object.entries(NotificationStateNames).map(
            ([value, label]) => ({ value, label })
          )}
          values={states}
          error={errors.states}
          disabled={submitting}
          onChange={(selected) => {
            setStates(selected.filter((state) => isNotificationState(state)));
            setErrors((previous) => ({ ...previous, states: "" }));
          }}
        />
        <MultiSelect
          label="Report Types"
          options={availableReports.map((value) => ({
            value,
            label: `${value}: ${getReportName(value)}`,
          }))}
          values={reports}
          error={errors.reports}
          disabled={submitting}
          onChange={(selected) => {
            setReports(
              availableReports.filter((type) => selected.includes(type))
            );
            setErrors((previous) => ({ ...previous, reports: "" }));
          }}
        />
        {submitError && (
          <Text role="alert" sx={sx.submitError}>
            {submitError}
          </Text>
        )}
      </Flex>
    </Modal>
  );
};

const sx = {
  label: {
    fontWeight: "bold",
  },
  menuButton: {
    width: "100%",
    padding: "spacer1",
  },
  openMenuRoot: {
    display: "contents",
  },
  closedMenuRoot: {
    display: "none",
  },
  menuList: {
    width: "100%",
    minWidth: 0,
    maxHeight: "8rem",
    overflowY: "auto",
    marginTop: "spacer1",
  },
  footer: {
    gap: 4,
  },
  saveButton: {
    marginRight: 3,
  },
  description: {
    marginBottom: 8,
  },
  form: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
  },
  submitError: {
    color: "red.600",
  },
};
