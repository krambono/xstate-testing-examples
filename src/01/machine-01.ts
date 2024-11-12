import { setup } from 'xstate';

export const machine = setup({
  types: {
    events: {} as { type: 'next' } | { type: 'prev' },
  },
}).createMachine({
  context: {},
  id: 'Machine 01',
  initial: 'A',
  states: {
    A: {
      on: {
        next: {
          target: 'B',
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
