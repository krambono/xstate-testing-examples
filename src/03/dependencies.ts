export type Dependencies = {
  listFiles: () => Promise<string[]>;
  analyzeFiles: (files: string[]) => Promise<string[]>;
  uploadFiles: (files: string[]) => Promise<void>;
};
