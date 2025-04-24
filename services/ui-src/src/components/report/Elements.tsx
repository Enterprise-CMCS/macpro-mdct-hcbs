import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Heading,
  Stack,
  Image,
  Text,
  Accordion,
  Divider,
  Flex,
} from "@chakra-ui/react";
import {
  HeaderTemplate,
  SubHeaderTemplate,
  SubHeaderMeasureTemplate,
  ParagraphTemplate,
  AccordionTemplate,
  ButtonLinkTemplate,
  PageElement,
  NestedHeadingTemplate,
  HeaderIcon,
  MeasurePageTemplate,
  DependentPageInfo,
} from "types";
import { AccordionItem } from "components";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";
import { measurePrevPage, parseCustomHtml, useStore } from "utils";
import successIcon from "assets/icons/status/icon_status_check.svg";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
export interface PageElementProps {
  element: PageElement;
  index?: number;
  formkey: string;
  disabled?: boolean;
}

export const headerElement = (props: PageElementProps) => {
  const element = props.element as HeaderTemplate;
  const buildIcon = (icon: HeaderIcon | undefined) => {
    switch (icon) {
      case HeaderIcon.Check:
        return {
          src: successIcon,
          alt: "complete icon",
          text: "Complete",
        };
      default:
        return undefined;
    }
  };
  const icon = buildIcon(element.icon);

  return (
    <Heading as="h1" variant="h1">
      <Flex direction="row" width="100%">
        {icon && (
          <span>
            <Image
              src={icon.src}
              alt={icon.alt}
              marginRight="1rem"
              boxSize="xl"
              height="27px"
              display="inline-block"
            />
          </span>
        )}
        {element.text}
      </Flex>
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

export const subHeaderMeasureElement = (_props: PageElementProps) => {
  const { report, currentPageId } = useStore();

  const templates = [
    report?.measureLookup.defaultMeasures,
    report?.measureLookup.optionGroups,
  ].flat();

  const parent = templates.find(
    (template) =>
      template?.measureTemplate === currentPageId ||
      template?.dependentPages.find(
        (page: any) => page.template === currentPageId
      )
  );

  const measure = report?.pages.find(
    (measure) => measure.id === parent?.measureTemplate
  ) as MeasurePageTemplate;

  return (
    <Heading as="h2" variant="nestedHeading">
      {measure.required ? "Required" : "Optional"} Measure
    </Heading>
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
      <Text fontSize="16px" fontWeight={element.weight}>
        {(props.element as ParagraphTemplate).text}
      </Text>
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
  const page = button.to ?? measurePrevPage(report!, pageId!);

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
