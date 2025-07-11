import { Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { elementArray } from "./elementArray";

export const ComponentInventory = () => {
  const methods = useForm({});
  /**
   * TODO:
   * Add more elements to the inventory as needed
   * Style the inventory page
   * Consider adding a search or filter functionality
   * Leave space for PDF view with a construction cone 🏗️ emoji for in progress status
   *  <PDFViewPlaceholder />
   */

  const buildComponentDisplay = (componentExample: {
    description: string;
    name: string;
    variants: ReactNode[];
  }) => {
    return (
      <>
        <div
          style={{
            border: "1px solid black",
            margin: "20px",
          }}
        >
          <Heading as="h2" variant="h2">
            {componentExample.name}
          </Heading>
          <p>{componentExample.description}</p>
          {componentExample.variants.map((variant) => (
            <div
              style={{
                padding: "10px",
                margin: "20px",
              }}
            >
              {variant}
            </div>
          ))}
        </div>
      </>
    );
  };
  return (
    <FormProvider {...methods}>
      <Heading as="h1" variant="h1" style={{ margin: "15px" }}>
        Component Inventory
      </Heading>
      {elementArray.map((element) => buildComponentDisplay(element))}
    </FormProvider>
  );
};
