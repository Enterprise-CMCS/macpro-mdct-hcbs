import { VStack } from "@chakra-ui/react";
import {
  HeaderElement,
  SubHeaderElement,
  ParagraphElement,
  AccordionElement,
  ButtonLinkElement,
  NestedHeadingElement,
  DividerElement,
  SubHeaderMeasureElement,
} from "./Elements";
import {
  assertExhaustive,
  ElementType,
  PageElement,
  ReportStatus,
} from "../../types/report";
import {
  DateField,
  DropdownField,
  MeasureDetailsElement,
  MeasureFooterElement,
  MeasureTableElement,
  PerformanceRateElement,
  MeasureResultsNavigationTableElement,
  RadioField,
  StatusTableElement,
  TextAreaField,
  TextField,
  StatusAlert,
} from "components";
import { useStore } from "utils";
import { SubmissionParagraph } from "./SubmissionParagraph";

interface Props {
  elements: PageElement[];
}

export const Page = ({ elements }: Props) => {
  const { userIsEndUser } = useStore().user || {};
  const { report } = useStore();

  const composedElements = elements.map((element, index) => {
    const props = {
      formkey: `elements.${index}`,
      key: index,
      disabled: !userIsEndUser || report?.status === ReportStatus.SUBMITTED,
    };
    switch (element.type) {
      case ElementType.Header:
        return <HeaderElement {...{ ...props, element }} />;
      case ElementType.SubHeader:
        return <SubHeaderElement {...{ ...props, element }} />;
      case ElementType.NestedHeading:
        return <NestedHeadingElement {...{ ...props, element }} />;
      case ElementType.Paragraph:
        return <ParagraphElement {...{ ...props, element }} />;
      case ElementType.Textbox:
        return <TextField {...{ ...props, element }} />;
      case ElementType.TextAreaField:
        return <TextAreaField {...{ ...props, element }} />;
      case ElementType.Date:
        return <DateField {...{ ...props, element }} />;
      case ElementType.Dropdown:
        return <DropdownField {...{ ...props, element }} />;
      case ElementType.Accordion:
        return <AccordionElement {...{ ...props, element }} />;
      case ElementType.Radio:
        return <RadioField {...{ ...props, element }} />;
      case ElementType.ButtonLink:
        return <ButtonLinkElement {...{ ...props, element }} />;
      case ElementType.MeasureTable:
        return <MeasureTableElement {...{ ...props, element }} />;
      case ElementType.MeasureResultsNavigationTable:
        return (
          <MeasureResultsNavigationTableElement {...{ ...props, element }} />
        );
      case ElementType.StatusTable:
        return <StatusTableElement {...{ ...props, element }} />;
      case ElementType.MeasureDetails:
        return <MeasureDetailsElement {...{ ...props, element }} />;
      case ElementType.MeasureFooter:
        return <MeasureFooterElement {...{ ...props, element }} />;
      case ElementType.PerformanceRate:
        return <PerformanceRateElement {...{ ...props, element }} />;
      case ElementType.StatusAlert:
        return <StatusAlert {...{ ...props, element }} />;
      case ElementType.Divider:
        return <DividerElement {...{ ...props, element }} />;
      case ElementType.SubmissionParagraph:
        return <SubmissionParagraph {...{ ...props, element }} />;
      case ElementType.SubHeaderMeasure:
        return <SubHeaderMeasureElement {...{ ...props, element }} />;
      default:
        assertExhaustive(element);
        return null;
    }
  });

  return (
    <VStack alignItems="flex-start" gap="2rem" marginBottom="2rem">
      {composedElements}
    </VStack>
  );
};
