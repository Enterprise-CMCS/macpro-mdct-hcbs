import { qmTemplate } from "./qmTemplate";
import { FormOptions } from "./types";

const getRecentForm = () => {
  // Template Retrieval Logic
  return qmTemplate;
};
export const buildForm = (formOptions: FormOptions) => {
  // Lookup Measures Or UUID?
  const template = getRecentForm();
  const measures = [...template.measureLookup.defaultMeasures];
  const matchingRules = Object.entries(template.measureLookup.optionGroups)
    .filter(([k, _]) => formOptions.stateOptions.includes(k))
    .flatMap((arr) => arr[1]);
  measures.push(...matchingRules);

  // eslint-disable-next-line no-console
  console.log("match", measures);

  // Add measures to appropriate home
};
