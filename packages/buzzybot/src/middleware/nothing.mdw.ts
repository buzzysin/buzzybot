import { middleware, Middleware } from "@buzzybot/injex-discord-plugin";

@middleware()
export class NothingMiddleware extends Middleware {
  handle() {
    return true;
  }
}
