import { MeasureDetailsExport } from "components/report/MeasureDetails";
import { ElementType } from "types";

export const renderElements = (
  section: any,
  element: any | Object,
  type: ElementType
) => {
  const { answer } = element;
  let useTable = false;
  let render = <td>{answer ? answer.toString() : "No Response"}</td>;

  switch (type) {
    case ElementType.NdrEnhanced:
      console.log("ndr", answer);
      break;
    case ElementType.MeasureDetails:
      render = MeasureDetailsExport (section);
      break;
    default:
      useTable = true;
      break;
  }

  return {
    useTable: useTable,
    display: render,
  };
};

export const PerformanceMeasureReportElement = () => {};
