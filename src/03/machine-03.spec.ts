import { createActor, waitFor } from 'xstate';
import { createFunctionMock, sleep } from '../utils';
import { Dependencies } from './dependencies';
import { createMachine03 } from './machine-03';

describe('machine-03', () => {
  const dependencies = {
    listFiles: createFunctionMock<Dependencies['listFiles']>(),
    analyzeFiles: createFunctionMock<Dependencies['analyzeFiles']>(),
    uploadFiles: createFunctionMock<Dependencies['uploadFiles']>(),
  } satisfies Dependencies;

  beforeEach(() => {
    dependencies.listFiles.mockClear();
    dependencies.analyzeFiles.mockClear();
    dependencies.uploadFiles.mockClear();
  });

  describe("'Listing files' state", () => {
    it('should start in the "Listing files" state', () => {
      // given
      const machine = createMachine03(dependencies);

      // when
      const actor = createActor(machine);

      // then
      expect(actor.getSnapshot().value).toBe('Listing files');
    });

    it('should transition to "Analyzing files" state when listing files is successful', async () => {
      // given
      dependencies.listFiles.mockResolvedValue(['file1', 'file2', 'file3']);
      const machine = createMachine03(dependencies);
      const actor = createActor(machine);
      actor.start();

      // when
      // here we can't use the hack with sleep(0) because it would go at the last state of the machine
      // I wait a first time for the machine to be in the initial state I want
      await waitFor(actor, snapshot => snapshot.matches('Listing files'));

      // then
      const snapshot = actor.getSnapshot();
      expect(dependencies.listFiles).toHaveBeenCalled();
      expect(snapshot.context.files).toStrictEqual(['file1', 'file2', 'file3']);
      // what is ensuring that I am in the next state after 'Listing files' ? seems hacky again
      expect(snapshot.value).toBe('Analyzing files');
    });
  });

  describe("'Analyzing files' state", () => {
    it('should transition to "Uploading files" state when analyzing files is successful', async () => {
      // given
      // I have to mock the list files function to be able to go to the initial state of the machine
      dependencies.listFiles.mockResolvedValue(['file1', 'file2', 'file3']);
      // It would be better to have the possibility start the machine in a specific state
      // Currently, if we start the machine in a state that invokes an actor, the actor won't be invoked,
      // making it impossible to test the logic.

      dependencies.analyzeFiles.mockResolvedValue(['file1', 'file3']);
      const machine = createMachine03(dependencies);
      const actor = createActor(machine);
      actor.start();

      // when
      await waitFor(actor, snapshot => snapshot.matches('Analyzing files'));

      // then
      const snapshot = actor.getSnapshot();
      expect(dependencies.analyzeFiles).toHaveBeenCalledWith(['file1', 'file2', 'file3']);
      expect(snapshot.context.validFiles).toStrictEqual(['file1', 'file3']);
      // what is ensuring that I am in the next state after 'Analyzing files' ? seems hacky again
      expect(snapshot.value).toBe('Uploading files');
    });
  });

  describe("'Uploading files' state", () => {
    it('should transition to "Done" state when uploading files is successful', async () => {
      // given
      // Same as above for dependencies
      dependencies.listFiles.mockResolvedValue(['file1', 'file2', 'file3']);
      dependencies.analyzeFiles.mockResolvedValue(['file1', 'file3']);
      //

      dependencies.uploadFiles.mockResolvedValue();

      const machine = createMachine03(dependencies);
      const actor = createActor(machine);
      actor.start();

      // when
      await waitFor(actor, snapshot => snapshot.matches('Uploading files'));

      // then
      const snapshot = actor.getSnapshot();
      expect(dependencies.uploadFiles).toHaveBeenCalledWith(['file1', 'file3']);
      // what is ensuring that I am in the next state after 'Uploading files' ? seems hacky again
      expect(snapshot.value).toBe('Done');
    });
  });

  // I dont write all tests
  // I think it's enough to expose the problem
});
