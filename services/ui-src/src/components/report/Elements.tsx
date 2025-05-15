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
  NestedHeadingTemplate,
  HeaderIcon,
  MeasurePageTemplate,
  isMeasurePageTemplate,
  PageElement,
} from "types";
import { AccordionItem } from "components";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";
import { measurePrevPage, parseCustomHtml, useStore } from "utils";
import successIcon from "assets/icons/status/icon_status_check.svg";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { currentPageSelector } from "utils/state/selectors";

export interface PageElementProps<T extends PageElement = PageElement> {
  element: T;
  formkey: string;
  disabled?: boolean;
}

export const HeaderElement = ({
  element,
}: PageElementProps<HeaderTemplate>) => {
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

export const SubHeaderElement = ({
  element,
}: PageElementProps<SubHeaderTemplate>) => {
  const hideElement = useElementIsHidden(element.hideCondition);
  if (hideElement) {
    return null;
  }
  return (
    <Stack>
      <Heading as="h2" variant="subHeader">
        {element.text}
      </Heading>
      {element.helperText && (
        <Text variant="helperText">{element.helperText}</Text>
      )}
    </Stack>
  );
};

export const SubHeaderMeasureElement = (_props: PageElementProps) => {
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

export const NestedHeadingElement = ({
  element,
}: PageElementProps<NestedHeadingTemplate>) => {
  return (
    <Heading as="h3" variant="nestedHeading">
      {element.text}
    </Heading>
  );
};

export const ParagraphElement = ({
  element,
}: PageElementProps<ParagraphTemplate>) => {
  return (
    <Stack>
      {element.title && (
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

export const AccordionElement = ({
  element: accordion,
}: PageElementProps<AccordionTemplate>) => {
  return (
    <Accordion allowToggle={true}>
      <AccordionItem label={accordion.label}>
        {parseCustomHtml(accordion.value)}
      </AccordionItem>
    </Accordion>
  );
};

export const DividerElement = (_props: PageElementProps) => {
  return <Divider></Divider>;
};

export const ButtonLinkElement = ({
  element: button,
}: PageElementProps<ButtonLinkTemplate>) => {
  const { reportType, state, reportId, pageId } = useParams();
  const { report } = useStore();

  const navigate = useNavigate();
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
