import { useNavigate, useParams } from "react-router-dom";
import { Button, Heading, Stack, Image, Text } from "@chakra-ui/react";
import {
  HeaderTemplate,
  SubHeaderTemplate,
  ParagraphTemplate,
  AccordionTemplate,
  ButtonLinkTemplate,
  PageElement,
} from "types";
import { TemplateCardAccordion } from "components";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";

export interface PageElementProps {
  element: PageElement;
  index?: number;
  formkey: string;
  disabled?: boolean;
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
