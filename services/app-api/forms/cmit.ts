import { CMIT } from "../types/reports";
import {
  DataSource,
  DeliverySystem,
  MeasureSpecification,
} from "../utils/constants";

export const CMIT_LIST: CMIT[] = [
  {
    cmit: 111,
    name: "my measure",
    uid: "abc",
    options: "",
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    measureSteward: "CMS",
    dataSource: DataSource.Administrative,
    measureSpecification: [],
  },
  {
    cmit: 222,
    name: "another measure",
    uid: "cde",
    options: "",
    deliverySystem: [DeliverySystem.FFS],
    measureSteward: "CMS",
    dataSource: DataSource.Administrative,
    measureSpecification: [],
  },
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
