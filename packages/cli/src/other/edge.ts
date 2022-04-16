import { Vtx } from "@buzzybot/cli/other/vtx";

export class Edge<N, E> {
  get value() {
    return this._value;
  }

  constructor(protected u: Vtx<N>, protected v: Vtx<N>, protected _value: E = null as unknown as E) {}
}
