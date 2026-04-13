import { Helmet } from "react-helmet-async";

interface TitleProps {
  tabTitle: string;
}

export const Title = ({ tabTitle }: TitleProps) => {
  const fullTitle = `${tabTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
};

export default Title;
