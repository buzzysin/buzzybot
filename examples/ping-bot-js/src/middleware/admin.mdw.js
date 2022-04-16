const { Middleware, middleware } = require("@buzzybot/injex-discord-plugin")
// js class
@middleware()
export class AdminMiddleware extends Middleware {
async handle(...args) {
const [interaction] = args;

/* Implement this method */

return true;
}
}