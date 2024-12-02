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
];
