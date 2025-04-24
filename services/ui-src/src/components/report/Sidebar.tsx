import { Box, Button, Heading, Flex, Image } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useBreakpoint, useStore } from "utils";
import arrowDownIcon from "assets/icons/arrows/icon_arrow_down_gray.svg";
import arrowUpIcon from "assets/icons/arrows/icon_arrow_up_gray.svg";
import { ReactNode, useEffect, useState } from "react";

const navItem = (title: string, index: number) => {
  if (index <= 0) return title;
  return (
    <Box paddingLeft="1rem" key={`${title}.${index}`}>
      {navItem(title, index - 1)}
    </Box>
  );
};

export const Sidebar = () => {
  const { report, pageMap, currentPageId, setSidebar, sidebarOpen } =
    useStore();
  const { reportType, state, reportId } = useParams();
  const [toggleList, setToggleList] = useState<{ [key: string]: boolean }>({});

  if (!report || !pageMap) {
    return null;
  }

  const setToggle = (sectionId: string) => {
    const list = toggleList;
    list[sectionId] = !toggleList[sectionId];
    setToggleList({ ...list });
  };

  const navigate = useNavigate();

  const onNavSelect = (sectionId: string) => {
    navigate(`/report/${reportType}/${state}/${reportId}/${sectionId}`);
  };

  const navSection = (section: number, index: number = 0): ReactNode => {
    const page = report.pages[section];
    const childSections = page.childPageIds?.map((child) => pageMap.get(child));

    return (
      <Box key={page.id}>
        <Button
          variant={"sidebar"}
          className={page.id === currentPageId ? "selected" : ""}
          onClick={(e) => {
            e.preventDefault();
            onNavSelect(page.id);
          }}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box width="100%" height="100%">
              {navItem(page.title!, index)}
            </Box>
            {childSections?.length! > 0 && (
              <Box onClick={() => setToggle(page.id)}>
                <Image
                  src={toggleList[page.id] ? arrowUpIcon : arrowDownIcon}
                  alt={
                    toggleList[page.id]
                      ? "Collapse subitems"
                      : "Expand subitems"
                  }
                />
              </Box>
            )}
          </Flex>
        </Button>
        {childSections?.length! > 0 &&
          toggleList[page.id] &&
          childSections!.map((sec) => navSection(sec!, index + 1))}
      </Box>
    );
  };

  const root = pageMap.get("root");
  if (root == undefined) return null;

  return (
    <Box sx={sx.sidebar} className={sidebarOpen ? "open" : "closed"}>
      <Flex sx={sx.sidebarNav}>
        <Flex sx={sx.sidebarList}>
          <Heading variant="sidebar">Quality Measure Set Report</Heading>
          {report.pages[root].childPageIds?.map((child) =>
            navSection(pageMap.get(child)!)
          )}
        </Flex>
        <Button
          aria-label="Open/Close sidebar menu"
          variant="sidebarToggle"
          onClick={() => setSidebar(!sidebarOpen)}
          className={sidebarOpen ? "open" : "closed"}
        >
          <Image
            src={arrowDownIcon}
            alt={sidebarOpen ? "Arrow left" : "Arrow right"}
            className={sidebarOpen ? "left" : "right"}
          />
        </Button>
      </Flex>
    </Box>
  );
};

const sx = {
  sidebar: {
    position: "relative",
    transition: "all 0.3s ease",
    height: "100%",
    zIndex: "dropdown",
    "&.open": {
      marginLeft: "0rem",
    },
    "&.closed": {
      marginLeft: "-20.5rem",
    },
    ".tablet &": {
      position: "absolute",
    },
    ".mobile &": {
      position: "absolute",
    },
  },
  sidebarNav: {
    height: "100%",
    ".tablet &": {
      position: "fixed",
      display: "flex",
    },
    ".mobile &": {
      position: "fixed",
      display: "flex",
    },
  },
  sidebarList: {
    background: "palette.gray_lightest",
    width: "20.5rem",
    flexDir: "column",
  },
};
