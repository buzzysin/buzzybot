const { bootstrap } = require("@injex/core");

@bootstrap()
export class BootstrapInjex  {
  /** 
   * you can require your other app entry points inside 
   * this `run()` function. You can go one step further and integrate your app with 
   * Injex, but reading their documentation first is strongly recommended. 
   */
  async run() {}
}