import { render, screen } from "@testing-library/react";
import { useFormContext } from "react-hook-form";
import { TextField } from "components";
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { PageElement } from "types/report";

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

const mockedTextboxElement = {
  type: TextField,
  label: "test label",
  helperText: "helper text",
};

const textFieldComponent = (
  <TextField
    element={mockedTextboxElement as unknown as PageElement}
    index={0}
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
