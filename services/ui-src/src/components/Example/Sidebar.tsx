import { Box, Button, Heading, Stack, VStack } from "@chakra-ui/react";
import { qmReportTemplate } from "./templates/qm";
import { AnyObject } from "yup/lib/types";

export const navItem = (page: AnyObject, func: Function) => {
  return (
    <Button variant="sidebar" onClick={() => func(page.id)}>
      {page.title}
    </Button>
  );
};

interface Props {
  setPage: Function;
}

export const Sidebar = ({ setPage }: Props) => {
  const pageMap = new Map();
  for (const parentPage of qmReportTemplate.pages) {
    pageMap.set(parentPage.id, parentPage);
  }

  const buildNavList = (childPageIds: string[]) => {
    const builtList: any[] = [];

    for (const child of childPageIds) {
      const page = pageMap.get(child);
      if (page.childPageIds) {
        builtList.push(
          <Stack width="100%" spacing="0">
            {navItem(page, setPage)}
            <Box>{buildNavList(page.childPageIds)}</Box>
          </Stack>
        );
      } else {
        builtList.push(navItem(page, setPage));
      }
    }
    return builtList;
  };
  const navList = buildNavList(pageMap.get("root").childPageIds);
  return (
    <VStack height="100%" width="320px" background="gray.100" spacing="0">
      <Heading fontSize="21" fontWeight="700" padding="32px">
        Quality Measures Report
      </Heading>
      {navList}
    </VStack>
  );
};
