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
          <Text fontSize="18px" fontWeight="bold" paddingBottom="16px">
            Quality Measure Details
          </Text>
          <Text fontSize="22px" fontWeight="bold">
            Measure Name: {title}
          </Text>
          <Text fontSize="18px">CMIT number: #{cmit}</Text>
          <Text fontSize="18px">Steward: {steward}</Text>
          <Text fontSize="18px">
            Collection method: {formattedCollectionMethod}
          </Text>
        </>
      </Flex>
      <Divider margin="16px 0px" />
    </Box>
  );
};
