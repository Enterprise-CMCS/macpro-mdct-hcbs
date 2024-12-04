import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { StateNames } from "../../../constants";
import { isReportType, isStateAbbr, Report } from "types";
import {
  PageTemplate,
  InstructionsAccordion,
  DashboardTable,
  AddEditReportModal,
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
} from "@chakra-ui/react";
import { parseCustomHtml, useStore } from "utils";
import dashboardVerbiage from "verbiage/pages/dashboard";
import accordion from "verbiage/pages/accordion";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";
import { getReportsForState } from "utils/api/requestMethods/report";

export const DashboardPage = () => {
  const { userIsAdmin } = useStore().user ?? {};
  const { reportType, state } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const { intro, body } = dashboardVerbiage;
  const fullStateName = StateNames[state as keyof typeof StateNames];

  // TO-DO: update accordingly - if a user is an admin or a read-only type, use the selected state, otherwise use their assigned state
  const activeState = state;

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

  const openAddEditReportModal = () => {
    // TO-DO: setSelectedReport with formData

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
          {fullStateName} {intro.header}
        </Heading>
        <InstructionsAccordion
          verbiage={
            userIsAdmin
              ? accordion.adminDashboard
              : accordion.stateUserDashboard
          }
          defaultIndex={0} // sets the accordion to open by default
        />
        {parseCustomHtml(intro.body)}
      </Box>
      <Flex sx={sx.bodyBox} gap="2rem" flexDirection="column">
        {!isLoading && <DashboardTable reports={reports} />}
        {!reports?.length && <Text variant="tableEmpty">{body.empty}</Text>}
        <Flex justifyContent="center">
          <Button onClick={() => openAddEditReportModal()} type="submit">
            {body.link.callToActionText}
          </Button>
        </Flex>
      </Flex>
      <AddEditReportModal
        activeState={activeState!}
        reportType={reportType!}
        modalDisclosure={{
          isOpen: addEditReportModalIsOpen,
          onClose: addEditReportModalOnCloseHandler,
        }}
        reportHandler={reloadReports}
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
};
