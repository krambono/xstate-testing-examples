import { createActor } from 'xstate';
import { machine01 } from './machine-01';

describe('machine 01', () => {
  // describe blocks represent all the states of the machine
  describe('State A', () => {
    it('should start in state A', () => {
      // given
      // I create an actor from the machine
      const actor = createActor(machine01);

      // when
      actor.start();

      // then
      const snapshot = actor.getSnapshot();

      // I have an expect statement for the machine state.
      expect(snapshot.value).toBe('A');

      // I have an expect statement for the machine context.
      expect(snapshot.context).toStrictEqual({ value: null });
    });

    // I test each transition for the current state
    it("should transition to state B when 'next' event is sent", () => {
      // given
      const actor = createActor(machine01);
      actor.start();

      // when
      actor.send({ type: 'next', value: 'my-value' });

      // then
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('B');
      expect(snapshot.context.value).toBe('my-value');
    });
  });

  describe('State B', () => {
    it('should transition to state A when "prev" event is sent', () => {
      // given
      // I want to start my machine in state B
      const resolvedState = machine01.resolveState({ value: 'B', context: { value: 'my-value' } });
      const actor = createActor(machine01, { snapshot: resolvedState });
      actor.start();

      // when
      actor.send({ type: 'prev' });

      // then
      expect(actor.getSnapshot().value).toBe('A');
    });
  });
});
