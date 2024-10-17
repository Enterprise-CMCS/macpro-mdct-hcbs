import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { States } from "../../../constants";
import { ReportMetadataShape } from "types";

import {
  PageTemplate,
  InstructionsAccordion,
  DashboardTable,
} from "components";
import {
  Box,
  Button,
  Image,
  Heading,
  Link,
  Text,
  Flex,
} from "@chakra-ui/react";
import { parseCustomHtml, useStore } from "utils";

import dashboardVerbiage from "verbiage/pages/dashboard";
import accordion from "verbiage/pages/accordion";

import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";

export const DashboardPage = () => {
  const {
    state: userState,
    userIsReadOnly,
    userIsAdmin,
  } = useStore().user ?? {};
  const navigate = useNavigate();

  const [reportsToDisplay] = useState<ReportMetadataShape[] | undefined>(
    undefined
  );

  const { intro, body } = dashboardVerbiage;

  // if an admin or a read-only user has selected a state, retrieve it from local storage
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;

  // if a user is an admin or a read-only type, use the selected state, otherwise use their assigned state
  const activeState =
    userIsAdmin || userIsReadOnly ? adminSelectedState : userState;

  const fullStateName = States[activeState as keyof typeof States];

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
      <Box sx={sx.bodyBox}>
        <DashboardTable reportsByState={reportsToDisplay} body={body} />
        {!reportsToDisplay?.length && (
          <Text sx={sx.emptyTableContainer}>{body.empty}</Text>
        )}
        <Flex justifyContent="center" marginTop="2rem">
          <Button onClick={() => navigate(body.link.route)} type="submit">
            {body.link.callToActionText}
          </Button>
        </Flex>
      </Box>
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
  emptyTableContainer: {
    maxWidth: "75%",
    margin: "0 auto",
    textAlign: "center",
  },
};
