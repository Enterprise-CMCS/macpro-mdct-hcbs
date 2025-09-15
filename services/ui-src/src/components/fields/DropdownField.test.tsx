import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { testA11y } from "utils/testing/commonTests";
import { DropdownTemplate, ElementType } from "types";
import { DropdownField } from "./DropdownField";
import assert from "node:assert";
import { useState } from "react";

const mockedDropdownElement: DropdownTemplate = {
  id: "mock-dropdown-id",
  type: ElementType.Dropdown,
  label: "test-dropdown-field",
  helperText: "helper text",
  required: true,
  options: [
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
  ],
};
const updateSpy = jest.fn();

const DropdownWrapper = ({ template }: { template: DropdownTemplate }) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <DropdownField element={element} updateElement={onChange} />;
};

describe("<DropdownField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Test DropdownField basic functionality", () => {
    test("DropdownField is visible", () => {
      render(<DropdownWrapper template={mockedDropdownElement} />);
      const dropdown = screen.getAllByLabelText("test-dropdown-field")[0];
      expect(dropdown).toBeInTheDocument();
      assert(dropdown instanceof HTMLSelectElement);
      expect(dropdown.options.length).toBe(3);
    });

    test("DropdownField should send updates to the Form", async () => {
      render(<DropdownWrapper template={mockedDropdownElement} />);
      const dropdown = screen.getAllByLabelText("test-dropdown-field")[0];

      await userEvent.selectOptions(dropdown, "2027");

      expect(updateSpy).toHaveBeenCalledWith({ answer: "2027" });
    });
  });

  testA11y(<DropdownWrapper template={mockedDropdownElement} />);
});
