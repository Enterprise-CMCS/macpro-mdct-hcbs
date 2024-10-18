import {
  Button,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Image,
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
import { TemplateCardAccordion } from "components/accordions/TemplateCardAccordion";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";

export interface PageElementProps {
  element: PageElement;
  index: number;
}

export const headerElement = (props: PageElementProps) => {
  return (
    <Heading fontWeight="hairline" textAlign="left" mb={6}>
      {(props.element as HeaderTemplate).text}
    </Heading>
  );
};

export const subHeaderElement = (props: PageElementProps) => {
  return (
    <Heading variant="subHeader">
      {(props.element as SubHeaderTemplate).text}
    </Heading>
  );
};

export const paragraphElement = (props: PageElementProps) => {
  return (
    <Text fontSize="18px" pb={6}>
      {(props.element as SubHeaderTemplate).text}
    </Text>
  );
};

export const accordionElement = (props: PageElementProps) => {
  const accordion = props.element as AccordionTemplate;
  return (
    <TemplateCardAccordion
      verbiage={{ buttonLabel: accordion.label, text: accordion.value }}
    ></TemplateCardAccordion>
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
    <Button variant="return" onClick={() => setCurrentPageId(button.to)}>
      <Image src={arrowLeftIcon} alt="Arrow left" className="icon" />
      {button.label}
    </Button>
  );
};
