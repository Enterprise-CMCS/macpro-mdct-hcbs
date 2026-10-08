import { FormEvent, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import { HiChevronDown } from "react-icons/hi";
import { InlineError, TextField } from "@cmsgov/design-system";
import { useFlags } from "launchdarkly-react-client-sdk";
import { Modal } from "components";
import { reportOptions } from "components/forms/AdminDashSelector";
import { ErrorMessages, StateNames } from "../../../constants";
import { getReportName, ReportType } from "types/report";
import { isStateAbbr } from "types/other";
import { NotificationAssignment } from "types/notification";
import { isEmail } from "utils/validation/inputValidation";

type Props = {
  modalDisclosure: { isOpen: boolean; onClose: () => void };
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
      <FormLabel id={`${id}-label`} fontWeight="bold" requiredIndicator={null}>
        {label}
      </FormLabel>
      <InlineError id={`${id}-error`}>{error}</InlineError>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          variant="outline"
          rightIcon={<HiChevronDown />}
          width="100%"
          textAlign="left"
          fontWeight="normal"
          isDisabled={disabled}
          aria-labelledby={`${id}-label ${id}-selection`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <span id={`${id}-selection`}>
            {label} ({values.length})
          </span>
        </MenuButton>
        <MenuList maxHeight="18rem" overflowY="auto">
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
      </Menu>
    </FormControl>
  );
};

export const AddEmailModal = ({ modalDisclosure, onSubmit }: Props) => {
  const flags = useFlags();
  const availableReports = reportOptions
    .filter((option) => !option.flagName || flags?.[option.flagName])
    .map((option) => option.value);
  const [email, setEmail] = useState("");
  const [states, setStates] = useState<NotificationAssignment["states"]>([]);
  const [reports, setReports] = useState<ReportType[]>([]);
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
      content={{ heading: "Add Email", actionButtonText: "Save" }}
      footer={
        <ModalFooter gap="4">
          <Button
            colorScheme="blue"
            mr={3}
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
      <Text mb={8}>
        Enter an email address and select states and reports below for a user to
        receive notifications from the assigned states and reports.
      </Text>
      <VStack
        as="form"
        id="add-email-form"
        noValidate
        align="stretch"
        spacing={8}
        onSubmit={handleSubmit}
      >
        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="Input text"
          required
          disabled={submitting}
          value={email}
          errorMessage={errors.email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((previous) => ({ ...previous, email: "" }));
          }}
        />
        <MultiSelect
          label="States"
          options={Object.entries(StateNames).map(([value, label]) => ({
            value,
            label,
          }))}
          values={states}
          error={errors.states}
          disabled={submitting}
          onChange={(selected) => {
            setStates(selected.filter(isStateAbbr));
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
          <Text role="alert" color="red.600">
            {submitError}
          </Text>
        )}
      </VStack>
    </Modal>
  );
};
