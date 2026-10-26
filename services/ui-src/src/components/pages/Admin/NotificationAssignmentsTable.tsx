import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import { NotificationAssignment } from "types/notification";

interface Props {
  assignments: NotificationAssignment[];
  disabled?: boolean;
  onEdit?: (assignment: NotificationAssignment) => void;
  onDelete?: (assignment: NotificationAssignment) => void;
  isDeleting?: Record<string, boolean>;
}

export const NotificationAssignmentsTable = ({
  assignments,
  disabled = false,
  onEdit,
  onDelete,
  isDeleting = {},
}: Props) => {
  const [ascending, setAscending] = useState(true);
  const sortedAssignments = assignments.toSorted((first, second) =>
    ascending
      ? first.email.localeCompare(second.email)
      : second.email.localeCompare(first.email)
  );

  return (
    <Box sx={sx.container}>
      <Table size="sm">
        <TableCaption placement="top" sx={sx.caption}>
          <VisuallyHidden>Notification assignments</VisuallyHidden>
        </TableCaption>
        <Thead>
          <Tr>
            <Th scope="col" aria-sort={ascending ? "ascending" : "descending"}>
              <Button
                variant="unstyled"
                sx={sx.sortButton}
                aria-label={`Sort Email ${ascending ? "descending" : "ascending"}`}
                onClick={() => setAscending((previous) => !previous)}
              >
                Email
                {ascending ? (
                  <HiArrowUp aria-hidden="true" />
                ) : (
                  <HiArrowDown aria-hidden="true" />
                )}
              </Button>
            </Th>
            <Th scope="col">States</Th>
            <Th scope="col">Reports</Th>
            <Th scope="col" sx={sx.actionsHeader}>
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedAssignments.map((assignment) => (
            <Tr key={assignment.email}>
              <Td sx={sx.emailCell}>{assignment.email}</Td>
              <Td sx={sx.statesCell}>{assignment.states.join(", ")}</Td>
              <Td>{assignment.reports.join(", ")}</Td>
              <Td>
                <Flex sx={sx.actions}>
                  <Button
                    variant="outline"
                    aria-label={`Edit ${assignment.email}`}
                    isDisabled={disabled || !onEdit}
                    onClick={() => onEdit?.(assignment)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    aria-label={`Delete ${assignment.email}`}
                    isDisabled={
                      disabled || !onDelete || isDeleting[assignment.email]
                    }
                    onClick={() => onDelete?.(assignment)}
                  >
                    {isDeleting[assignment.email] ? (
                      <Spinner size="md" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
          {assignments.length === 0 && (
            <Tr>
              <Td colSpan={4}>No notification assignments found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

const sx = {
  container: {
    marginTop: "spacer3",
    overflowX: "auto",
  },
  caption: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  sortButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "spacer_half",
    height: "auto",
    minWidth: 0,
    padding: 0,
    fontSize: "inherit",
    fontWeight: "inherit",
  },
  actionsHeader: {
    width: "1%",
    whiteSpace: "nowrap",
  },
  emailCell: {
    overflowWrap: "anywhere",
  },
  statesCell: {
    maxWidth: "15rem",
  },
  actions: {
    gap: "spacer2",
    justifyContent: "flex-end",
  },
};
