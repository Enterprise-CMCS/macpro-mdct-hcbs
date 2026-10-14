import { vi } from "vitest";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import * as framerMotion from "framer-motion";
import {
  UserRoles,
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

framerMotion.MotionGlobalConfig.skipAnimations = true;

/* Mocks window.matchMedia (https://bit.ly/3Qs4ZrV) */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.scrollBy = vi.fn();
window.scrollTo = vi.fn();
Element.prototype.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

(window as any)._env_ = {};

/* From Chakra UI Accordion test file (https://bit.ly/3MFtwXq) */
vi.mock("@chakra-ui/transition", async (importOriginal) => ({
  ...(await importOriginal()),
  Collapse: vi.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

/* Mock Amplify */
vi.mock("aws-amplify/api", () => ({
  get: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  patch: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  post: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  put: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  del: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
}));

vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: vi.fn().mockReturnValue({
    idToken: () => ({
      payload: "eyJLongToken",
    }),
  }),
  signOut: vi.fn().mockImplementation(() => Promise.resolve()),
  signInWithRedirect: () => {},
}));

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: false,
  value: function () {},
});

export const mockStateUser = {
  userRole: UserRoles.STATE_USER,
  email: "stateuser@test.com",
  given_name: "Thelonious",
  family_name: "States",
  full_name: "Thelonious States",
  state: "MN",
  userIsEndUser: true,
};

export const mockStateApprover = {
  userRole: UserRoles.APPROVER,
  email: "stateapprover@test.com",
  given_name: "Zara",
  family_name: "Zustimmer",
  full_name: "Zara Zustimmer",
  state: "MN",
  userIsAdmin: true,
};

export const mockHelpDeskUser = {
  userRole: UserRoles.HELP_DESK,
  email: "helpdeskuser@test.com",
  given_name: "Clippy",
  family_name: "Helperson",
  full_name: "Clippy Helperson",
  state: undefined,
  userIsReadOnly: true,
};

export const mockAdminUser = {
  userRole: UserRoles.ADMIN,
  email: "adminuser@test.com",
  given_name: "Adam",
  family_name: "Admin",
  full_name: "Adam Admin",
  state: undefined,
  userIsAdmin: true,
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
  navTitle: "mock-title",
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
  navTitle: "mock-title-2",
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
  navTitle: "mock-title-2",
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

// ROUTER

export const RouterWrappedComponent: React.FC<{ children: any }> = ({
  children,
}) => <Router>{children}</Router>;

// LAUNCHDARKLY

export const mockLDClient = {
  variation: vi.fn(() => true),
};

// ASSET
export * from "./mockAsset";
// FORM
export * from "./mockForm";
// ROUTER
export * from "./mockRouter";
