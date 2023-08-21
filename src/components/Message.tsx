import { BaseComponentParams } from "../types";
import { FC } from "react";
import Button from "./Button";

interface Params extends BaseComponentParams {
  message: string;
  onDismiss?: () => void;

  isError: boolean;
}

const Message: FC<Params> = ({ message, onDismiss, isError }) => {
  return (
    <div className={isError ? "bg-red-500" : "bg-green-500"}>
      <p>{message}</p>
      {onDismiss && <Button onClick={onDismiss} label={"Dismiss"} />}
    </div>
  );
};

export default Message;
