import { VStack } from "@chakra-ui/react";
import { AnyObject } from "yup/lib/types";
import {
  headerElement,
  subHeaderElement,
  paragraphElement,
  textboxElement,
  dateElement,
  accordianElement,
  radioElement,
  resultRowButtonElement,
  buttonElement,
  buttonLinkElement,
} from "./Elements";

interface Props {
  elements: AnyObject[];
  setPage: Function;
}

export const Page = ({ elements, setPage }: Props) => {
  const renderElement = (element: any) => {
    switch (element.type) {
      case "header":
        return headerElement(element);
      case "sub-header":
        return subHeaderElement(element);
      case "paragraph":
        return paragraphElement(element);
      case "textbox":
        return textboxElement(element);
      case "date":
        return dateElement(element);
      case "accordian":
        return accordianElement(element);
      case "radio":
        return radioElement(element);
      case "resultRowButton":
        return resultRowButtonElement(element, setPage);
      case "button":
        return buttonElement(element, setPage);
      case "button-link":
        return buttonLinkElement(element, setPage);
    }
    return <></>;
  };

  return (
    <VStack alignItems="flex-start">
      {elements.length > 0 && elements.map((element) => renderElement(element))}
    </VStack>
  );
};
