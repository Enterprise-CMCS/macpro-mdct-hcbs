import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { WarningIcon } from "@cmsgov/design-system";
import { AnyObject } from "yup/lib/types";

export const headerElement = (element: AnyObject) => {
  return (
    <Heading fontWeight="hairline" textAlign="left">
      {element.text}
    </Heading>
  );
};

export const subHeaderElement = (element: AnyObject) => {
  return <Heading fontSize="18px">{element.text}</Heading>;
};

export const textboxElement = (element: AnyObject) => {
  return (
    <FormControl>
      <FormLabel fontWeight="bold">{element.label}</FormLabel>
      <FormHelperText>{element.helperText}</FormHelperText>
      <Input size="sm"></Input>
    </FormControl>
  );
};

export const dateElement = (element: AnyObject) => {
  return (
    <FormControl>
      <FormLabel fontWeight="bold">{element.label}</FormLabel>
      <FormHelperText>{element.helperText}</FormHelperText>
      <FormHelperText>MM/DD/YY</FormHelperText>
      <Input size="sm" width="22"></Input>
    </FormControl>
  );
};

export const accordianElement = (element: AnyObject) => {
  return (
    <Accordion width="100%" defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {element.label}{" "}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>{element.value}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const buttonElement = (element: AnyObject, func: Function) => {
  return <Button onClick={() => func(element.to)}>{element.text}</Button>;
};

interface Props {
  elements: AnyObject[];
  setPage: Function;
}

export const resultRowButtonElement = (element: AnyObject, func: Function) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Measure Name</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>
            <WarningIcon w={8} h={8} color="red.500" />
          </Td>
          <Td>
            <Stack flex="1">
              <Text>Measure name</Text>
              <Text>CMIT name</Text>
            </Stack>
          </Td>
          <Td>
            <Button variant="link" onClick={() => func(element.to)}>
              Edit measure
            </Button>
          </Td>
          <Td>
            <Button onClick={() => func(element.to)}>Edit</Button>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export const Page = ({ elements, setPage }: Props) => {
  const renderElement = (element: any) => {
    switch (element.type) {
      case "header":
        return headerElement(element);
      case "sub-header":
        return subHeaderElement(element);
      case "textbox":
        return textboxElement(element);
      case "date":
        return dateElement(element);
      case "accordian":
        return accordianElement(element);
      case "resultRowButton":
        return resultRowButtonElement(element, setPage);
      case "button":
        return buttonElement(element, setPage);
    }
    return <></>;
  };

  return (
    <VStack alignItems="flex-start">
      {elements.length > 0 && elements.map((element) => renderElement(element))}
    </VStack>
  );
};
