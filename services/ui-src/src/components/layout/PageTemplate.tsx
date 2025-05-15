import React from "react";
import { Box, Flex, SystemStyleObject } from "@chakra-ui/react";

export const PageTemplate = ({
  type = "standard",
  children,
  sxOverride,
}: Props) => {
  return (
    <section>
      <Box sx={{ ...sx.contentBox, ...sxOverride }} className={type}>
        <Flex sx={sx.contentFlex} className={`contentFlex ${type}`} gap="8">
          {children}
        </Flex>
      </Box>
    </section>
  );
};

interface Props {
  type?: "standard" | "report";
  children: React.ReactNode;
  sxOverride?: SystemStyleObject;
}

const sx = {
  contentBox: {
    "&.standard": {
      flexShrink: "0",
    },
    "&.report": {
      height: "100%",
    },
  },
  contentFlex: {
    flexDirection: "column",
    "&.standard": {
      maxWidth: "basicPageWidth",
      margin: "3.5rem auto",
    },
    ".mobile &": {
      margin: "2.5rem auto",
    },
    "&.report": {
      height: "100%",
    },
  },
};
