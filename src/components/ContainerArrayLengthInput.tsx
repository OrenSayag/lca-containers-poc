import { FC, useState } from "react";
import Button from "./Button";

interface Params {
  onConfirm: (length: number) => void;
}

const ContainerArrayLengthInput: FC<Params> = ({ onConfirm }) => {
  const [input, setInput] = useState<number>(1);
  return (
    <div>
      <p>אנא הגדר את כמות המיכלים שישלחו למעבדה</p>
      <input
        type="number"
        onChange={(e) => setInput(+e.target.value)}
        value={input}
      />
      <Button
        disabled={input === undefined}
        onClick={() => (input !== undefined ? onConfirm(input) : undefined)}
        label={"הזנת מיכלים"}
      />
    </div>
  );
};

export default ContainerArrayLengthInput;
