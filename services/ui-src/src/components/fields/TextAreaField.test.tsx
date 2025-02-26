import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { TextAreaField } from "components";
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { ElementType, TextAreaBoxTemplate } from "types/report";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: jest.fn(),
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

const mockedTextAreaElement = {
  type: ElementType.TextAreaField,
  label: "test label",
  helperText: "helper text",
} as TextAreaBoxTemplate;

const textAreaFieldComponent = (
  <TextAreaField
    element={mockedTextAreaElement}
    index={0}
    formkey="elements.0"
  />
);

describe("<TextAreaField />", () => {
  describe("Test TextAreaField component", () => {
    test("TextAreaField is visible", () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
      render(textAreaFieldComponent);
      const textAreaField = screen.getByRole("textbox");
      expect(textAreaField).toBeVisible();
      jest.clearAllMocks();
    });

    test("TextAreaField should send updates to the Form", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
      render(textAreaFieldComponent);
      const textAreaField = screen.getByRole("textbox");

      await userEvent.type(textAreaField, "hello[Tab]");

      // 5 keystrokes + 1 blur + 1 hydrate = 7 calls
      expect(mockRhfMethods.setValue).toHaveBeenCalledTimes(7);
      expect(mockRhfMethods.setValue).toHaveBeenCalledWith(
        expect.any(String),
        "hello"
      );
    });
  });

  testA11y(
    textAreaFieldComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
