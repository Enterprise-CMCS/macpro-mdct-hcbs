import { render, screen } from "@testing-library/react";
import { AdminBannerForm } from "components";
import userEvent from "@testing-library/user-event";
import { testA11yAct } from "utils/testing/commonTests";

const mockWriteAdminBanner = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("<AdminBannerForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AdminBannerForm can be filled and submitted without error", async () => {
    render(<AdminBannerForm updateBanner={mockWriteAdminBanner} />);

    // It is frustrating that this is a button + list, instead of an combobox.
    // Why, CMSDS, have you done this? Is it better? How?
    const dropdown = screen.getByRole("button", { name: /Site area/ });
    await userEvent.click(dropdown);
    const qmsOption = screen.getByRole("option", { name: /QMS report/ });
    await userEvent.click(qmsOption);

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

    const submitButton = screen.getByText("Create Banner");
    await userEvent.click(submitButton);

    expect(mockWriteAdminBanner).toHaveBeenCalledWith({
      area: "QMS",
      title: "mock title",
      description: "mock description",
      link: "http://example.com",
      startDate: "1970-01-01",
      endDate: "1970-01-02",
    });
  });

  testA11yAct(<AdminBannerForm updateBanner={mockWriteAdminBanner} />);
});

describe("AdminBannerForm validation", () => {
  test("Display form errors when user tries to submit completely blank form", async () => {
    render(<AdminBannerForm updateBanner={mockWriteAdminBanner} />);

    const submitButton = screen.getByText("Create Banner");
    await userEvent.click(submitButton);

    const responseIsRequiredErrorMessage = screen.getAllByText(
      "A response is required",
      { exact: false }
    );
    expect(responseIsRequiredErrorMessage[0]).toBeVisible();
    expect(responseIsRequiredErrorMessage.length).toBe(4);
  });

  test("User has form errors but then fills out the form and errors go away", async () => {
    render(<AdminBannerForm updateBanner={mockWriteAdminBanner} />);

    const submitButton = screen.getByText("Create Banner");
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
      area: "home",
      title: "mock title",
      description: "mock description",
      link: "http://example.com",
      startDate: "1970-01-01",
      endDate: "1970-01-02",
    });
  });
});
