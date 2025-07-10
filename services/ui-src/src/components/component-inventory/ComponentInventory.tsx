import { Heading } from "@chakra-ui/react";
import { TextField } from "components/fields/TextField";
import { HeaderElement } from "components/report/Elements";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ElementType, HeaderIcon } from "types";

export const ComponentInventory = () => {
  const methods = useForm({});
  {
    /**
     * TODO:
     * Add more elements to the inventory as needed
     * Style the inventory page
     * Consider adding a search or filter functionality
     * Leave space for PDF view (upon Aileen's PDF work) with a construction cone 🏗️ emoji for in progress status
     *  <PDFViewPlaceholder />
     */
  }
  const elementArray = [
    {
      name: "Header",
      description: "Big text at the top of the page",
      variants: [
        <HeaderElement
          formkey="00"
          element={{
            type: ElementType.Header,
            id: "id",
            text: "HeaderElement",
          }}
        />,
        <HeaderElement
          formkey="01"
          element={{
            type: ElementType.Header,
            id: "id",
            text: "HeaderElement with Icon",
            icon: HeaderIcon.Check,
          }}
        />,
      ],
    },
    {
      name: "Text Field",
      description: "A field for entering text",
      variants: [
        <TextField
          formkey="00"
          element={{ type: ElementType.Textbox, id: "id", label: "TextField" }}
        />,
      ],
    },
  ];
  const buildComponentDisplay = (componentExample: {
    description: string;
    name: string;
    variants: ReactNode[];
  }) => {
    return (
      <>
        <Heading as="h2" variant="h2">
          {componentExample.name}
        </Heading>
        <p>{componentExample.description}</p>
        {componentExample.variants.map((variant) => (
          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "20px",
            }}
          >
            {variant}
          </div>
        ))}
      </>
    );
  };
  return (
    <FormProvider {...methods}>
      <Heading as="h1" variant="h1">
        Component Inventory
      </Heading>
      {elementArray.map((element) => buildComponentDisplay(element))}
    </FormProvider>
  );
};
