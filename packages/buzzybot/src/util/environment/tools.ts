type validator = () => boolean;

type action<I extends any[], O = void> = (...i: I) => O | Promise<O>;

const doIf =
  (condition: validator) =>
  <I extends any[], O = void>(action: action<I, O>, ...i: I) =>
    condition() ? action(...i) : void 0;

const not = (condition: validator) => () => !condition();

const isProd: validator = () => process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";
const isDev: validator = not(isProd);

export const devOnly = doIf(isDev);
export const prodOnly = doIf(isProd);
export const unlessProd = doIf(not(isProd));
export const unlessDev = doIf(not(isDev));

export const valueWhenEnv = <T>(map: Partial<Record<NodeJS.ProcessEnv["NODE_ENV"], T>>) => {
  if ("production" in map && !("staging" in map)) map["staging"] = map["development"];
  return map[process.env.NODE_ENV]!;
};
