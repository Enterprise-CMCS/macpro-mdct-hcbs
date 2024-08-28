import React from "react";
import { Box, Flex } from "@chakra-ui/react";

export const PageTemplate = ({
  type = "standard",
  children,
  sxOverride,
}: Props) => {
  return (
    <section>
      <Box sx={{ ...sx.contentBox, ...sxOverride }} className={type}>
        <Flex sx={sx.contentFlex} className={`contentFlex ${type}`}>
          {children}
        </Flex>
      </Box>
    </section>
  );
};

interface Props {
  type?: "standard" | "report";
  children: React.ReactNode;
  sxOverride?: any;
}

const sx = {
  contentBox: {
    "&.standard": {
      flexShrink: "0",
      paddingTop: "2rem",
    },
    "&.report": {
      height: "100%",
    },
  },
  contentFlex: {
    flexDirection: "column",
    "&.standard": {
      maxWidth: "basicPageWidth",
      margin: "5.5rem auto 0",
    },
    "&.report": {
      height: "100%",
    },
  },
};
