import { CMIT } from "../types/reports";
import { DataSource, DeliverySystem } from "../utils/constants";

export const CMIT_LIST: CMIT[] = [
  {
    cmit: 111,
    name: "my measure",
    uid: "abc",
    options: "",
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    measureSteward: "CMS",
    dataSource: DataSource.Administrative,
  },
  {
    cmit: 222,
    name: "another measure",
    uid: "cde",
    options: "",
    deliverySystem: [DeliverySystem.FFS],
    measureSteward: "CMS",
    dataSource: DataSource.Administrative,
  },
];
