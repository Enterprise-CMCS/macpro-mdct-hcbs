import { useContext } from "react";
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import {
  AdminBannerContext,
  AdminBannerForm,
  Alert,
  Banner,
  PageTemplate,
} from "components";
import { convertDateUtcToEt, useStore } from "utils";
import { AlertTypes } from "types";
import { ToggleButton } from "components/toggle/toggleButton";

export const NotificationsPage = () => {
  const { deleteAdminBanner, writeAdminBanner } =
    useContext(AdminBannerContext);

  const {
    bannerData,
    bannerActive,
    bannerLoading,
    bannerErrorMessage,
    bannerDeleting,
  } = useStore();

  return (
    <PageTemplate data-testid="admin-view">
      <Box sx={sx.introTextBox}>
        <Heading as="h1" id="AdminHeader" tabIndex={-1} sx={sx.headerText}>
            Notifications
        </Heading>
      </Box>
      <Box sx={sx.currentBannerSectionBox}>
        <Text sx={sx.sectionHeader}>Current Banner</Text>
                  <Flex sx={sx.currentBannerInfo}>
                    <Text>
                      Status:{" "}
                      <span className={bannerActive ? "active" : "inactive"}>
                        {bannerActive ? "Active" : "Inactive"}
                      </span>
                    </Text>
                  </Flex>
                  <ToggleButton />

      </Box>
    </PageTemplate>
  );
};

const sx = {
  introTextBox: {
    width: "100%",
  },
  headerText: {
    marginBottom: "spacer2",
    fontSize: "heading_3xl",
    fontWeight: "heading_3xl",
  },
  currentBannerSectionBox: {
    width: "100%",
    marginBottom: "spacer4",
  },
  sectionHeader: {
    fontSize: "heading_2xl",
    fontWeight: "heading_2xl",
  },
  currentBannerInfo: {
    flexDirection: "column",
    marginBottom: "spacer1 !important",
    span: {
      marginLeft: "spacer1",
      "&.active": {
        color: "palette.success",
      },
      "&.inactive": {
        color: "palette.error",
      },
    },
  },
  currentBannerFlex: {
    flexDirection: "column",
  },
  spinnerContainer: {
    marginTop: "spacer1",
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
  deleteBannerButton: {
    width: "13.3rem",
    alignSelf: "end",
    marginTop: "spacer2 !important",
  },
  newBannerBox: {
    width: "100%",
    flexDirection: "column",
  },
};
