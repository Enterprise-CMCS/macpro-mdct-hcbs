import {
  Button,
  Flex,
  Image,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { useStore } from "utils";
import iconStatusCheck from "assets/icons/status/icon_status_check.svg";
import iconStatusError from "assets/icons/status/icon_status_alert.svg";
import editIconPrimary from "assets/icons/edit/icon_edit_primary.svg";
import lookupIconPrimary from "assets/icons/search/icon_search_primary.svg";
import { ParentPageTemplate } from "types/report";
import { useNavigate } from "react-router-dom";

export const StatusTableElement = () => {
  const { pageMap, setCurrentPageId } = useStore();
  const navigate = useNavigate();

  if (!pageMap) {
    return null;
  }

  const childPageIdsList = (pageMap.get("root") as ParentPageTemplate)
    .childPageIds;
  const sectionTitles = childPageIdsList
    .map((id) => {
      const page = pageMap.get(id) as ParentPageTemplate;
      return { title: page.title, pageId: id };
    })
    .slice(0, -1);

  // Build Rows
  const rows = sectionTitles.map((section, index) => {
    return (
      <Tr key={section.pageId || index} p={0}>
        <Td>
          <Stack flex="1">
            <Text fontWeight="bold">{section.title}</Text>
          </Stack>
        </Td>
        <Td>
          <Flex align="right">
            {/* TODO: Logic for when a page is incomplete to change status icon and text */}
            <Image
              src={iconStatusCheck ? iconStatusCheck : iconStatusError}
              alt="icon description"
            />
            <Text ml={1}>{iconStatusCheck ? "Complete" : "Error"}</Text>
          </Flex>
        </Td>
        <Td>
          <Button
            colorScheme="blue"
            variant="outline"
            leftIcon={<Image src={editIconPrimary} />}
            onClick={() => setCurrentPageId(section.pageId)}
          >
            Edit
          </Button>
        </Td>
      </Tr>
    );
  });
  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>Section</Th>
            <Th>Status</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
      <Stack
        direction="row"
        width="100%"
        display="flex"
        justifyContent="space-between"
        mt={5}
      >
        <Button
          onClick={() => navigate("PDF")}
          colorScheme="blue"
          variant="outline"
          leftIcon={<Image src={lookupIconPrimary} />}
        >
          Review PDF
        </Button>
        <Button
          // onClick={() => SetPageIndex(parentPage.index - 1)}
          alignSelf="flex-end"
        >
          Submit QMS Report
        </Button>
      </Stack>
    </>
  );
};
