import { Box, Collapse, SystemStyleObject } from "@chakra-ui/react";
import { Alert } from "components";
import { useRef } from "react";
import { AlertTypes, ErrorVerbiage } from "types";

export const ErrorAlert = ({
  error,
  variant = "inline",
  sxOverride,
  alertSxOverride,
}: Props) => {
  // Focus the alert when an error is given
  const ref = useRef<HTMLDivElement>(null);
  if (error && ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    ref.current.focus({ preventScroll: true });
  }

  return (
    <Box ref={ref} sx={sxOverride}>
      <Collapse in={!!error}>
        {error && (
          <Alert
            status={AlertTypes.ERROR}
            title={error.title}
            showIcon={false}
            className={variant}
            sx={alertSxOverride ?? sx.root}
          >
            {error.children}
          </Alert>
        )}
      </Collapse>
    </Box>
  );
};

interface Props {
  error?: ErrorVerbiage;
  variant?: "inline" | "toast";
  sxOverride?: SystemStyleObject;
  alertSxOverride?: SystemStyleObject;
}

const sx = {
  root: {
    background: "palette.error_lightest",
    borderLeft: "palette.error",
    minHeight: 0,
    marginY: "spacer2",
    maxWidth: "55.25rem",
    margin: "auto",
    borderInlineStartWidth: "0.5rem",
    borderInlineStartColor: "palette.error",
    boxShadow: "0px 4px 3px rgba(0, 0, 0, 0.2)",
    "&.toast": {
      position: "absolute",
      right: 0,
      width: "90%",
      maxWidth: "500px",
      margin: "spacer2",
      boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    },
  },
};
