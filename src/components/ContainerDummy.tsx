import { BaseComponentParams } from "../types";
import { ChangeEventHandler, FC, useEffect } from "react";
import Button from "./Button";
import { ContainerWithRef } from "../assets/machines/containers.machine";
import { useActor } from "@xstate/react";
import TextPop from "./TextPop";

interface Params extends BaseComponentParams {
  container: ContainerWithRef;
  onExit: () => void;
}

const ContainerDummy: FC<Params> = ({ container, onExit }) => {
  const [state, send] = useActor<any>(container.ref);
  const onBarcodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    send({ type: "UPDATE", data: { barcode: e.target.value || undefined } });
  };
  const onSave = () => {
    send("SAVE");
    onExit();
  };
  const onCancel = () => {
    send("CANCEL");
    if (!(state as any).context.dirty) {
      onExit();
    }
  };

  useEffect(() => {}, [state]);
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
      {(state as any).matches("Confirm Exit") && (
        <TextPop
          text={"יש שינויים שלא נשמרו. האם אתם בטוחים?"}
          title={"תשומת לב"}
          cancel={{
            text: "ביטול",
            on: () => send("CANCEL"),
          }}
          ok={{
            text: "יציאה ללא שמירה",
            on: () => {
              send("OK");
              onExit();
            },
          }}
        />
      )}
    </div>
  );
};

export default ContainerDummy;
