export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type FunctionMock<T extends (...args: any) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

export const createFunctionMock = <T extends (...args: any) => any>(): FunctionMock<T> => jest.fn();
