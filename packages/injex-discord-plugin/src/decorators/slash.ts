import { define, singleton } from "@injex/core";
import { IConstructor } from "@injex/stdlib";
import { Middleware } from "../classes/middleware";
import {
  Metadata,
  ModuleNameOrType,
  OneOrN,
  SlashMetadata,
  SlashMetadataPublic,
  TClassDecorator,
} from "../interfaces/internal";
import { m } from "../metadata-handlers";

type SlashConfig = Pick<SlashMetadata, "name" | "description" | "groups" | "options"> & {
  /**
   * Root-level protection
   */
  protect?: OneOrN<ModuleNameOrType<Middleware>>;
};
type SlashGroupConfig = SlashMetadataPublic & {
  /**
   * Group-level protection
   */
  protect?: OneOrN<ModuleNameOrType<Middleware>>;
};
type SlashGroupCommandConfig = Pick<SlashMetadata, "name" | "description" | "options"> & {
  /**
   * Command-level protection
   */
  protect?: OneOrN<ModuleNameOrType<Middleware>>;
  /**
   * The name of the group this command belongs to
   */
  group: string;
};
type SlashSubCommandConfig = Omit<SlashGroupCommandConfig, "group">;

/**
 * Create a root command, autoruns the `run()` method if defined.
 *
 * Using the `groups` option should be the same as using `slash.group` class decorator.
 *
 * To `protect` *only* the `run()` method, use `slash.protect()`
 */
export function slash(config: SlashConfig): TClassDecorator {
  return function slashDecorate(target) {
    define()(target);
    singleton()(target);

    m.setMetadata(target, "slash", "command");
    m.setMetadata(target, "name", config.name);
    m.setMetadata(target, "description", config.description);
    if (config.options) m.setMetadata(target, "options", config.options);

    /**
     * Callbacks are only allowed on non-scoped commands
     */
    if (!config.groups && !config.protect) m.setMetadata(target, "callback", "run");

    /**
     * Using `groups` should be (TODO: IS) the same as using `slash.group(...)`
     */
    if (config.groups) {
      config.groups.forEach(group => {
        slash.group({
          name: group.name!,
          description: group.description,
          protect: group.protect,
          ...(group.options ? { options: group.options } : {}),
        })(target);
      });
    }

    if (config.protect) {
      const protect = config.protect instanceof Array ? config.protect : [config.protect];
      protect.forEach(middleware => m.pushMetadata(target, "protectAll", middleware));
    }
  };
}

export namespace slash {
  /**
   * Define a subcommand (unscoped)
   * - **Warning**: This will cause `run` to be ignored.
   * @param config
   * @returns
   */
  export function sub(config: SlashSubCommandConfig): MethodDecorator {
    if (!config.protect) config.protect = [];

    return function slashSubDecorate(target, key, desc) {
      m.pushMetadata(target.constructor as IConstructor, "commands", {
        name: config.name,
        description: config.description,
        callback: key,
        /**
         * Define an empty group as a subcommand
         * (allowed on the same level, which is the first nesting level)
         */
        group: null,
        protect: config.protect instanceof Array ? config.protect : [config.protect!],
      });

      const metadata = m.getMetadata(target);
      doSlashMetadataCheck(metadata);
    };
  }

  /**
   * Define a slash group command.
   * - **Warning**: This will cause `run` to be ignored.
   * @param config
   * @returns
   */
  export function group(config: SlashGroupConfig): TClassDecorator {
    if (!config.protect) config.protect = [];

    return function slashGroupDecorate(target) {
      m.pushMetadata(target, "groups", {
        name: config.name,
        description: config.description,
        protect: config.protect instanceof Array ? config.protect : [config.protect!],
        ...(config.options ? { options: config.options } : {}),
      });

      const metadata = m.getMetadata(target);
      doSlashMetadataCheck(metadata);
    };
  }

  export namespace group {
    /**
     * The most fine-grained control over defining group commands
     * @param config
     * @returns
     */
    export function command(config: SlashGroupCommandConfig): MethodDecorator {
      if (!config.protect) config.protect = [];
      return function (target, key, desc) {
        m.pushMetadata(target.constructor as IConstructor, "commands", {
          name: config.name,
          description: config.description,
          callback: key,
          group: config.group,
          protect: config.protect instanceof Array ? config.protect : [config.protect!],
          ...(config.options ? { options: config.options } : {}),
        });
      };
    }
  }

  /**
   * Use this function for `function-level` protection
   * @param middleware
   * @returns
   */
  export function protect(middleware: OneOrN<IConstructor<Middleware>>): MethodDecorator {
    return function slashProtectDecorate(target, key, desc) {
      const middlewares = middleware instanceof Array ? middleware : [middleware];
      middlewares.forEach(m => {
        slashProtectMethod(m)(target, key, desc);
      });
    };
  }
  export namespace protect {
    /**
     * Provide root-level protection on all commands
     * @param middleware
     * @returns
     */
    export function all(middleware: OneOrN<IConstructor<Middleware>>): TClassDecorator {
      return function slashProtectAllDecorate(target) {
        const middlewares = middleware instanceof Array ? middleware : [middleware];
        middlewares.forEach(middleware => {
          m.pushMetadata(target, "protectAll", middleware);
        });
      };
    }
  }
  function slashProtectClass(middleware: IConstructor<Middleware>): TClassDecorator {
    return function slashProtectClassDecorate(target) {
      m.pushMetadata(target, "protect", { callback: "run", middleware });
    };
  }
  function slashProtectMethod(middleware: IConstructor<Middleware>): MethodDecorator {
    return function slashProtectMethodDecorate(target, key, desc) {
      m.pushMetadata(target.constructor, "protect", { callback: key, middleware });
    };
  }

  function doSlashMetadataCheck(metadata: Metadata) {
    /**
     * Remember that base commands are disabled by having sub/grouped commands
     */
    if (metadata && "callback" in metadata) {
      delete metadata["callback"];
      delete metadata["options"];
    }
  }
}
