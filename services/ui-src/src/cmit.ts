import { CMIT, DeliverySystem, DataSource, MeasureSpecification } from "types";

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
    cmit: 1255,
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
    cmit: 962,
    name: "LTSS-5: Screening, Risk Assessment, and Plan of Care to Prevent Future Falls",
    uid: "962",
    measureSteward: "CMS",
    measureSpecification: [
      MeasureSpecification.CMS,
      MeasureSpecification.HEDIS,
    ],
    deliverySystem: [],
    dataSource: DataSource.Hybrid,
    options: "",
  },
];
