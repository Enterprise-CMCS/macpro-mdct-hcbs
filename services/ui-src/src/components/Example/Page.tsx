import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

export const headerElement = (value: string) => {
  return <Heading>{value}</Heading>;
};

export const paragraphElement = (value: string) => {
  return <Text>{value}</Text>;
};

export const buttonElement = (element: any, func: Function) => {
  return <Button onClick={() => func(element.pages)}>{element.text}</Button>;
};

interface Props {
  elements: any[];
  setPage: Function;
}

export const Page = ({ elements, setPage }: Props) => {
  const renderElement = (element: any) => {
    switch (element.type) {
      case "header":
        return headerElement(element.text);
      case "paragraph":
        return paragraphElement(element.text);
      case "button":
        return buttonElement(element, setPage);
    }
    return <></>;
  };

  return (
    <div>
      {elements.length > 0 && elements.map((element) => renderElement(element))}
    </div>
  );
};
