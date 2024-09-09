import { FormTemplate, MeasureTemplateName } from "./types";

export const qmTemplate: FormTemplate = {
  measureLookup: {
    defaultMeasures: [
      {
        cmit: 123,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName.StandardMeasure,
      },
      {
        cmit: 234,
        required: false,
        stratified: true,
        measureTemplate: MeasureTemplateName.StandardMeasure,
      },
    ],
    optionGroups: {
      rulesOne: [
        {
          cmit: 888,
          required: true,
          stratified: false,
          measureTemplate: MeasureTemplateName.StandardMeasure,
        },
      ],
      rulesTwo: [
        {
          cmit: 999,
          required: true,
          stratified: false,
          measureTemplate: MeasureTemplateName.StandardMeasure,
        },
      ],
    },
  },
  sections: [
    {
      title: "Intro",
      id: "section-0",
      pageElements: [],
    },
    {
      title: "Required Measures",
      id: "section-1",
      pageElements: [],
    },
  ],
  measureTemplates: {
    [MeasureTemplateName.StandardMeasure]: {
      pageElements: [
        {
          id: "0001",
          type: "text",
          text: "Please answer the following question honestly:",
        },
        {
          id: "0002",
          type: "input",
          inputType: "number",
          questionText: "How far can you throw a rock?",
          answer: undefined,
        },
      ],
    },
  },
};
