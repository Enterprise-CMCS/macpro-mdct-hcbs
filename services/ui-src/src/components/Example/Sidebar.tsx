import { Button, VStack } from "@chakra-ui/react";
import { testJson } from "./json/layer-test";

export const Sidebar = () => {
  const pageMap = new Map();
  for (const parentPage of testJson.pages) {
    pageMap.set(parentPage.id, parentPage);
  }

  return (
    <VStack
      height="100%"
      width="160px"
      background="gray.100"
      position="absolute"
      margin="0"
    >
      Menubar
      <Button variant="link"> Test</Button>
    </VStack>
  );
};
