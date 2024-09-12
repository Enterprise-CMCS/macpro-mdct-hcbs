import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { States } from "../../../constants";

import { ReportMetadataShape } from "types";

import {
  PageTemplate,
  InstructionsAccordion,
  DashboardTable,
} from "components";
import { Box, Button, Image, Heading, Link } from "@chakra-ui/react";
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
      <Link as={RouterLink} to="/" sx={sx.returnLink}>
        <Image src={arrowLeftIcon} alt="Arrow left" className="returnIcon" />
        Return home
      </Link>

      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
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
        <Box sx={sx.callToActionContainer}>
          <Button type="submit" variant="outline">
            {body.callToAction}
          </Button>
        </Box>
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
  returnLink: {
    display: "flex",
    width: "8.5rem",
    paddingTop: "0.5rem",
    svg: {
      height: "1.375rem",
      width: "1.375rem",
      marginTop: "-0.125rem",
      marginRight: ".5rem",
    },
    textDecoration: "none",
    _hover: {
      textDecoration: "underline",
    },
    ".returnIcon": {
      width: "1.25rem",
      height: "1.25rem",
      marginTop: "0.25rem",
      marginRight: "0.5rem",
    },
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
    ".tablet &, .mobile &": {
      fontSize: "xl",
      lineHeight: "1.75rem",
      fontWeight: "bold",
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
  callToActionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "2rem",
  },
};
