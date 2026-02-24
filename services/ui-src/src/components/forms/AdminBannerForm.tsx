import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Flex, Spinner } from "@chakra-ui/react";
import {
  Dropdown as CmsdsDropdown,
  TextField as CmsdsTextField,
  SingleInputDateField as CmsdsDateField,
} from "@cmsgov/design-system";
import { ErrorMessages } from "../../constants";
import { parseMMDDYYYY } from "utils";
import {
  BannerArea,
  bannerAreaLabels,
  BannerAreas,
  BannerFormData,
} from "types";
import { isUrl } from "utils/validation/inputValidation";
import { Banner } from "components/alerts/Banner";

export const AdminBannerForm = ({ updateBanner }: Props) => {
  const [formData, setFormData] = useState<BannerFormData>({
    area: BannerAreas.Home,
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
  const [submitting, setSubmitting] = useState(false);

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

    const newBannerData: BannerFormData = {
      ...formData,
      startDate: format_mdy_to_ymd(formData.startDate),
      endDate: format_mdy_to_ymd(formData.endDate),
    };

    try {
      await updateBanner(newBannerData);
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form id="addAdminBanner" onSubmit={onSubmit}>
        <Flex flexDirection="column" gap="1.5rem">
          <CmsdsDropdown
            name="area"
            label="Site area"
            onChange={(evt) =>
              setFormData({ ...formData, area: evt.target.value as BannerArea })
            }
            options={areaOptions}
            value={formData.area}
          ></CmsdsDropdown>
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
            multiline={true}
            name="description"
            label="Description text"
            hint={supportedTagsHint}
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
        title={formData.title || "New banner title"}
        link={formData.link}
        description={formData.description || "New banner description"}
      />
      <Flex sx={sx.previewFlex}>
        <Button form="addAdminBanner" type="submit" sx={sx.replaceBannerButton}>
          {submitting ? <Spinner size="md" /> : "Create Banner"}
        </Button>
      </Flex>
    </>
  );
};

const areaOptions = Object.entries(bannerAreaLabels).map(([key, value]) => ({
  label: value,
  value: key,
}));

const supportedTagsHint = (
  <>
    Formatting is supported with these HTML tags: <code>strong</code>/
    <code>b</code>, <code>em</code>/<code>i</code>, <code>p</code>,{" "}
    <code>ul</code>, <code>ol</code>, <code>li</code>, and <code>a</code>.
    Remember to include the <code>target="_blank"</code> attribute in link tags.
  </>
);

const format_mdy_to_ymd = (dateString: string) => {
  const [m, d, y] = dateString.split("/");
  return [y, m, d].join("-");
};

interface Props {
  updateBanner: (data: BannerFormData) => void;
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
