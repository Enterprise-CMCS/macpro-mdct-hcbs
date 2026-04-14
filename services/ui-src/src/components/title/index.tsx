import { useEffect, useRef } from "react";

interface TitleProps {
  tabTitle: string;
}

export const Title = ({ tabTitle }: TitleProps) => {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = tabTitle ? tabTitle : defaultTitle.current;

    return () => {
      document.title = defaultTitle.current;
    };
  }, [tabTitle]);

  return null;
};

export default Title;
