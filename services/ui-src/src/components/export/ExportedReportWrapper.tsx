import { Box, Stack } from "@chakra-ui/react";
import {
  FormPageTemplate,
  MeasurePageTemplate,
  ParentPageTemplate,
} from "types";

export const ExportedReportWrapper = ({ section }: Props) => {
  console.log(section);
  return (
    <Stack>
      {section.elements?.map((element) => (
        <Box>{element?.type}</Box>
      ))}
    </Stack>
  );
};

export interface Props {
  section: ParentPageTemplate | FormPageTemplate | MeasurePageTemplate;
}
