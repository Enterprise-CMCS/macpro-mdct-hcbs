import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFlags } from "launchdarkly-react-client-sdk";
import { AddEditEmailModal } from "./AddEditEmailModal";
import { ErrorMessages, StateNames } from "../../../constants";
import { getReportName, ReportType } from "types/report";
import { NotificationAssignment } from "types/notification";
import { testA11y } from "utils/testing/commonTests";

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn(),
}));

const onClose = vi.fn();
const onSubmit = vi.fn();
const modal = (
  <AddEditEmailModal
    modalDisclosure={{ isOpen: true, onClose }}
    onSubmit={onSubmit}
  />
);

const selectOptions = async (label: string, options: string[]) => {
  await userEvent.click(screen.getByRole("button", { name: label }));
  const menu = within(await screen.findByRole("menu"));
  for (const name of options) {
    await userEvent.click(menu.getByText(name));
  }
  await userEvent.keyboard("{Escape}");
};

const completeForm = async () => {
  await userEvent.click(screen.getByRole("textbox", { name: "Email" }));
  await userEvent.paste("po@example.com");
  await selectOptions("States, 0 selected", ["Alabama", "Alaska"]);
  await selectOptions("Report Types, 0 selected", [
    `${ReportType.HA}: ${getReportName(ReportType.HA)}`,
    `${ReportType.QIP}: ${getReportName(ReportType.QIP)}`,
  ]);
};

const getVisibleMenuOptions = async () => {
  const menu = await screen.findByRole("menu");
  await waitFor(() => expect(menu).toBeVisible());
  return within(menu)
    .getAllByRole("menuitemcheckbox")
    .map((option) => option.textContent);
};

