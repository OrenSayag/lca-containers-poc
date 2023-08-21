import { BaseComponentParams } from "../types";
import { ChangeEventHandler, FC } from "react";
import Button from "./Button";
import { ContainerWithRef } from "../assets/machines/containers.machine";
import { useActor } from "@xstate/react";

interface Params extends BaseComponentParams {
  container: ContainerWithRef;
}

const ContainerDummy: FC<Params> = ({ container }) => {
  const [state, send] = useActor<any>(container.ref);
  const onBarcodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    send({ type: "UPDATE", data: { barcode: e.target.value } });
  };
  const onSave = () => {
    send("SAVE");
  };
  const onCancel = () => {
    send("CANCEL");
  };
  return (
    <div className={"flex flex-col gap-3 p-4"}>
      <input
        type="text"
        value={(state as any).context.data.barcode || ""}
        onChange={onBarcodeChange}
      />
      <pre dir={"rtl"}>{JSON.stringify({ ctx: (state as any).context })}</pre>
      <Button onClick={onSave} label={"Save"} />
      <Button onClick={onCancel} label={"Cancel"} />
    </div>
  );
};

export default ContainerDummy;
