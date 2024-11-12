import { createMachine, assign, fromPromise, setup } from 'xstate';
import { Dependencies } from './dependencies';
import { DataResponse } from './models';

export const createMachine02 = (dependencies: Dependencies) =>
  setup({
    types: {
      context: {} as { id: string; data: DataResponse | null; error: unknown | null },
      input: {} as { id: string },
    },
    actors: {
      'fetch data': fromPromise<DataResponse, { id: string }>(({ input }) => dependencies.fetchData(input.id)),
    },
    actions: {
      'assign data': assign((_, data: DataResponse) => ({ data })),
    },
  }).createMachine({
    context: ({ input }) => ({ id: input.id, data: null, error: null }),
    id: 'Machine 02',
    initial: 'Fetching',
    states: {
      Fetching: {
        invoke: {
          input: ({ context }) => ({ id: context.id }),
          onDone: {
            target: 'Done',
            actions: {
              type: 'assign data',
              params: ({ event }) => event.output,
            },
          },
          onError: {
            target: 'Error',
            actions: assign(({ event }) => ({ error: event.error })),
          },
          src: 'fetch data',
        },
      },
      Done: {},
      Error: {},
    },
  });
