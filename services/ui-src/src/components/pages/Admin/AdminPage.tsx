import { Fragment, useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { AdminBannerForm, PageTemplate } from "components";
import { convertDateUtcToEt, useStore } from "utils";
import { BannerArea, bannerAreaLabels, BannerShape } from "types";
import { Banner } from "components/alerts/Banner";

export const AdminPage = () => {
  const { allBanners, fetchBanners, updateBanner, deleteBanner } = useStore();
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      await fetchBanners();
      setLoading(false);
    })();
  }, []);

  const bannerGroups = groupAndSortBanners(allBanners);

  const onDelete = async (bannerKey: string) => {
    setIsDeleting({ ...isDeleting, [bannerKey]: true });
    try {
      await deleteBanner(bannerKey);
    } finally {
      setIsDeleting({ ...isDeleting, [bannerKey]: false });
    }
  };

  return (
    <PageTemplate data-testid="admin-view">
      <Box>
        <Heading as="h1" id="AdminHeader" tabIndex={-1} sx={sx.headerText}>
          Banner Admin
        </Heading>
        <Text>Manage the announcement banners below.</Text>
      </Box>
      <Box>
        <Heading as="h2" sx={sx.sectionHeader}>
          Current Banners
        </Heading>
        {loading ? (
          <Flex sx={sx.spinnerContainer}>
            <Spinner size="md" />
          </Flex>
        ) : allBanners.length === 0 ? (
          <Text>There are no existing banners.</Text>
        ) : (
          <Flex sx={sx.bannerGroupsContainer}>
            {Object.entries(bannerGroups).map(([area, banners]) => (
              <Flex key={area} sx={sx.bannerGroupContainer}>
                <Heading as="h3">
                  {bannerAreaLabels[area as BannerArea]}
                </Heading>
                {banners.map((banner) => (
                  <Fragment key={banner.key}>
                    <Banner {...banner} />
                    <Flex sx={sx.bannerStatusAndButtonContainer}>
                      {displayStatus(banner)}
                      <Button
                        variant="danger"
                        onClick={() => onDelete(banner.key)}
                        aria-label={`Delete banner titled ${banner.title}`}
                      >
                        {isDeleting[banner.key] ? (
                          <Spinner size="md" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </Flex>
                  </Fragment>
                ))}
                <hr />
              </Flex>
            ))}
          </Flex>
        )}
      </Box>
      <Flex sx={sx.newBannerBox} gap=".75rem">
        <Heading as="h2" sx={sx.sectionHeader}>
          Create a New Banner
        </Heading>
        <AdminBannerForm updateBanner={updateBanner} />
      </Flex>
    </PageTemplate>
  );
};

function groupAndSortBanners(banners: BannerShape[]) {
  // Sort by startDate, then by endDate, then by createdAt. Earliest first.
  banners.sort(
    (a, b) =>
      a.startDate.localeCompare(b.startDate) ||
      a.endDate.localeCompare(b.endDate) ||
      a.createdAt.localeCompare(b.createdAt)
  );

  const groups: Record<string, BannerShape[]> = {};
  for (let area of Object.keys(bannerAreaLabels)) {
    const group = banners.filter((b) => b.area === area);
    if (group.length > 0) {
      // Only display an area if it has any banners
      groups[area] = group;
    }
  }
  return groups;
}

function displayStatus(banner: BannerShape) {
  const now = new Date();
  const startDate = new Date(banner.startDate);
  const endDate = new Date(banner.endDate);
  const status =
    now < startDate ? "Scheduled" : now <= endDate ? "Active" : "Expired";
  const startDateEt = convertDateUtcToEt(startDate.valueOf());
  const endDateEt = convertDateUtcToEt(endDate.valueOf());

  return (
    <Text sx={sx.statusText}>
      <span className={status}>{status}</span>: {startDateEt}&ndash;{endDateEt}
    </Text>
  );
}

const sx = {
  headerText: {
    marginBottom: "spacer2",
    fontSize: "heading_3xl",
    fontWeight: "heading_3xl",
  },
  sectionHeader: {
    marginBottom: "spacer2",
    fontSize: "heading_2xl",
    fontWeight: "heading_2xl",
  },
  bannerGroupsContainer: {
    flexDirection: "column",
    gap: "3rem",
    h3: {
      fontWeight: "bold",
    },
  },
  bannerGroupContainer: {
    flexDirection: "column",
    gap: "2rem",
  },
  bannerStatusAndButtonContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 10rem",
    marginTop: "-1rem",
    button: {
      fontWeight: "bold",
    },
  },
  statusText: {
    ".Expired": { color: "palette.error" },
    ".Active": { color: "palette.success" },
    ".Scheduled": { color: "palette.primary" },
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
  newBannerBox: {
    width: "100%",
    flexDirection: "column",
  },
};
