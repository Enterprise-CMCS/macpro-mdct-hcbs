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
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useStore } from "utils";
import {
  HeaderTemplate,
  SubHeaderTemplate,
  TextboxTemplate,
  DateTemplate,
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

export const textboxElement = (props: PageElementProps) => {
  const textbox = props.element as TextboxTemplate;

  // get form context and register field
  const form = useFormContext();
  const inputName = "answers.1.2"; // TODO: id based
  useEffect(() => {
    form.register(inputName);
  }, []);
  const [input, setInput] = useState(textbox.answer || "");

  const onBlurHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(inputName, e.target.value);
  };

  return (
    <FormControl>
      <FormLabel fontWeight="bold">{textbox.label}</FormLabel>
      {textbox.helperText !== undefined && (
        <FormHelperText>{textbox.helperText}</FormHelperText>
      )}
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onBlur={async (e) => await onBlurHandler(e)}
        size="sm"
      ></Input>
    </FormControl>
  );
};

export const dateElement = (props: PageElementProps) => {
  const dateElement = props.element as DateTemplate;
  return (
    <FormControl>
      <FormLabel fontWeight="bold">{dateElement.label}</FormLabel>
      <FormHelperText>{dateElement.helperText}</FormHelperText>
      <FormHelperText>MM/DD/YY</FormHelperText>
      <Input size="sm" width="22"></Input>
    </FormControl>
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
