function primitive(x: any): x is number | string | symbol | undefined {
  return typeof x !== "object" && typeof x !== "function";
}

export default function merge(a: any, b: any, mode: "CONCAT" | "CONCAT_UNIQUE" | "MERGE" = "MERGE"): any {
  if (primitive(a) || primitive(b)) {
    return b ?? a;
  }
  if (a instanceof Array && b instanceof Array) {
    if (mode === "CONCAT") {
      return [...a, ...b];
    } else if (mode == "CONCAT_UNIQUE") {
      return Array.from(new Set([...a, ...b]));
    } else {
      const rArr = Array.from({ length: Math.max(a.length, b.length) });
      return rArr.map((_, i) => merge(a[i], b[i], mode));
    }
  }
  if (a instanceof Map && b instanceof Map) {
    const aKeys = Array.from(a.keys());
    const bKeys = Array.from(b.keys());
    const rKeys = aKeys.concat(bKeys.filter(bK => !aKeys.some(aK => aK === bK)));

    return rKeys.reduce(
      (map: Map<any, any>, key) => map.set(key, merge(a.get(key), b.get(key), mode)),
      new Map<any, any>()
    );
  }
  if (a.constructor === Object && b.constructor === Object) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    const rKeys = aKeys.concat(bKeys.filter(bK => !aKeys.some(aK => aK === bK)));

    return rKeys.reduce((obj, rK) => Object.assign(obj, { [rK]: merge(a[rK], b[rK], mode) }), {});
  }
}
