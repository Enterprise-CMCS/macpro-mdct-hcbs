import { VStack } from "@chakra-ui/react";
import {
  headerElement,
  subHeaderElement,
  paragraphElement,
  accordionElement,
  buttonLinkElement,
  nestedHeadingElement,
} from "./Elements";
import { assertExhaustive, ElementType, PageElement } from "../../types/report";
import {
  DateField,
  DropdownField,
  MeasureDetailsElement,
  MeasureFooterElement,
  MeasureTableElement,
  MeasureResultsNavigationTableElement,
  MeasureResultsNavigationTableElementLTSS5,
  RadioField,
  ReportingRadioField,
  StatusTableElement,
  TextAreaField,
  TextField,
} from "components";
import { useStore } from "utils";

interface Props {
  elements: PageElement[];
}

export const Page = ({ elements }: Props) => {
  const { userIsEndUser } = useStore().user || {};
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
      case ElementType.MeasureResultsNavigationTableLTSS5:
        return MeasureResultsNavigationTableElementLTSS5;
      case ElementType.StatusTable:
        return StatusTableElement;
      case ElementType.MeasureDetails:
        return MeasureDetailsElement;
      case ElementType.MeasureFooter:
        return MeasureFooterElement;
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
        disabled={!userIsEndUser}
      />
    );
  });
  return (
    <VStack alignItems="flex-start" gap="1rem">
      {composedElements}
    </VStack>
  );
};

const buildFormKey = (index: number) => {
  return `elements.${index}`;
};
