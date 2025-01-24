import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import { EmailCard } from "components";
import { Link } from "@chakra-ui/react";

describe("Test EmailCard", () => {
  test("Email for EmailCard is visible", () => {
    render(
      <EmailCard icon="settings">
        <Link href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</Link>
      </EmailCard>
    );
    const link = screen.getByRole("link", { name: "mdct_help@cms.hhs.gov" });
    expect(link).toBeVisible();
  });

  testA11y(<EmailCard icon="settings" />);
});
