import { PageElementProps } from "components/report/Elements";
import { PerformanceRateTemplate } from "types";
import * as PerformanceType from "./../rates/types";

export const PerformanceRateElement = (props: PageElementProps) => {
  const performanceRateProp = props.element as PerformanceRateTemplate;
  const { rateType } = performanceRateProp;

  const PerformanceRate = PerformanceType[rateType];

  return (
    <div>
      <PerformanceRate {...performanceRateProp}></PerformanceRate>
    </div>
  );
};
