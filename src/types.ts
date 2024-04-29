export interface Options {
  id: string;
  name: string;
  variants?: Options[];
  optionsTitle?: string;
  options?: Options[];
}

export interface Errors {
  name: string;
  message: string;
  invoke: boolean;
}
