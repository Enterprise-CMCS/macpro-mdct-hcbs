import { Box, Divider, Flex, HStack, Text, Heading } from "@chakra-ui/react";
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
            <Heading
              fontWeight="heading_md"
              fontSize="heading_md"
              paddingBottom="spacer2"
            >
              Quality Measure Details:
            </Heading>
          )}
          <Heading
            fontWeight="heading_xl"
            fontSize="heading_xl"
            lineHeight="heading_xl"
            marginBottom="0 !important"
            as="h3"
          >
            {`Measure Name: ${title}`}
          </Heading>
          <Text>{`CMIT number: #${cmit}`}</Text>
          <Text>{`Steward: ${steward}`}</Text>
          <Text>{`Collection method: ${formattedCollectionMethod}`}</Text>
        </>
      </Flex>
      {!isPdf && <Divider marginTop="spacer4" />}
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
export const MeasureDetailsExport = (section: MeasurePageTemplate) => {
  const {
    name: title,
    cmit,
    measureSteward: steward,
    dataSource: collectionMethod,
  } = section.cmitInfo!;

  const formattedCollectionMethod = formatCollectionMethod(
    collectionMethod?.toString()
  );

  return (
    <HStack
      gap="spacer4"
      marginLeft="spacer4"
      position="relative"
      alignItems="flex-start"
    >
      <TableStatusIcon tableStatus={section.status} isPdf></TableStatusIcon>
      {render(title, cmit, steward, formattedCollectionMethod, true)}
    </HStack>
  );
};
