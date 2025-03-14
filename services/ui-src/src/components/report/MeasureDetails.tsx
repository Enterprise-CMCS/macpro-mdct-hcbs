import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import { DataSource, MeasurePageTemplate } from "types";

export const MeasureDetailsElement = () => {
  const { report, pageMap, currentPageId } = useStore();

  if (!currentPageId) return null;
  const currentPage = report?.pages[
    pageMap?.get(currentPageId)!
  ] as MeasurePageTemplate;

  const cmitInfo = currentPage.cmitInfo;
  const title = cmitInfo!.name;
  const cmit = cmitInfo?.cmit;
  const steward = cmitInfo?.measureSteward;
  const collectionMethod = DataSource[cmitInfo!.dataSource];
  return (
    <Box width="110%">
      <Flex flexDirection="column" alignItems="space-between">
        <>
          <Text fontSize="18px" fontWeight="bold" paddingBottom="16px">
            Quality Measure Details:
          </Text>
          <Text fontSize="22px" fontWeight="bold">
            Measure Name: {title}
          </Text>
          <Text fontSize="18px">CMIT number: {cmit}</Text>
          <Text fontSize="18px">Steward: {steward}</Text>
          <Text fontSize="18px">Collection method: {collectionMethod}</Text>
        </>
      </Flex>
      <Divider margin="32px 0px" />
    </Box>
  );
};
