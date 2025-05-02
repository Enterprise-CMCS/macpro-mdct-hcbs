import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { TextAreaField } from "components";
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { ElementType, TextAreaBoxTemplate } from "types/report";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";

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
  get: jest.fn(),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));
jest.mock("utils/state/hooks/useElementIsHidden");
const mockedUseElementIsHidden = useElementIsHidden as jest.MockedFunction<
  typeof useElementIsHidden
>;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockedTextAreaElement = {
  type: ElementType.TextAreaField,
  label: "test label",
  helperText: "helper text",
  hideCondition: {
    controllerElementId: "reporting-radio",
    answer: "yes",
  },
  required: true,
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

      await act(async () => await userEvent.type(textAreaField, "h"));

      // hydrate + interact
      expect(mockRhfMethods.setValue).toHaveBeenCalledTimes(2);
      expect(mockRhfMethods.setValue).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        "h",
        expect.any(Object)
      );
    });
  });

  describe("Text area field hide condition logic", () => {
    test("Text area field is hidden if its hide conditions' controlling element has a matching answer", async () => {
      mockedUseElementIsHidden.mockReturnValueOnce(true);
      render(textAreaFieldComponent);
      const textField = screen.queryByLabelText("test label");
      expect(textField).not.toBeInTheDocument();
    });

    test("Text area field is NOT hidden if its hide conditions' controlling element has a different answer", async () => {
      mockGetValues({
        elements: [
          {
            answer: "idk",
            type: "radio",
            label: "Should we hide the other radios on this page?",
            id: "reporting-radio",
          },
        ],
      });
      render(textAreaFieldComponent);
      const textField = screen.queryByLabelText("test label");
      expect(textField).toBeVisible();
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
