import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ApiProvider } from "./ApiProvider";

const TestComponent = () => <div>Test</div>;

const testComponent = (
  <ApiProvider>
    <TestComponent />
  </ApiProvider>
);

describe("<ApiProvider />", () => {
  it("should render correctly", () => {
    render(testComponent);
    expect(screen.getByText("Test")).toBeVisible();
  });
});
