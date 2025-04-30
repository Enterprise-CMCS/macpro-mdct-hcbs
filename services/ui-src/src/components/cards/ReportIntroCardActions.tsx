import { Button, Flex, Image, Link } from "@chakra-ui/react";
import nextIcon from "assets/icons/arrows/icon_arrow_next_white.svg";
import { useNavigate } from "react-router-dom";
import { ReportType } from "types";
import { useStore } from "utils";

/**
 * This component is contained within each card on the state user home page.
 * It has a link to that report type's dashboard.
 */
export const ReportIntroCardActions = ({ reportType }: Props) => {
  const navigate = useNavigate();
  const state = useStore().user?.state;
  const dashboardRoute = `/report/${reportType}/${state}`;

  return (
    <Flex sx={sx.actionsFlex}>
      <Button
        as={Link}
        variant={"primary"}
        href={`/report/${reportType}/${state}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(dashboardRoute);
        }}
        rightIcon={<Image src={nextIcon} alt="Link Icon" height="1rem" />}
        sx={sx.link}
      >
        Enter {reportType} Report online
      </Button>
    </Flex>
  );
};

interface Props {
  reportType: ReportType;
}

const sx = {
  actionsFlex: {
    flexFlow: "no-wrap",
    gridGap: "1rem",
    justifyContent: "space-between",
    margin: "1rem 0 0 1rem",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  link: {
    textDecoration: "none",
    "&:visited, &:visited:hover": {
      color: "white",
      textDecoration: "none",
    },
    "&:hover": {
      color: "white",
      textDecoration: "none",
      backgroundColor: "palette.primary_darker",
    },
  },
};
