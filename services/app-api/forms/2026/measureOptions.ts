import { MeasureTemplateName, MeasureOptions } from "../../types/reports";
import { DeliverySystem } from "../../utils/constants";

export const defaultMeasures: MeasureOptions[] = [
  {
    cmit: 960,
    uid: "960",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-1"],
    dependentPages: [
      {
        key: DeliverySystem.FFS,
        linkText: "Delivery Method: FFS",
        template: MeasureTemplateName["FFS-1"],
      },
      {
        key: DeliverySystem.MLTSS,
        linkText: "Delivery Method: MLTSS",
        template: MeasureTemplateName["MLTSS-1"],
      },
    ],
  },
  {
    cmit: 969,
    uid: "969",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["FASI-1"],
    dependentPages: [
      {
        key: DeliverySystem.FFS,
        linkText: "Delivery Method: FFS",
        template: MeasureTemplateName["FFS-FASI-1"],
      },
      {
        key: DeliverySystem.MLTSS,
        linkText: "Delivery Method: MLTSS",
        template: MeasureTemplateName["MLTSS-FASI-1"],
      },
    ],
  },
  {
    cmit: 961,
    uid: "961",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-2"],
    dependentPages: [
      {
        key: DeliverySystem.FFS,
        linkText: "Delivery Method: FFS",
        template: MeasureTemplateName["FFS-2"],
      },
      {
        key: DeliverySystem.MLTSS,
        linkText: "Delivery Method: MLTSS",
        template: MeasureTemplateName["MLTSS-2"],
      },
    ],
  },
  {
    cmit: 970,
    uid: "970",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["FASI-2"],
    dependentPages: [],
  },
  {
    cmit: 20,
    uid: "20",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-6"],
    dependentPages: [
      {
        key: DeliverySystem.FFS,
        linkText: "Delivery Method: FFS",
        template: MeasureTemplateName["FFS-6"],
      },
      {
        key: DeliverySystem.MLTSS,
        linkText: "Delivery Method: MLTSS",
        template: MeasureTemplateName["MLTSS-6"],
      },
    ],
  },
  {
    cmit: 968,
    uid: "968",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-7"],
    dependentPages: [
      {
        key: DeliverySystem.FFS,
        linkText: "Delivery Method: FFS",
        template: MeasureTemplateName["FFS-7"],
      },
      {
        key: DeliverySystem.MLTSS,
        linkText: "Delivery Method: MLTSS",
        template: MeasureTemplateName["MLTSS-7"],
      },
    ],
  },
  {
    cmit: 414,
    uid: "414",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-8"],
    dependentPages: [
      {
        key: DeliverySystem.FFS,
        linkText: "Delivery Method: FFS",
        template: MeasureTemplateName["FFS-8"],
      },
      {
        key: DeliverySystem.MLTSS,
        linkText: "Delivery Method: MLTSS",
        template: MeasureTemplateName["MLTSS-8"],
      },
    ],
  },
  {
    cmit: 111,
    uid: "111",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["HCBS-10"],
    dependentPages: [],
  },
  {
    cmit: 963,
    uid: "963",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-3"],
    dependentPages: [
      {
        key: DeliverySystem.FFS,
        linkText: "Delivery Method: FFS",
        template: MeasureTemplateName["FFS-3"],
      },
      {
        key: DeliverySystem.MLTSS,
        linkText: "Delivery Method: MLTSS",
        template: MeasureTemplateName["MLTSS-3"],
      },
    ],
  },
  {
    cmit: 962,
    uid: "962",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-4"],
    dependentPages: [],
  },
  {
    cmit: 1255,
    uid: "1255",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["LTSS-5"],
    dependentPages: [
      {
        key: "Part1",
        linkText: "Part 1: Screening (MLTSS)",
        template: MeasureTemplateName["LTSS-5-PT1"],
      },
      {
        key: "Part2",
        linkText: "Part 2: Risk Assessment and Plan of Care (MLTSS)",
        template: MeasureTemplateName["LTSS-5-PT2"],
      },
    ],
  },
  {
    cmit: 561,
    uid: "561",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["MLTSS"],
    dependentPages: [],
  },
];

export const pomMeasures: MeasureOptions[] = [
  {
    cmit: 1822,
    uid: "1822-1",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-1"],
    dependentPages: [],
  },
  {
    cmit: 1822,
    uid: "1822-2",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-2"],
    dependentPages: [],
  },
  {
    cmit: 1822,
    uid: "1822-3",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-3"],
    dependentPages: [],
  },
  {
    cmit: 1822,
    uid: "1822-4",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-4"],
    dependentPages: [],
  },
  {
    cmit: 1822,
    uid: "1822-5",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-5"],
    dependentPages: [],
  },
  {
    cmit: 1822,
    uid: "1822-6",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-6"],
    dependentPages: [],
  },
  {
    cmit: 1822,
    uid: "1822-7",
    required: false,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-7"],
    dependentPages: [],
  },
];
