import { useEffect, useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import addIcon from "assets/icons/add/icon_add_blue.svg";
import { AccordionItem, DropdownField, PageTemplate } from "components";
import { useFlags } from "launchdarkly-react-client-sdk";
import { AddEditEmailModal } from "./AddEditEmailModal";
import { NotificationAssignmentsTable } from "./NotificationAssignmentsTable";
import { NotificationAssignment } from "types/notification";
import {
  ElementType,
  getReportName,
  isReportType,
  ReportType,
} from "types/report";
import { isStateAbbr, StateAbbr } from "types/other";
import { reportOptions } from "components/forms/AdminDashSelector";
import { StateNames } from "../../../constants";
import {
  createNotificationAssignment,
  getNotificationAssignments,
  updateNotificationAssignment,
} from "utils/api/requestMethods/notificationAssignments";

export const NotificationsPage = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const flags = useFlags() ?? {};
  const { notificationsSystem } = flags;
  const [savedAssignments, setSavedAssignments] = useState<
    NotificationAssignment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [selectedStates, setSelectedStates] = useState<StateAbbr[]>([]);
  const [selectedReports, setSelectedReports] = useState<ReportType[]>([]);
  const availableReports = reportOptions.filter(
    (option) => !option.flagName || flags[option.flagName]
  );
  const modalDisclosure = useDisclosure();
  const [editingAssignment, setEditingAssignment] =
    useState<NotificationAssignment>();
  useEffect(() => {
    if (!notificationsSystem) return;
    let active = true;
    setLoading(true);
    setLoadError("");
    getNotificationAssignments()
      .then((result) => {
        if (active) setSavedAssignments(result);
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load notification assignments. Please try again."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [notificationsSystem, loadAttempt]);

  const filteredAssignments = savedAssignments.filter(
    (assignment) =>
      (selectedStates.length === 0 ||
        assignment.states.some((state) => selectedStates.includes(state))) &&
      (selectedReports.length === 0 ||
        assignment.reports.some((report) => selectedReports.includes(report)))
  );
  return (
    <PageTemplate sxOverride={sx.page}>
      <Box sx={sx.introTextBox}>
        <Heading
          as="h1"
          id="NotificationsHeader"
          tabIndex={-1}
          sx={sx.headerText}
        >
          Notifications Settings
        </Heading>
        <Text>
          The notification assignments page should be used to assign CMS Project
          Officers to the states and reports they manage. By making these
          assignments POs will receive email notifications when states
          submit/re-submit reports.
        </Text>
        <Accordion sx={sx.accordion} allowToggle={true} defaultIndex={[-1]}>
          <AccordionItem label="Notification Assignments">
            <Box>
              <Heading sx={sx.instructionsHeading}>
                How to manage notification assignments:
              </Heading>
              <ol>
                <li>
                  <strong>Add a new assignment: </strong>
                  Select <strong>+ Add email</strong> to open the setup form.
                  Enter the user’s email address, select one or more states, and
                  choose the relevant reports they should monitor. Select{" "}
                  <strong>Save</strong> to apply.
                </li>
                <li>
                  <strong>Filter assignments:</strong> Use the{" "}
                  <strong>States</strong> and <strong>Report</strong> dropdown
                  menus above the table to narrow down the displayed records.
                  Select <strong>Clear Filters</strong> to reset your view.
                </li>
                <li>
                  <strong>Sort assignments: </strong> Select the column headers
                  (such as <strong>Email</strong>) to sort the table contents
                  alphabetically.
                </li>
                <li>
                  <strong>Edit or remove assignments:</strong> Use the{" "}
                  <strong>Actions</strong> column next to any entry to update a
                  user's assigned states/reports or remove their notification
                  access.
                </li>
              </ol>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
      <Box>
        {notificationsSystem && (
          <Box sx={sx.assignments}>
            <Flex sx={sx.addEmail}>
              <Button
                variant="outline"
                leftIcon={<Image src={addIcon} alt="" />}
                onClick={() => {
                  setEditingAssignment(undefined);
                  modalDisclosure.onOpen();
                }}
                isDisabled={disabled || loading}
              >
                Add email
              </Button>
            </Flex>
            <Flex sx={sx.filters}>
              <Box sx={sx.filterField}>
                <DropdownField
                  element={{
                    id: "notification-state-filter",
                    type: ElementType.Dropdown,
                    label: "States",
                    required: false,
                    answer: "",
                    options: [
                      { label: "- Select an option -", value: "" },
                      ...Object.entries(StateNames).map(([value, label]) => ({
                        value,
                        label,
                      })),
                    ],
                  }}
                  clearOnSelect
                  updateElement={({ answer }) => {
                    if (isStateAbbr(answer)) {
                      setSelectedStates((previous) =>
                        previous.includes(answer)
                          ? previous
                          : [...previous, answer]
                      );
                    }
                  }}
                />
              </Box>
              <Box sx={sx.filterField}>
                <DropdownField
                  element={{
                    id: "notification-report-filter",
                    type: ElementType.Dropdown,
                    label: "Report Types",
                    required: false,
                    answer: "",
                    options: [
                      { label: "- Select an option -", value: "" },
                      ...availableReports.map(({ value }) => ({
                        value,
                        label: `${value}: ${getReportName(value)}`,
                      })),
                    ],
                  }}
                  clearOnSelect
                  updateElement={({ answer }) => {
                    if (isReportType(answer)) {
                      setSelectedReports((previous) =>
                        previous.includes(answer)
                          ? previous
                          : [...previous, answer]
                      );
                    }
                  }}
                />
              </Box>
              <Button
                variant="link"
                sx={sx.clearFilters}
                onClick={() => {
                  setSelectedStates([]);
                  setSelectedReports([]);
                }}
              >
                Clear Filters
              </Button>
            </Flex>
            {(selectedStates.length > 0 || selectedReports.length > 0) && (
              <Flex sx={sx.selectedFilters} aria-label="Selected filters">
                {selectedStates.map((state) => (
                  <Tag key={state} size="lg" sx={sx.filterChip}>
                    <TagLabel>{StateNames[state]}</TagLabel>
                    <TagCloseButton
                      sx={sx.filterChipClose}
                      aria-label={`Remove ${StateNames[state]} filter`}
                      onClick={() =>
                        setSelectedStates((previous) =>
                          previous.filter((value) => value !== state)
                        )
                      }
                    />
                  </Tag>
                ))}
                {selectedReports.map((report) => (
                  <Tag key={report} size="lg" sx={sx.filterChip}>
                    <TagLabel>{report}</TagLabel>
                    <TagCloseButton
                      sx={sx.filterChipClose}
                      aria-label={`Remove ${report} filter`}
                      onClick={() =>
                        setSelectedReports((previous) =>
                          previous.filter((value) => value !== report)
                        )
                      }
                    />
                  </Tag>
                ))}
              </Flex>
            )}
            {loading && (
              <Flex sx={sx.statusContainer}>
                <Spinner label="Loading notification assignments" />
              </Flex>
            )}
            {loadError && (
              <Box sx={sx.statusContainer}>
                <Text role="alert" sx={sx.loadError}>
                  {loadError}
                </Text>
                <Button
                  variant="link"
                  onClick={() => setLoadAttempt((previous) => previous + 1)}
                >
                  Retry
                </Button>
              </Box>
            )}
            {!loading && !loadError && (
              <NotificationAssignmentsTable
                assignments={filteredAssignments}
                disabled={disabled}
                onEdit={(assignment) => {
                  setEditingAssignment(assignment);
                  modalDisclosure.onOpen();
                }}
              />
            )}
          </Box>
        )}
      </Box>
      {notificationsSystem && modalDisclosure.isOpen && (
        <AddEditEmailModal
          key={editingAssignment?.email ?? "add"}
          assignment={editingAssignment}
          modalDisclosure={modalDisclosure}
          onSubmit={async (assignment) => {
            if (editingAssignment) {
              const saved = await updateNotificationAssignment(assignment);
              setSavedAssignments((previous) =>
                previous.map((existing) =>
                  existing.email === saved.email ? saved : existing
                )
              );
            } else {
              const saved = await createNotificationAssignment(assignment);
              setSavedAssignments((previous) => [...previous, saved]);
              if (loadError) setLoadAttempt((previous) => previous + 1);
            }
          }}
        />
      )}
    </PageTemplate>
  );
};

const sx = {
  instructionsHeading: {
    fontSize: "heading_md",
    fontWeight: "heading_md",
  },
  assignments: {
    marginTop: "spacer1",
  },
  addEmail: {
    gap: "spacer2",
    alignItems: "center",
  },
  filters: {
    marginTop: "spacer4",
    gap: "spacer3",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  filterField: {
    width: { base: "100%", md: "15rem" },
  },
  selectedFilters: {
    marginTop: "spacer3",
    gap: "spacer1",
    flexWrap: "wrap",
  },
  statusContainer: {
    marginTop: "spacer3",
  },
  loadError: {
    color: "palette.error",
  },
  page: {
    // Keeps dropdown menu above sticky footer
    ".ds-c-dropdown__menu-container": {
      zIndex: "popover",
    },
  },
  filterChip: {
    paddingY: "spacer_half",
    paddingX: "spacer1",
    gap: "spacer_half",
    backgroundColor: "palette.primary_lightest",
    border: "1px solid",
    borderColor: "palette.primary",
    borderRadius: "full",
    color: "palette.base",
    fontWeight: "normal",
  },
  filterChipClose: {
    margin: 0,
    width: "12px",
    marginInlineStart: 0,
    marginInlineEnd: 0,
  },
  clearFilters: {
    fontWeight: "bold",
    width: "138px",
    height: "40px",
    borderRadius: "3px",
    paddingY: "8px",
    paddingX: 0,
    gap: "10px",
    justifyContent: "flex-start",
    flexShrink: 0,
  },
  accordion: {
    marginTop: "spacer4",
    color: "palette.base",
  },
  introTextBox: {
    width: "100%",
  },
  headerText: {
    marginBottom: "spacer2",
    fontSize: "heading_3xl",
    fontWeight: "heading_3xl",
  },
  spinnerContainer: {
    marginTop: "spacer1",
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
};
