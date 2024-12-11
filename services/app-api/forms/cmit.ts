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
    cmit: 1255,
    name: "LTSS-5: Screening, Risk Assessment, and Plan of Care to Prevent Future Falls",
    uid: "1255",
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
