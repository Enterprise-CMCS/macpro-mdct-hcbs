import { Box, Collapse, Heading, Link, Text } from "@chakra-ui/react";
import {
  AdminDashSelector,
  Banner,
  CiIntroductionCard,
  PageTemplate,
  QmsIntroductionCard,
  TacmIntroductionCard,
  PCPIntroductionCard,
} from "components";
import { useEffect } from "react";
import { checkDateRangeStatus, useStore } from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";

export const HomePage = () => {
  const { bannerData, bannerActive, setBannerActive } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  const isTACMReportActive = useFlags()?.isTacmReportActive;
  const isCIReportActive = useFlags()?.isCiReportActive;
  const isPCPReportActive = useFlags()?.isPCPReportActive;

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
                (HCBS) reports for your state or territory. For more information
                about measuring and improving quality in home and
                community-based services, please visit{" "}
                <Link
                  isExternal
                  href="https://www.medicaid.gov/medicaid/quality-of-care/quality-improvement-initiatives/measuring-and-improving-quality-home-and-community-based-services"
                >
                  this link.
                </Link>
              </Text>
            </Box>
            <QmsIntroductionCard />
            {isCIReportActive && <CiIntroductionCard />}
            {isTACMReportActive && <TacmIntroductionCard />}
            {isPCPReportActive && <PCPIntroductionCard />}
          </>
        ) : (
          // show read-only view to non-state users
          <AdminDashSelector />
        )}
      </PageTemplate>
    </>
  );
};
