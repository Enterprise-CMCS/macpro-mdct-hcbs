import { Box, BoxProps } from "@chakra-ui/react";

export const Card = ({ ...props }: Omit<BoxProps, "sx">) => {
  return <Box {...props} sx={sx.root} />;
};

const sx = {
  root: {
    width: "100%",
    padding: "2rem",
    ".mobile &": {
      padding: "1rem",
    },
  },
};
