import { CMIT, DeliverySystem, DataSource, MeasureSpecification } from "types";

export const CMIT_LIST: CMIT[] = [
  // required measures
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
    cmit: 20,
    name: "LTSS-6: Admission to a Facility from the Community",
    uid: "20",
    measureSteward: "CMS",
    measureSpecification: [MeasureSpecification.CMS],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Administrative,
    options: "",
  },
  {
    cmit: 968,
    name: "LTSS-7: Minimizing Facility Length of Stay",
    uid: "968",
    measureSteward: "CMS",
    measureSpecification: [MeasureSpecification.CMS],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Administrative,
    options: "",
  },
  {
    cmit: 414,
    name: "LTSS-8: Successful Transition after Long-Term Facility Stay",
    uid: "414",
    measureSteward: "CMS",
    measureSpecification: [MeasureSpecification.CMS],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Administrative,
    options: "",
  },
  // optional measures
  {
    cmit: 969,
    name: "FASI-1: Identification of Person-Centered Priorities",
    uid: "969",
    measureSteward: "CMS",
    measureSpecification: [MeasureSpecification.CMS],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.RecordReview,
    options: "",
  },
  {
    cmit: 970,
    name: "FASI-2: Documentation of a Person-Centered Service Plan",
    uid: "970",
    measureSteward: "CMS",
    measureSpecification: [MeasureSpecification.CMS],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.RecordReview,
    options: "",
  },
  {
    cmit: 111,
    name: "HCBS-10: Self-direction of Services and Supports Among Medicaid Beneficiaries Receiving LTSS through Managed Care Organizations",
    uid: "111",
    measureSteward: "CMS",
    measureSpecification: [MeasureSpecification.CMS],
    deliverySystem: [DeliverySystem.MLTSS],
    dataSource: DataSource.CaseRecordManagement,
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
    deliverySystem: [DeliverySystem.MLTSS, DeliverySystem.MLTSS],
    dataSource: DataSource.Hybrid,
    options: "",
  },
  {
    cmit: 561,
    name: "MLTSS: Plan All-Cause Readmission",
    uid: "561",
    measureSteward: "NCQA",
    measureSpecification: [MeasureSpecification.HEDIS],
    deliverySystem: [DeliverySystem.MLTSS],
    dataSource: DataSource.Administrative,
    options: "",
  },
  // POM measures
  {
    cmit: 1822,
    name: "POM: People Live in Integrated Environments",
    uid: "1822-1",
    measureSteward: "CQL",
    measureSpecification: [MeasureSpecification.CQL],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Survey,
    options: "",
  },
  {
    cmit: 1822,
    name: "POM: People Participate in the Life of the Community",
    uid: "1822-2",
    measureSteward: "CQL",
    measureSpecification: [MeasureSpecification.CQL],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Survey,
    options: "",
  },
  {
    cmit: 1822,
    name: "POM: People Choose Services",
    uid: "1822-3",
    measureSteward: "CQL",
    measureSpecification: [MeasureSpecification.CQL],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Survey,
    options: "",
  },
  {
    cmit: 1822,
    name: "POM: People Realize Personal Goals",
    uid: "1822-4",
    measureSteward: "CQL",
    measureSpecification: [MeasureSpecification.CQL],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Survey,
    options: "",
  },
  {
    cmit: 1822,
    name: "POM: People are Free from Abuse and Neglect",
    uid: "1822-5",
    measureSteward: "CQL",
    measureSpecification: [MeasureSpecification.CQL],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Survey,
    options: "",
  },
  {
    cmit: 1822,
    name: "POM: People Have the Best Possible Health",
    uid: "1822-6",
    measureSteward: "CQL",
    measureSpecification: [MeasureSpecification.CQL],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Survey,
    options: "",
  },
  {
    cmit: 1822,
    name: "POM: People Interact with Other Members of the Community",
    uid: "1822-7",
    measureSteward: "CQL",
    measureSpecification: [MeasureSpecification.CQL],
    deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
    dataSource: DataSource.Survey,
    options: "",
  },
];
