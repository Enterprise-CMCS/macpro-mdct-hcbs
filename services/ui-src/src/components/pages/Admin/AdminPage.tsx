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
    <PageTemplate data-testid="admin-view">
      {bannerErrorMessage ? (
        <Alert
          status={AlertTypes.ERROR}
          title={bannerErrorMessage.title}
          showIcon={false}
        >
          {bannerErrorMessage.children}
        </Alert>
      ) : null}
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
                    <Text>
                      Status:{" "}
                      <span className={bannerActive ? "active" : "inactive"}>
                        {bannerActive ? "Active" : "Inactive"}
                      </span>
                    </Text>
                    <Text>
                      Start Date:{" "}
                      {bannerData.startDate && (
                        <span>{convertDateUtcToEt(bannerData.startDate)}</span>
                      )}
                    </Text>
                    <Text>
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
