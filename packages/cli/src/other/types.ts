export type BzProjectConfig = {
  version: string;
  commands: string;
  middleware: string;
  slash: {
    clientId: string;
    devServer: string;
  };
  token: string;
};
