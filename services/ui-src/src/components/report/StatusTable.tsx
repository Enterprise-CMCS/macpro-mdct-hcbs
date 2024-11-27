import { Link as RouterLink } from "react-router-dom";
import {
  Button,
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
import editIconPrimary from "assets/icons/edit/icon_edit_primary.svg";
import lookupIconPrimary from "assets/icons/search/icon_search_primary.svg";
import { ParentPageTemplate } from "types/report";
import { TableStatusIcon } from "components/tables/TableStatusIcon";
import { reportBasePath } from "utils/other/routing";

export const StatusTableElement = () => {
  const { pageMap, report } = useStore();

  if (!pageMap) {
    return null;
  }

  const childPages = (report?.pages[pageMap.get("root")!] as ParentPageTemplate)
    .childPageIds;
  const sections = childPages.slice(0, -1).map((id) => {
    const pageIdx = pageMap.get(id);
    if (!pageIdx) return null;
    return report?.pages[pageIdx] as ParentPageTemplate;
  });

  // Build Rows
  const rows = sections.map((section, index) => {
    if (!section) return null;

    return (
      <Tr key={section.id || index} p={0}>
        <Td>
          <Text>{section.title}</Text>
        </Td>
        <Td>
          {/* TODO: Logic for when a page is incomplete to change status icon and text */}
          <TableStatusIcon tableStatus={"complete"} isPdf={true} />
        </Td>
        <Td>
          <Button
            as={RouterLink}
            to={reportBasePath(report!) + `/${section.id}`}
            variant="outline"
            leftIcon={<Image src={editIconPrimary} />}
          >
            Edit
          </Button>
        </Td>
      </Tr>
    );
  });
  return (
    <>
      <Table variant="status">
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
          as={RouterLink}
          to={reportBasePath(report!) + "/export"}
          target="_blank"
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
