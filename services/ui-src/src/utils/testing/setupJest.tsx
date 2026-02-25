import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
import * as framerMotion from "framer-motion";
import {
  UserRoles,
  HcbsUserState,
  UserContextShape,
  HcbsBannerState,
  HcbsReportState,
  ReportType,
  ReportStatus,
  PageType,
  MeasureTemplateName,
  MeasurePageTemplate,
  PageStatus,
  DataSource,
  DeliverySystem,
  MeasureSpecification,
  ElementType,
} from "types";

// GLOBALS

global.React = React;

global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

framerMotion.MotionGlobalConfig.skipAnimations = true;

/* Mocks window.matchMedia (https://bit.ly/3Qs4ZrV) */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
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

export const mockBannerStore: HcbsBannerState = {
  allBanners: [],
  _lastFetchTime: 0,
  fetchBanners: async () => {},
  createBanner: async () => {},
  deleteBanner: async () => {},
};

// USER CONTEXT

export const mockUserContext: UserContextShape = {
  user: undefined,
  logout: async () => {},
  loginWithIDM: async () => {},
  updateTimeout: async () => {},
  getExpiration: () => "",
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
  status: PageStatus.IN_PROGRESS,
  title: "mock-title",
  type: PageType.Measure,
  required: true,
  substitutable: "FASI-1",
  elements: [
    {
      type: ElementType.Radio,
      label: "Is the state reporting on this measure?",
      id: "measure-reporting-radio",
      required: true,
      choices: [
        {
          label: "Yes, the state is reporting on this measure.",
          value: "yes",
        },
        {
          label: "No, CMS is reporting this measure on the state's behalf.",
          value: "no",
        },
      ],
      answer: "yes",
    },
  ],
  dependentPages: [
    {
      key: "FFS",
      linkText: "Delivery Method: Fee-for-Service (FFS LTSS)",
      template: MeasureTemplateName["FFS-1"],
    },
    {
      key: "MLTSS",
      linkText: "Delivery Method: Managed Care (MLTSS)",
      template: MeasureTemplateName["MLTSS-1"],
    },
  ],
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
  status: PageStatus.IN_PROGRESS,
  title: "mock-title-2",
  type: PageType.Measure,
  required: true,
  elements: [],
  dependentPages: [
    {
      key: "FFS",
      linkText: "Delivery Method: Fee-for-Service (FFS LTSS)",
      template: MeasureTemplateName["FFS-2"],
    },
    {
      key: "MLTSS",
      linkText: "Delivery Method: Managed Care (MLTSS)",
      template: MeasureTemplateName["MLTSS-2"],
    },
  ],
};

export const mockMeasureTemplateNotReporting: MeasurePageTemplate = {
  id: "LTSS-1",
  cmitId: "960",
  status: PageStatus.IN_PROGRESS,
  title: "mock-title-2",
  type: PageType.Measure,
  required: true,
  substitutable: "FASI-1",
  elements: [
    {
      type: ElementType.Radio,
      label: "Is the state reporting on this measure?",
      id: "measure-reporting-radio",
      required: true,
      choices: [
        {
          label: "Yes, the state is reporting on this measure.",
          value: "yes",
        },
        {
          label: "No, CMS is reporting this measure on the state's behalf.",
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
      label: "Additional notes/comments",
      answer: "yes",
      required: false,
    },
  ],
  dependentPages: [
    {
      key: "FFS",
      linkText: "Delivery Method: Fee-for-Service (FFS LTSS)",
      template: MeasureTemplateName["FFS-1"],
    },
  ],
};

export const mockReportStore: HcbsReportState = {
  modalOpen: false,
  sidebarOpen: true,
  currentPageId: "LTSS-1",
  pageMap: new Map([
    ["root", 0],
    [mockMeasureTemplate.id, 1],
  ]),
  report: {
    id: "mock-id",
    type: ReportType.QMS,
    status: ReportStatus.IN_PROGRESS,
    name: "mock-report-title",
    year: 2026,
    options: {},
    state: "PR",
    archived: false,
    submissionCount: 0,
    pages: [
      {
        id: "root",
        childPageIds: [mockMeasureTemplate.id, mock2MeasureTemplate.id],
      },
      { ...mockMeasureTemplate, cmit: 960 },
      { ...mock2MeasureTemplate, cmit: 961 },
    ],
  },
  loadReport: () => {},
  updateReport: () => {},
  setCurrentPageId: () => {},
  setModalOpen: () => {},
  setModalComponent: () => {},
  setAnswers: () => {},
  resetMeasure: () => {},
  clearMeasure: () => {},
  changeDeliveryMethods: () => {},
  setSubstitute: () => {},
  setSidebar: () => {},
  completePage: () => {},
  saveReport: async () => {},
};

// BOUND STORE

export const mockUseStore: HcbsUserState & HcbsBannerState & HcbsReportState = {
  ...mockStateUserStore,
  ...mockBannerStore,
  ...mockReportStore,
};

export const mockUseAdminStore: HcbsUserState & HcbsBannerState = {
  ...mockAdminUserStore,
  ...mockBannerStore,
};

export const mockUseReadOnlyUserStore: HcbsUserState & HcbsBannerState = {
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
// FORM
export * from "./mockForm";
// ROUTER
export * from "./mockRouter";
