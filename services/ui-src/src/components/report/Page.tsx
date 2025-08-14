import React from "react";
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
  MeasureResultsNavigationTableElement,
  RadioField,
  StatusTableElement,
  TextAreaField,
  TextField,
  StatusAlert,
  Fields,
  NDR,
  NDRBasic,
  NDRFields,
  NDREnhanced,
} from "components";
import { useStore } from "utils";
import { SubmissionParagraph } from "./SubmissionParagraph";

interface Props {
  id: string;
  elements: PageElement[];
  setElements: (elements: PageElement[]) => void;
}

export const Page = ({ id, setElements, elements }: Props) => {
  const { userIsEndUser } = useStore().user || {};
  const { report } = useStore();

  const buildElement = (element: PageElement, index: number) => {
    const disabled =
      !userIsEndUser || report?.status === ReportStatus.SUBMITTED;
    const updateElement = (updatedElement: Partial<typeof element>) => {
      setElements([
        ...elements.slice(0, index),
        { ...element, ...updatedElement } as typeof element,
        ...elements.slice(index + 1),
      ]);
    };

    switch (element.type) {
      case ElementType.Header:
        return <HeaderElement {...{ element }} />;
      case ElementType.SubHeader:
        return <SubHeaderElement {...{ element }} />;
      case ElementType.NestedHeading:
        return <NestedHeadingElement {...{ element }} />;
      case ElementType.Paragraph:
        return <ParagraphElement {...{ element }} />;
      case ElementType.Textbox:
        return <TextField {...{ updateElement, disabled, element }} />;
      case ElementType.TextAreaField:
        return <TextAreaField {...{ updateElement, disabled, element }} />;
      case ElementType.NumberField:
        return <TextField {...{ updateElement, disabled, element }} />;
      case ElementType.Date:
        return <DateField {...{ updateElement, disabled, element }} />;
      case ElementType.Dropdown:
        return <DropdownField {...{ updateElement, disabled, element }} />;
      case ElementType.Accordion:
        return <AccordionElement {...{ disabled, element }} />;
      case ElementType.Radio:
        return <RadioField {...{ updateElement, disabled, element }} />;
      case ElementType.ButtonLink:
        return <ButtonLinkElement {...{ disabled, element }} />;
      case ElementType.MeasureTable:
        return <MeasureTableElement {...{ disabled, element }} />;
      case ElementType.MeasureResultsNavigationTable:
        return <MeasureResultsNavigationTableElement {...{ element }} />;
      case ElementType.StatusTable:
        return <StatusTableElement />;
      case ElementType.MeasureDetails:
        return <MeasureDetailsElement />;
      case ElementType.MeasureFooter:
        return <MeasureFooterElement {...{ disabled, element }} />;
      case ElementType.LengthOfStayRate:
        return <Fields {...{ updateElement, disabled, element }} />;
      case ElementType.NdrFields:
        return <NDRFields {...{ updateElement, disabled, element }} />;
      case ElementType.NdrEnhanced:
        return <NDREnhanced {...{ updateElement, disabled, element }} />;
      case ElementType.Ndr:
        return <NDR {...{ updateElement, disabled, element }} />;
      case ElementType.NdrBasic:
        return <NDRBasic {...{ updateElement, disabled, element }} />;
      case ElementType.StatusAlert:
        return <StatusAlert {...{ element }} />;
      case ElementType.Divider:
        return <DividerElement {...{ element }} />;
      case ElementType.SubmissionParagraph:
        return <SubmissionParagraph />;
      case ElementType.SubHeaderMeasure:
        return <SubHeaderMeasureElement {...{ element }} />;
      default:
        assertExhaustive(element);
        return null;
    }
  };

  const composedElements = elements.map((element, index) => {
    const el = buildElement(element, index);
    return <React.Fragment key={`${id}-${index}`}>{el}</React.Fragment>;
  });

  return (
    <VStack alignItems="flex-start" gap="2rem" marginBottom="2rem">
      {composedElements}
    </VStack>
  );
};
