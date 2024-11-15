import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { ErrorAlert, PreviewBanner } from "components";
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import { convertDatetimeStringToNumber } from "utils";
import { ElementType, ErrorVerbiage } from "types";
import { TextField, DateField } from "components";

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
        <form id="addAdminBanner" onSubmit={onSubmit} {...props}>
          <Flex flexDirection="column" gap="1.5rem">
            <TextField
              element={{
                type: ElementType.Textbox,
                label: "Title text",
              }}
              index={0}
              formkey={"bannerTitle"}
            ></TextField>
            <TextField
              element={{
                type: ElementType.Textbox,
                label: "Description tex",
              }}
              index={1}
              formkey={"bannerDescription"}
            ></TextField>
            <TextField
              element={{
                type: ElementType.Textbox,
                label: "Link",
              }}
              index={2}
              formkey={"bannerLink"}
            ></TextField>
            <DateField
              element={{
                type: ElementType.Date,
                label: "Start date",
                helperText: "",
              }}
              index={3}
              formkey={"bannerStartDate"}
            ></DateField>
            <DateField
              element={{
                type: ElementType.Date,
                label: "End date",
                helperText: "",
              }}
              index={3}
              formkey={"bannerEndDate"}
            ></DateField>
          </Flex>
        </form>
        <PreviewBanner />
      </FormProvider>
      <Flex sx={sx.previewFlex}>
        <Button form="addAdminBanner" type="submit" sx={sx.replaceBannerButton}>
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
