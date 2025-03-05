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
  const { report, pageMap, currentPageId } = useStore();
  const { reportType, state, reportId } = useParams();
  const { isDesktop } = useBreakpoint();
  const [isOpen, setIsOpen] = useState<boolean>(isDesktop);
  const [toggleList, setToggleList] = useState<{ [key: string]: boolean }>({});

  //TO FIX: temporary fix, for some reason isDesktop sometimes returns false so it messes with the sidebar on load
  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop])

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
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box
              width="100%"
              height="100%"
              onClick={() => onNavSelect(page.id)}
            >
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
    <Box sx={sx.sidebar} className={isOpen ? "open" : "closed"}>
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
          onClick={() => setIsOpen(!isOpen)}
          className={isOpen ? "open" : "closed"}
        >
          <Image
            src={arrowDownIcon}
            alt={isOpen ? "Arrow left" : "Arrow right"}
            className={isOpen ? "left" : "right"}
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
