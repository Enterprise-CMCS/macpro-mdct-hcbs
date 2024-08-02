import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { TemplateCardAccordion } from "components";
import verbiage from "verbiage/pages/home";
import { AnyObject } from "types";
import { testA11y } from "utils/testing/commonTests";

const accordionComponent = (mockProps?: AnyObject) => {
  const props = {
    verbiage: verbiage.cards.QM.accordion,
    ...mockProps,
  };
  return (
    <RouterWrappedComponent>
      <TemplateCardAccordion {...props} />
    </RouterWrappedComponent>
  );
};

const accordionContent = verbiage.cards.QM.accordion.text[0].content;
const accordionButtonLabel = verbiage.cards.QM.accordion.buttonLabel;

describe("<TemplateCardAccordion />", () => {
  test("Accordion is visible", () => {
    render(accordionComponent());
    expect(screen.getByText(accordionButtonLabel)).toBeVisible();
  });

  test("Accordion default closed state only shows the question", () => {
    render(accordionComponent());
    expect(screen.getByText(accordionButtonLabel)).toBeVisible();
    expect(screen.getByText(accordionContent)).not.toBeVisible();
  });

  test("Accordion should show answer on click", async () => {
    render(accordionComponent());
    const accordionQuestion = screen.getByText(accordionButtonLabel);
    expect(accordionQuestion).toBeVisible();
    expect(screen.getByText(accordionContent)).not.toBeVisible();
    await userEvent.click(accordionQuestion);
    expect(accordionQuestion).toBeVisible();
    expect(screen.getByText(accordionContent)).toBeVisible();
  });

  test("Accordion should render a list when given one", async () => {
    const mockProps = {
      verbiage: {
        buttonLabel: "expand",
        list: ["item one", "item two", "item three"],
      },
    };

    render(accordionComponent(mockProps));
    const button = screen.getByText("expand");
    await userEvent.click(button);

    expect(screen.getByText("item one")).toBeVisible();
    expect(screen.getByText("item two")).toBeVisible();
    expect(screen.getByText("item three")).toBeVisible();
  });

  test("Accordion should render a table when given one", async () => {
    const mockProps = {
      verbiage: {
        buttonLabel: "expand",
        table: {
          headRow: ["mock column header"],
        },
      },
    };

    render(accordionComponent(mockProps));
    const button = screen.getByText("expand");
    await userEvent.click(button);

    expect(screen.getByText("mock column header")).toBeVisible();
  });

  testA11y(accordionComponent());
});
