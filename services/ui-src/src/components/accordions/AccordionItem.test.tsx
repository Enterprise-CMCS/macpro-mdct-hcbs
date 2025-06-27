import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "components";
import { testA11yAct } from "utils/testing/commonTests";

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

  test("Find Expand button", () => {
    const button = screen.getByRole("button", { name: "Expand" });
    expect(button).toBeEnabled();
    const img = screen.getByRole("img", { name: "Expand" });
    expect(img).toBeVisible();
  });

  test("When Expand button clicked it switches to Collapse", async () => {
    const button = screen.getByRole("button", { name: "Expand" });
    await userEvent.click(button);
    expect(screen.getByRole("button", { name: "Collapse" })).toBeVisible();
  });

  testA11yAct(accordionItemComponent);
});
