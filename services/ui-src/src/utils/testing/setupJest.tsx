import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
import { mockFlags, resetLDMocks } from "jest-launchdarkly-mock";
import {
  UserRoles,
  HcbsUserState,
  UserContextShape,
  AdminBannerState,
  HcbsReportState,
  ReportType,
  ReportStatus,
  PageType,
  MeasureTemplateName,
  MeasurePageTemplate,
  MeasureStatus,
  DataSource,
  DeliverySystem,
  MeasureSpecification,
  ElementType,
} from "types";
import { mockBannerData } from "./mockBanner";
// GLOBALS

global.React = React;

/* Mocks window.matchMedia (https://bit.ly/3Qs4ZrV) */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

window.scrollBy = jest.fn();
window.scrollTo = jest.fn();
Element.prototype.scrollTo = jest.fn();

/* From Chakra UI Accordion test file (https://bit.ly/3MFtwXq) */
jest.mock("@chakra-ui/transition", () => ({
  ...jest.requireActual("@chakra-ui/transition"),
  Collapse: jest.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

/* Mock LaunchDarkly (see https://bit.ly/3QAeS7j) */
export const mockLDFlags = {
  setDefault: (baseline: any) => mockFlags(baseline),
  clear: resetLDMocks,
  set: mockFlags,
};

/* Mock Amplify */
jest.mock("aws-amplify/api", () => ({
  get: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  post: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  put: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  del: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
}));

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn().mockReturnValue({
    idToken: () => ({
      payload: "eyJLongToken",
    }),
  }),
  signOut: jest.fn().mockImplementation(() => Promise.resolve()),
  signInWithRedirect: () => {},
}));

//  BANNER STATES / STORE

export const mockBannerStore: AdminBannerState = {
  bannerData: mockBannerData,
  bannerActive: false,
  bannerLoading: false,
  bannerErrorMessage: { title: "", children: undefined },
  bannerDeleting: false,
  setBannerData: () => {},
  clearAdminBanner: () => {},
  setBannerActive: () => {},
  setBannerLoading: () => {},
  setBannerErrorMessage: () => {},
  setBannerDeleting: () => {},
};

// USER CONTEXT

