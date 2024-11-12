import { assign, setup } from 'xstate';

export const machine01 = setup({
  types: {
    context: {} as {
      value: string | null;
    },
    events: {} as { type: 'next'; value: string } | { type: 'prev' },
  },
  actions: {
    'set value': assign((_, value: string) => ({ value })),
  },
}).createMachine({
  context: {
    value: null,
  },
  id: 'Machine 01',
  initial: 'A',
  states: {
    A: {
      on: {
        next: {
          target: 'B',
          actions: {
            type: 'set value',
            params: ({ event }) => event.value,
          },
        },
      },
    },
    B: {
      on: {
        prev: {
          target: 'A',
        },
      },
    },
  },
});
