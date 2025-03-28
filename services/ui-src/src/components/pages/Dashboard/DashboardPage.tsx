import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { StateNames } from "../../../constants";
import { isReportType, isStateAbbr, Report } from "types";
import {
  PageTemplate,
  DashboardTable,
  AddEditReportModal,
  AccordionItem,
} from "components";
import {
  Box,
  Button,
  Image,
  Heading,
  Link,
  Text,
  Flex,
  useDisclosure,
  Accordion,
} from "@chakra-ui/react";
import { useStore } from "utils";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";
import { getReportsForState } from "utils/api/requestMethods/report";

export const DashboardPage = () => {
  const { userIsEndUser } = useStore().user ?? {};
  const { reportType, state } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | undefined>(
    undefined
  );
  const fullStateName = StateNames[state as keyof typeof StateNames];

  useEffect(() => {
    if (!isReportType(reportType) || !isStateAbbr(state)) {
      return;
    }

    reloadReports(reportType, state);
  }, [reportType, state]);

  const reloadReports = (reportType: string, state: string) => {
    (async () => {
      setIsLoading(true);
      const result = await getReportsForState(reportType, state);
      setReports(result);
      setIsLoading(false);
    })();
  };

  const openAddEditReportModal = (report?: Report) => {
    setSelectedReport(report);
    // use disclosure to open modal
    addEditReportModalOnOpenHandler();
  };

  // add/edit program modal disclosure
  const {
    isOpen: addEditReportModalIsOpen,
    onOpen: addEditReportModalOnOpenHandler,
    onClose: addEditReportModalOnCloseHandler,
  } = useDisclosure();

  return (
    <PageTemplate type="report" sx={sx.layout}>
      <Link as={RouterLink} to="/" variant="return">
        <Image src={arrowLeftIcon} alt="Arrow left" className="icon" />
        Return home
      </Link>

      <Box sx={sx.leadTextBox}>
        <Heading as="h1" variant="h1">
          {fullStateName} Quality Measure Set Report
        </Heading>
        <Accordion
          allowToggle={true}
          sx={sx.accordion}
          defaultIndex={[0]} // sets the accordion to open by default
        >
          <AccordionItem label="Instructions" sx={sx.accordionItem}>
            <Box sx={sx.accordionPanel}>
              <p>
                [Optional - Include instructions that would support the state in
                the completion of the report]
              </p>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
      <Flex sx={sx.bodyBox} gap="2rem" flexDirection="column">
        {!isLoading && (
          <DashboardTable
            reports={reports}
            openAddEditReportModal={openAddEditReportModal}
            readOnlyUser={!userIsEndUser}
          />
        )}
        {!reports?.length && (
          <Text variant="tableEmpty">
            Keep track of your Quality Measure Set Reports, once you start a
            report you can access it here.
          </Text>
        )}
        {userIsEndUser && (
          <Flex justifyContent="center">
            <Button onClick={() => openAddEditReportModal()} type="submit">
              Start Quality Measure Set Report
            </Button>
          </Flex>
        )}
      </Flex>
      <AddEditReportModal
        activeState={state!}
        reportType={reportType!}
        modalDisclosure={{
          isOpen: addEditReportModalIsOpen,
          onClose: addEditReportModalOnCloseHandler,
        }}
        reportHandler={reloadReports}
        selectedReport={selectedReport}
      />
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "1rem",
      marginBottom: "3.5rem",
    },
  },
  leadTextBox: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "2.5rem auto 0rem",
    ".tablet &, .mobile &": {
      margin: "2.5rem 0 1rem",
    },
  },
  bodyBox: {
    maxWidth: "55.25rem",
    margin: "0 auto",
    ".desktop &": {
      width: "100%",
    },
    ".tablet &, .mobile &": {
      margin: "0",
    },
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
  accordion: {
    marginTop: "2rem",
    color: "palette.base",
  },
  accordionItem: {
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  accordionPanel: {
    ".mobile &": {
      paddingLeft: "1rem",
    },
    a: {
      color: "palette.primary",
      textDecoration: "underline",
    },
    header: {
      marginBottom: "1.5rem",
    },
    p: {
      marginBottom: "1.5rem",
    },
  },
};
