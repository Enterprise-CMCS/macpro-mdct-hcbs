import { useState } from "react";
// components
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { ErrorAlert, PreviewBanner } from "components";
// utils
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import { convertDatetimeStringToNumber } from "utils";
import { ErrorVerbiage } from "types";
// data
import formJson from "forms/addAdminBanner/addAdminBanner.json";
import { FormProvider, useForm } from "react-hook-form";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<ErrorVerbiage>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // add validation to formJson
  const form = useForm();

  const onSubmit = async (formData: any) => {
    setSubmitting(true);
    const newBannerData = {
      key: bannerId,
      title: formData["bannerTitle"],
      description: formData["bannerDescription"],
      link: formData["bannerLink"] || undefined,
      startDate: convertDatetimeStringToNumber(
        formData["bannerStartDate"],
        "startDate"
      ),
      endDate: convertDatetimeStringToNumber(
        formData["bannerEndDate"],
        "endDate"
      ),
    };
    try {
      await writeAdminBanner(newBannerData);
      window.scrollTo(0, 0);
    } catch {
      setError(bannerErrors.REPLACE_BANNER_FAILED);
    }
    setSubmitting(false);
  };

  return (
    <>
      <ErrorAlert error={error} sxOverride={sx.errorAlert} />
      <FormProvider {...form}>
        <form id={formJson.id} onSubmit={onSubmit} {...props}>
          <PreviewBanner />
        </form>
      </FormProvider>
      <Flex sx={sx.previewFlex}>
        <Button form={formJson.id} type="submit" sx={sx.replaceBannerButton}>
          {submitting ? <Spinner size="md" /> : "Replace Current Banner"}
        </Button>
      </Flex>
    </>
  );
};

interface Props {
  writeAdminBanner: Function;
  [key: string]: any;
}

const sx = {
  errorAlert: {
    maxWidth: "40rem",
  },
  previewFlex: {
    flexDirection: "column",
  },
  replaceBannerButton: {
    width: "14rem",
    marginTop: "1rem !important",
    alignSelf: "end",
  },
};