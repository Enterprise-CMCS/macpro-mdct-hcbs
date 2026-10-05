import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxField, TextField } from "components";
import {
  ElementType,
  CheckboxTemplate,
  FormPageTemplate,
  Report,
  TextboxTemplate,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { useStore } from "utils";
import { CheckboxExport } from "./CheckboxField";
import { clearHiddenElements } from "utils/state/reportLogic/reportActions";

const updateSpy = vi.fn();
const mockClearHiddenElements = vi.fn();
useStore.setState({
  currentPageId: "my-page",
  clearHiddenElements: mockClearHiddenElements,
});

const mockCheckboxElement: CheckboxTemplate = {
  id: "mock-checkbox-id",
  type: ElementType.Checkbox,
  label: "mock label",
  required: true,
  answer: [],
  choices: [
    {
      label: "Choice 1",
      value: "A",
      checked: false,
    },
    {
      label: "Choice 2",
      value: "B",
      checkedChildren: [
        {
          id: "mock-text-box-id",
          type: ElementType.Textbox,
          label: "Text Label",
          required: true,
        },
      ],
      checked: false,
    },
    {
      label: "Choice 3",
      value: "C",
      checked: false,
    },
  ],
};

const CheckboxComponent = (
  <CheckboxField element={mockCheckboxElement} updateElement={updateSpy} />
);

describe("<CheckboxField />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render as Checkboxes", () => {
    render(CheckboxComponent);
    expect(screen.getByRole("checkbox", { name: "Choice 1" })).toBeVisible();
    expect(screen.getByRole("checkbox", { name: "Choice 2" })).toBeVisible();
    expect(screen.getByRole("checkbox", { name: "Choice 3" })).toBeVisible();
  });

  it("should allow checking checkbox choices", async () => {
    render(CheckboxComponent);
    await userEvent.click(screen.getByRole("checkbox", { name: "Choice 1" }));
    expect(updateSpy).toHaveBeenCalledWith({ answer: ["A"] });
  });

  it("should display children fields after selection", async () => {
    render(CheckboxComponent);
    expect(
      screen.queryByRole("textbox", { name: "Text Label" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Choice 2" }));
    expect(updateSpy).toHaveBeenCalledWith({ answer: ["B"] });
    expect(screen.getByRole("textbox", { name: "Text Label" })).toBeVisible();
  });

  describe("serviceTypeChange click action", () => {
    const serviceTypeElement: CheckboxTemplate = {
      ...mockCheckboxElement,
      answer: ["A"],
      clickAction: "serviceTypeChange",
    };

    it("should clear hidden elements only after confirming deselection", async () => {
      render(
        <CheckboxField element={serviceTypeElement} updateElement={updateSpy} />
      );
      await userEvent.click(screen.getByRole("checkbox", { name: "Choice 1" }));
      expect(
        screen.getByRole("dialog", { name: "Are you sure?" })
      ).toBeVisible();
      expect(
        screen.getByText(
          "Warning: Changing this response will clear any data previously entered in the corresponding service sections."
        )
      ).toBeVisible();
      expect(screen.getByRole("checkbox", { name: "Choice 1" })).toBeChecked();
      expect(updateSpy).not.toHaveBeenCalled();
      expect(mockClearHiddenElements).not.toHaveBeenCalled();

      await userEvent.click(screen.getByRole("button", { name: "Yes" }));
      expect(updateSpy).toHaveBeenCalledWith({ answer: [] });
      expect(mockClearHiddenElements).toHaveBeenCalledWith(
        "my-page",
        "mock-checkbox-id"
      );
      expect(
        screen.getByRole("checkbox", { name: "Choice 1" })
      ).not.toBeChecked();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it.each(["No", "Close"])(
      "should preserve selection when clicking %s",
      async (buttonName) => {
        render(
          <CheckboxField
            element={serviceTypeElement}
            updateElement={updateSpy}
          />
        );
        await userEvent.click(
          screen.getByRole("checkbox", { name: "Choice 1" })
        );
        await userEvent.click(screen.getByRole("button", { name: buttonName }));
        expect(
          screen.getByRole("checkbox", { name: "Choice 1" })
        ).toBeChecked();
        expect(updateSpy).not.toHaveBeenCalled();
        expect(mockClearHiddenElements).not.toHaveBeenCalled();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      }
    );

    it("should select additional services without confirmation", async () => {
      render(
        <CheckboxField element={serviceTypeElement} updateElement={updateSpy} />
      );
      await userEvent.click(screen.getByRole("checkbox", { name: "Choice 3" }));
      expect(updateSpy).toHaveBeenCalledWith({ answer: ["A", "C"] });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    describe("service section data", () => {
      const originalState = useStore.getState();

      afterEach(() => {
        cleanup();
        useStore.setState(originalState);
      });

      it("should hide and clear a section on Yes and keep other service data", async () => {
        useStore.setState({
          pageMap: new Map([["my-page", 0]]),
          report: {
            pages: [
              {
                id: "my-page",
                elements: [
                  { ...serviceTypeElement, answer: ["A", "C"] },
                  {
                    id: "service-a-data",
                    type: ElementType.Textbox,
                    label: "Service A data",
                    required: true,
                    answer: "previous answer",
                    hideCondition: {
                      controllerElementId: serviceTypeElement.id,
                      answerExcludes: ["A"],
                    },
                  },
                  {
                    id: "service-c-data",
                    type: ElementType.Textbox,
                    label: "Service C data",
                    required: true,
                    answer: "keep this answer",
                    hideCondition: {
                      controllerElementId: serviceTypeElement.id,
                      answerExcludes: ["C"],
                    },
                  },
                ],
              },
            ],
          } as Report,
          clearHiddenElements: (pageId, controllerElementId) => {
            useStore.setState(
              clearHiddenElements(
                pageId,
                controllerElementId,
                useStore.getState()
              )
            );
          },
        });
        const ServicePage = () => {
          const report = useStore((state) => state.report)!;
          const page = report.pages[0] as FormPageTemplate;
          const [checkbox, serviceA, serviceC] = page.elements;
          return (
            <>
              <CheckboxField
                element={checkbox as CheckboxTemplate}
                updateElement={(update) => {
                  useStore.setState({
                    report: {
                      ...report,
                      pages: [
                        {
                          ...page,
                          elements: [
                            { ...checkbox, ...update } as CheckboxTemplate,
                            serviceA,
                            serviceC,
                          ],
                        },
                      ],
                    },
                  });
                }}
              />
              <TextField
                element={serviceA as TextboxTemplate}
                updateElement={vi.fn()}
              />
              <TextField
                element={serviceC as TextboxTemplate}
                updateElement={vi.fn()}
              />
            </>
          );
        };
        render(<ServicePage />);
        await userEvent.click(
          screen.getByRole("checkbox", { name: "Choice 1" })
        );
        expect(screen.getByDisplayValue("previous answer")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "No" }));
        expect(
          screen.getByRole("textbox", { name: "Service A data" })
        ).toHaveValue("previous answer");

        await userEvent.click(
          screen.getByRole("checkbox", { name: "Choice 1" })
        );
        await userEvent.click(screen.getByRole("button", { name: "Yes" }));
        expect(
          screen.queryByRole("textbox", { name: "Service A data" })
        ).not.toBeInTheDocument();
        expect(
          useStore.getState().report!.pages[0].elements![1]
        ).toHaveProperty("answer", undefined);
        expect(
          screen.getByRole("textbox", { name: "Service C data" })
        ).toHaveValue("keep this answer");

        await userEvent.click(
          screen.getByRole("checkbox", { name: "Choice 1" })
        );
        expect(
          screen.getByRole("textbox", { name: "Service A data" })
        ).toHaveValue("");
      });
    });

    it("should not clear anything without a click action", async () => {
      render(
        <CheckboxField
          element={{ ...mockCheckboxElement, answer: ["A"] }}
          updateElement={updateSpy}
        />
      );
      await userEvent.click(screen.getByRole("checkbox", { name: "Choice 1" }));
      expect(mockClearHiddenElements).not.toHaveBeenCalled();
    });
  });

  testA11y(CheckboxComponent);
});

describe("<CheckboxExport/>", () => {
  it("should render selected labels when answer is array", () => {
    const element: CheckboxTemplate = {
      type: ElementType.Checkbox,
      id: "check",
      label: "Label",
      required: false,
      choices: [
        { value: "a", label: "Option A" },
        { value: "b", label: "Option B" },
      ],
      answer: ["a", "b"],
    };

    render(CheckboxExport(element));

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("should render empty if unanswered", () => {
    const element: CheckboxTemplate = {
      type: ElementType.Checkbox,
      id: "check",
      label: "Label",
      required: false,
      choices: [],
      answer: [],
    };

    render(CheckboxExport(element));

    expect(screen.queryByRole("listitem")).toBeNull();
  });
});
