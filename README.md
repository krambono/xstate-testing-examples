# Typescript starter

## Dependencies installation:

```bash
npm install
```

## Run tests:

```bash
npm run test
```

With watch mode:

```bash
npm run test:watch
```

## How I Approach Testing

Usually, I have a single test file per machine. For each state, I use a describe block that contains the name of the state, and I test all possible transitions from that state.

What I want to test:

- When a transition occurs, do I get the expected state?
- Are side effects performed correctly?
- Is the context mutated as expected?

## Machines

### Machine 01

Simple machine, everything works fine.

Here I test transitions between states and context mutations.

[Visualize the machine in stately studio](https://stately.ai/registry/editor/162d254d-65fc-48fe-9fa4-7b272a29988d?machineId=d257b799-d4d3-46b1-aba4-2f2d85be7a79)

### Machine 02

A slightly more complex machine

Here, I test transitions between states, context mutations, and whether my dependencies are called.

I have one problem here: when reaching the "Fetching" state, the actor that performs the data fetching is invoked. I want to wait for the actor to be done before transitioning to the 'Done' state and writing my expect statements.

I can use a "hack" by calling `await sleep(0)`, which does the job here, but I would prefer a better solution.

I know there is a waitFor function, and I could wait until the snapshot reaches the state I’m looking for, but there could be additional states between the initial state and the expected state. I want to ensure that the state following the initial state is the one I want. In that case, the waitFor function wouldn’t raise any error.

Another solution is to subscribe to the actor to check if the next snapshot is the one I want. I’m not sure if this is viable. What triggers a new snapshot when subscribing to an actor?

[Visualize the machine in stately studio](https://stately.ai/registry/editor/162d254d-65fc-48fe-9fa4-7b272a29988d?mode=design&machineId=d147dc34-dcfa-465c-b649-85e16c080f71)
