import { assign, createMachine, sendParent } from "xstate";
import { Container } from "../../types";

export type Context = {
  data: Container;
  originalData: Container;
  dirty: boolean;
};

export type Event =
  | { type: "UPDATE"; data: Container }
  | { type: "EXIT" }
  | { type: "OK" }
  | { type: "CANCEL" }
  | { type: "SAVE" };

export const createContainerMachine = (data: Container) =>
  createMachine(
    {
      id: "Item Machine",
      context: {
        data,
        originalData: data,
        dirty: false,
      },
      initial: "Initial",
      states: {
        Initial: {
          on: {
            UPDATE: [
              {
                target: "Update",
                cond: "hasDataChanged",
                actions: "setDirty",
                description: "Params: { data: TItem }",
              },
              {
                target: "Update",
                actions: "resetDirty",
                description: "Params: { data: TItem }",
              },
            ],
            EXIT: [
              {
                target: "Confirm Exit",
                cond: "isDirty",
              },
              {
                target: "Initial",
              },
            ],
            SAVE: {
              target: "Initial",
              actions: [
                {
                  type: "sendParentSave",
                  params: {},
                },
                "resetDirty",
              ],
              description: "Sends to parent: ITEM.SAVE",
            },
            CANCEL: [
              {
                target: "Confirm Exit",
                cond: "isDirty",
              },
              {
                target: "Initial",
                actions: [
                  {
                    type: "sendParentCancel",
                    params: {},
                  },
                ],
              },
            ],
          },
        },
        Update: {
          entry: {
            type: "setData",
            params: {},
          },
          always: {
            target: "Initial",
          },
        },
        "Confirm Exit": {
          on: {
            OK: {
              target: "Initial",
              actions: {
                type: "sendParentCancel",
                params: {},
              },
              description: "Send to parent: ITEM.CANCEL",
            },
            CANCEL: {
              target: "Initial",
            },
            SAVE: {
              target: "Initial",
              actions: {
                type: "sendParentSave",
                params: {},
              },
              description: "Send to parent: ITEM.SAVE",
            },
          },
        },
      },
      schema: {
        events: {} as Event,
        context: {} as Context,
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
    },
    {
      actions: {
        setData: assign((ctx, event) => {
          if (event.type !== "UPDATE") return {};
          return {
            data: { ...ctx.data, ...event.data },
          };
        }),

        setDirty: assign(() => {
          return {
            dirty: true,
          };
        }),

        resetDirty: assign(() => {
          return {
            dirty: false,
          };
        }),

        sendParentCancel: sendParent({ type: "CONTAINER.CANCEL" }),

        sendParentSave: sendParent((ctx) => ({
          type: "CONTAINER.SAVE",
          data: ctx.data,
        })),
      },
      services: {},
      guards: {
        hasDataChanged: (ctx, e) => {
          if (e.type !== "UPDATE") return false;
          return (
            JSON.stringify(ctx.originalData) !==
            JSON.stringify({ ...ctx.data, ...e.data })
          );
        },

        isDirty: (ctx) => ctx.dirty,
      },
      delays: {},
    }
  );
