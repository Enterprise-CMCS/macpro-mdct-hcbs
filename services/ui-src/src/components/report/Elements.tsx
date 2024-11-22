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
import {
  HeaderTemplate,
  SubHeaderTemplate,
  ParagraphTemplate,
  AccordionTemplate,
  RadioTemplate,
  ButtonLinkTemplate,
  PageElement,
} from "../../types/report";
import { TemplateCardAccordion } from "components/accordions/TemplateCardAccordion";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";
import { useNavigate, useParams } from "react-router-dom";

export interface PageElementProps {
  element: PageElement;
  index?: number;
  formkey: string;
}

export const headerElement = (props: PageElementProps) => {
  return (
    <Heading as="h1" variant="h1">
      {(props.element as HeaderTemplate).text}
    </Heading>
  );
};

export const subHeaderElement = (props: PageElementProps) => {
  return (
    <Heading as="h2" variant="subHeader">
      {(props.element as SubHeaderTemplate).text}
    </Heading>
  );
};

export const paragraphElement = (props: PageElementProps) => {
  const element = props.element as ParagraphTemplate;

  return (
    <Stack>
      {element?.title && (
        <Text fontSize="16px" fontWeight="bold">
          {(props.element as ParagraphTemplate).title}
        </Text>
      )}
      <Text fontSize="16px">{(props.element as ParagraphTemplate).text}</Text>
    </Stack>
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
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();
  const button = props.element as ButtonLinkTemplate;
  const nav = () =>
    navigate(`/report/${reportType}/${state}/${reportId}/${button.to}`);

  return (
    <Button variant="return" onClick={() => nav()}>
      <Image src={arrowLeftIcon} alt="Arrow left" className="icon" />
      {button.label}
    </Button>
  );
};
