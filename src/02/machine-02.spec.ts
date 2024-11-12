import { createActor } from 'xstate';
import { sleep } from '../utils';
import { Dependencies } from './dependencies';
import { createMachine02 } from './machine-02';

describe('machine 02', () => {
  const id = 'my-id';

  describe('Fetching', () => {
    it("should start in 'Fetching' state", () => {
      // given
      const dependencies = {
        fetchData: jest.fn(),
      } satisfies Dependencies;
      const machine = createMachine02(dependencies);
      const actor = createActor(machine, { input: { id } });

      // when
      actor.start();

      // then
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('Fetching');
      expect(snapshot.context).toStrictEqual({ id, data: null, error: null });
    });

    it("should transition to 'Done' state when the fetching of data is done ", async () => {
      // given
      const dependencies = {
        fetchData: jest.fn().mockResolvedValue({ content: 'my-content' }),
      } satisfies Dependencies;
      const machine = createMachine02(dependencies);
      const actor = createActor(machine, { input: { id } });
      actor.start();

      // when
      await sleep(0); // Is there a better way to wait machine to transition on next state?

      // then
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('Done');
      expect(dependencies.fetchData).toHaveBeenCalledWith(id);
      expect(snapshot.context.data).toStrictEqual({ content: 'my-content' });
    });

    it("should transition to 'Error' state when the fetching of data fails", async () => {
      // given
      const dependencies = {
        fetchData: jest.fn().mockRejectedValue(new Error('An error occurred')),
      } satisfies Dependencies;
      const machine = createMachine02(dependencies);
      const actor = createActor(machine, { input: { id } });
      actor.start();

      // when
      await sleep(0); // Is there a better way to wait machine to transition on next state?

      // then
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('Error');
      expect(dependencies.fetchData).toHaveBeenCalledWith(id);
      expect(snapshot.context.error).toStrictEqual(new Error('An error occurred'));
    });
  });
});
