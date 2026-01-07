import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import { ElementType, EligibilityTableTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";
import { EligibilityTableElement } from "components/report/WwlComponents/EligibilityTable";

const mockedElement: EligibilityTableTemplate = {
  id: "mock-id",
  type: ElementType.EligibilityTable,
  answer: [
    {
      title: "mockTitle1",
      description: "mockDescription1",
      recheck: "Yes",
      frequency: "Annually",
      eligibilityUpdate: "No",
    },
  ],
};
const updateSpy = jest.fn();

const EligibilityTableWrapper = ({
  template,
}: {
  template: EligibilityTableTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <EligibilityTableElement element={element} updateElement={onChange} />;
};

describe("<EligibilityTableElement />", () => {
  describe("Test EligibilityTableElement component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("EligibilityTableElement is visible", () => {
      render(<EligibilityTableWrapper template={mockedElement} />);
      expect(screen.getByText("Other Eligibility")).toBeInTheDocument();
    });

    // test("Rate should calculate", async () => {
    //   render(<NdrBasicWrapper template={mockedElement} />);

    //   const numerator = screen.getByRole("textbox", { name: "Numerator" });
    //   await userEvent.type(numerator, "1");
    //   expect(numerator).toHaveValue("1");

    //   const denominator = screen.getByRole("textbox", { name: "Denominator" });
    //   await userEvent.type(denominator, "2");
    //   expect(denominator).toHaveValue("2");

    //   const result = screen.getByRole("textbox", { name: "Result" });
    //   expect(result).toHaveValue("50");
    // });

    // test("Rate should not display a decimal point if it is not needed", async () => {
    //   render(<NdrBasicWrapper template={mockedElement} />);

    //   const numerator = screen.getByRole("textbox", { name: "Numerator" });
    //   await userEvent.type(numerator, "27");

    //   const denominator = screen.getByRole("textbox", { name: "Denominator" });
    //   await userEvent.type(denominator, "3");

    //   const result = screen.getByRole("textbox", { name: "Result" });
    //   expect(result).toHaveValue("900");
    // });

    // test("Rate should not display as a percent normally", async () => {
    //   render(
    //     <NdrBasicWrapper
    //       template={{ ...mockedElement, displayRateAsPercent: false }}
    //     />
    //   );

    //   const numerator = screen.getByRole("textbox", { name: "Numerator" });
    //   await userEvent.type(numerator, "1");

    //   const denominator = screen.getByRole("textbox", { name: "Denominator" });
    //   await userEvent.type(denominator, "2");

    //   expect(screen.getByRole("textbox", { name: "Result" })).toHaveValue("50");
    //   expect(screen.queryByText("%")).not.toBeInTheDocument();
    // });

    // test("Rate should display as a percent when appropriate", async () => {
    //   render(
    //     <NdrBasicWrapper
    //       template={{ ...mockedElement, displayRateAsPercent: true }}
    //     />
    //   );

    //   const numerator = screen.getByRole("textbox", { name: "Numerator" });
    //   await userEvent.type(numerator, "1");

    //   const denominator = screen.getByRole("textbox", { name: "Denominator" });
    //   await userEvent.type(denominator, "2");

    //   expect(screen.getByRole("textbox", { name: "Result" })).toHaveValue("50");
    //   expect(screen.getByText("%")).toBeVisible();
    // });

    // test("Rate should display trailing decimal places if the value is rounded to 0", async () => {
    //   render(<NdrBasicWrapper template={mockedElement} />);

    //   const numerator = screen.getByRole("textbox", { name: "Numerator" });
    //   await userEvent.type(numerator, "4");

    //   const denominator = screen.getByRole("textbox", { name: "Denominator" });
    //   await userEvent.type(denominator, "2000");

    //   const result = screen.getByRole("textbox", { name: "Result" });
    //   expect(result).toHaveValue("0.2");
    // });
  });

  //   describe("NDRBasicExport", () => {
  //     it("should render a normal rate", () => {
  //       render(
  //         NDRBasicExport({
  //           ...mockedElement,
  //           displayRateAsPercent: false,
  //           answer: {
  //             numerator: 1,
  //             denominator: 2,
  //             rate: 50,
  //           },
  //         })
  //       );
  //       expect(screen.getByRole("row", { name: "Numerator 1" })).toBeVisible();
  //       expect(screen.getByRole("row", { name: "Denominator 2" })).toBeVisible();
  //       expect(screen.getByRole("row", { name: "Result 50" })).toBeVisible();
  //       expect(screen.queryByText("%", { exact: false })).not.toBeInTheDocument();
  //     });

  //     it("should render a percentage", () => {
  //       render(
  //         NDRBasicExport({
  //           ...mockedElement,
  //           displayRateAsPercent: true,
  //           answer: {
  //             numerator: 1,
  //             denominator: 2,
  //             rate: 50,
  //           },
  //         })
  //       );
  //       expect(screen.getByRole("row", { name: "Numerator 1" })).toBeVisible();
  //       expect(screen.getByRole("row", { name: "Denominator 2" })).toBeVisible();
  //       expect(screen.getByRole("row", { name: "Result 50%" })).toBeVisible();
  //     });
  //   });

  testA11y(<EligibilityTableWrapper template={mockedElement} />);
});
