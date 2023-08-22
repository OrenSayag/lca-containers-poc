import { ActorRefFrom, assign, createMachine } from "xstate";
import { Container } from "../../types";
import { isContainerEmpty, saveList } from "../../services/container.service";
import { spawn } from "xstate/es";
import { createContainerMachine } from "./container.machine";
import { v4 as uuid } from "uuid";

type Event =
  | { type: "SET_CONTAINER_ARRAY_LENGTH"; length: number }
  | { type: "SET_EXISTING_CONTAINERS"; containers: Container[] }
  | { type: "ADD_CONTAINER" }
  | { type: "REMOVE_CONTAINER"; uuid: string }
  | { type: "EDIT_CONTAINER"; uuid: string }
  | { type: "CONTAINER.SAVE"; data: Container }
  | { type: "CONTAINER.CANCEL" }
  | { type: "REMOVE_EMPTY_CONTAINERS" }
  | { type: "SAVE_LIST" }
  | { type: "DISMISS" };

export type ContainerWithRef = {
  ref: ActorRefFrom<any>;
  data: Container;
};

type Context = {
  containers?: ContainerWithRef[];
  currentContainer?: ContainerWithRef;
  errorMessage?: string;
  successMessage?: string;
};

export const containersMachine = createMachine(
  {
    id: "Containers",
    context: {},
    initial: "Main",
    states: {
      Error: {
        initial: "Initial",
        states: {
          Initial: {
            always: {
              target: "Display",
              cond: "errorMessageExists",
            },
          },
          Display: {
            on: {
              DISMISS: {
                target: "Initial",
                actions: {
                  type: "removeErrorMessage",
                  params: {},
                },
              },
            },
          },
        },
      },
      Main: {
        initial: "Initial",
        states: {
          Initial: {
            always: {
              target: "#Containers.Main.List",
              cond: "containersIsArray",
            },
            on: {
              SET_CONTAINER_ARRAY_LENGTH: {
                actions: {
                  type: "initContainers",
                  params: {},
                },
                description: "Params: { length: number }",
                internal: true,
              },
              SET_EXISTING_CONTAINERS: {
                actions: {
                  type: "setExistingContainers",
                  params: {},
                },
                description: "Params: { containers: Container[] }",
                internal: true,
              },
            },
          },
          List: {
            description:
              "Each container in the list is assigned a reference to a spawned machine - the Container machine.",
            initial: "Initial",
            states: {
              Initial: {
                on: {
                  SAVE_LIST: {
                    target: "SAVING LIST",
                  },
                },
              },
              "SAVING LIST": {
                invoke: {
                  src: "saveList",
                  id: "invoke-zd67h",
                  onDone: [
                    {
                      target: "Initial",
                      actions: {
                        type: "setSuccessMessage",
                        params: {},
                      },
                    },
                  ],
                  onError: [
                    {
                      target: "Initial",
                      actions: {
                        type: "setErrorMessage",
                        params: {},
                      },
                    },
                  ],
                },
              },
            },
            on: {
              ADD_CONTAINER: {
                actions: {
                  type: "addContainer",
                  params: {},
                },
                internal: true,
              },
              REMOVE_CONTAINER: {
                actions: {
                  type: "removeContainer",
                  params: {},
                },
                description: "Params: { index: number }",
                internal: true,
              },
              EDIT_CONTAINER: {
                actions: {
                  type: "setCurrentContainer",
                  params: {},
                },
                internal: true,
              },
              "CONTAINER.SAVE": {
                actions: {
                  type: "saveContainerData",
                  params: {},
                },
                description: "Params: { data: TContainer }",
                internal: true,
              },
              "CONTAINER.CANCEL": {
                actions: {
                  type: "unsetCurrentContainer",
                  params: {},
                },
                internal: true,
              },
              REMOVE_EMPTY_CONTAINERS: {
                actions: {
                  type: "removeEmptyContainers",
                  params: {},
                },
                internal: true,
              },
            },
          },
        },
      },
      Success: {
        initial: "Initial",
        states: {
          Initial: {
            always: {
              target: "Display",
              cond: "successMessageExists",
            },
          },
          Display: {
            after: {
              "5000": [
                {
                  target: "#Containers.Success.Initial",
                  actions: [
                    {
                      type: "removeSuccessMessage",
                      params: {},
                    },
                  ],
                },
                {
                  internal: false,
                },
              ],
            },
          },
        },
      },
    },
    type: "parallel",
    schema: {
      context: {} as Context,
      events: {} as Event,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    // tsTypes: {} as import("./containers.machine.typegen").Typegen0,
  },
  {
    actions: {
      initContainers: assign({
        containers: (_, event) => {
          const createNewContainers = () => {
            if (event.type !== "SET_CONTAINER_ARRAY_LENGTH") {
              return;
            }
            const arr = [];
            for (let i = 0; i < event.length; i++) {
              const id = uuid();
              arr.push({
                ref: spawn<any>(createContainerMachine({ uuid: id })),
                data: { uuid: id },
              });
            }
            if (event.type !== "SET_CONTAINER_ARRAY_LENGTH") {
              return;
            }
            return arr;
          };
          if (event.type !== "SET_CONTAINER_ARRAY_LENGTH") {
            return;
          }
          return createNewContainers();
        },
      }),

      setExistingContainers: assign({
        containers: (_, e) => {
          if (e.type !== "SET_EXISTING_CONTAINERS") return;
          const containers = e.containers.map((c) => ({
            ref: spawn<any>(createContainerMachine({ uuid: c.uuid })),
            data: { uuid: c.uuid },
          }));
          return containers;
        },
      }),

      addContainer: assign((context) => {
        if (context.containers === undefined) return {};
        const id = uuid();
        return {
          containers: [
            ...context.containers,
            {
              ref: spawn<any>(createContainerMachine({ uuid: id })),
              data: { uuid: id },
            },
          ],
        };
      }),

      removeContainer: assign((context, event) => {
        if (event.type !== "REMOVE_CONTAINER") return {};
        return {
          containers: context.containers?.filter(
            (c) => c.data.uuid !== event.uuid
          ),
        };
      }),

      setCurrentContainer: assign((ctx, e) => {
        if (e.type !== "EDIT_CONTAINER") return {};
        const cont = ctx.containers!.find((c) => c.data.uuid === e.uuid);
        return {
          currentContainer: {
            ...cont!,
            data: { ...cont!.data },
          },
        };
      }),

      saveContainerData: assign((context, event) => {
        if (
          event.type !== "CONTAINER.SAVE" ||
          context.containers === undefined
        ) {
          return {};
        }
        return {
          containers: context.containers.map((c) => {
            if (c.data.uuid === event.data.uuid) {
              return { ...c, data: event.data };
            }
            return c;
          }),
          currentContainer: undefined,
        };
      }),

      unsetCurrentContainer: assign(() => {
        return {
          currentContainer: undefined,
        };
      }),

      removeEmptyContainers: assign((context) => {
        if (context.containers === undefined) return {};
        return {
          containers: context.containers.filter(
            (c) => !isContainerEmpty(c.data)
          ),
        };
      }),

      setSuccessMessage: assign(() => {
        return {
          successMessage: "Success",
        };
      }),

      setErrorMessage: assign(() => {
        return {
          errorMessage: "Failure",
        };
      }),

      removeSuccessMessage: assign(() => {
        return {
          successMessage: undefined,
        };
      }),

      removeErrorMessage: assign(() => {
        return {
          errorMessage: undefined,
        };
      }),
    },
    services: { saveList: () => saveList() },
    guards: {
      containersIsArray: (ctx) => Array.isArray(ctx.containers),
      successMessageExists: (ctx) => !!ctx.successMessage,
      errorMessageExists: (ctx) => !!ctx.errorMessage,
    },
    delays: {},
  }
);
