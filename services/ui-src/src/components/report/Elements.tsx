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
  ParagraphTemplate,
  AccordionTemplate,
  ButtonLinkTemplate,
  PageElement,
  NestedHeadingTemplate,
  HeaderIcon,
  MeasurePageTemplate,
  isMeasurePageTemplate,
} from "types";
import { AccordionItem } from "components";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";
import { measurePrevPage, parseHtml, useStore } from "utils";
import successIcon from "assets/icons/status/icon_status_check.svg";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { currentPageSelector } from "utils/state/selectors";
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
        {element.text}
      </Heading>
      {element?.helperText && (
        <Text variant="helperText">{element.helperText}</Text>
      )}
    </Stack>
  );
};

export const subHeaderMeasureElement = (_props: PageElementProps) => {
  const { report } = useStore();
  const currentPage = useStore(currentPageSelector);
  if (!currentPage) return null;

  let required = false;
  if (isMeasurePageTemplate(currentPage)) {
    required = !!currentPage.required;
  } else {
    //find the parent measure to get the page type
    const measure = report?.pages.find(
      (page) =>
        isMeasurePageTemplate(page) &&
        page.dependentPages &&
        page.dependentPages.find((child) => child.template === currentPage.id)
    ) as MeasurePageTemplate;
    required = !!measure.required;
  }

  return (
    <Heading
      as="h2"
      variant="nestedHeading"
      color="#5a5a5a"
      marginBottom="-1.5rem"
    >
      {required ? "Required" : "Optional"} Measure
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
          {element.title}
        </Text>
      )}
      <Text fontSize="16px" fontWeight={element.weight}>
        {element.text}
      </Text>
    </Stack>
  );
};

export const accordionElement = (props: PageElementProps) => {
  const accordion = props.element as AccordionTemplate;
  return (
    <Accordion allowToggle={true}>
      <AccordionItem label={accordion.label}>
        {parseHtml(accordion.value)}
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
