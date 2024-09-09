import { Button, VStack } from "@chakra-ui/react";
import { testJson } from "./json/layer-test";

const menuItem = (text: string) => {
  return <Button>{text}</Button>;
};

export const Sidebar = () => {
  const pageMap = new Map();
  for (const parentPage of testJson.pages) {
    pageMap.set(parentPage.id, parentPage);
  }

  const buildNavList = (children: string[]) => {
    const builtList: any[] = [];
    for (const child of children) {
      const page = pageMap.get(child);
      if (page.children) {
        builtList.push({ id: page.id, child: buildNavList(page.children) });
      } else {
        builtList.push({ id: page.id });
      }
    }
    return builtList;
  };

  const navList = buildNavList(pageMap.get("root").children);
  console.log(navList);

  return (
    <VStack
      height="100%"
      width="160px"
      background="gray.100"
    >
      Menubar
      <Button variant="link"> Test</Button>
    </VStack>
  );
};
