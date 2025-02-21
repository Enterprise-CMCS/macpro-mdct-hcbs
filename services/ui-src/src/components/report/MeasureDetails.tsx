import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { PageElementProps } from "./Elements";
import { MeasureDetailsTemplate } from "types";

export const MeasureDetailsElement = (props: PageElementProps) => {
  const details = props.element as MeasureDetailsTemplate;
  const title = details.title;

  return (
    <Box width="100%">
      <Flex flexDirection="column" alignItems="space-between">
        <>
          <Text fontSize="18px" fontWeight="bold">
            Quality Measure Details:
          </Text>
          <Text fontSize="22px" fontWeight="bold">
            Measure Name: {title}
          </Text>
          {/* noodling how to call the CMIT_LIST deets here */}
          <Text fontSize="18px">
            CMIT number: 'cmit' <br />
            Steward: 'MeasureSteward' <br />
            Collection method: 'dataSource'
          </Text>
        </>
      </Flex>
      <Divider marginBottom="2rem" />
    </Box>
  );
};
