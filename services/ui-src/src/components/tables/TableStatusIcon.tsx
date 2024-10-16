import { Box, Image, Text } from "@chakra-ui/react";
import successIcon from "assets/icons/status/icon_status_check.svg";
import unfinishedIcon from "assets/icons/status/icon_status_alert.svg";

export enum TableStatuses {
  COMPLETE = "complete",
  CLOSE = "close",
  NO_STATUS = "no status",
  DISABLED = "disabled",
}

export type TableStatusType = TableStatuses | string;

export const TableStatueIcon = ({ tableStatus, isPdf }: Props) => {
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
        <>
          <Image src={status.src} alt={status.alt} boxSize="xl" />
          {isPdf && (
            <Text>
              <b>{status.text}</b>
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

interface Props {
  tableStatus: TableStatusType;
  isPdf?: boolean;
  [key: string]: any;
}
