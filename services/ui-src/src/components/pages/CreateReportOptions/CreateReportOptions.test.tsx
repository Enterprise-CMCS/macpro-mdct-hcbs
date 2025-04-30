import { CreateReportOptions } from "./CreateReportOptions";
import { testA11y } from "utils/testing/commonTests";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe("CreateReportOptions", () => {
  testA11y(<CreateReportOptions />);
});
