import { useMachine } from "@xstate/react";
import { containersMachine } from "../assets/machines/containers.machine";
import { Container } from "../types";

export const saveList = () => {
  return new Promise((res) =>
    setTimeout(() => {
      res("Success");
    }, 1_000)
  );
};

export const useContainersMachine = () => useMachine(containersMachine);

export const isContainerEmpty = (container: Container) => !container.barcode;
