import { render } from "@testing-library/react";
import { mockStateUserStore } from "utils/testing/setupJest";
import { useFormContext } from "react-hook-form";
import { DateField } from "components/fields/DateField";
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

const mockedDateTextboxElement = {
  type: DateField,
  label: "test-date-field",
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
    test("DateField is visible", () => {
      mockGetValues(undefined);
      const result = render(dateFieldComponent);
      console.log(result.container);
      const dateFieldInput: HTMLInputElement = result.container.querySelector(
        "[label='test-date-field']"
      )!;
      expect(dateFieldInput).toBeVisible();
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
