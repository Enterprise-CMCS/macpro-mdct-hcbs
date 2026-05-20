import { Box, Heading, Link, Text } from "@chakra-ui/react";
import {
  AdminDashSelector,
  CiIntroductionCard,
  PageTemplate,
  QmsIntroductionCard,
  TacmIntroductionCard,
  PCPIntroductionCard,
  WWLIntroductionCard,
} from "components";
import { useStore } from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";
import { activeBannerSelector } from "utils/state/selectors";
import { BannerAreas } from "types";
import { Banner } from "components/alerts/Banner";

export const HomePage = () => {
  const banner = useStore(activeBannerSelector(BannerAreas.Home));
  const { userIsEndUser } = useStore().user ?? {};

  const isTACMReportActive = useFlags()?.isTacmReportActive;
  const isCIReportActive = useFlags()?.isCiReportActive;
  const isPCPReportActive = useFlags()?.isPcpReportActive;
  const isWWLReportActive = useFlags()?.isWwlReportActive;

  return (
    <>
      <PageTemplate>
        {banner ? <Banner {...banner} key={banner.key} /> : null}
        {/* Show standard view to state users */}
        {userIsEndUser ? (
          <>
            <Box>
              <Heading as="h1" variant="h1" paddingBottom="spacer3">
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
            <Box>
              <Heading as="h2" variant="h2" marginBottom="spacer3">
                Quality Reports
              </Heading>
              <QmsIntroductionCard />
            </Box>
            <Box>
              <Heading as="h2" variant="h2" marginBottom="spacer3">
                Transparency Reports
              </Heading>
              <Box display="flex" flexDirection="column" gap="spacer4">
                {isTACMReportActive && <TacmIntroductionCard />}
                {isWWLReportActive && <WWLIntroductionCard />}
              </Box>
            </Box>
            <Box>
              <Heading as="h2" variant="h2" marginBottom="spacer3">
                Compliance Reports
              </Heading>
              <Box display="flex" flexDirection="column" gap="spacer4">
                {isCIReportActive && <CiIntroductionCard />}
                {isPCPReportActive && <PCPIntroductionCard />}
              </Box>
            </Box>
          </>
        ) : (
          // show read-only view to non-state users
          <AdminDashSelector />
        )}
      </PageTemplate>
    </>
  );
};
