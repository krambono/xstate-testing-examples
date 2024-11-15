import { createActor } from 'xstate';
import { createFunctionMock, sleep } from '../utils';
import { Dependencies } from './dependencies';
import { createMachine02 } from './machine-02';

describe('machine 02', () => {
  const dependencies = {
    fetchData: createFunctionMock<Dependencies['fetchData']>(),
  } satisfies Dependencies;
  const id = 'my-id';

  beforeEach(() => {
    dependencies.fetchData.mockClear();
  });

  describe('Fetching', () => {
    it("should start in 'Fetching' state", () => {
      // given
      const actor = initializeActor();

      // when
      actor.start();

      // then
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('Fetching');
      expect(snapshot.context).toStrictEqual({ id, data: null, error: null });
    });

    it("should transition to 'Done' state when the fetching of data is done ", async () => {
      // given
      dependencies.fetchData.mockResolvedValue({ content: 'my-content' });
      const actor = initializeActor();
      actor.start();

      // when
      await sleep(0); // Is there a better way to wait for the machine to transition to the next state?

      // then
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('Done');
      expect(dependencies.fetchData).toHaveBeenCalledWith(id);
      expect(snapshot.context.data).toStrictEqual({ content: 'my-content' });
    });

    it("should transition to 'Error' state when the fetching of data fails", async () => {
      // given
      dependencies.fetchData.mockRejectedValue(new Error('An error occurred'));
      const actor = initializeActor();
      actor.start();

      // when
      await sleep(0); // Is there a better way to wait for the machine to transition to the next state?

      // then
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('Error');
      expect(dependencies.fetchData).toHaveBeenCalledWith(id);
      expect(snapshot.context.error).toStrictEqual(new Error('An error occurred'));
    });
  });

  function initializeActor() {
    const machine = createMachine02(dependencies);
    return createActor(machine, { input: { id } });
  }
});
