import { MeasureTemplateName, MeasureOptions } from "../../types/reports";

export const defaultMeasures: MeasureOptions[] = [
  {
    cmit: 960,
    uid: "960",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-1"],
    deliverySystemTemplates: [
      MeasureTemplateName["FFS-1"],
      MeasureTemplateName["MLTSS-1"],
    ],
  },
  {
    cmit: 969,
    uid: "969",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["FASI-1"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 961,
    uid: "961",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-2"],
    deliverySystemTemplates: [
      MeasureTemplateName["FFS-2"],
      MeasureTemplateName["MLTSS-2"],
    ],
  },
  {
    cmit: 970,
    uid: "970",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["FASI-2"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 20,
    uid: "20",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-6"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 968,
    uid: "968",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-7"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 414,
    uid: "414",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-8"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 111,
    uid: "111",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["HCBS-10"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 963,
    uid: "963",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-3"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 962,
    uid: "962",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-4"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 1255,
    uid: "1255",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-5"],
  },
  {
    cmit: 561,
    uid: "561",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["MLTSS"],
    deliverySystemTemplates: [],
  },
];

export const pomMeasures: MeasureOptions[] = [
  {
    cmit: 1822,
    uid: "1822-1",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-1"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 1822,
    uid: "1822-2",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-2"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 1822,
    uid: "1822-3",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-3"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 1822,
    uid: "1822-4",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-4"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 1822,
    uid: "1822-5",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-5"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 1822,
    uid: "1822-6",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-6"],
    deliverySystemTemplates: [],
  },
  {
    cmit: 1822,
    uid: "1822-7",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-7"],
    deliverySystemTemplates: [],
  },
];
