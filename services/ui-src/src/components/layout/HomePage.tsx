import { Box, Collapse, Heading, Text } from "@chakra-ui/react";
import {
  AdminDashSelector,
  Banner,
  CiIntroductionCard,
  PageTemplate,
  QmsIntroductionCard,
  TacmIntroductionCard,
} from "components";
import { useEffect } from "react";
import { checkDateRangeStatus, useStore } from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";

export const HomePage = () => {
  const { bannerData, bannerActive, setBannerActive } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  const isTACMReportActive = useFlags()?.isTacmReportActive;
  const isCIReportActive = useFlags()?.isCiReportActive;

  useEffect(() => {
    let bannerActivity = false;
    if (bannerData && bannerData.startDate && bannerData.endDate) {
      bannerActivity = checkDateRangeStatus(
        bannerData.startDate,
        bannerData.endDate
      );
    }
    setBannerActive(bannerActivity);
  }, [bannerData]);

  const showBanner = !!bannerData?.key && bannerActive;

  return (
    <>
      <Collapse in={showBanner}>
        <Box margin="0 2rem">
          <Banner bannerData={bannerData} />
        </Box>
      </Collapse>
      <PageTemplate>
        {/* show standard view to state users */}
        {userIsEndUser ? (
          <>
            <Box>
              <Heading as="h1" variant="h1">
                Home and Community-Based Services (HCBS) Portal
              </Heading>
              <Text>
                Get started by completing the Home and Community-Based Services
                (HCBS) for your state or territory.
              </Text>
            </Box>
            <QmsIntroductionCard />
            {isCIReportActive && <CiIntroductionCard />}
            {isTACMReportActive && <TacmIntroductionCard />}
          </>
        ) : (
          // show read-only view to non-state users
          <AdminDashSelector />
        )}
      </PageTemplate>
    </>
  );
};
