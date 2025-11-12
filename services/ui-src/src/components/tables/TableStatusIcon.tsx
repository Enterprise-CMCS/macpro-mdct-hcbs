import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import successIcon from "assets/icons/status/icon_status_check.svg";
import notStartedIcon from "assets/icons/status/icon_status_alert.svg";
import notStartedPDFIcon from "assets/icons/status/icon_status_alert_pdf.svg";
import inProgressIcon from "assets/icons/status/icon_status_inprogress.svg";
import { PageStatus } from "types";

export enum TableStatuses {
  CLOSE = "close",
  DISABLED = "disabled",
}

export type TableStatusType = PageStatus | TableStatuses | undefined;

export const TableStatusIcon = ({ tableStatus, showLabel, isPdf }: Props) => {
  const statusIcon = (status: TableStatusType) => {
    switch (status) {
      case PageStatus.COMPLETE:
        return {
          src: successIcon,
          alt: "complete icon",
          text: "Complete",
          textColor: "palette.success",
        };
      case PageStatus.IN_PROGRESS:
        return {
          src: inProgressIcon,
          alt: "in progress icon",
          text: "In progress",
          textColor: "palette.primary",
        };
      case PageStatus.NOT_STARTED:
        return {
          src: isPdf ? notStartedPDFIcon : notStartedIcon,
          alt: "not started icon",
          text: "Not started",
          textColor: "palette.error_darker",
        };
      default:
        return undefined;
    }
  };

  const status = statusIcon(tableStatus);
  return (
    <Box>
      {status && (
        <VStack paddingTop={isPdf ? ".5rem" : "0"}>
          <HStack>
            <Image src={status.src} alt={status.alt} boxSize="xl" />
            {showLabel && <Text>{status.text}</Text>}
          </HStack>
          {isPdf && (
            <Text
              color={status.textColor}
              fontWeight={"heading_xs"}
              fontSize="heading_xs"
            >
              {status.text}
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

interface Props {
  tableStatus: TableStatusType;
  showLabel?: boolean;
  isPdf?: boolean;
}
