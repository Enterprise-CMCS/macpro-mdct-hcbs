import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "components";
import { testA11y } from "utils/testing/commonTests";

const accordionItemComponent = (
  <RouterWrappedComponent>
    <Accordion>
      <AccordionItem />
    </Accordion>
  </RouterWrappedComponent>
);

describe("Test AccordionItem", () => {
  beforeEach(() => {
    render(accordionItemComponent);
  });

  test("Expand button exists", () => {
    const button = screen.getByRole("button", { name: "Expand" });
    userEvent.click(button);
    expect(button).toBeEnabled();
  });

  test("Expand image exists", () => {
    const img = screen.getByRole("img", { name: "Expand" });
    expect(img).toBeVisible();
  });

  testA11y(accordionItemComponent);
});
