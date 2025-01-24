import { Alert } from "components";
import { BannerData } from "types";

export const Banner = ({ bannerData, ...props }: Props) => {
  if (bannerData) {
    const { title, description, link } = bannerData;
    return (
      bannerData && (
        <Alert title={title} link={link} {...props}>
          {description}
        </Alert>
      )
    );
  } else return <></>;
};

interface Props {
  bannerData: BannerData | undefined;
}
