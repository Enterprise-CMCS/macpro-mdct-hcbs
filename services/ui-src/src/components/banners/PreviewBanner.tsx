import { useFormContext } from "react-hook-form";
import { Banner } from "components";

export const PreviewBanner = () => {
  // get the form context
  const form = useFormContext();

  // set banner preview data
  const formData = form.getValues();
  const bannerData = {
    title: formData?.["bannerTitle"]?.["answer"] || "New banner title",
    description:
      formData?.["bannerDescription"]?.["answer"] || "New banner description",
    link: formData?.["bannerLink"]?.["answer"] || "",
  };

  return <Banner bannerData={bannerData} />;
};