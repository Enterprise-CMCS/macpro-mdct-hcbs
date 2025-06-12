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
  NDRFields,
  NDREnhanced,
  NDRBasic,
} from "components";
import { useStore } from "utils";
import { SubmissionParagraph } from "./SubmissionParagraph";

interface Props {
  elements: PageElement[];
}

export const Page = ({ elements }: Props) => {
  const { userIsEndUser } = useStore().user || {};
  const { report } = useStore();

  const buildElement = (element: PageElement, index: number) => {
    /*
     * This `as any` cast is currently needed to support element nesting.
     * None of the PageElement template types include a formkey property...
     * yet any of them _could_ be given a formkey, if they appear as a child
     * of (for example) a radio button. See RadioField.tsx:formatChoices().
     */
    const formkey = (element as any).formkey ?? `elements.${index}`;
    const disabled =
      !userIsEndUser || report?.status === ReportStatus.SUBMITTED;

    switch (element.type) {
      case ElementType.Header:
        return <HeaderElement {...{ formkey, disabled, element }} />;
      case ElementType.SubHeader:
        return <SubHeaderElement {...{ formkey, disabled, element }} />;
      case ElementType.NestedHeading:
        return <NestedHeadingElement {...{ formkey, disabled, element }} />;
      case ElementType.Paragraph:
        return <ParagraphElement {...{ formkey, disabled, element }} />;
      case ElementType.Textbox:
        return <TextField {...{ formkey, disabled, element }} />;
      case ElementType.TextAreaField:
        return <TextAreaField {...{ formkey, disabled, element }} />;
      case ElementType.Date:
        return <DateField {...{ formkey, disabled, element }} />;
      case ElementType.Dropdown:
        return <DropdownField {...{ formkey, disabled, element }} />;
      case ElementType.Accordion:
        return <AccordionElement {...{ formkey, disabled, element }} />;
      case ElementType.Radio:
        return <RadioField {...{ formkey, disabled, element }} />;
      case ElementType.ButtonLink:
        return <ButtonLinkElement {...{ formkey, disabled, element }} />;
      case ElementType.MeasureTable:
        return <MeasureTableElement {...{ formkey, disabled, element }} />;
      case ElementType.MeasureResultsNavigationTable:
        return (
          <MeasureResultsNavigationTableElement
            {...{ formkey, disabled, element }}
          />
        );
      case ElementType.StatusTable:
        return <StatusTableElement />;
      case ElementType.MeasureDetails:
        return <MeasureDetailsElement />;
      case ElementType.MeasureFooter:
        return <MeasureFooterElement {...{ formkey, disabled, element }} />;
      case ElementType.LengthOfStayRate:
        return <Fields {...{ formkey, disabled, element }} />;
      case ElementType.NdrFields:
        return <NDRFields {...{ formkey, disabled, element }} />;
      case ElementType.NdrEnhanced:
        return <NDREnhanced {...{ formkey, disabled, element }} />;
      case ElementType.Ndr:
        return <NDR {...{ formkey, disabled, element }} />;
      case ElementType.NdrBasic:
        return <NDRBasic {...{ formkey, disabled, element }} />;
      case ElementType.StatusAlert:
        return <StatusAlert {...{ formkey, disabled, element }} />;
      case ElementType.Divider:
        return <DividerElement {...{ formkey, disabled, element }} />;
      case ElementType.SubmissionParagraph:
        return <SubmissionParagraph />;
      case ElementType.SubHeaderMeasure:
        return <SubHeaderMeasureElement {...{ formkey, disabled, element }} />;
      default:
        assertExhaustive(element);
        return null;
    }
  };

  const composedElements = elements.map((element, index) => {
    const el = buildElement(element, index);
    return <React.Fragment key={index}>{el}</React.Fragment>;
  });

  return (
    <VStack alignItems="flex-start" gap="2rem" marginBottom="2rem">
      {composedElements}
    </VStack>
  );
};
