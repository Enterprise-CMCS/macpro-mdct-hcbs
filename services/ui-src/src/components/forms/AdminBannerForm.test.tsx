import { act, render, screen } from "@testing-library/react";
import { AdminBannerForm } from "components";
import { RouterWrappedComponent } from "utils/testing/mockRouter";
import userEvent from "@testing-library/user-event";
import { testA11y } from "utils/testing/commonTests";

const mockWriteAdminBanner = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const adminBannerFormComponent = (writeAdminBanner: Function) => (
  <RouterWrappedComponent>
    <AdminBannerForm writeAdminBanner={writeAdminBanner} />
  </RouterWrappedComponent>
);

describe("<AdminBannerForm />", () => {
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

    await act(async () => {
      const titleInput = screen.getByLabelText("Title text");
      await userEvent.type(titleInput, "mock title");

      const descriptionInput = screen.getByLabelText("Description text");
      await userEvent.type(descriptionInput, "mock description");

      const linkInput = screen.getByLabelText("Link", { exact: false });
      await userEvent.type(linkInput, "http://example.com");

      const startDateInput = screen.getByLabelText("Start date");
      await userEvent.type(startDateInput, "01/01/1970");

      const endDateInput = screen.getByLabelText("End date");
      await userEvent.type(endDateInput, "01/01/1970");

      const submitButton = screen.getByText("Replace Current Banner");
      await userEvent.click(submitButton);
    });

    const HOURS = 60 * 60 * 1000;

    expect(mockWriteAdminBanner).toHaveBeenCalledWith({
      key: "admin-banner-id",
      title: "mock title",
      description: "mock description",
      link: "http://example.com",
      startDate: 5 * HOURS, // midnight UTC, in New York
      endDate: 29 * HOURS - 1000, // 1 second before midnight of the next day
    });
  });

  test("AdminBannerForm shows an error when submit fails", async () => {
    mockWriteAdminBanner.mockImplementationOnce(() => {
      throw new Error("FAILURE");
    });

    render(adminBannerFormComponent(mockWriteAdminBanner));

    await act(async () => {
      const titleInput = screen.getByLabelText("Title text");
      await userEvent.type(titleInput, "mock title");

      const descriptionInput = screen.getByLabelText("Description text");
      await userEvent.type(descriptionInput, "mock description");

      const linkInput = screen.getByLabelText("Link", { exact: false });
      await userEvent.type(linkInput, "http://example.com");

      const startDateInput = screen.getByLabelText("Start date");
      await userEvent.type(startDateInput, "01/01/1970");

      const endDateInput = screen.getByLabelText("End date");
      await userEvent.type(endDateInput, "01/01/1970");

      const submitButton = screen.getByText("Replace Current Banner");
      await userEvent.click(submitButton);
    });

    const errorMessage = screen.getByText(
      "Current banner could not be replaced",
      { exact: false }
    );

    //REVISIT: .toBeVisible isn't working correctly
    expect(errorMessage).toBeInTheDocument();
  });

  testA11y(adminBannerFormComponent(mockWriteAdminBanner));
});

describe("AdminBannerForm validation", () => {
  test("Display form errors when user tries to submit completely blank form", async () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));

    const submitButton = screen.getByText("Replace Current Banner");
    await act(async () => await userEvent.click(submitButton));

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

    await act(async () => {
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
      await userEvent.type(endDateInput, "01/01/1970");
      await userEvent.click(submitButton);
      // Errors go away when user fills out all fields
      expect(responseIsRequiredErrorMessage[0]).not.toBeVisible();
    });

    const HOURS = 60 * 60 * 1000;

    expect(mockWriteAdminBanner).toHaveBeenCalledWith({
      key: "admin-banner-id",
      title: "mock title",
      description: "mock description",
      link: "http://example.com",
      startDate: 5 * HOURS, // midnight UTC, in New York
      endDate: 29 * HOURS - 1000, // 1 second before midnight of the next day
    });
  });
});
