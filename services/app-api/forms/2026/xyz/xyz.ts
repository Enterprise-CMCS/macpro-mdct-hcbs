import { ReportType, PageType } from "../../../types/reports";

export interface ReportBase {
  type: ReportType;
  year: number;
  pages: any[];
}

export const xyzReportTemplate: ReportBase = {
  type: ReportType.XYZ,
  year: 2026,
  pages: [
    {
      id: "root",
      childPageIds: ["general-information"],
    },
    {
      id: "general-information",
      type: PageType.Standard,
      title: "General Information",
      sidebar: false,
      hideNavButtons: false,
      elements: [
        {
          id: "program-name",
          type: "textbox",
          label: "Program Name",
          helperText: "Enter the name of your program",
          required: true,
        },
        {
          id: "description",
          type: "textAreaField",
          label: "Program Description",
          helperText: "Provide a brief description of your program",
          required: false,
        },
      ],
    },
  ],
};
