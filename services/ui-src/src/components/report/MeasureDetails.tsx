import { Box, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import { MeasurePageTemplate, PageType } from "types";
import { currentPageSelector } from "utils/state/selectors";
import { TableStatusIcon } from "components/tables/TableStatusIcon";

//methods
const formatCollectionMethod = (method: string | undefined) => {
  if (!method) return "";
  return method.replace(/([A-Z])/g, " $1").trim();
};

//render
const render = (
  title: string,
  cmit?: number,
  steward?: string,
  formattedCollectionMethod?: string,
  isPdf: boolean = false
) => {
  return (
    <Box width="80%">
      <Flex flexDirection="column" alignItems="space-between">
        <>
          {!isPdf && (
            <Text fontWeight="bold" paddingBottom="1rem">
              Quality Measure Details:
            </Text>
          )}
          <Text fontWeight={isPdf ? "bold" : "normal"}>
            Measure Name: {title}
          </Text>
          <Text>CMIT number: #{cmit}</Text>
          <Text>Steward: {steward}</Text>
          <Text>Collection method: {formattedCollectionMethod}</Text>
        </>
      </Flex>
      {!isPdf && <Divider margin="2rem 0 0 0" />}
    </Box>
  );
};

//component
export const MeasureDetailsElement = () => {
  const currentPage = useStore(currentPageSelector);

  if (!currentPage || currentPage.type !== PageType.Measure) return null;
  const measurePage = currentPage as MeasurePageTemplate;

  const cmitInfo = measurePage.cmitInfo;
  const title = cmitInfo!.name;
  const cmit = cmitInfo?.cmit;
  const steward = cmitInfo?.measureSteward;
  const collectionMethod = cmitInfo?.dataSource;

  const formattedCollectionMethod = formatCollectionMethod(
    collectionMethod?.toString()
  );

  return render(title, cmit, steward, formattedCollectionMethod);
};

//export
export const MeasureDetailsExport = (section: any) => {
  const {
    name: title,
    cmit,
    measureSteward: steward,
    dataSource: collectionMethod,
  } = section.cmitInfo;

  const formattedCollectionMethod = formatCollectionMethod(
    collectionMethod?.toString()
  );

  return (
    <HStack gap={4}>
      <TableStatusIcon tableStatus={section.status}></TableStatusIcon>
      {render(title, cmit, steward, formattedCollectionMethod, true)}
    </HStack>
  );
};
