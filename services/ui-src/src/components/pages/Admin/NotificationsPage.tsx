import {
  Accordion,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import addIcon from "assets/icons/add/icon_add_blue.svg";
import { AccordionItem, PageTemplate } from "components";
import { useFlags } from "launchdarkly-react-client-sdk";
import { AddEmailModal } from "./AddEmailModal";
import { NotificationAssignment } from "types/notification";

export const NotificationsPage = ({
  disabled = false,
  onAddEmail,
}: {
  disabled?: boolean;
  onAddEmail?: (assignment: NotificationAssignment) => Promise<void>;
}) => {
  const { notificationsSystem } = useFlags() ?? {};
  const modalDisclosure = useDisclosure();
  return (
    <PageTemplate>
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
              <Heading fontSize="heading_md" fontWeight="heading_md">
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
          <Box mt="spacer1">
            <Flex gap="spacer2" align="center">
              <Button
                variant="outline"
                leftIcon={<Image src={addIcon} alt="" />}
                onClick={modalDisclosure.onOpen}
                isDisabled={disabled}
              >
                Add email
              </Button>
            </Flex>
          </Box>
        )}
      </Box>
      {notificationsSystem && modalDisclosure.isOpen && (
        <AddEmailModal
          modalDisclosure={modalDisclosure}
          onSubmit={async (assignment) => {
            if (!onAddEmail) {
              throw new Error("Saving assignments is not available yet.");
            }
            await onAddEmail(assignment);
          }}
        />
      )}
    </PageTemplate>
  );
};

const sx = {
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
