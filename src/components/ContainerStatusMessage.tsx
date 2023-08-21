import { FC, useMemo } from "react";
import { BaseComponentParams } from "../types";

interface Params extends BaseComponentParams {
  success: boolean;
}

const ContainerStatusMessage: FC<Params> = ({ success }) => {
  const message = useMemo(
    () => (success ? "הושלם" : "ממתין להזנת פרטים"),
    [success]
  );
  return (
    <div className={success ? "text-green-500" : "text-red-500"}>{message}</div>
  );
};

export default ContainerStatusMessage;
