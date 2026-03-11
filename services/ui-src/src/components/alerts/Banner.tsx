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
    transition: "all 0.3s ease",
    color: "palette.primary_darker",
    textDecoration: "underline",
    textDecorationColor: "palette.primary_darker",
  },
  "& a:hover, & a:visited:hover": {
    color: "palette.primary_darkest",
    textDecorationColor: "palette.primary_darkest",
  },
  "& a:focus, & a:visited:focus": {
    color: "inherit",
    textDecorationColor: "palette.primary_darker",
  },
};
