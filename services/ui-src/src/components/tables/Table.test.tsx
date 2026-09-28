import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { Table } from "components";
import { testA11y } from "utils/testing/commonTests";

const tableContent = {
  caption: "mock caption",
  headRow: ["mock header 1", "mock header 2", "mock header 3"],
  bodyRows: [],
};

const tableComponent = (
  <RouterWrappedComponent>
    <Table content={tableContent} variant="striped" />
  </RouterWrappedComponent>
);

describe("<Table />", () => {
  it("should render corectly", () => {
    render(tableComponent);

    expect(screen.getByRole("table")).toBeVisible();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1);
    expect(screen.getByText("mock header 1")).toBeInTheDocument();
    expect(screen.getByText("mock header 2")).toBeInTheDocument();
    expect(screen.getByText("mock header 3")).toBeInTheDocument();
  });

  testA11y(tableComponent);
});
