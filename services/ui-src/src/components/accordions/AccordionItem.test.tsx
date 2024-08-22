import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "components";

const accordionItemComponent = (
  <RouterWrappedComponent>
    <Accordion>
      <AccordionItem data-testid="accordion-item" />
    </Accordion>
  </RouterWrappedComponent>
);

describe("Test AccordionItem", () => {
  beforeEach(() => {
    render(accordionItemComponent);
  });

  test("AccordionItem is visible", () => {
    expect(screen.getByTestId("accordion-item")).toBeVisible();
  });
});

describe("Test AccordionItem accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(accordionItemComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
