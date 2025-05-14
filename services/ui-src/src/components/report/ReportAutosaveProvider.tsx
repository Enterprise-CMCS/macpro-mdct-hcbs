import { createContext, ReactNode, useState } from "react";
import { useStore } from "utils";

export const ReportAutosaveContext = createContext({
  autosave: () => {},
});

export const ReportAutosaveProvider = ({ children }: Props) => {
  const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout>>();
  const { report, saveReport } = useStore();

  const useDebounce = (func: () => void, delay: number = 2000) => {
    if (timerId) clearTimeout(timerId);

    let timer = setTimeout(() => {
      func();
    }, delay);
    setTimerId(timer);
  };

  const autosave = () => {
    useDebounce(() => {
      if (!report) return;
      saveReport();
    });
  };
  const value = {
    autosave,
  };

  return (
    <ReportAutosaveContext.Provider value={value}>
      {children}
    </ReportAutosaveContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
