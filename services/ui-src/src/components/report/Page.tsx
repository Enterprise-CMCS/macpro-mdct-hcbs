import { VStack } from "@chakra-ui/react";
import {
  headerElement,
  subHeaderElement,
  paragraphElement,
  textboxElement,
  dateElement,
  accordionElement,
  radioElement,
  buttonLinkElement,
} from "./Elements";
import { MeasureTableElement } from "./MeasureTable";
import { assertExhaustive, ElementType, PageElement } from "../../types/report";

interface Props {
  elements: PageElement[];
}

export const Page = ({ elements }: Props) => {
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
        return textboxElement;
      case ElementType.Date:
        return dateElement;
      case ElementType.Accordion:
        return accordionElement;
      case ElementType.Radio:
        return radioElement;
      case ElementType.ButtonLink:
        return buttonLinkElement;
      case ElementType.MeasureTable:
        return MeasureTableElement;
      default:
        assertExhaustive(elementType);
        return (_element: any, _key: number) => <></>;
    }
  };

  const composedElements = elements.map((element, index) => {
    const ComposedElement = renderElement(element);
    return <ComposedElement key={index} element={element} />;
  });
  return <VStack alignItems="flex-start">{composedElements}</VStack>;
};
