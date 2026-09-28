import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import { HelpCard } from "components";
import { Link } from "@chakra-ui/react";

describe("<HelpCard/>", () => {
  it("should render its children", () => {
    render(
      <HelpCard icon="settings">
        <Link href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</Link>
      </HelpCard>
    );
    const link = screen.getByRole("link", { name: "mdct_help@cms.hhs.gov" });
    expect(link).toBeVisible();
  });

  testA11y(<HelpCard icon="settings">Test</HelpCard>);
});
