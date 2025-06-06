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
  Banner,
  ErrorAlert,
  PageTemplate,
} from "components";
import { convertDateUtcToEt, useStore } from "utils";

export const AdminPage = () => {
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
    <PageTemplate sxOverride={sx.layout} data-testid="admin-view">
      <ErrorAlert error={bannerErrorMessage} sxOverride={sx.errorAlert} />
      <Box sx={sx.introTextBox}>
        <Heading as="h1" id="AdminHeader" tabIndex={-1} sx={sx.headerText}>
          Banner Admin
        </Heading>
        <Text>Manage the announcement banner below.</Text>
      </Box>
      <Box sx={sx.currentBannerSectionBox}>
        <Text sx={sx.sectionHeader}>Current Banner</Text>
        {bannerLoading ? (
          <Flex sx={sx.spinnerContainer}>
            <Spinner size="md" />
          </Flex>
        ) : (
          <>
            <Collapse in={!!bannerData?.key}>
              {bannerData && (
                <>
                  <Flex sx={sx.currentBannerInfo}>
                    <Text sx={sx.currentBannerStatus}>
                      Status:{" "}
                      <span className={bannerActive ? "active" : "inactive"}>
                        {bannerActive ? "Active" : "Inactive"}
                      </span>
                    </Text>
                    <Text sx={sx.currentBannerDate}>
                      Start Date:{" "}
                      {bannerData.startDate && (
                        <span>{convertDateUtcToEt(bannerData.startDate)}</span>
                      )}
                    </Text>
                    <Text sx={sx.currentBannerDate}>
                      End Date:{" "}
                      {bannerData.endDate && (
                        <span>{convertDateUtcToEt(bannerData.endDate)}</span>
                      )}
                    </Text>
                  </Flex>
                  <Flex sx={sx.currentBannerFlex}>
                    <Banner bannerData={bannerData} />
                    <Button
                      variant="danger"
                      sx={sx.deleteBannerButton}
                      onClick={deleteAdminBanner}
                    >
                      {bannerDeleting ? (
                        <Spinner size="md" />
                      ) : (
                        "Delete Current Banner"
                      )}
                    </Button>
                  </Flex>
                </>
              )}
            </Collapse>
            {!bannerData && <Text>There is no current banner</Text>}
          </>
        )}
      </Box>
      <Flex sx={sx.newBannerBox} gap=".75rem">
        <Text sx={sx.sectionHeader}>Create a New Banner</Text>
        <AdminBannerForm writeAdminBanner={writeAdminBanner} />
      </Flex>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  errorAlert: {
    width: "100% !important",
    marginTop: "-4rem",
    marginBottom: "2rem",
  },
  introTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  currentBannerSectionBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  sectionHeader: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  currentBannerInfo: {
    flexDirection: "column",
    marginBottom: "0.5rem !important",
  },
  currentBannerStatus: {
    span: {
      marginLeft: "0.5rem",
      "&.active": {
        color: "palette.success",
      },
      "&.inactive": {
        color: "palette.error",
      },
    },
  },
  currentBannerDate: {
    span: {
      marginLeft: "0.5rem",
    },
  },
  currentBannerFlex: {
    flexDirection: "column",
  },
  spinnerContainer: {
    marginTop: "0.5rem",
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
    marginTop: "1rem !important",
  },
  newBannerBox: {
    width: "100%",
    flexDirection: "column",
    marginBottom: "2.25rem",
  },
};
