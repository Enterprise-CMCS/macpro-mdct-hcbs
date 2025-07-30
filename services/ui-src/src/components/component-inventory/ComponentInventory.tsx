import { Divider, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
import { elementObject } from "./elementObject";
import { ElementType } from "types";

export const ComponentInventory = () => {
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
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          borderBottom: "2px solid #ddd",
          paddingBottom: "20px",
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
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {componentExample.variants.map((variant, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px #0000001a",
                    minWidth: "300px",
                    backgroundColor: "#fff",
                  }}
                >
                  {variant}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Heading as="h1" variant="h1" style={{ margin: "15px" }}>
        Component Inventory
      </Heading>
      <p style={{ margin: "15px" }}>
        This page is a work in progress. It will eventually contain all the
        components used in the application, along with examples of how to use
        them.
      </p>
      <Divider style={{ margin: "20px 0" }} />
      {/* Display all ElementType enum possibilities, even if not in elementObject */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Object.values(ElementType).map((type) => {
          return buildComponentDisplay(type);
        })}
      </div>
    </>
  );
};
