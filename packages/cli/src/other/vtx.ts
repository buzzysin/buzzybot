export class Vtx<N> {
  get value() {
    return this._value;
  }

  constructor(protected _value: N) {}
}
