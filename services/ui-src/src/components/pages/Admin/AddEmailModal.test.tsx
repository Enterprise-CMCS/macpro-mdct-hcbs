import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFlags } from "launchdarkly-react-client-sdk";
import { AddEmailModal } from "./AddEmailModal";
import { ErrorMessages, StateNames } from "../../../constants";
import { getReportName, ReportType } from "types/report";
import { testA11y } from "utils/testing/commonTests";

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn(),
}));

const onClose = vi.fn();
const onSubmit = vi.fn();
const modal = (
  <AddEmailModal
    modalDisclosure={{ isOpen: true, onClose }}
    onSubmit={onSubmit}
  />
);

const selectOptions = async (label: string, options: string[]) => {
  await userEvent.click(
    screen.getByRole("button", { name: new RegExp(`^${label}`) })
  );
  const menu = within(await screen.findByRole("menu"));
  for (const name of options) {
    await userEvent.click(menu.getByRole("menuitemcheckbox", { name }));
  }
  await userEvent.keyboard("{Escape}");
};

const completeForm = async () => {
  await userEvent.type(
    screen.getByRole("textbox", { name: /Email/ }),
    "po@example.com"
  );
  await selectOptions("States", ["Alabama", "Alaska"]);
  await selectOptions("Report Types", [
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

describe("<AddEmailModal />", () => {
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
    const user = userEvent.setup();
    render(modal);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getAllByText(ErrorMessages.requiredResponse)).toHaveLength(3);
    for (const error of screen.getAllByText(ErrorMessages.requiredResponse)) {
      expect(error).toHaveClass("ds-c-inline-error");
      expect(error.querySelector("svg")).toBeInTheDocument();
    }
    for (const label of ["States", "Report Types"]) {
      expect(
        screen.getByRole("button", { name: new RegExp(`^${label}`) })
      ).toHaveAccessibleDescription(/A response is required/);
    }
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows state and report labels without required asterisks", () => {
    render(modal);
    expect(screen.getByText("States", { selector: "label" }).textContent).toBe(
      "States"
    );
    expect(
      screen.getByText("Report Types", { selector: "label" }).textContent
    ).toBe("Report Types");
  });

  it("lists states from constants and all available report types", async () => {
    const user = userEvent.setup();
    render(modal);
    await user.click(screen.getByRole("button", { name: /^States/ }));
    expect(await getVisibleMenuOptions()).toEqual(Object.values(StateNames));
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /^Report Types/ }));
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
    const user = userEvent.setup();
    render(modal);
    await user.click(screen.getByRole("button", { name: /^Report Types/ }));
    expect(await getVisibleMenuOptions()).toEqual(
      Object.values(ReportType).map((type) => `${type}: ${getReportName(type)}`)
    );
  });

  it("hides reports when feature flags are unavailable", async () => {
    vi.mocked(useFlags).mockReturnValue({});
    const user = userEvent.setup();
    render(modal);
    await user.click(screen.getByRole("button", { name: /^Report Types/ }));
    expect(screen.queryByRole("menuitemcheckbox")).not.toBeInTheDocument();
  });

  it("saves multiple selected states and reports, then closes", async () => {
    const user = userEvent.setup();
    render(modal);
    await completeForm();
    expect(screen.getByRole("button", { name: /States \(2\)/ })).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Report Types \(2\)/ })
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Save" }));
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
    const user = userEvent.setup();
    render(modal);
    await completeForm();
    await user.clear(screen.getByRole("textbox", { name: /Email/ }));
    await user.type(screen.getByRole("textbox", { name: /Email/ }), "invalid");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText(ErrorMessages.mustBeAnEmail)).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("requires a state after all selected states are deselected", async () => {
    const user = userEvent.setup();
    render(modal);
    await completeForm();
    await selectOptions("States", ["Alabama", "Alaska"]);
    expect(screen.getByRole("button", { name: /States \(0\)/ })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText(ErrorMessages.requiredResponse)).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
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
    const user = userEvent.setup();
    render(modal);
    await completeForm();
    const save = screen.getByRole("button", { name: "Save" });
    await user.click(save);
    expect(save).toBeDisabled();
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
    await user.click(save);
    expect(onSubmit).toHaveBeenCalledOnce();
    await act(async () => resolveSubmission());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("displays submission errors and allows retrying", async () => {
    const user = userEvent.setup();
    onSubmit.mockRejectedValueOnce(
      new Error("Saving assignments is not available yet.")
    );
    render(modal);
    await completeForm();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Saving assignments is not available yet."
    );
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it.each(["Cancel", /Close/])(
    "closes with %s without saving",
    async (name) => {
      const user = userEvent.setup();
      render(modal);
      await user.click(screen.getByRole("button", { name }));
      expect(onClose).toHaveBeenCalledOnce();
      expect(onSubmit).not.toHaveBeenCalled();
    }
  );

  testA11y(modal);
});
