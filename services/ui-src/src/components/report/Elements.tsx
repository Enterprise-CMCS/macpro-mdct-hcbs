import { Link, useNavigate, useParams } from "react-router-dom";
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
import { measurePrevPage, parseHtml, useStore } from "utils";
import successIcon from "assets/icons/status/icon_status_check.svg";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { currentPageSelector } from "utils/state/selectors";
import whitePDFPrimary from "assets/icons/pdf/icon_pdf_white.svg";

export type PageElementProps<T extends PageElement = PageElement> = T extends {
  answer?: any;
}
  ? {
      element: T;
      updateElement: (updatedElement: Partial<T>) => void;
      disabled?: boolean;
    }
  : {
      element: T;
    };

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
              marginRight="spacer2"
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
      color="palette.gray_dark"
      marginBottom="-spacer3"
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
        <Text fontSize="heading_md" fontWeight="heading_md">
          {element.title}
        </Text>
      )}
      <Text fontSize="body_md" fontWeight={element.weight}>
        {element.text}
      </Text>
    </Stack>
  );
};

export const AccordionElement = ({
  element: accordion,
}: PageElementProps<AccordionTemplate>) => {
  return (
    <Accordion allowToggle={true} defaultIndex={[-1]}>
      <AccordionItem label={accordion.label}>
        {parseHtml(accordion.value)}
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
  const link = `/report/${reportType}/${state}/${reportId}/${page}`;
  const nav = () => navigate(link);

  //swapping between props based on style
  const getPropObj = (style: string) => {
    switch (style) {
      case "pdf": {
        return {
          prop: {
            as: Link,
            target: "_blank",
            variant: "primary",
            to: link,
          },
          style: {
            src: whitePDFPrimary,
            alt: "pdf icon",
          },
        };
      }
      default: {
        return {
          prop: {
            variant: "return",
            onClick: () => nav(),
          },
          style: {
            src: arrowLeftIcon,
            alt: "Arrow left",
          },
        };
      }
    }
  };

  const propObj = getPropObj(button.style ?? "");

  return (
    <Button {...propObj.prop}>
      <Image {...propObj.style} className="icon" />
      {setLabel}
    </Button>
  );
};
