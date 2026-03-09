import { Box } from "@chakra-ui/react";
import { Alert } from "components";
import { BannerFormData } from "types";
import { parseHtml } from "utils";

export const Banner = ({ title, description, link }: Props) => {
  return (
    <Alert title={title} link={link}>
      <Box sx={sx}>{parseHtml(description)}</Box>
    </Alert>
  );
};

type Props = Pick<BannerFormData, "title" | "description" | "link">;

const sx = {
  "& a, & a:visited": {
    color: "blue.600",
    textDecoration: "underline",
    textDecorationColor: "blue.600",
  },
  "& a:hover, & a:visited:hover": {
    color: "blue.700",
    textDecorationColor: "blue.700",
  },
  "& a:focus, & a:visited:focus": {
    color: "inherit",
    textDecorationColor: "blue.600",
  },
};
