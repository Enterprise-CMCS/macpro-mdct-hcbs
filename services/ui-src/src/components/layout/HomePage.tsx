import { Box, Collapse, Heading, Link, Text } from "@chakra-ui/react";
import {
  AdminDashSelector,
  Banner,
  PageTemplate,
  TemplateCard,
} from "components";
import { useEffect } from "react";
import { checkDateRangeStatus, useStore } from "utils";
import verbiage from "verbiage/pages/home";

export const HomePage = () => {
  const { bannerData, bannerActive, setBannerActive } = useStore();
  const { intro, cards } = verbiage;
  const { userIsEndUser } = useStore().user ?? {};

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
                {intro.header}
              </Heading>
              <Text>
                {intro.body.preLinkText}
                <Link href={intro.body.linkLocation} isExternal>
                  {intro.body.linkText}
                </Link>
                {intro.body.postLinkText}
              </Text>
              <Text></Text>
            </Box>
            <TemplateCard templateName="QM" verbiage={cards.QM} />
          </>
        ) : (
          // show read-only view to non-state users
          <AdminDashSelector verbiage={verbiage.readOnly} />
        )}
      </PageTemplate>
    </>
  );
};