export const mockUserContext: UserContextShape = {
  user: undefined,
  logout: async () => {},
  loginWithIDM: async () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

// USER STATES / STORE

export const mockNoUserStore: HcbsUserState = {
  user: undefined,
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateUserStore: HcbsUserState = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userIsEndUser: true,
  },
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateApproverStore: HcbsUserState = {
  user: {
    userRole: UserRoles.APPROVER,
    email: "stateapprover@test.com",
    given_name: "Zara",
    family_name: "Zustimmer",
    full_name: "Zara Zustimmer",
    state: "MN",
    userIsAdmin: true,
  },
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockHelpDeskUserStore: HcbsUserState = {
  user: {
    userRole: UserRoles.HELP_DESK,
    email: "helpdeskuser@test.com",
    given_name: "Clippy",
    family_name: "Helperson",
    full_name: "Clippy Helperson",
    state: undefined,
    userIsReadOnly: true,
  },
  showLocalLogins: false,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockAdminUserStore: HcbsUserState = {
  user: {
    userRole: UserRoles.ADMIN,
    email: "adminuser@test.com",
    given_name: "Adam",
    family_name: "Admin",
    full_name: "Adam Admin",
    state: undefined,
    userIsAdmin: true,
  },
  showLocalLogins: false,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockMeasureTemplate: MeasurePageTemplate = {
  id: "LTSS-1",
  cmitId: "960",
  cmitInfo: {
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
  },
  status: MeasureStatus.IN_PROGRESS,
  title: "mock-title",
  type: PageType.Measure,
  required: true,
  substitutable: "FASI-1",
  elements: [],
};

export const mock2MeasureTemplate: MeasurePageTemplate = {
  id: "FASI-1",
  cmitId: "961",
  cmitInfo: {
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
  },
  status: MeasureStatus.IN_PROGRESS,
  title: "mock-title-2",
  type: PageType.Measure,
  required: true,
  elements: [],
};

export const mockMeasureTemplateNotReporting: MeasurePageTemplate = {
  id: "LTSS-1",
  cmitId: "960",
  status: MeasureStatus.IN_PROGRESS,
  title: "mock-title-2",
  type: PageType.Measure,
  required: true,
  substitutable: "FASI-1",
  elements: [
    {
      type: ElementType.ReportingRadio,
      label: "Is the state reporting on this measure?",
      id: "measure-reporting-radio",
      value: [
        {
          label: "Yes, the state is reporting on this measure",
          value: "yes",
        },
        {
          label: "No, CMS is reporting this measure on the state's behalf",
          value: "no",
        },
      ],
      answer: "no",
    },
    {
      type: ElementType.TextAreaField,
      id: "additional-notes-field",
      helperText:
        "If applicable, add any notes or comments to provide context to the reported measure result",
      label: "Additional notes/comments (optional)",
      answer: "yes",
    },
  ],
};

export const mockReportStore: HcbsReportState = {
  modalOpen: false,
  currentPageId: "mock-template-id",
  pageMap: new Map([["mock-template-id", 0]]),
  report: {
    id: "mock-id",
    type: ReportType.QMS,
    status: ReportStatus.IN_PROGRESS,
    title: "mock-report-title",
    year: 2026,
    options: {},
    state: "PR",
    pages: [
      { ...mockMeasureTemplate, cmit: 960 },
      { ...mock2MeasureTemplate, cmit: 961 },
    ],
    measureLookup: {
      defaultMeasures: [
        {
          cmit: 960,
          measureTemplate: MeasureTemplateName["FFS-1"],
          required: true,
          uid: "960",
          deliverySystemTemplates: [MeasureTemplateName["FFS-1"]],
        },
      ],
      optionGroups: {},
    },
    measureTemplates: {
      [MeasureTemplateName["LTSS-1"]]: {
        ...mockMeasureTemplate,
        required: true,
      },
      [MeasureTemplateName["LTSS-2"]]: {
        ...mockMeasureTemplate,
        optional: true,
      },
      [MeasureTemplateName["LTSS-6"]]: {
        ...mockMeasureTemplate,
        stratified: true,
      },
      [MeasureTemplateName["LTSS-3"]]: {
        ...mockMeasureTemplate,
        optional: true,
      },
      [MeasureTemplateName["LTSS-7"]]: {
        ...mockMeasureTemplate,
        required: true,
      },
      [MeasureTemplateName["LTSS-8"]]: {
        ...mockMeasureTemplate,
        required: true,
      },
      [MeasureTemplateName["FFS-1"]]: mockMeasureTemplate,
      [MeasureTemplateName["FFS-2"]]: mockMeasureTemplate,
      [MeasureTemplateName["FFS-3"]]: mockMeasureTemplate,
      [MeasureTemplateName["FFS-7"]]: mockMeasureTemplate,
      [MeasureTemplateName["FFS-8"]]: mockMeasureTemplate,
      [MeasureTemplateName["MLTSS-1"]]: mockMeasureTemplate,
      [MeasureTemplateName["MLTSS-2"]]: mockMeasureTemplate,
      [MeasureTemplateName["MLTSS-3"]]: mockMeasureTemplate,
      [MeasureTemplateName["MLTSS-7"]]: mockMeasureTemplate,
      [MeasureTemplateName["MLTSS-8"]]: mockMeasureTemplate,
      [MeasureTemplateName["FASI-1"]]: mockMeasureTemplate,
      [MeasureTemplateName["FFS-FASI-1"]]: mockMeasureTemplate,
      [MeasureTemplateName["MLTSS-FASI-1"]]: mockMeasureTemplate,
      [MeasureTemplateName["POM-1"]]: mockMeasureTemplate,
      [MeasureTemplateName["POM-2"]]: mockMeasureTemplate,
      [MeasureTemplateName["POM-3"]]: mockMeasureTemplate,
      [MeasureTemplateName["POM-4"]]: mockMeasureTemplate,
      [MeasureTemplateName["POM-5"]]: mockMeasureTemplate,
      [MeasureTemplateName["POM-6"]]: mockMeasureTemplate,
      [MeasureTemplateName["POM-7"]]: mockMeasureTemplate,
    },
  },
  setReport: () => {},
  setCurrentPageId: () => {},
  setModalOpen: () => {},
  setModalComponent: () => {},
  setAnswers: () => {},
  resetMeasure: () => {},
  clearMeasure: () => {},
  setSubstitute: () => {},
  saveReport: async () => {},
};

// BOUND STORE

export const mockUseStore: HcbsUserState & AdminBannerState & HcbsReportState =
  {
    ...mockStateUserStore,
    ...mockBannerStore,
    ...mockReportStore,
  };

export const mockUseAdminStore: HcbsUserState & AdminBannerState = {
  ...mockAdminUserStore,
  ...mockBannerStore,
};

export const mockUseReadOnlyUserStore: HcbsUserState & AdminBannerState = {
  ...mockHelpDeskUserStore,
  ...mockBannerStore,
  ...mockReportStore,
};

// ROUTER

export const RouterWrappedComponent: React.FC<{ children: any }> = ({
  children,
}) => <Router>{children}</Router>;

// LAUNCHDARKLY

export const mockLDClient = {
  variation: jest.fn(() => true),
};

// ASSET
export * from "./mockAsset";
// BANNER
export * from "./mockBanner";
// FORM
export * from "./mockForm";
// ROUTER
export * from "./mockRouter";
