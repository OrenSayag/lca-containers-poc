import { useMachine } from "@xstate/react";
import { containersMachine } from "../assets/machines/containers.machine";
import { spawn } from "xstate";
import { createContainerMachine } from "../assets/machines/container.machine";
import { Container } from "../types";

export const saveList = () => {
  return new Promise((res) =>
    setTimeout(() => {
      res("Success");
    }, 1_000)
  );
};

export const useContainersMachine = (containers?: Container[]) =>
  useMachine(containersMachine, {
    context: {
      containers: containers?.map((c) => ({
        data: c,
        ref: spawn<any>(createContainerMachine(c)),
      })),
    },
  });

export const isContainerEmpty = (container: Container) => !container.barcode;
