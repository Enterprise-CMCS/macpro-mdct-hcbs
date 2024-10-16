import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useStore } from "utils";
import {
  HeaderTemplate,
  SubHeaderTemplate,
  AccordionTemplate,
  RadioTemplate,
  ButtonLinkTemplate,
  PageElement,
} from "../../types/report";

export interface PageElementProps {
  element: PageElement;
  index: number;
}

export const headerElement = (props: PageElementProps) => {
  return (
    <Heading fontWeight="hairline" textAlign="left">
      {(props.element as HeaderTemplate).text}
    </Heading>
  );
};

export const subHeaderElement = (props: PageElementProps) => {
  return (
    <Heading fontSize="18px">
      {(props.element as SubHeaderTemplate).text}
    </Heading>
  );
};

export const paragraphElement = (props: PageElementProps) => {
  return (
    <Text fontSize="18px">{(props.element as SubHeaderTemplate).text}</Text>
  );
};

export const accordionElement = (props: PageElementProps) => {
  const accordion = props.element as AccordionTemplate;

  return (
    <Accordion width="100%" defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {accordion.label}{" "}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>{accordion.value}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const radioElement = (props: PageElementProps) => {
  const radio = props.element as RadioTemplate;

  return (
    <RadioGroup>
      <FormLabel fontWeight="bold">{radio.label}</FormLabel>
      <Stack direction="column">
        {radio.value.map((child, index) => (
          <Radio key={index} value={child.value}>
            {child.label}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export const buttonLinkElement = (props: PageElementProps) => {
  const button = props.element as ButtonLinkTemplate;
  const { setCurrentPageId } = useStore();
  return (
    <Button variant="link" onClick={() => setCurrentPageId(button.to)}>
      {button.label}
    </Button>
  );
};
