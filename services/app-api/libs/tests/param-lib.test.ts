import { proxyEvent } from "../../testing/proxyEvent";
import { parseReportTypeAndState, parseReportParameters } from "../param-lib";

describe("Path parameter parsing", () => {
  describe("parseReportTypeAndState", () => {
    it("should validate report type and state", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QMS", state: "CO" },
      };
      const result = parseReportTypeAndState(event)!;
      expect(result).toBeDefined();
      expect(result.reportType).toBe("QMS");
      expect(result.state).toBe("CO");
    });

    it("should return false for invalid report type", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "XX", state: "CO" },
      };
      const result = parseReportTypeAndState(event);
      expect(result).toBeUndefined();
    });

    it("should return false for invalid state", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QMS", state: "XX" },
      };
      const result = parseReportTypeAndState(event);
      expect(result).toBeUndefined();
    });
  });

  describe("parseReportParameters", () => {
    it("should validate report type and state", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QMS", state: "CO", id: "foo" },
      };
      const result = parseReportParameters(event)!;
      expect(result).toBeDefined();
      expect(result.reportType).toBe("QMS");
      expect(result.state).toBe("CO");
      expect(result.id).toBe("foo");
    });

    it("should return false for invalid report type", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "XX", state: "CO", id: "foo" },
      };
      const result = parseReportParameters(event);
      expect(result).toBeUndefined();
    });

    it("should return false for invalid state", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QMS", state: "XX", id: "foo" },
      };
      const result = parseReportParameters(event);
      expect(result).toBeUndefined();
    });

    it("should return false for missing report ID", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QMS", state: "CO" },
      };
      const result = parseReportParameters(event);
      expect(result).toBeUndefined();
    });
  });
});
