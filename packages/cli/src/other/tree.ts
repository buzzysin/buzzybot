import { Vtx } from "@buzzybot/cli/other/vtx";

export class Tree<N = any, E = any> extends Vtx<N> {
  get children() {
    return this._children;
  }
  get parent() {
    return this._parent;
  }

  constructor(
    protected _value: N,
    protected _children: Tree<N, E>[] = [],
    protected _parent: Tree<N, E> | null = null
  ) {
    super(_value);

    _children.forEach(child => (child._parent = this));
  }

  execDfs(exec: (tree: Tree<N, E>) => void): Tree<N, E>[] {
    return Tree._execDfs(exec, [this], []);
  }

  execBfs(exec: (tree: Tree<N, E>) => void): Tree<N, E>[] {
    return Tree._execBfs(exec, [this], []);
  }

  async execAsyncBfs(exec: (tree: Tree<N, E>) => Promise<void>): Promise<Tree<N, E>[]> {
    return Tree._execAsyncBfs(exec, this, []);
  }

  private static _execDfs<N, E>(
    exec: (tree: Tree<N, E>) => void,
    stack: Tree<N, E>[],
    visited: Tree<N, E>[]
  ): Tree<N, E>[] {
    // [A]
    // [B, C]
    // [D, E, C]
    // [E, C]
    // [C]
    // [F]
    //
    if (!stack.length) return visited;

    const tree = stack.shift();

    if (tree) {
      exec(tree);
      visited.push(tree);
      stack.unshift(...tree.children);
    }

    return Tree._execDfs(exec, stack, visited);
  }

  private static _execBfs<N, E>(
    exec: (tree: Tree<N, E>) => void,
    queue: Tree<N, E>[],
    visited: Tree<N, E>[]
  ): Tree<N, E>[] {
    // [A]
    // [B, C]
    // [C, D, E]
    // [D, E, F]
    // [E, F]
    // [F]
    //
    if (!queue.length) return visited;

    const tree = queue.shift();

    if (tree) {
      exec(tree);
      visited.push(tree);
      queue.push(...tree.children);
    }

    return Tree._execDfs(exec, queue, visited);
  }

  private static async _execAsyncBfs<N, E>(
    exec: (tree: Tree<N, E>) => Promise<void>,
    tree: Tree<N, E>,
    visited: Tree<N, E>[]
  ): Promise<Tree<N, E>[]> {
    return await exec(tree)
      .then(() => (visited.push(tree), tree))
      .then(async tree => {
        // const promises = tree.children
        //   .map(child => [exec, child, visited] as const) /*  */
        //   .map(([exec, child, visited]) =>
        //     Tree._execAsyncBfs.bind<null, typeof exec, Tree<N, E>, Tree<N, E>[], any[], Promise<Tree<N, E>[]>>(
        //       null,
        //       exec,
        //       child,
        //       visited
        //     )
        //   );

        // console.log(promises);

        // for (const promise of promises) await promise();

        const promises = tree.children.map(child => Tree._execAsyncBfs(exec, child, visited))
        await Promise.all(promises);

        return visited;
      })
      .catch(e => (console.log(e), visited));
  }
}
