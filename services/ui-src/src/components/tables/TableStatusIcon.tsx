import { Box, HStack, Image, Text } from "@chakra-ui/react";
import successIcon from "assets/icons/status/icon_status_check.svg";
import notStartedIcon from "assets/icons/status/icon_status_alert.svg";
import inProgressIcon from "assets/icons/status/icon_status_inprogress.svg";
import { PageStatus } from "types";

export enum TableStatuses {
  CLOSE = "close",
  DISABLED = "disabled",
}

export type TableStatusType = PageStatus | TableStatuses | undefined;

export const TableStatusIcon = ({ tableStatus, isPdf }: Props) => {
  const statusIcon = (status: TableStatusType) => {
    switch (status) {
      case PageStatus.COMPLETE:
        return {
          src: successIcon,
          alt: "complete icon",
          text: "Complete",
        };
      case PageStatus.IN_PROGRESS:
        return {
          src: inProgressIcon,
          alt: "in progress icon",
          text: "In progress",
        };
      case PageStatus.NOT_STARTED:
        return {
          src: notStartedIcon,
          alt: "not started icon",
          text: "Not started",
        };
      default:
        return undefined;
    }
  };

  const status = statusIcon(tableStatus);
  return (
    <Box>
      {status && (
        <HStack>
          <Image src={status.src} alt={status.alt} boxSize="xl" />
          {isPdf && <Text>{status.text}</Text>}
        </HStack>
      )}
    </Box>
  );
};

interface Props {
  tableStatus: TableStatusType;
  isPdf?: boolean;
  [key: string]: any;
}
