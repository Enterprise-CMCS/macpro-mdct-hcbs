import { Divider, Heading, Spinner } from "@chakra-ui/react";
import { ReactNode, Fragment, useEffect, useState } from "react";
import { elementObject } from "./elementObject";
import { ElementType, Report, ReportStatus } from "types";
import { useStore } from "utils";

export const ComponentInventory = () => {
  const { loadReport } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  /**
   * TODO:
   * Style the inventory page
   * Verify that we are not missing any unique variants of components
   * Consider adding a search or filter functionality
   * Leave space for PDF view with a construction cone 🏗️ emoji for in progress status
   *  <PDFViewPlaceholder />
   */

  const mockReport = {
    name: "Mock Report",
    state: "PR",
    status: ReportStatus.IN_PROGRESS,
    submissionCount: 0,
    archived: false,
    submitted: 1,
    submittedBy: "User Name",
    pages: [
      {
        id: "root",
        childPageIds: ["first-measure", "second-measure"],
      },
      {
        id: "first-measure",
        required: true,
        cmitId: "cmitId",
        cmit: "123",
        cmitInfo: {
          name: "CMIT Name",
          cmit: "123",
          measureSteward: "Steward Name",
          dataSource: "Data Source",
          deliverySystem: ["Delivery System 1", "Delivery System 2"],
        },
        childPageIds: [],
        type: "measure",
        title: "Measure Title",
        dependentPages: [
          {
            key: "FFS",
            linkText: "Delivery Method",
            template: "FFS",
          },
        ],
      },
      {
        id: "second-measure",
        required: false,
      },
    ],
  } as Report;

  useEffect(() => {
    loadReport(mockReport);
    setIsLoading(false);
    // Cleanup function runs on unmount
    return () => loadReport(undefined);
  }, []);

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
                  key={`variant-${index}`}
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

  if (isLoading) {
    return <Spinner size="md" />;
  }

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
        {Object.values(ElementType).map((type, index) => {
          return (
            <Fragment key={`type-${index}`}>
              {buildComponentDisplay(type)}
            </Fragment>
          );
        })}
      </div>
    </>
  );
};
