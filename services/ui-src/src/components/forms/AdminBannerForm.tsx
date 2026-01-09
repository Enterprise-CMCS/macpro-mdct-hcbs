import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { Banner } from "components";
import {
  TextField as CmsdsTextField,
  SingleInputDateField as CmsdsDateField,
} from "@cmsgov/design-system";
import { bannerId, ErrorMessages } from "../../constants";
import { convertDatetimeStringToNumber, parseMMDDYYYY } from "utils";
import { AdminBannerMethods, BannerData } from "types";
import { isUrl } from "utils/validation/inputValidation";

export const AdminBannerForm = ({ writeAdminBanner }: Props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    startDate: "",
    endDate: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    link: "",
    startDate: "",
    endDate: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onTextChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    const required = evt.target.dataset.required === "true";
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    let errorMessage = "";
    if (required && !value) {
      errorMessage = ErrorMessages.requiredResponse;
    } else if (name === "link" && value && !isUrl(value)) {
      errorMessage = "Response must be a valid hyperlink/URL";
    }
    setFormErrors({
      ...formErrors,
      [name]: errorMessage,
    });
  };

  const onStartDateChange = (rawValue: string, maskedValue: string) => {
    const updatedFormData = {
      ...formData,
      startDate: rawValue,
    };
    setFormData(updatedFormData);

    const parsedValue = parseMMDDYYYY(maskedValue);
    let updatedErrors = structuredClone(formErrors);
    updatedErrors.startDate = "";
    if (!rawValue) {
      updatedErrors.startDate = ErrorMessages.requiredResponse;
    } else if (parsedValue === undefined) {
      updatedErrors.startDate =
        "Start date is invalid. Please enter date in MM/DD/YYYY format";
    } else {
      const endDate = parseMMDDYYYY(formData.endDate);
      if (endDate && endDate < parsedValue) {
        updatedErrors.endDate = ErrorMessages.endDateBeforeStartDate;
      } else if (
        updatedErrors.endDate === ErrorMessages.endDateBeforeStartDate
      ) {
        updatedErrors.endDate = "";
      }
    }
    setFormErrors(updatedErrors);
  };

  const onEndDateChange = (rawValue: string, maskedValue: string) => {
    const updatedFormData = {
      ...formData,
      endDate: rawValue,
    };
    setFormData(updatedFormData);

    const parsedValue = parseMMDDYYYY(maskedValue);
    let updatedErrors = structuredClone(formErrors);
    updatedErrors.endDate = "";
    if (!rawValue) {
      updatedErrors.endDate = ErrorMessages.requiredResponse;
    } else if (parsedValue === undefined) {
      updatedErrors.endDate =
        "End date is invalid. Please enter date in MM/DD/YYYY format";
    } else {
      const startDate = parseMMDDYYYY(formData.startDate);
      if (startDate && parsedValue < startDate) {
        updatedErrors.endDate = ErrorMessages.endDateBeforeStartDate;
      }
    }
    setFormErrors(updatedErrors);
  };

  const onBlur = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    const required = evt.target.dataset.required === "true";
    if (required && !value) {
      setFormErrors({
        ...formErrors,
        [name]: ErrorMessages.requiredResponse,
      });
    }
  };

  const onSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    const newErrors = structuredClone(formErrors);
    for (let key of ["title", "description", "startDate", "endDate"] as const) {
      if (!formErrors[key] && !formData[key]) {
        newErrors[key] = ErrorMessages.requiredResponse;
      }
    }
    setFormErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((message) => !!message);
    if (hasErrors) {
      return;
    }

    setSubmitting(true);

    const newBannerData: BannerData = {
      key: bannerId,
      title: formData.title,
      description: formData.description,
      link: formData.link,
      startDate: convertDatetimeStringToNumber(formData.startDate, {
        hour: 0,
        minute: 0,
        second: 0,
      }),
      endDate: convertDatetimeStringToNumber(formData.endDate, {
        hour: 23,
        minute: 59,
        second: 59,
      }),
    };

    try {
      await writeAdminBanner(newBannerData);
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form id="addAdminBanner" onSubmit={onSubmit}>
        <Flex flexDirection="column" gap="1.5rem">
          <CmsdsTextField
            name="title"
            label="Title text"
            onChange={onTextChange}
            onBlur={onBlur}
            value={formData.title}
            errorMessage={formErrors.title}
            data-required="true"
          />
          <CmsdsTextField
            name="description"
            label="Description text"
            onChange={onTextChange}
            onBlur={onBlur}
            value={formData.description}
            errorMessage={formErrors.description}
            data-required="true"
          />
          <CmsdsTextField
            name="link"
            label="Link"
            hint="Optional"
            onChange={onTextChange}
            onBlur={onBlur}
            value={formData.link}
            errorMessage={formErrors.link}
            data-required="false"
          />
          <CmsdsDateField
            name="startDate"
            label="Start date"
            onChange={onStartDateChange}
            onBlur={onBlur}
            value={formData.startDate}
            errorMessage={formErrors.startDate}
            data-required="true"
          />
          <CmsdsDateField
            name="endDate"
            label="End date"
            onChange={onEndDateChange}
            onBlur={onBlur}
            value={formData.endDate}
            errorMessage={formErrors.endDate}
            data-required="true"
          />
        </Flex>
      </form>
      <Banner
        bannerData={{
          title: formData.title || "New banner title",
          description: formData.description || "New banner description",
          link: formData.link,
        }}
      />
      <Flex sx={sx.previewFlex}>
        <Button form="addAdminBanner" type="submit" sx={sx.replaceBannerButton}>
          {submitting ? <Spinner size="md" /> : "Replace Current Banner"}
        </Button>
      </Flex>
    </>
  );
};

interface Props {
  writeAdminBanner: AdminBannerMethods["writeAdminBanner"];
}

const sx = {
  previewFlex: {
    flexDirection: "column",
  },
  replaceBannerButton: {
    width: "14rem",
    marginTop: "spacer2 !important",
    alignSelf: "end",
  },
};
