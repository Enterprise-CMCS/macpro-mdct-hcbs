import { Divider, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { elementObject } from "./elementObject";
import { ElementType } from "types";

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

  const buildComponentDisplay = (type: ElementType) => {
    const componentExample = elementObject[type] as {
      description: string;
      variants: ReactNode[];
    };

    return (
      <div
        style={{
          margin: "20px",
        }}
      >
        <Heading as="h2" variant="h2">
          {type}
        </Heading>
        {!componentExample ? (
          <p>No example available for this component.</p>
        ) : (
          <>
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
        )}
      </div>
    );
  };
  return (
    <FormProvider {...methods}>
      <Heading as="h1" variant="h1" style={{ margin: "15px" }}>
        Component Inventory
      </Heading>
      <p style={{ margin: "15px" }}>
        This page is a work in progress. It will eventually contain all the
        components used in the application, along with examples of how to use
        them.
      </p>
      <Divider />
      {/* Display all ElementType enum possibilities, even if not in elementObject */}
      {Object.values(ElementType).map((type) => {
        return buildComponentDisplay(type);
      })}
    </FormProvider>
  );
};
