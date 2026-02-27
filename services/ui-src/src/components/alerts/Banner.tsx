import { Alert } from "components";
import { BannerFormData } from "types";
import { parseHtml } from "utils";

export const Banner = ({ title, description, link }: Props) => {
  return (
    <Alert title={title} link={link}>
      {parseHtml(description)}
    </Alert>
  );
};

type Props = Pick<BannerFormData, "title" | "description" | "link">;
