export type BzProjectConfig = {
  version: string;
  commands: string;
  middleware: string;
  [x:string]: any;
  // TODO
  // slash: {
  //   clientId: string;
  //   devServer: string;
  // };
  // token: string;
};
