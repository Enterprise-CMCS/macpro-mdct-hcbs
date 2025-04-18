import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusTableElement } from "./StatusTable";
import { MemoryRouter } from "react-router-dom";
import { useStore } from "utils";
import {
  mockUseReadOnlyUserStore,
  mockStateUserStore,
} from "utils/testing/setupJest";
import { PageStatus } from "types";

jest.mock("utils", () => ({
  useStore: jest.fn(),
  submitReport: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: jest.fn().mockReturnValue({
    viewPdf: true,
  }),
}));

const report = {
  type: "QMS",
  id: "mock-report-id",
  state: "CO",
  pages: [
    { childPageIds: ["1", "2"] },
    { title: "Section 1", id: "id-1" },
    { title: "Section 2", id: "id-2" },
  ],
};

const mockPageMap = new Map();
mockPageMap.set("root", 0);
mockPageMap.set("1", 1);
mockPageMap.set("2", 2);

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
const mockSetModalComponent = jest.fn();

describe("StatusTable with state user", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseStore.mockImplementation((selector: Function | undefined) => {
      if (selector) {
        return {
          sections: [
            {
              section: { title: "Section 1", id: "id-1" },
              displayStatus: PageStatus.COMPLETE,
              submittable: true,
            },
            {
              section: { title: "Section 2", id: "id-2" },
              displayStatus: PageStatus.IN_PROGRESS,
              submittable: false,
            },
          ],
          submittable: true,
        };
      }
      return {
        ...mockStateUserStore,
        pageMap: mockPageMap,
        report: report,
        setModalComponent: mockSetModalComponent,
      };
    });
  });

  test("table with section titles and status icons render", () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    // Table headers
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Section title and status for Section 1
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByAltText("complete icon")).toBeInTheDocument();
  });

  test("when the Edit button is clicked, navigate to the correct editable page", async () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const editButton = screen.getAllByRole("button", { name: /Edit/i })[0];
    await userEvent.click(editButton);

    expect(editButton).toBeVisible();
  });
  test("when the Review PDF button is clicked, navigate to PDF", async () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const reviewPdfButton = screen.getByRole("link", { name: /Review PDF/i });

    const PdfPath = `/report/${report.type}/${report.state}/${report.id}/export`;
    expect(reviewPdfButton).toHaveAttribute("href", PdfPath);
    expect(reviewPdfButton).toHaveAttribute("target", "_blank");
  });

  test("when the Submit button is clicked, call the API", async () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const submitButton = screen.getAllByRole("button", {
      name: /Submit QMS Report/i,
    })[0];
    await userEvent.click(submitButton);

    expect(mockSetModalComponent).toBeCalled();
  });

  test("if pageMap is not defined return null", () => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      pageMap: null,
    });

    const { container } = render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("StatusPage with Read only user", () => {
  beforeEach(() => {
    mockedUseStore.mockImplementation((selector: Function | undefined) => {
      if (selector) {
        return {
          sections: [
            {
              section: { title: "Section 1", id: "id-1" },
              displayStatus: PageStatus.COMPLETE,
              submittable: true,
            },
            {
              section: { title: "Section 2", id: "id-2" },
              displayStatus: PageStatus.IN_PROGRESS,
              submittable: false,
            },
          ],
          submittable: true,
        };
      }
      return {
        ...mockUseReadOnlyUserStore,
        pageMap: mockPageMap,
        report: report,
        setModalComponent: mockSetModalComponent,
      };
    });
  });
  it("should not render the Submit QMS Report button when user is read only", async () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const submitButton = screen.queryByText("Submit QMS Report");
    expect(submitButton).not.toBeInTheDocument();
  });
});
