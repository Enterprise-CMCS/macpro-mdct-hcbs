import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const accordionItemComponent = (
  <RouterWrappedComponent>
    <Accordion>
      <AccordionItem label="test">
        <p>Content</p>
      </AccordionItem>
    </Accordion>
  </RouterWrappedComponent>
);

describe("AccordionItem", () => {
  beforeEach(() => {
    render(accordionItemComponent);
  });

  it("should be closed by default", () => {
    const button = screen.getByRole("button", { name: "test" });
    const content = screen.getByText("Content");

    expect(button).toBeVisible();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(content).not.toBeVisible();
  });

  test("should expand when clicked", async () => {
    const button = screen.getByRole("button", { name: "test" });

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");

    await waitFor(() => {
      expect(screen.getByText("Content")).toBeVisible();
    });
  });

  testA11yAct(accordionItemComponent);
});
