import { createActor } from 'xstate';
import { machine } from './machine-01';

describe('machine 01', () => {
  // describe blocks represent all the states of the machine
  describe('State A', () => {
    it('should start in state A', () => {
      // given
      // I create an actor from the machine
      const actor = createActor(machine);

      // when
      actor.start();

      // then
      expect(actor.getSnapshot().value).toBe('A');
    });

    // I test each transition for the current state
    it("should transition to state B when 'next' event is sent", () => {
      // given
      const actor = createActor(machine);
      actor.start();

      // when
      actor.send({ type: 'next' });

      // then
      expect(actor.getSnapshot().value).toBe('B');
    });
  });

  describe('State B', () => {
    it('should transition to state A when "prev" event is sent', () => {
      // given
      // I want to start my machine in state B
      const resolvedState = machine.resolveState({ value: 'B' });
      const actor = createActor(machine, { snapshot: resolvedState });
      actor.start();

      // when
      actor.send({ type: 'prev' });

      // then
      expect(actor.getSnapshot().value).toBe('A');
    });
  });
});