describe("<AddEditEmailModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onSubmit.mockReset();
    onSubmit.mockResolvedValue(undefined);
    vi.mocked(useFlags).mockReturnValue({
      isQmsReportActive: true,
      isHaReportActive: true,
      isQipReportActive: true,
      isCiReportActive: false,
      isPcpReportActive: false,
      isImaReportActive: false,
      isWwlReportActive: false,
    });
  });

  it("shows required errors without saving an empty form", async () => {
    render(modal);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getAllByText(ErrorMessages.requiredResponse)).toHaveLength(3);
    for (const error of screen.getAllByText(ErrorMessages.requiredResponse)) {
      expect(error).toHaveClass("ds-c-inline-error");
      expect(error.querySelector("svg")).toBeInTheDocument();
    }
    for (const label of ["States, 0 selected", "Report Types, 0 selected"]) {
      expect(
        screen.getByRole("button", { name: label })
      ).toHaveAccessibleDescription(`Error: ${ErrorMessages.requiredResponse}`);
    }
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("lists states from constants and all available report types", async () => {
    render(modal);
    await userEvent.click(
      screen.getByRole("button", { name: "States, 0 selected" })
    );
    expect(await getVisibleMenuOptions()).toEqual(Object.values(StateNames));
    await userEvent.keyboard("{Escape}");
    await userEvent.click(
      screen.getByRole("button", { name: "Report Types, 0 selected" })
    );
    expect(await getVisibleMenuOptions()).toEqual(
      [ReportType.QMS, ReportType.HA, ReportType.QIP].map(
        (type) => `${type}: ${getReportName(type)}`
      )
    );
  });

  it("lists all reports when their feature flags are enabled", async () => {
    vi.mocked(useFlags).mockReturnValue({
      isQmsReportActive: true,
      isQipReportActive: true,
      isHaReportActive: true,
      isCiReportActive: true,
      isPcpReportActive: true,
      isImaReportActive: true,
      isWwlReportActive: true,
    });
    render(modal);
    await userEvent.click(
      screen.getByRole("button", { name: "Report Types, 0 selected" })
    );
    expect(await getVisibleMenuOptions()).toEqual(
      Object.values(ReportType).map((type) => `${type}: ${getReportName(type)}`)
    );
  });

  it("hides reports when feature flags are unavailable", async () => {
    vi.mocked(useFlags).mockReturnValue({});
    render(modal);
    await userEvent.click(
      screen.getByRole("button", { name: "Report Types, 0 selected" })
    );
    expect(screen.queryByRole("menuitemcheckbox")).not.toBeInTheDocument();
  });

  it("saves multiple selected states and reports, then closes", async () => {
    render(modal);
    await completeForm();
    expect(
      screen.getByRole("button", { name: "States, 2 selected" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Report Types, 2 selected" })
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "po@example.com",
        states: ["AL", "AK"],
        reports: [ReportType.HA, ReportType.QIP],
      });
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  it("validates email format and keeps the modal open", async () => {
    render(modal);
    await completeForm();
    await userEvent.clear(screen.getByRole("textbox", { name: "Email" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Email" }),
      "invalid"
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText(ErrorMessages.mustBeAnEmail)).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("requires a state after all selected states are deselected", async () => {
    render(modal);
    await selectOptions("States, 0 selected", ["Alabama", "Alaska"]);
    expect(
      screen.getByRole("button", { name: "States, 2 selected" })
    ).toBeVisible();
    await selectOptions("States, 2 selected", ["Alabama", "Alaska"]);
    const states = screen.getByRole("button", { name: "States, 0 selected" });
    expect(states).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(states).toHaveAccessibleDescription(
      `Error: ${ErrorMessages.requiredResponse}`
    );
    expect(states).toHaveAttribute("aria-invalid", "true");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("disables saving while submission is pending", async () => {
    let resolveSubmission: () => void = () => {
      throw new Error("Submission has not started");
    };
    onSubmit.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmission = resolve;
        })
    );
    render(modal);
    await completeForm();
    const save = screen.getByRole("button", { name: "Save" });
    await userEvent.click(save);
    expect(save).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(save);
    expect(onSubmit).toHaveBeenCalledOnce();
    await act(async () => resolveSubmission());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("displays submission errors and allows retrying", async () => {
    onSubmit.mockRejectedValueOnce(
      new Error("Saving assignments is not available yet.")
    );
    render(modal);
    await completeForm();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Saving assignments is not available yet."
    );
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it.each(["Cancel", "Close"])(
    "closes with %s without saving",
    async (name) => {
      render(modal);
      await userEvent.click(screen.getByRole("button", { name }));
      expect(onClose).toHaveBeenCalledOnce();
      expect(onSubmit).not.toHaveBeenCalled();
    }
  );

  testA11y(modal);

  it("keeps the short scrollable options list in the form layout", async () => {
    render(modal);
    await userEvent.click(
      screen.getByRole("button", { name: "States, 0 selected" })
    );
    const menu = await screen.findByRole("menu");
    expect(menu).toHaveStyle({ maxHeight: "8rem", overflowY: "auto" });
    expect(menu.parentElement).toHaveStyle({
      display: "contents",
    });
    await userEvent.keyboard("{Escape}");
    expect(menu.parentElement).toHaveStyle({ display: "none" });
  });

  const assignment: NotificationAssignment = {
    email: "po@example.com",
    states: ["AL", "AK"],
    reports: [ReportType.HA, ReportType.IMA],
  };

  it("prefills edit mode, disables email, and saves changed selections", async () => {
    render(
      <AddEditEmailModal
        modalDisclosure={{ isOpen: true, onClose }}
        assignment={assignment}
        onSubmit={onSubmit}
      />
    );
    await waitFor(() =>
      expect(
        screen.getByRole("dialog", { name: "Edit Assignments" })
      ).toBeVisible()
    );
    expect(
      screen.getByText(
        "Edit states and reports assigned to the email displayed below to receive notifications."
      )
    ).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
      assignment.email
    );
    expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled();
    await selectOptions("States, 2 selected", ["Alabama"]);
    await selectOptions("Report Types, 2 selected", [
      `${ReportType.HA}: ${getReportName(ReportType.HA)}`,
    ]);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        email: assignment.email,
        states: ["AK"],
        reports: [ReportType.IMA],
      })
    );
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("requires selections in edit mode and cancels without saving", async () => {
    render(
      <AddEditEmailModal
        modalDisclosure={{ isOpen: true, onClose }}
        assignment={assignment}
        onSubmit={onSubmit}
      />
    );
    await selectOptions("States, 2 selected", ["Alabama", "Alaska"]);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText(ErrorMessages.requiredResponse)).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
