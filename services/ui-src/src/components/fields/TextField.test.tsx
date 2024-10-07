import { render, screen } from "@testing-library/react";
// components
import { useFormContext } from "react-hook-form";
import { TextField } from "components";
// utils
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const textFieldComponent = (
  <TextField
    name="testTextField"
    label="test-label"
    placeholder="test-placeholder"
    data-testid="test-text-field"
  />
);

describe("<TextField />", () => {
  describe("Test TextField component", () => {
    test("TextField is visible", () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
      render(textFieldComponent);
      const textField = screen.getByRole("textbox");
      expect(textField).toBeVisible();
      jest.clearAllMocks();
    });
  });

  testA11y(
    textFieldComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
