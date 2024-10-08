import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { useFormContext } from "react-hook-form";
import { DateField } from "components/fields/DateField";
import { useStore } from "utils";
import { mockUseStore } from "utils/testing/setupJest";
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

const mockedDateTextboxElement = {
  type: DateField,
  label: "test label",
  helperText: "helper text",
};

const dateFieldComponent = (
  <DateField
    element={mockedDateTextboxElement as unknown as PageElement}
    index={0}
  />
);

describe("<DateField />", () => {
  describe("Test DateField basic functionality", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
    });

    test("DateField is visible", () => {
      mockGetValues(undefined);
      const result = render(dateFieldComponent);
      const dateFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testDateField']"
      )!;
      expect(dateFieldInput).toBeVisible();
    });

    test("onChange event fires handler when typing and stays even after blurred", async () => {
      mockGetValues(undefined);
      const result = render(dateFieldComponent);
      const dateFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testDateField']"
      )!;
      await userEvent.type(dateFieldInput, "07/14/2022");
      await userEvent.tab();
      expect(dateFieldInput.value).toEqual("07/14/2022");
    });
  });

  testA11y(dateFieldComponent, () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    mockGetValues(undefined);
  });
});
