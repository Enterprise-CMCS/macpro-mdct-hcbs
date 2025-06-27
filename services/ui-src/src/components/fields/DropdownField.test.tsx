import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { DropdownTemplate, ElementType } from "types";
import { DropdownField } from "./DropdownField";
import { useFormContext } from "react-hook-form";
import { mockStateUserStore } from "utils/testing/setupJest";
import assert from "node:assert";

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

const mockedDropdownElement: DropdownTemplate = {
  id: "mock-dropdown-id",
  type: ElementType.Dropdown,
  label: "test-dropdown-field",
  helperText: "helper text",
  options: [
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
  ],
};

const testKey = "unique.form.key";

const dropdownFieldComponent = (
  <DropdownField element={mockedDropdownElement} formkey={testKey} />
);

describe("<DropdownField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Test DropdownField basic functionality", () => {
    test("DropdownField is visible", () => {
      render(dropdownFieldComponent);
      const dropdown = screen.getAllByLabelText("test-dropdown-field")[0];
      expect(dropdown).toBeInTheDocument();
      assert(dropdown instanceof HTMLSelectElement);
      expect(dropdown.options.length).toBe(3);
    });

    test("DropdownField should send updates to the Form", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
      render(dropdownFieldComponent);
      const dropdown = screen.getAllByLabelText("test-dropdown-field")[0];

      await userEvent.selectOptions(dropdown, "2027");

      //a hydrate at the start + value change = 2 times
      expect(mockSetValue).toHaveBeenCalledTimes(2);
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
