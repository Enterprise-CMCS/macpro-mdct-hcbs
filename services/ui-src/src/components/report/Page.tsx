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
import { DateField } from "components/report/fields/DateField";
import { DateRange } from "components/report/fields/DateRange";
import { DropdownField } from "components/report/fields/DropdownField";
import { RadioField } from "components/report/fields/RadioField";
import { TextAreaField } from "components/report/fields/TextAreaField";
import { TextField } from "components/report/fields/TextField";
import { CheckboxField } from "components/report/fields/CheckboxField";
import { ListInput } from "components/report/fields/ListInput";
import { LengthOfStay } from "components/report/rates/LengthOfStay";
import { ReadmissionRate } from "components/report/rates/ReadmissionRate";
import { MultiCategoryNdr } from "components/report/rates/MultiCategoryNdr";
import { MultiRateNdr } from "components/report/rates/MultiRateNdr";
import { NDR } from "components/report/rates/NDR";
import { PerformanceNdr } from "components/report/rates/PerformanceNdr";
import { EligibilityTableElement } from "./EligibilityTable";
import { MeasureTableElement } from "./MeasureTable";
import { MeasureResultsNavigationTableElement } from "./MeasureResultsNavigationTable";
import { StatusTableElement } from "./StatusTable";
import { MeasureDetailsElement } from "./MeasureDetails";
import { MeasureFooterElement } from "./MeasureFooter";
import { StatusAlert } from "./StatusAlert";
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
      case ElementType.DateRange:
        return <DateRange {...{ updateElement, disabled, element }} />;
      case ElementType.Dropdown:
        return <DropdownField {...{ updateElement, disabled, element }} />;
      case ElementType.Accordion:
        return <AccordionElement {...{ disabled, element }} />;
      case ElementType.Radio:
        return <RadioField {...{ updateElement, disabled, element }} />;
      case ElementType.Checkbox:
        return <CheckboxField {...{ updateElement, disabled, element }} />;
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
        return <LengthOfStay {...{ updateElement, disabled, element }} />;
      case ElementType.ReadmissionRate:
        return <ReadmissionRate {...{ updateElement, disabled, element }} />;
      case ElementType.MultiCategoryNdr:
        return <MultiCategoryNdr {...{ updateElement, disabled, element }} />;
      case ElementType.MultiRateNdr:
        return <MultiRateNdr {...{ updateElement, disabled, element }} />;
      case ElementType.Ndr:
        return <NDR {...{ updateElement, disabled, element }} />;
      case ElementType.PerformanceNdr:
        return <PerformanceNdr {...{ updateElement, disabled, element }} />;
      case ElementType.StatusAlert:
        return <StatusAlert {...{ element }} />;
      case ElementType.Divider:
        return <DividerElement {...{ element }} />;
      case ElementType.SubmissionParagraph:
        return <SubmissionParagraph />;
      case ElementType.SubHeaderMeasure:
        return <SubHeaderMeasureElement {...{ element }} />;
      case ElementType.ListInput:
        return <ListInput {...{ updateElement, disabled, element }} />;
      case ElementType.EligibilityTable:
        return <EligibilityTableElement {...{ updateElement, element }} />;
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
    <VStack alignItems="flex-start" gap="spacer4">
      {composedElements}
    </VStack>
  );
};
