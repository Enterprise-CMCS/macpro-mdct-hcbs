import { render, screen, act } from "@testing-library/react";
import { ApiProvider } from "./ApiProvider";

const TestComponent = () => <div>Test</div>;

const testComponent = (
  <ApiProvider>
    <TestComponent />
  </ApiProvider>
);

describe("<ApiProvider />", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  test("ApiProvider renders children", () => {
    expect(screen.getByText("Test")).toBeVisible();
  });
});
