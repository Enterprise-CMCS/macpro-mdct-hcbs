import { ElementType, TextAreaBoxTemplate } from "../../../types/reports";

export const criticalIncidentCommentsField: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "critical-incident-comments-field",
  helperText:
    "If applicable, add any notes or comments to provide context to the reported results.",
  label: "Additional comments",
  required: false,
};
