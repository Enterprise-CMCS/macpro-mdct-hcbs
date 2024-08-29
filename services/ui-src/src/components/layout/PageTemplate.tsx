import React from "react";
import { Box, Flex } from "@chakra-ui/react";

export const PageTemplate = ({
  type = "standard",
  children,
  sxOverride,
  sx,
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
  sx: any;
}
