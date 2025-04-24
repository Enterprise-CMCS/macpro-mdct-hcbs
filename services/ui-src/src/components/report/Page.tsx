import { VStack } from "@chakra-ui/react";
import {
  headerElement,
  subHeaderElement,
  paragraphElement,
  accordionElement,
  buttonLinkElement,
  nestedHeadingElement,
  dividerElement,
  subHeaderMeasureElement,
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
  ReportingRadioField,
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

  const renderElement = (element: PageElement) => {
    const elementType = element.type;
    switch (elementType) {
      case ElementType.Header:
        return headerElement;
      case ElementType.SubHeader:
        return subHeaderElement;
      case ElementType.NestedHeading:
        return nestedHeadingElement;
      case ElementType.Paragraph:
        return paragraphElement;
      case ElementType.Textbox:
        return TextField;
      case ElementType.TextAreaField:
        return TextAreaField;
      case ElementType.Date:
        return DateField;
      case ElementType.Dropdown:
        return DropdownField;
      case ElementType.Accordion:
        return accordionElement;
      case ElementType.Radio:
        return RadioField;
      case ElementType.ReportingRadio:
        return ReportingRadioField;
      case ElementType.ButtonLink:
        return buttonLinkElement;
      case ElementType.MeasureTable:
        return MeasureTableElement;
      case ElementType.MeasureResultsNavigationTable:
        return MeasureResultsNavigationTableElement;
      case ElementType.StatusTable:
        return StatusTableElement;
      case ElementType.MeasureDetails:
        return MeasureDetailsElement;
      case ElementType.MeasureFooter:
        return MeasureFooterElement;
      case ElementType.PerformanceRate:
        return PerformanceRateElement;
      case ElementType.StatusAlert:
        return StatusAlert;
      case ElementType.Divider:
        return dividerElement;
      case ElementType.SubmissionParagraph:
        return SubmissionParagraph;
      case ElementType.SubHeaderMeasure:
        return subHeaderMeasureElement;
      default:
        assertExhaustive(elementType);
        return (_element: any, _key: number) => <></>;
    }
  };

  const composedElements = elements.map((element, index) => {
    const ComposedElement = renderElement(element);
    const formKey = (element as any).formKey ?? buildFormKey(index);
    return (
      <ComposedElement
        formkey={formKey}
        key={index}
        element={element}
        disabled={!userIsEndUser || report?.status === ReportStatus.SUBMITTED}
      />
    );
  });
  return (
    <VStack alignItems="flex-start" gap="2rem" marginBottom="2rem">
      {composedElements}
    </VStack>
  );
};

const buildFormKey = (index: number) => {
  return `elements.${index}`;
};
