import React from "react";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
import { UserRoles, UserState, AdminBannerState } from "types";
import { mockBannerData } from "./mockBanner";

// GLOBALS

global.React = React;

global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

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

HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

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

// USER STATES / STORE

export const mockNoUserStore: UserState = {
  user: undefined,
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateUserStore: UserState = {
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

export const mockStateApproverStore: UserState = {
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

export const mockHelpDeskUserStore: UserState = {
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

export const mockAdminUserStore: UserState = {
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

// BOUND STORE

export const mockUseStore: UserState & AdminBannerState = {
  ...mockStateUserStore,
  ...mockBannerStore,
};

// BANNER
export * from "./mockBanner";
// ROUTER
export * from "./mockRouter";
