import { render, screen } from "@testing-library/react";
import { AdminBannerForm } from "components";
import { RouterWrappedComponent } from "utils/testing/mockRouter";
import userEvent from "@testing-library/user-event";
import { testA11yAct } from "utils/testing/commonTests";
import { AdminBannerMethods } from "types";

const mockWriteAdminBanner = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const adminBannerFormComponent = (
  writeAdminBanner: AdminBannerMethods["writeAdminBanner"]
) => (
  <RouterWrappedComponent>
    <AdminBannerForm writeAdminBanner={writeAdminBanner} />
  </RouterWrappedComponent>
);

const HOURS = 60 * 60 * 1000;

describe("<AdminBannerForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AdminBannerForm is visible", () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));
    expect(screen.getByRole("textbox", { name: "Title text" })).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: "Description text" })
    ).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Link" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Start date" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "End date" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Replace Current Banner" })
    ).toBeVisible();
  });

  test("AdminBannerForm can be filled and submitted without error", async () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));

    const titleInput = screen.getByLabelText("Title text");
    await userEvent.type(titleInput, "mock title");

    const descriptionInput = screen.getByLabelText("Description text");
    await userEvent.type(descriptionInput, "mock description");

    const linkInput = screen.getByLabelText("Link", { exact: false });
    await userEvent.type(linkInput, "http://example.com");

    const startDateInput = screen.getByLabelText("Start date");
    await userEvent.type(startDateInput, "01/01/1970");

    const endDateInput = screen.getByLabelText("End date");
    // Modified: End date must be after start date
    await userEvent.type(endDateInput, "01/02/1970");

    const submitButton = screen.getByText("Replace Current Banner");
    await userEvent.click(submitButton);

    expect(mockWriteAdminBanner).toHaveBeenCalledWith({
      key: "admin-banner-id",
      title: "mock title",
      description: "mock description",
      link: "http://example.com",
      startDate: 5 * HOURS, // midnight UTC, in New York
      endDate: 53 * HOURS - 1000, // End of the next day in NY
    });
  });

  testA11yAct(adminBannerFormComponent(mockWriteAdminBanner));
});

describe("AdminBannerForm validation", () => {
  test("Display form errors when user tries to submit completely blank form", async () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));

    const submitButton = screen.getByText("Replace Current Banner");
    await userEvent.click(submitButton);

    const responseIsRequiredErrorMessage = screen.getAllByText(
      "A response is required",
      { exact: false }
    );
    expect(responseIsRequiredErrorMessage[0]).toBeVisible();
    expect(responseIsRequiredErrorMessage.length).toBe(4);
  });

  test("User has form errors but then fills out the form and errors go away", async () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));

    const submitButton = screen.getByText("Replace Current Banner");
    const titleInput = screen.getByLabelText("Title text");
    const descriptionInput = screen.getByLabelText("Description text");
    const linkInput = screen.getByLabelText("Link", { exact: false });
    const startDateInput = screen.getByLabelText("Start date");
    const endDateInput = screen.getByLabelText("End date");

    // User clicks submit button without filling any fields in
    await userEvent.click(submitButton);
    const responseIsRequiredErrorMessage = screen.getAllByText(
      "A response is required",
      { exact: false }
    );

    expect(responseIsRequiredErrorMessage[0]).toBeVisible();
    expect(responseIsRequiredErrorMessage.length).toBe(4);

    // User then fills in all the fields and is able to submit
    await userEvent.type(titleInput, "mock title");
    await userEvent.type(descriptionInput, "mock description");
    await userEvent.type(linkInput, "http://example.com");
    await userEvent.type(startDateInput, "01/01/1970");
    await userEvent.type(endDateInput, "01/02/1970");
    await userEvent.click(submitButton);

    // Errors go away when user fills out all fields
    expect(
      screen.queryAllByText("A response is required", { exact: false })
    ).toStrictEqual([]);

    // Ensure that the error message for the end date is not displayed
    expect(
      screen.queryByText("End date can't be before start date")
    ).not.toBeInTheDocument();

    expect(mockWriteAdminBanner).toHaveBeenCalledWith({
      key: "admin-banner-id",
      title: "mock title",
      description: "mock description",
      link: "http://example.com",
      startDate: 5 * HOURS, // midnight UTC, in New York
      endDate: 53 * HOURS - 1000, // Expected end date for 01/02/1970
    });
  });
});
