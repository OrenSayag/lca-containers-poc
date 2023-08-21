import { FC } from "react";
import { BaseComponentParams } from "../types";

interface Params extends BaseComponentParams {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

const Button: FC<Params> = ({ onClick, label, disabled }) => {
  return (
    <button disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
