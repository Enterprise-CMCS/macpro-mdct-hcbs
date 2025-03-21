import {
  Button,
  Table,
  Th,
  Thead,
  Tr,
  Td,
  Tbody,
  Text,
} from "@chakra-ui/react";
import { useStore } from "utils";
import { TableStatusIcon } from "components/tables/TableStatusIcon";
import { MeasurePageTemplate } from "types";
import { useParams, useNavigate } from "react-router-dom";

export const MeasureResultsNavigationTableElementLTSS5 = () => {
  const { report, pageMap, currentPageId } = useStore();
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  if (!currentPageId) return null;
  const currentPage = report?.pages[
    pageMap?.get(currentPageId)!
  ] as MeasurePageTemplate;
  if (!currentPage.cmitInfo) return null;

  const handleEditClick = (pageId: string) => {
    if (report) {
      const path = `/report/${reportType}/${state}/${reportId}/${pageId}`;
      navigate(path);
    }
  };

  return (
    <Table variant="measureLTSS5">
      <Thead>
        <Tr>
          <Th></Th>
          <Th>
            Measure Name <br />
            CMIT Number
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        <>
          <Tr key={0}>
            <Td>
              <TableStatusIcon tableStatus=""></TableStatusIcon>
            </Td>
            <Td width="100%">
              <Text fontWeight="bold">Part 1: Screening (MLTSS)</Text>
              <Text>CMIT#: 1255</Text>
            </Td>
            <Td>
              <Button
                variant="outline"
                onClick={() => handleEditClick("LTSS-5-PT1")}
              >
                Edit
              </Button>
            </Td>
          </Tr>
          <Tr key={1}>
            <Td>
              <TableStatusIcon tableStatus=""></TableStatusIcon>
            </Td>
            <Td width="100%">
              <Text fontWeight="bold">
                Part 2: Risk Assessment and Plan of Care (MLTSS)
              </Text>
              <Text>CMIT#: 1255</Text>
            </Td>
            <Td>
              <Button
                variant="outline"
                onClick={() => handleEditClick("LTSS-5-PT2")}
              >
                Edit
              </Button>
            </Td>
          </Tr>
        </>
      </Tbody>
    </Table>
  );
};
