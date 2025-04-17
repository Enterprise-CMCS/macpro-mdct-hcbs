import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Heading,
  Stack,
  Image,
  Text,
  Accordion,
  Divider,
} from "@chakra-ui/react";
import {
  HeaderTemplate,
  SubHeaderTemplate,
  ParagraphTemplate,
  AccordionTemplate,
  ButtonLinkTemplate,
  PageElement,
  MeasurePageTemplate,
  NestedHeadingTemplate,
} from "types";
import { AccordionItem } from "components";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";
import { parseCustomHtml, useStore } from "utils";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";

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
  const element = props.element as SubHeaderTemplate;
  const hideElement = useElementIsHidden(element.hideCondition);
  if (hideElement) {
    return null;
  }
  return (
    <Stack>
      <Heading as="h2" variant="subHeader">
        {(props.element as SubHeaderTemplate).text}
      </Heading>
      {element?.helperText && (
        <Text variant="helperText">
          {(props.element as SubHeaderTemplate).helperText}
        </Text>
      )}
    </Stack>
  );
};

export const nestedHeadingElement = (props: PageElementProps) => {
  return (
    <Heading as="h3" variant="nestedHeading">
      {(props.element as NestedHeadingTemplate).text}
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
    <Accordion allowToggle={true}>
      <AccordionItem label={accordion.label}>
        {parseCustomHtml(accordion.value)}
      </AccordionItem>
    </Accordion>
  );
};

export const dividerElement = (_props: PageElementProps) => {
  return <Divider></Divider>;
};

export const buttonLinkElement = (props: PageElementProps) => {
  const { reportType, state, reportId, pageId } = useParams();
  const { report } = useStore();

  const navigate = useNavigate();
  const button = props.element as ButtonLinkTemplate;

  const findPrevPage = () => {
    const measure = report?.pages.find(
      (measure) => measure.id === pageId
    ) as MeasurePageTemplate;
    return measure?.required ? "req-measure-result" : "optional-measure-result";
  };

  const page = button.to ?? findPrevPage();

  //auto generate the label for measures that are substitutable
  const setLabel =
    button.label ??
    `Return to ${
      page === "req-measure-result" ? "Required" : "Optional"
    } Measure Dashboard`;
  const nav = () =>
    navigate(`/report/${reportType}/${state}/${reportId}/${page}`);

  return (
    <Button variant="return" onClick={() => nav()}>
      <Image src={arrowLeftIcon} alt="Arrow left" className="icon" />
      {setLabel}
    </Button>
  );
};
