import { render, screen } from "@testing-library/react";
import { StatusAlert } from "./StatusAlert";
import { ElementType, StatusAlertTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";

const mockStatusAlert = {
  type: ElementType.StatusAlert,
  title: "mock alert",
  text: "mock text",
  status: "error",
} as StatusAlertTemplate;

const statusAlertComponent = (
  <StatusAlert
    element={mockStatusAlert}
    index={0}
    formkey="elements.0"
  ></StatusAlert>
);

//TO DO: Add better test once the component is finished

describe("<StatusAlert />", () => {
  describe("Test StatusAlert component", () => {
    beforeEach(() => {
      render(statusAlertComponent);
    });
    test("StatusAlert is visible", () => {
      expect(screen.getByText("mock alert")).toBeVisible();
      expect(screen.getByText("mock text")).toBeVisible();
    });
  });

  testA11y(statusAlertComponent);
});
