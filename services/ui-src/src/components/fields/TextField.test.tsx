import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { TextField } from "components";
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { ElementType, TextboxTemplate } from "types/report";
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

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
jest.mock("utils/state/hooks/useElementIsHidden");
const mockedUseElementIsHidden = useElementIsHidden as jest.MockedFunction<
  typeof useElementIsHidden
>;

const mockedTextboxElement: TextboxTemplate = {
  id: "mock-textbox-id",
  type: ElementType.Textbox,
  label: "test label",
  helperText: "helper text",
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
};

const textFieldComponent = (
  <TextField element={mockedTextboxElement} formkey="elements.0" />
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

    test("TextField should send updates to the Form", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
      render(textFieldComponent);
      const textField = screen.getByRole("textbox");

      await act(async () => await userEvent.type(textField, "h"));

      // enter letter + type + label + id
      expect(mockRhfMethods.setValue).toHaveBeenCalledTimes(4);
      expect(mockRhfMethods.setValue).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        "h",
        expect.any(Object)
      );
    });
  });

  describe("Text field hide condition logic", () => {
    test("Text field is hidden if its hide conditions' controlling element has a matching answer", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockedUseElementIsHidden.mockReturnValueOnce(true);
      render(textFieldComponent);
      const textField = screen.queryByLabelText("test label");
      expect(textField).not.toBeInTheDocument();
    });

    test("Text field is NOT hidden if its hide conditions' controlling element has a different answer", async () => {
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
      render(textFieldComponent);
      const textField = screen.queryByLabelText("test label");
      expect(textField).toBeVisible();
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
