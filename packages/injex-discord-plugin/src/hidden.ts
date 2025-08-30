export class Hidden<T> {
  #value: T;
  #hint!: "string" | "number" | "default";

  constructor(value: T) {
    this.#value = value;

    const typeofV = typeof value;
    switch (typeofV) {
      case "number":
      case "string":
        this.#hint = typeof value as "string" | "number";
      default:
        this.#hint = "default";
    }
  }

  toString(): string {
    return `Hidden([******])`;
  }

  // JSON.stringify should not leak the inner value.
  toJSON() {
    return this.toString();
  }

  [Symbol.toPrimitive](hint: "string" | "number" | "default"): string {
    if (hint === "string") return this.toString();
    if (hint === "number") return String(this.#value);
    return this.toString();
  }

  get(): T {
    return this.#value;
  }
}

export function hide<T>(value: T) {
  return new Hidden(value);
}
