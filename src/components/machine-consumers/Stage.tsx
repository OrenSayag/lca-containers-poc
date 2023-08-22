import { BaseComponentParams, Container } from "../../types";
import { FC, useEffect } from "react";
import {
  isContainerEmpty,
  useContainersMachine,
} from "../../services/container.service";
import ContainerArrayLengthInput from "../ContainerArrayLengthInput";
import ContainersList from "../ContainersList";
import ProgressBar from "../ProgressBar";
import Button from "../Button";
import NodePop from "../NodePop";
import ContainerDummy from "./ContainerDummy";
import { useNavigate, useParams } from "react-router-dom";

interface Params extends BaseComponentParams {
  containers?: Container[];
}
const Stage: FC<Params> = ({ containers }) => {
  const [state, send] = useContainersMachine();
  const navigate = useNavigate();

  const { uuid: uuidParam } = useParams();

  const onEditItem = (uuid: string) => {
    if (!uuidParam) {
      navigate(`${uuid}`);
    }
    send("EDIT_CONTAINER", { uuid });
  };

  useEffect(() => {
    if (!state.context.containers && Array.isArray(containers)) {
      send("SET_EXISTING_CONTAINERS", { containers });
    }
  }, [containers]);

  useEffect(() => {
    if (!state.context.containers) {
      if (!containers) {
        navigate("/");
      }
      return;
    }
    const isUUIDValid = state.context.containers.some(
      (c) => c.data.uuid === uuidParam
    );
    if (!isUUIDValid) {
      return navigate("/");
    }
    onEditItem(uuidParam!);
  }, [uuidParam, state.context.containers]);
  const onConfirmArrayLength = (length: number) => {
    send("SET_CONTAINER_ARRAY_LENGTH", { length });
  };
  const onDeleteItem = (uuid: string) => {
    send("REMOVE_CONTAINER", { uuid });
  };
  const onAddItem = () => {
    send("ADD_CONTAINER");
  };
  const onRemoveEmptyContainers = () => {
    send("REMOVE_EMPTY_CONTAINERS");
  };

  const onExitItem = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>פרטי מיכלים</h1>
      {state.matches("Main.Initial") && (
        <ContainerArrayLengthInput onConfirm={onConfirmArrayLength} />
      )}
      {state.matches("Main.List.Initial") && (
        <div>
          <ProgressBar
            total={state.context.containers!.length}
            current={
              state.context.containers!.filter((c) => !isContainerEmpty(c.data))
                .length
            }
          />
          <ContainersList
            containers={state.context.containers!}
            onDeleteItem={onDeleteItem}
            onEditItem={onEditItem}
          />
          <div>
            <Button onClick={onAddItem} label={"הוספת מיכל +"} />
            <Button
              onClick={onRemoveEmptyContainers}
              label={"מחק מיכלים ללא פריטים"}
            />
          </div>
          {uuidParam && state.context.currentContainer && (
            <NodePop
              node={
                <ContainerDummy
                  onExit={onExitItem}
                  container={state.context.currentContainer}
                />
              }
            />
          )}
        </div>
      )}
      {/*<pre dir={"ltr"}>*/}
      {/*  {JSON.stringify({ state: state.value, ctx: state.context }, null, 2)}*/}
      {/*</pre>*/}
    </div>
  );
};

export default Stage;
