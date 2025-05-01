import { mockStateUserStore } from "utils/testing/setupJest";
import { useFormContext } from "react-hook-form";
import { DateField } from "components/fields/DateField";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { PageElement } from "types/report";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

const mockedDateTextboxElement = {
  type: DateField,
  label: "test-date-field",
  helperText: "helper text",
};

const testKey = "unique.form.key";
const dateFieldComponent = (
  <DateField
    element={mockedDateTextboxElement as unknown as PageElement}
    formkey={testKey}
    index={0}
  />
);

describe("<DateField />", () => {
  describe("Test DateField basic functionality", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("DateField is visible", () => {
      mockGetValues(undefined);
      render(dateFieldComponent);
      const dateFieldInput = screen.getByRole("textbox");
      expect(dateFieldInput).toBeVisible();
    });

    test("Datefield sends updates to the Form", async () => {
      mockGetValues(undefined);
      render(dateFieldComponent);
      const dateFieldInput = screen.getByRole("textbox");

      await userEvent.type(dateFieldInput, "10162024");
      expect(mockRhfMethods.setValue).toHaveBeenCalledTimes(1);
      expect(mockRhfMethods.setValue).toHaveBeenCalledWith(
        `${testKey}.answer`,
        "10/16/2024",
        expect.any(Object)
      );
    });
  });

  testA11y(
    dateFieldComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
