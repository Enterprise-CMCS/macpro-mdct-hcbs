import { ChangeEvent, FormEvent, useState } from "react";
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import {
  Dropdown as CmsdsDropdown,
  TextField as CmsdsTextField,
  SingleInputDateField as CmsdsDateField,
} from "@cmsgov/design-system";
import { ErrorMessages } from "../../constants";
import { parseAsLocalDate, parseMMDDYYYY, useStore } from "utils";
import {
  BannerArea,
  bannerAreaLabels,
  BannerAreas,
  BannerFormData,
} from "types";
import { isUrl } from "utils/validation/inputValidation";
import { Banner } from "components/alerts/Banner";

export const AdminBannerForm = ({ createBanner }: Props) => {
  const allBanners = useStore((state) => state.allBanners);
  const blankFormState: BannerFormData = {
    area: BannerAreas.Home,
    title: "",
    description: "",
    link: "",
    startDate: "",
    endDate: "",
  };
  const untouchedState = {
    area: true, // This starts at a valid value ("home")
    title: false,
    description: false,
    link: false,
    startDate: false,
    endDate: false,
  };
  const blankErrorState = {
    area: "",
    title: "",
    description: "",
    link: "",
    startDate: "",
    endDate: "",
  };
  const [formData, setFormData] = useState(blankFormState);
  const [touchedState, setTouchedState] = useState(untouchedState);
  const [formErrors, setFormErrors] = useState(blankErrorState);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (evt: {
    target: { name: string; value: string; maskedValue?: string };
  }) => {
    const newFormData = { ...formData, [evt.target.name]: evt.target.value };
    setFormData(newFormData);

    const touched = { ...touchedState, [evt.target.name]: true };
    setTouchedState(touched);

    const newFormErrors = blankErrorState;

    if (touched.title && !newFormData.title) {
      newFormErrors.title = ErrorMessages.requiredResponse;
    }

    if (touched.description && !newFormData.description) {
      newFormErrors.description = ErrorMessages.requiredResponse;
    }

    if (touched.link && newFormData.link && !isUrl(newFormData.link)) {
      newFormErrors.link = "Response must be a valid hyperlink/URL";
    }

    const parsedStartDate = parseMMDDYYYY(
      evt.target.name === "startDate"
        ? evt.target.maskedValue!
        : newFormData.startDate
    );
    if (touched.startDate) {
      if (!newFormData.startDate) {
        newFormErrors.startDate = ErrorMessages.requiredResponse;
      } else if (parsedStartDate === undefined) {
        newFormErrors.startDate =
          "Start date is invalid. Please enter date in MM/DD/YYYY format";
      } else {
        const banner = findConflictingBanner(newFormData.area, parsedStartDate);
        if (banner) {
          newFormErrors.startDate = `Start date conflicts with existing banner: ${banner.title}`;
        }
      }
    }

    const parsedEndDate = parseMMDDYYYY(
      evt.target.name === "endDate"
        ? evt.target.maskedValue!
        : newFormData.endDate
    );
    if (touched.endDate) {
      if (!newFormData.endDate) {
        newFormErrors.endDate = ErrorMessages.requiredResponse;
      } else if (parsedEndDate === undefined) {
        newFormErrors.endDate =
          "End date is invalid. Please enter date in MM/DD/YYYY format";
      } else if (parsedStartDate && parsedEndDate < parsedStartDate) {
        newFormErrors.endDate = ErrorMessages.endDateBeforeStartDate;
      } else {
        const banner = findConflictingBanner(newFormData.area, parsedEndDate);
        if (banner) {
          newFormErrors.endDate = `End date conflicts with existing banner: ${banner.title}`;
        }
      }
    }

    if (
      parsedStartDate &&
      parsedEndDate &&
      !newFormErrors.startDate &&
      !newFormErrors.endDate
    ) {
      const banner = findConflictingBanner(
        newFormData.area,
        parsedStartDate,
        parsedEndDate
      );
      if (banner) {
        newFormErrors.endDate = `This date range conflicts with existing banner: ${banner.title}`;
      }
    }

    setFormErrors(newFormErrors);
  };

  /**
   * @param dateA - A date (start or end) just entered by the user
   * @param dateB - Another date just entered by the user.
   *                If present, this is the endDate, and dateA is the startDate.
   */
  const findConflictingBanner = (
    area: BannerArea,
    dateA: Date,
    dateB?: Date
  ) => {
    return allBanners.find((banner) => {
      const start = parseAsLocalDate(banner.startDate);
      const end = parseAsLocalDate(banner.endDate);
      if (banner.area !== area) {
        return false;
      } else if (start <= dateA && dateA <= end) {
        // This banner's range contains date A
        return true;
      } else if (!dateB) {
        // We're only checking for one end of the new range
        return false;
      } else if (start <= dateB && dateB <= end) {
        // This banner's range contains date B
        return true;
      } else if (dateA <= start && end <= dateB) {
        // The new range completely covers this banner's range
        return true;
      } else {
        return false;
      }
    });
  };

  // The CmsdsDateField change event has a different shape than other inputs,
  // so we wrangle it into a standard shape with these custom handlers.
  const onStartDateChange = (rawValue: string, maskedValue: string) => {
    onChange({ target: { name: "startDate", value: rawValue, maskedValue } });
  };
  const onEndDateChange = (rawValue: string, maskedValue: string) => {
    onChange({ target: { name: "endDate", value: rawValue, maskedValue } });
  };

  const onBlur = (evt: ChangeEvent<HTMLInputElement>) => {
    // This check ensures an error appears when the user clicks into,
    // and then clicks out of, an empty field.
    const { name, value } = evt.target;
    const required = evt.target.dataset.required === "true";
    if (required && !value) {
      setFormErrors({ ...formErrors, [name]: ErrorMessages.requiredResponse });
    }
    setTouchedState({ ...touchedState, [name]: true });
  };

  const onSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    // This check ensures errors appear when the user clicks submit,
    // without first having clicked any of the required input fields.
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
      await createBanner(newBannerData);
      window.scrollTo(0, 0);
      setFormData(blankFormState);
      setTouchedState(untouchedState);
      setFormErrors(blankErrorState);
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
            onChange={onChange}
            onBlur={onBlur}
            options={areaOptions}
            value={formData.area}
            errorMessage={formErrors.area}
          />
          <CmsdsTextField
            name="title"
            label="Title text"
            onChange={onChange}
            onBlur={onBlur}
            value={formData.title}
            errorMessage={formErrors.title}
            data-required="true"
          />
          <CmsdsTextField
            multiline={true}
            name="description"
            label="Description text"
            hint={supportedTagsHint()}
            onChange={onChange}
            onBlur={onBlur}
            value={formData.description}
            errorMessage={formErrors.description}
            data-required="true"
          />
          <CmsdsTextField
            name="link"
            label="Link"
            hint="Optional"
            onChange={onChange}
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

const supportedTagsHint = () => (
  <Box sx={sx.hint} as="span">
    Formatting is supported with these HTML tags:
    <span className="fake-list-item">
      <code>&lt;strong&gt;</code>
    </span>
    <span className="fake-list-item">
      <code>&lt;em&gt;</code>
    </span>
    <span className="fake-list-item">
      <code>&lt;p&gt;</code>
    </span>
    <span className="fake-list-item">
      <code>&lt;ul&gt;</code>
    </span>
    <span className="fake-list-item">
      <code>&lt;ol&gt;</code>
    </span>
    <span className="fake-list-item">
      <code>&lt;li&gt;</code>
    </span>
    <span className="fake-list-item">
      <code>&lt;a&gt;</code>
    </span>
  </Box>
);

const format_mdy_to_ymd = (dateString: string) => {
  const [m, d, y] = dateString.split("/");
  return [y, m, d].join("-");
};

interface Props {
  createBanner: (data: BannerFormData) => Promise<void>;
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
  hint: {
    ".fake-list-item": {
      display: "block",
      marginLeft: "spacer2",
      "&::before": {
        content: '"• "',
      },
    },
  },
};
