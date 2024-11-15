import { assign, createMachine, fromPromise, setup } from 'xstate';
import { Dependencies } from './dependencies';

export const createMachine03 = (dependencies: Dependencies) =>
  setup({
    types: {
      context: {} as {
        files: string[];
        validFiles: string[];
      },
    },
    actors: {
      'list files': fromPromise(dependencies.listFiles),
      'analyze files': fromPromise<string[], string[]>(({ input }) => dependencies.analyzeFiles(input)),
      'upload files': fromPromise<void, string[]>(({ input }) => dependencies.uploadFiles(input)),
    },
  }).createMachine({
    context: {
      files: [],
      validFiles: [],
    },
    id: 'Machine 03',
    initial: 'Listing files',
    states: {
      'Listing files': {
        invoke: {
          input: {},
          onDone: {
            target: 'Analyzing files',
            actions: assign(({ event }) => ({ files: event.output })),
          },
          onError: {
            target: 'Error',
          },
          src: 'list files',
        },
      },
      'Analyzing files': {
        invoke: {
          input: ({ context }) => context.files,
          onDone: {
            target: 'Uploading files',
            actions: assign(({ event }) => ({ validFiles: event.output })),
          },
          onError: {
            target: 'Error',
          },
          src: 'analyze files',
        },
      },
      Error: {},
      'Uploading files': {
        invoke: {
          input: ({ context }) => context.validFiles,
          onDone: {
            target: 'Done',
          },
          onError: {
            target: 'Error',
          },
          src: 'upload files',
        },
      },
      Done: {},
    },
  });

export type Machine03 = ReturnType<typeof createMachine03>;
