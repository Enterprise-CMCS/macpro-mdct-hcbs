import { proxyEvent } from "../../testing/proxyEvent";
import { parseReportTypeAndState, parseReportParameters } from "../param-lib";

describe("Path parameter parsing", () => {
  describe("parseReportTypeAndState", () => {
    it("should validate report type and state", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QM", state: "CO" },
      };
      const result = parseReportTypeAndState(event);
      expect(result.allParamsValid).toBe(true);
      expect(result.reportType).toBe("QM");
      expect(result.state).toBe("CO");
    });

    it("should return false for invalid report type", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "XX", state: "CO" },
      };
      const result = parseReportTypeAndState(event);
      expect(result.allParamsValid).toBe(false);
      expect(result.reportType).toBe(undefined);
      expect(result.state).toBe(undefined);
    });

    it("should return false for invalid state", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QM", state: "XX" },
      };
      const result = parseReportTypeAndState(event);
      expect(result.allParamsValid).toBe(false);
      expect(result.reportType).toBe(undefined);
      expect(result.state).toBe(undefined);
    });
  });

  describe("parseReportParameters", () => {
    it("should validate report type and state", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QM", state: "CO", id: "foo" },
      };
      const result = parseReportParameters(event);
      expect(result.allParamsValid).toBe(true);
      expect(result.reportType).toBe("QM");
      expect(result.state).toBe("CO");
      expect(result.id).toBe("foo");
    });

    it("should return false for invalid report type", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "XX", state: "CO", id: "foo" },
      };
      const result = parseReportParameters(event);
      expect(result.allParamsValid).toBe(false);
      expect(result.reportType).toBe(undefined);
      expect(result.state).toBe(undefined);
      expect(result.id).toBe(undefined);
    });

    it("should return false for invalid state", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QM", state: "XX", id: "foo" },
      };
      const result = parseReportParameters(event);
      expect(result.allParamsValid).toBe(false);
      expect(result.reportType).toBe(undefined);
      expect(result.state).toBe(undefined);
      expect(result.id).toBe(undefined);
    });

    it("should return false for missing report ID", () => {
      const event = {
        ...proxyEvent,
        pathParameters: { reportType: "QM", state: "CO" },
      };
      const result = parseReportParameters(event);
      expect(result.allParamsValid).toBe(false);
      expect(result.reportType).toBe(undefined);
      expect(result.state).toBe(undefined);
      expect(result.id).toBe(undefined);
    });
  });
});
