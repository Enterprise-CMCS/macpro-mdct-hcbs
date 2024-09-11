import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { AnyObject } from "yup/lib/types";
import { WarningIcon } from "@cmsgov/design-system";

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

export const paragraphElement = (element: AnyObject) => {
  return <Text fontSize="18px">{element.text}</Text>;
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

export const radioElement = (element: AnyObject) => {
  console.log(element);
  return (
    <RadioGroup>
      <FormLabel fontWeight="bold">{element.label}</FormLabel>
      <Stack direction="column">
        {element.value.map((child: AnyObject) => (
          <Radio value={child.value}>{child.label}</Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export const buttonElement = (element: AnyObject, func: Function) => {
  return <Button onClick={() => func(element.to)}>{element.label}</Button>;
};

export const buttonLinkElement = (element: AnyObject, func: Function) => {
  return (
    <Button variant="link" onClick={() => func(element.to)}>
      {element.label}
    </Button>
  );
};

export const resultRowButtonElement = (element: AnyObject, func: Function) => {
  console.log(element);
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
            <Button variant="link" onClick={() => func(element.modal, "modal")}>
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
