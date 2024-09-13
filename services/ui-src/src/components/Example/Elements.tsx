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
import { WarningIcon } from "@cmsgov/design-system";
import {
  HeaderTemplate,
  SubHeaderTemplate,
  TextboxTemplate,
  DateTemplate,
  AccordionTemplate,
  ResultRowButtonTemplate,
  ParagraphTemplate,
  RadioTemplate,
  ButtonLinkTemplate,
  PageType,
  ChoiceTemplate,
  NavigationFunction,
} from "./types";

export const headerElement = (element: HeaderTemplate) => {
  return (
    <Heading fontWeight="hairline" textAlign="left">
      {element.text}
    </Heading>
  );
};

export const subHeaderElement = (element: SubHeaderTemplate) => {
  return <Heading fontSize="18px">{element.text}</Heading>;
};

export const paragraphElement = (element: ParagraphTemplate) => {
  return <Text fontSize="18px">{element.text}</Text>;
};

export const textboxElement = (element: TextboxTemplate) => {
  return (
    <FormControl>
      <FormLabel fontWeight="bold">{element.label}</FormLabel>
      {/* TODO does this look weird when helperText undefined? */}
      <FormHelperText>{element.helperText}</FormHelperText>
      <Input size="sm"></Input>
    </FormControl>
  );
};

export const dateElement = (element: DateTemplate) => {
  return (
    <FormControl>
      <FormLabel fontWeight="bold">{element.label}</FormLabel>
      <FormHelperText>{element.helperText}</FormHelperText>
      <FormHelperText>MM/DD/YY</FormHelperText>
      <Input size="sm" width="22"></Input>
    </FormControl>
  );
};

export const accordionElement = (element: AccordionTemplate) => {
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

export const radioElement = (element: RadioTemplate) => {
  return (
    <RadioGroup>
      <FormLabel fontWeight="bold">{element.label}</FormLabel>
      <Stack direction="column">
        {element.value.map((child: ChoiceTemplate) => (
          <Radio value={child.value}>{child.label}</Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export const buttonLinkElement = (
  element: ButtonLinkTemplate,
  clickHandler: NavigationFunction
) => {
  return (
    <Button variant="link" onClick={() => clickHandler(element.to)}>
      {element.label}
    </Button>
  );
};

export const resultRowButtonElement = (
  element: ResultRowButtonTemplate,
  modalOpenHandler: NavigationFunction
) => {
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
            <Button
              variant="link"
              onClick={() => modalOpenHandler(element.modalId, PageType.Modal)}
            >
              Edit measure
            </Button>
          </Td>
          <Td>
            <Button onClick={() => modalOpenHandler(element.to)}>Edit</Button>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
