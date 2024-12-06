import { VStack } from "@chakra-ui/react";
import {
  headerElement,
  subHeaderElement,
  paragraphElement,
  accordionElement,
  buttonLinkElement,
} from "./Elements";
import { assertExhaustive, ElementType, PageElement } from "../../types/report";
import { MeasureTableElement } from "./MeasureTable";
import { QualityMeasureTableElement } from "./QualityMeasureTable";
import { StatusTableElement } from "./StatusTable";
import { TextField, DateField, RadioField } from "components";
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
      case ElementType.Paragraph:
        return paragraphElement;
      case ElementType.Textbox:
        return TextField;
      case ElementType.Date:
        return DateField;
      case ElementType.Accordion:
        return accordionElement;
      case ElementType.Radio:
        return RadioField;
      case ElementType.ButtonLink:
        return buttonLinkElement;
      case ElementType.MeasureTable:
        return MeasureTableElement;
      case ElementType.QualityMeasureTable:
        return QualityMeasureTableElement;
      case ElementType.StatusTable:
        return StatusTableElement;
      default:
        assertExhaustive(elementType);
        return (_element: any, _key: number) => <></>;
    }
  };

  const composedElements = elements.map((element, index) => {
    const ComposedElement = renderElement(element);
    return (
      <ComposedElement
        formkey={buildFormKey(index)}
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
