import { bootstrap, IBootstrap } from "@injex/core";

@bootstrap()
export class BootstrapInjex implements IBootstrap {
  /** 
   * you can import your other app entry points inside 
   * this `run()` function. You can go one step further and integrate your app with 
   * Injex, but reading their documentation first is strongly recommended. 
   */
  async run() {}
}