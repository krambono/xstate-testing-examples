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

[Visualize machine in stately studio](https://stately.ai/registry/editor/embed/162d254d-65fc-48fe-9fa4-7b272a29988d?machineId=d257b799-d4d3-46b1-aba4-2f2d85be7a79&mode=design)
