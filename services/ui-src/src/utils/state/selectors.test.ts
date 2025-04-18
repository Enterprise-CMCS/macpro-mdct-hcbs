import { mockUseStore } from "utils/testing/setupJest";
import { currentPageSelector, submittableMetricsSelector } from "./selectors";
import { PageStatus } from "types";

describe("Selectors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getCurrentPage should return the current page object", async () => {
    const page = currentPageSelector(mockUseStore);

    expect(page?.id).toEqual(mockUseStore.currentPageId);
  });

  test("submittableMetricsSelector should return the readiness of the report", async () => {
    const result = submittableMetricsSelector(mockUseStore);

    expect(result?.sections[0]?.submittable).toEqual(false);
    expect(result?.sections[0]?.displayStatus).toEqual(PageStatus.IN_PROGRESS);
    expect(result?.submittable).toEqual(false);
  });
});
