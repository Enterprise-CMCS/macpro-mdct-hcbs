import { createContext } from "react";
import { UseFormReturn } from "react-hook-form";

export const ReportFormContext = createContext<UseFormReturn | null>(null);
