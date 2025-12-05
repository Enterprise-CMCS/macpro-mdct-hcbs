import { ReactNode, useMemo, createContext } from "react";

export const ApiContext = createContext({});

interface Props {
  children?: ReactNode;
}

export const ApiProvider = ({ children }: Props) => {
  const values = useMemo(() => ({}), []);
  return <ApiContext.Provider value={values}>{children}</ApiContext.Provider>;
};
