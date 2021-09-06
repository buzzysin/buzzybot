import { define, singleton } from "@injex/core";
import { TClassDecorator } from "../interfaces/internal";
import { m } from "../metadata-handlers";

export function middleware(): TClassDecorator {
  return function middlewareDecorate(target) {
    define()(target);
    singleton()(target);

    m.setMetadata(target, "middleware", true);
  };
}
