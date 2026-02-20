import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminPage } from "components";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { BannerShape, BannerAreas } from "types";

const daysFromToday = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(12);
  return date.toISOString();
};

const reformatDate = (isoString: string) => {
  const [_, year, month, day] = /^(\d\d\d\d)-(\d\d)-(\d\d)/.exec(isoString)!;
  return `${month}/${day}/${year}`;
};

const mockBannerQms = {
  title: "QMS Alert",
  area: BannerAreas.QMS,
  description: "mock description",
  link: "https://example.com/qms-alert",
  startDate: "2026-03-01T05:00:00.000Z",
  endDate: "2026-03-06T04:59:59.000Z",
  key: "a8618482-5f61-4bfc-91ba-9f1d25609986", // #gitleaks:allow
} as BannerShape;

const mockBannerHome1 = {
  title: "Home Alert - past",
  area: BannerAreas.Home,
  description: "mock description",
  startDate: daysFromToday(-5),
  endDate: daysFromToday(-2),
  key: "e50841b7-b438-4b47-ab42-fd7a7511ecb0", // #gitleaks:allow
} as BannerShape;

const mockBannerHome2 = {
  title: "Home Alert - present",
  area: BannerAreas.Home,
  description: "mock description",
  startDate: daysFromToday(-5),
  endDate: daysFromToday(1),
  key: "1a085df1-8946-4e04-8fd9-77cdbc85e992", // #gitleaks:allow
} as BannerShape;

const mockBannerHome3 = {
  title: "Home Alert - future",
  area: BannerAreas.Home,
  description: "mock description",
  startDate: daysFromToday(3),
  endDate: daysFromToday(4),
  key: "b479358a-22a1-4d27-8b3a-91d11b556b75", // #gitleaks:allow
} as BannerShape;

const fetchBanners = jest.fn();
const updateBanner = jest.fn();
const deleteBanner = jest.fn();
const bannerMethods = {
  fetchBanners,
  updateBanner,
  deleteBanner,
};

describe("<AdminPage />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the current banners under subheaders", async () => {
    useStore.setState({
      allBanners: [
        mockBannerQms,
        mockBannerHome3,
        mockBannerHome1,
        mockBannerHome2,
      ],
      ...bannerMethods,
    });

    render(<AdminPage />);
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: "Current Banners", level: 2 })
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Home page", level: 3 })
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "QMS report dashboard", level: 3 })
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "CI report dashboard", level: 3 })
    ).not.toBeInTheDocument();

    const bannerPreviews = screen.getAllByRole("alert");
    expect(bannerPreviews[0]).toHaveTextContent("Home Alert - past");
    expect(bannerPreviews[1]).toHaveTextContent("Home Alert - present");
    expect(bannerPreviews[2]).toHaveTextContent("Home Alert - future");

    expect(bannerPreviews[3]).toHaveTextContent("QMS Alert");
    expect(bannerPreviews[3]).toHaveTextContent("mock description");
    expect(
      screen.getByRole("link", { name: "https://example.com/qms-alert" })
    ).toBeVisible();
  });

  it("should delete banners on button click", async () => {
    useStore.setState({
      allBanners: [mockBannerHome1, mockBannerHome2],
      ...bannerMethods,
    });

    render(<AdminPage />);
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", {
      name: "Delete banner titled Home Alert - present",
    });
    await userEvent.click(deleteButton);

    expect(deleteBanner).toHaveBeenCalledWith(mockBannerHome2.key);
  });

  it("should display an empty state when there are no banners", async () => {
    useStore.setState({ allBanners: [], ...bannerMethods });

    render(<AdminPage />);
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("There are no existing banners.")).toBeVisible();
  });

  it("should display expired banner status", async () => {
    useStore.setState({ allBanners: [mockBannerHome1], ...bannerMethods });
    const dates = `${reformatDate(mockBannerHome1.startDate)} - ${reformatDate(mockBannerHome1.endDate)}`;

    render(<AdminPage />);
    await screen.findByText("Expired");

    expect(screen.getByText(dates, { exact: false })).toBeVisible();
  });

  it("should display active banner status", async () => {
    useStore.setState({ allBanners: [mockBannerHome2], ...bannerMethods });
    const dates = `${reformatDate(mockBannerHome2.startDate)} - ${reformatDate(mockBannerHome2.endDate)}`;

    render(<AdminPage />);
    await screen.findByText("Active");

    expect(screen.getByText(dates, { exact: false })).toBeVisible();
  });

  it("should display scheduled banner status", async () => {
    useStore.setState({ allBanners: [mockBannerHome3], ...bannerMethods });
    const dates = `${reformatDate(mockBannerHome3.startDate)} - ${reformatDate(mockBannerHome3.endDate)}`;

    render(<AdminPage />);
    await screen.findByText("Scheduled");

    expect(screen.getByText(dates, { exact: false })).toBeVisible();
  });

  testA11y(<AdminPage />, () => {
    useStore.setState({
      allBanners: [
        mockBannerQms,
        mockBannerHome1,
        mockBannerHome2,
        mockBannerHome3,
      ],
    });
  });

  testA11y(<AdminPage />, () => {
    useStore.setState({ allBanners: [] });
  });
});
