import { BaseComponentParams, Container } from "../types";
import { FC } from "react";
import Button from "./Button";

interface Params extends BaseComponentParams {
  container: Container;
  onEdit: () => void;
  onDelete: () => void;
}

const ContainerRow: FC<Params> = ({ container, onEdit, onDelete }) => {
  return (
    <tr className={"border-2"}>
      <td className={"border-2 w-fit px-12"}>
        <Button onClick={onEdit} label={"עריכה"} />
      </td>
      <td className={"border-2 w-fit px-12"}>
        {container.barcode || "טרם הוזן"}
      </td>
      <td className={"border-2 w-fit px-12"}>טרם הוזן</td>
      <td className={"border-2 w-fit px-12"}>טרם הוזן</td>
      <td className={"border-2 w-fit px-12"}>טרם הוזן</td>
      <td className={"border-2 w-fit px-12"}>טרם הוזן</td>
      <td className={"border-2 w-fit px-12"}>
        <Button onClick={onDelete} label={"מחיקה"} />
      </td>
    </tr>
  );
};

export default ContainerRow;
