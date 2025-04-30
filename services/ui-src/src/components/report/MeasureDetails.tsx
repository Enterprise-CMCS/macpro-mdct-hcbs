import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import { MeasurePageTemplate, PageType } from "types";
import { currentPageSelector } from "utils/state/selectors";

export const MeasureDetailsElement = () => {
  const currentPage = useStore(currentPageSelector);

  if (!currentPage || currentPage.type !== PageType.Measure) return null;
  const measurePage = currentPage as MeasurePageTemplate;

  const cmitInfo = measurePage.cmitInfo;
  const title = cmitInfo!.name;
  const cmit = cmitInfo?.cmit;
  const steward = cmitInfo?.measureSteward;
  const collectionMethod = cmitInfo?.dataSource;

  const formatCollectionMethod = (method: string | undefined) => {
    if (!method) return "";
    return method.replace(/([A-Z])/g, " $1").trim();
  };
  const formattedCollectionMethod = formatCollectionMethod(
    collectionMethod?.toString()
  );

  return (
    <Box width="80%">
      <Flex flexDirection="column" alignItems="space-between">
        <>
          <Text fontWeight="bold" paddingBottom="1rem">
            Quality Measure Details:
          </Text>
          <Text>Measure Name: {title}</Text>
          <Text>CMIT number: #{cmit}</Text>
          <Text>Steward: {steward}</Text>
          <Text>Collection method: {formattedCollectionMethod}</Text>
        </>
      </Flex>
      <Divider margin="2rem 0 0 0" />
    </Box>
  );
};
