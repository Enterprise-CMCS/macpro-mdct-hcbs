import { VStack } from "@chakra-ui/react";
import React from "react";
import {
  headerElement,
  subHeaderElement,
  paragraphElement,
  textboxElement,
  dateElement,
  accordionElement,
  radioElement,
  resultRowButtonElement,
  buttonLinkElement,
} from "./Elements";
import { MeasureTableElement } from "./MeasureTable";
import {
  assertExhaustive,
  ElementType,
  NavigationFunction,
  PageElement,
} from "../../types/report";

interface Props {
  elements: PageElement[];
  setPage: NavigationFunction;
}

export const Page = ({ elements, setPage }: Props) => {
  const renderElement = (element: PageElement) => {
    const elementType = element.type;
    switch (elementType) {
      case ElementType.Header:
        return headerElement(element);
      case ElementType.SubHeader:
        return subHeaderElement(element);
      case ElementType.Paragraph:
        return paragraphElement(element);
      case ElementType.Textbox:
        return textboxElement(element);
      case ElementType.Date:
        return dateElement(element);
      case ElementType.Accordion:
        return accordionElement(element);
      case ElementType.Radio:
        return radioElement(element);
      case ElementType.ResultRowButton:
        return resultRowButtonElement(element, setPage);
      case ElementType.ButtonLink:
        return buttonLinkElement(element, setPage);
      case ElementType.MeasureTable:
        return MeasureTableElement(element, setPage);
      default:
        assertExhaustive(elementType);
        return <></>;
    }
  };

  return (
    <VStack alignItems="flex-start">
      {elements.length > 0 &&
        elements.map((element, index) => (
          <React.Fragment key={index}>{renderElement(element)}</React.Fragment>
        ))}
    </VStack>
  );
};
