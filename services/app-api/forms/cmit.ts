import { CMIT } from "../types/reports";
import {
  DataSource,
  DeliverySystem,
  MeasureSpecification,
} from "../utils/constants";

export const CMIT_LIST: CMIT[] = [
  {
    cmit: 960,
    name: "LTSS-1: Comprehensive Assessment and Update",
    uid: "960",
    measureSteward: "CMS",
    measureSpecification: [
      MeasureSpecification.CMS,
      MeasureSpecification.HEDIS,
    ],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Hybrid,
    options: "",
  },
  {
    cmit: 961,
    name: "LTSS-2: Comprehensive Person-Centered Plan and Update",
    uid: "961",
    measureSteward: "CMS",
    measureSpecification: [
      MeasureSpecification.CMS,
      MeasureSpecification.HEDIS,
    ],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Hybrid,
    options: "",
  },
  {
    cmit: 963,
    name: "LTSS-3: Shared Person-Centered Plan with Primary Care Provider",
    uid: "963",
    measureSteward: "CMS",
    measureSpecification: [
      MeasureSpecification.CMS,
      MeasureSpecification.HEDIS,
    ],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Hybrid,
    options: "",
  },
  {
    cmit: 962,
    name: "LTSS-4: Reassessment and Person-Centered Plan Update after Inpatient Discharge",
    uid: "962",
    measureSteward: "CMS",
    measureSpecification: [
      MeasureSpecification.CMS,
      MeasureSpecification.HEDIS,
    ],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Hybrid,
    options: "",
  },
  {
    cmit: 1255,
    name: "LTSS-5: Screening, Risk Assessment, and Plan of Care to Prevent Future Falls",
    uid: "1255",
    measureSteward: "CMS",
    measureSpecification: [MeasureSpecification.CMS],
    deliverySystem: [DeliverySystem.MLTSS],
    dataSource: DataSource.Hybrid,
    options: "",
  },
];
