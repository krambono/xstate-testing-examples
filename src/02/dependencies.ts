export type Dependencies = {
  fetchData: (id: string) => Promise<{ content: string }>;
};
