import { Alert } from "components/alerts/Alert";
import { PageElementProps } from "./Elements";
import { WAIVER, WaiverAlertTemplate } from "types";
import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

export const WaiverAlert = (props: PageElementProps<WaiverAlertTemplate>) => {
  const alert = props.element;
  let children: ReactNode = alert.text;

  const waiverList: WAIVER[] = [];

  return (
    <>
      {waiverList.length == 0 && (
        <Box mt={-6}>
          <Alert
            status={alert.status}
            title={alert.title}
            // oxlint-disable-next-line no-children-prop
            children={children}
          ></Alert>
        </Box>
      )}
    </>
  );
};
