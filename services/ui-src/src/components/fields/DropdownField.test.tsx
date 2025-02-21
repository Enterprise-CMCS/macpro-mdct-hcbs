import { fireEvent, render, screen } from "@testing-library/react";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { PageElement } from "types";
import { DropdownField } from "./DropdownField";
import { useFormContext } from "react-hook-form";
import { mockStateUserStore } from "utils/testing/setupJest";

const mockTrigger = jest.fn();
const mockSetValue = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: mockSetValue,
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
  type: DropdownField,
  label: "test-dropdown-field",
  helperText: "helper text",
  options: [
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
  ],
};

const testKey = "unique.form.key";

const dropdownFieldComponent = (
  <DropdownField
    element={mockedDateTextboxElement as unknown as PageElement}
    formkey={testKey}
    index={0}
  />
);

describe("<DropdownField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Test DropdownField basic functionality", () => {
    test("DropdownField is visible", () => {
      render(dropdownFieldComponent);
      const dropdown = screen.getByRole("combobox", {
        name: "test-dropdown-field helper text",
      }) as HTMLSelectElement;
      expect(dropdown).toBeInTheDocument();
      expect(dropdown.options.length).toBe(2);
    });

    test("DropdownField should send updates to the Form", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
      render(dropdownFieldComponent);
      const dropdown = screen.getByRole("combobox", {
        name: "test-dropdown-field helper text",
      }) as HTMLSelectElement;

      fireEvent.change(dropdown, { target: { value: "2027" } });

      expect(mockSetValue).toHaveBeenCalledTimes(1);
      expect(mockSetValue).toHaveBeenCalledWith(
        "unique.form.key.answer",
        "2027",
        {
          shouldValidate: true,
        }
      );
    });
  });

  testA11y(
    dropdownFieldComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
