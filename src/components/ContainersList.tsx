import { BaseComponentParams } from "../types";
import ContainerRow from "./ContainerRow";
import { ContainerWithRef } from "../assets/machines/containers.machine";

interface Params extends BaseComponentParams {
  containers: ContainerWithRef[];
  onDeleteItem: (uuid: string) => void;
  onEditItem: (uuid: string) => void;
}

const ContainersList = ({ containers, onDeleteItem, onEditItem }: Params) => {
  return (
    <>
      <h2 className={"text-right font-bold text-xl"}>רשימת מיכלים להזנה</h2>
      <table className={"table-auto"}>
        <thead>
          <tr>
            <th>עריכה</th>
            <th>מזהה מיכל</th>
            <th>איבר</th>
            <th>צד</th>
            <th>תוכן המיכל</th>
            <th>אבחנה קלינית</th>
            <th>מחיקה</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <ContainerRow
              onDelete={() => onDeleteItem(c.data.uuid)}
              onEdit={() => onEditItem(c.data.uuid)}
              key={"container-row-" + c.data.uuid}
              container={c.data}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ContainersList;
