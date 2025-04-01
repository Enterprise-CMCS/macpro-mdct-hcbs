// import { useStore } from "utils";
import { Alert } from "components/alerts/Alert";
import { PageElementProps } from "./Elements";
import { StatusAlertTemplate } from "types";

export const StatusAlert = (props: PageElementProps) => {
  const alert = props.element as StatusAlertTemplate;
  // const { report } = useStore();

  const submittable = () => {
    //TO DO: wait for Ben's part to finish to do a check
    return false;
  };

  if (submittable()) return;

  return (
    <Alert
      status={alert.status}
      title={alert.title}
      children={alert.text}
    ></Alert>
  );
};
