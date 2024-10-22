import { Box, HStack, Image, Text } from "@chakra-ui/react";
import successIcon from "assets/icons/status/icon_status_check.svg";
import unfinishedIcon from "assets/icons/status/icon_status_alert.svg";

export enum TableStatuses {
  COMPLETE = "complete",
  CLOSE = "close",
  NO_STATUS = "no status",
  DISABLED = "disabled",
}

export type TableStatusType = TableStatuses | string;

export const TableStatusIcon = ({ tableStatus, isPdf }: Props) => {
  const statusIcon = (status: TableStatusType) => {
    switch (status) {
      case TableStatuses.COMPLETE:
        return {
          src: successIcon,
          alt: isPdf ? "" : "complete icon",
          text: "Complete",
        };
      default:
        return {
          src: unfinishedIcon,
          alt: isPdf ? "" : "warning icon",
          text: "Error",
        };
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
