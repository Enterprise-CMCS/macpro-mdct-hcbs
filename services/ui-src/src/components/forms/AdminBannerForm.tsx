import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { ErrorAlert, PreviewBanner, TextField, DateField } from "components";
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import { convertDatetimeStringToNumber } from "utils";
import { ElementType, ErrorVerbiage } from "types";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<ErrorVerbiage>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // add validation to formJson
  const form = useForm();

  const onSubmit = async (formData: any) => {
    setSubmitting(true);
    const newBannerData = {
      key: bannerId,
      title: formData["bannerTitle"]?.answer,
      description: formData["bannerDescription"]?.answer,
      link: formData["bannerLink"]?.answer || undefined,
      startDate: convertDatetimeStringToNumber(
        formData["bannerStartDate"]?.answer,
        "startDate"
      ),
      endDate: convertDatetimeStringToNumber(
        formData["bannerEndDate"]?.answer,
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
        <form
          id="addAdminBanner"
          onSubmit={form.handleSubmit(onSubmit)}
          {...props}
        >
          <Flex flexDirection="column" gap="1.5rem">
            <TextField
              element={{
                type: ElementType.Textbox,
                label: "Title text",
              }}
              formkey={"bannerTitle"}
            ></TextField>
            <TextField
              element={{
                type: ElementType.Textbox,
                label: "Description text",
              }}
              formkey={"bannerDescription"}
            ></TextField>
            <TextField
              element={{
                type: ElementType.Textbox,
                label: "Link",
              }}
              formkey={"bannerLink"}
            ></TextField>
            <DateField
              element={{
                type: ElementType.Date,
                label: "Start date",
                helperText: "",
              }}
              formkey={"bannerStartDate"}
            ></DateField>
            <DateField
              element={{
                type: ElementType.Date,
                label: "End date",
                helperText: "",
              }}
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
