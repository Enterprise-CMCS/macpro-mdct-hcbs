import { render, screen } from "@testing-library/react";
import { HomePage } from "./HomePage";
import { testA11y } from "utils/testing/commonTests";
import { useStore } from "utils";
import { BannerAreas, BannerShape, HcbsUser } from "types";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { useFlags } from "launchdarkly-react-client-sdk";

jest.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: jest.fn().mockReturnValue({
    isTacmReportActive: true,
    isCiReportActive: true,
    isPcpReportActive: true,
    isQipReportActive: true,
    isWwlReportActive: true,
  }),
}));

const stateUser = { userIsEndUser: true } as HcbsUser;
const adminUser = { userIsEndUser: false } as HcbsUser;

useStore.setState({ _lastFetchTime: Date.now() /* prevent banner API poll */ });

const homePage = (
  <RouterWrappedComponent>
    <HomePage />
  </RouterWrappedComponent>
);

describe("Home page", () => {
  it("should render a card for each enabled report type", () => {
    useStore.setState({ user: stateUser, allBanners: [] });
    render(homePage);

    const headings = [
      { level: 1, name: /Home and Community-Based Services/ },
      { level: 2, name: /Quality Reports/ },
      { level: 3, name: /Quality Measure Set Report/ },
      { level: 3, name: /QMS Quality Improvement Plans/ },
      { level: 2, name: /Transparency Reports/ },
      { level: 3, name: /Timely Access Compliance Measure Report/ },
      { level: 3, name: /Waiver Waiting List Report/ },
      { level: 2, name: /Compliance Reports/ },
      { level: 3, name: /Critical Incident Report/ },
      { level: 3, name: /Person-Centered Planning Report/ },
    ];
    for (let heading of headings) {
      expect(screen.getByRole("heading", heading)).toBeVisible();
    }
  });

  it("should not render disabled report types", () => {
    useStore.setState({ user: stateUser, allBanners: [] });
    (useFlags as any).mockReturnValue({
      isTacmReportActive: false,
      isCiReportActive: false,
      isPcpReportActive: false,
      isQipReportActive: false,
      isWwlReportActive: false,
    });

    render(homePage);

    const headings = [
      { level: 2, name: /Transparency Reports/ },
      { level: 2, name: /Compliance Reports/ },
      { level: 3, name: /QMS Quality Improvement Plans/ },
      { level: 3, name: /Timely Access Compliance Measure Report/ },
      { level: 3, name: /Waiver Waiting List Report/ },
      { level: 3, name: /Critical Incident Report/ },
      { level: 3, name: /Person-Centered Planning Report/ },
    ];
    for (let heading of headings) {
      expect(screen.queryByRole("heading", heading)).not.toBeInTheDocument();
    }
  });

  it("should still render if user and flags are missing", () => {
    useStore.setState({ user: undefined, allBanners: [] });
    (useFlags as any).mockReturnValue(undefined);

    render(homePage);

    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
  });

  it("should render the admin dash selector for non-state users", () => {
    useStore.setState({ user: adminUser, allBanners: [] });
    render(homePage);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "View State/Territory Reports",
      })
    ).toBeVisible();
  });

  it("should render the homepage banner, if one exists", () => {
    const mockBanner = {
      title: "Mock Banner Title",
      area: BannerAreas.Home,
      startDate: "2000-01-01",
      endDate: "2999-12-31",
    } as BannerShape;
    useStore.setState({ user: stateUser, allBanners: [mockBanner] });

    render(homePage);

    const banner = screen.getByRole("alert");
    expect(banner).toBeVisible();
    expect(banner).toHaveTextContent(/Mock Banner Title/);
  });

  testA11y(homePage);
});
