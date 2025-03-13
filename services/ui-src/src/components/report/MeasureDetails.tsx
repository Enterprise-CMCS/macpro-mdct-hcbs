import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { CMIT_LIST } from "cmit";
import { useStore } from "utils";
import { DataSource, MeasurePageTemplate, PageType } from "types";
import { currentPageSelector } from "utils/state/selectors";

export const MeasureDetailsElement = () => {
  const currentPage = useStore(currentPageSelector);

  if (!currentPage || currentPage.type !== PageType.Measure) return null;
  const measurePage = currentPage as MeasurePageTemplate;

  const cmitInfo = CMIT_LIST.find((item) => item.uid === measurePage?.cmitId);
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
