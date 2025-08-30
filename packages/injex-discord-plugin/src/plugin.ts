import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";
import { IInjexPlugin, IModule, Injex } from "@injex/core";
import { Client, Interaction } from "discord.js";
import { DiscordSlashCommand, Hidden, Middleware } from ".";
import { createConfig } from "./create-config";
import deployCommands from "./deploy-commands";
import {
  IDiscordPluginCreateConfig,
  ModuleNameOrType,
  SlashMetadata,
  Unit,
} from "./interfaces/internal";
import { m } from "./metadata-handlers";

type SlashCommandCallback = (interaction: Interaction) => void | Promise<void>;

export class DiscordInjexPlugin implements IInjexPlugin {
  private container!: Injex<any>;

  private middlewareModules: IModule[];

  private slashModules: IModule[];
  private slashModuleMetadata: SlashMetadata[];
  private slashCommandPartials: SlashCommandBuilder[];
  private slashCommandCallbacks: SlashCommandCallback[];

  private token: Hidden<string>;
  private clientId: string;
  private guildId?: string;

  public client: Client;

  constructor(config: IDiscordPluginCreateConfig) {
    this.middlewareModules = [];

    this.slashModules = [];
    this.slashModuleMetadata = [];
    this.slashCommandPartials = [];
    this.slashCommandCallbacks = [];

    const {
      client,
      botId: clientId,
      token,
      guildId: devServer,
    } = createConfig(config);

    this.client = client;
    this.clientId = clientId;
    this.guildId = devServer;
    this.token = token;

    this.handleModule = this.handleModule.bind(this);
  }

  #_debug(...args: any[]) {
    this.container.logger.debug(...args);
  }

  #_info(...args: any[]) {
    this.container.logger.info(...args);
  }

  apply(container: Injex<any>): void | Promise<void> {
    this.container = container;
    this.container.logger.setNamespace(DiscordInjexPlugin.name);
    this.#_debug(`[apply]`);

    this.container.addObject(this.client, "client");

    this.container.hooks.afterModuleCreation.tap(
      this.handleModule,
      undefined,
      this
    );

    this.container.hooks.afterCreateModules.tap(
      this.initialiseModules,
      undefined,
      this
    );
  }

  protected async done() {
    this.#_debug(`[done]`);
    try {
      await this.client.login(this.token.get());
      this.container.logger.info("Access granted");
    } catch {
      this.container.logger.info("Access denied");
    }
  }

  protected handleModule(module: IModule) {
    this.#_debug(`[handleModule] ${module.metadata.item.name}`);
    if (m.hasMetadata(module.metadata.item)) {
      const metadata = m.getMetadata(module.metadata.item);

      if ("slash" in metadata) this.slashModules.push(module);
      else if ("middleware" in metadata) this.middlewareModules.push(module);
    }
  }

  protected async initialiseModules() {
    this.#_debug(`[initialiseModules]`);
    await this.slashInitialise();
    await this.slashDeploy();
    await this.slashRegister();

    await this.done();
  }
  protected async slashInitialise() {
    this.#_debug(`[slashInitialise]`);
    for (const slash of this.slashModules) {
      const slashMetadata = m.getMetadata(slash.metadata.item) as SlashMetadata;

      const {
        name,
        description,
        groups = [],
        commands = [],
        callback,
        options,
      } = slashMetadata;

      const rootBuilder = new SlashCommandBuilder();
      const rootCallbacks = [];

      rootBuilder
        /*  */
        .setName(name.toLowerCase().replace(/\s+/g, "-"))
        .setDescription(description);

      /**
       * This is a root command! Ignore groups/subcommands!
       */
      if (callback) {
        // ! Commands
        if (options) options(rootBuilder);

        // ! Callback
        this.slashSetInteractionCallbacks(slash, slashMetadata);
      }

      if (commands.length) {
        // ! Commands
        const subCommands = this.slashCreateSubcommands(
          new SlashCommandSubcommandBuilder(),
          commands
        );
        rootBuilder.addSubcommand(subCommands);
      }

      if (groups && groups.length) {
        // ! Commands
        for (const group of groups) {
          const groupCommands = this.slashCreateGroupedCommands(
            new SlashCommandSubcommandGroupBuilder(),
            commands,
            group
          );
          rootBuilder.addSubcommandGroup(groupCommands);
        }
      }

      // ! Callbacks
      for (const command of commands) {
        this.slashSetInteractionCallbacks(slash, slashMetadata, command);
      }

      // ! Commands
      this.slashCommandPartials.push(rootBuilder);
      this.slashModuleMetadata.push(slashMetadata);
    }

    // Log metadata
    this.container.logger.info("Slash Command Metadata:");
    for (const metadata of this.slashModuleMetadata) {
      this.container.logger.info(`- ${metadata.name}: ${metadata.description}`);
      if (metadata.groups) {
        this.container.logger.info(
          `  Groups: ${metadata.groups.map((g) => g.name).join(", ")}`
        );
      }
      if (metadata.commands) {
        this.container.logger.info(
          `  Commands: ${metadata.commands.map((c) => `${c.group}:${c.name}`).join(", ")}`
        );
      }
    }
  }

  protected async slashDeploy() {
    this.#_debug(`[slashDeploy]`);

    try {
      await deployCommands({
        commands: this.slashCommandPartials,
        token: this.token,
        clientId: this.clientId,
        mode: process.env.NODE_ENV,
        guildId: this.guildId,
      });
    } catch (e: any) {
      throw new Error(`Could not deploy commands: ${e.message}`);
      process.exit(1);
    }
  }

  protected async slashRegister() {
    this.#_debug(`[slashRegister]`);
    for (const interactionCallback of this.slashCommandCallbacks) {
      this.client.on("interactionCreate", async (interaction) => {
        try {
          await interactionCallback(interaction);
        } catch (e) {
          this.container.logger.info((e as Error).message);
        }
      });
    }
  }

  protected async getAsAsyncInstance<T = any>(module: IModule) {
    this.#_debug(`[getAsAsyncInstance]`);
    const moduleDefinition = this.container.getModuleDefinition(
      module.metadata.item
    );
    return moduleDefinition.metadata.singleton
      ? (moduleDefinition.module as T)
      : ((await moduleDefinition.module()) as T);
  }

  protected slashGetMiddlewareInstances(
    middlewares: ModuleNameOrType<Middleware>[]
  ) {
    this.#_debug(`[slashRegister]`);
    return middlewares.map(
      (m) => this.container.getModuleDefinition(m).module as Middleware
    );
  }

  protected slashCreateSubcommands(
    builder: SlashCommandSubcommandBuilder,
    commands: SlashMetadata["commands"]
  ) {
    this.#_debug(`[slashCreateSubcommands] ${commands}`);
    if (!commands) return builder;

    const subMetas = commands.filter((meta) => meta.group === null);

    for (const meta of subMetas) {
      this.#_debug(`[slashCreateSubcommands] Adding ${meta.name}`);

      builder
        /*  */
        .setName(meta.name)
        .setDescription(meta.description);

      if (meta.options)
        meta.options(builder as unknown as SlashCommandOptionsOnlyBuilder);
    }

    return builder;
  }

  protected slashCreateGroupedCommands(
    builder: SlashCommandSubcommandGroupBuilder,
    commands: SlashMetadata["commands"],
    group: Unit<Exclude<SlashMetadata["groups"], undefined>>
  ) {
    this.#_debug(`[slashCreateGroupedCommands]`);

    if (!commands) return builder;

    const groupMetas = commands.filter((meta) => meta.group !== null);

    const metasInGroup = groupMetas.filter((meta) => meta.group === group.name);

    builder
      /*  */
      .setName(group.name)
      .setDescription(group.description);

    for (const meta of metasInGroup) {
      this.#_debug(`[slashCreateGroupedCommands] Adding ${meta.name}`);

      const subCommandBuilder = new SlashCommandSubcommandBuilder();
      subCommandBuilder
        /*  */
        .setName(meta.name)
        .setDescription(meta.description);

      if (meta.options)
        meta.options(
          subCommandBuilder as unknown as SlashCommandOptionsOnlyBuilder
        );

      builder.addSubcommand(subCommandBuilder);
    }

    return builder;
  }

  protected slashSetInteractionCallbacks(
    module: IModule,
    metadata: SlashMetadata,
    command?: Unit<Exclude<SlashMetadata["commands"], undefined>>
  ) {
    this.#_debug(
      `::slashSetInteractionCallbacks ${module.metadata.item.name}::${String(
        command?.callback || "run"
      )}`
    );

    const self = this;
    const instance = this.getAsAsyncInstance<DiscordSlashCommand>(module);

    function createInteractionCallback(
      rootCallback: string,
      onInstance: Promise<any>,
      command: string,
      subCommand?: string,
      commandGroup?: string | null,
      middlewarePromises: Promise<Middleware>[] = [],
      onError?: (error: Error) => any
    ) {
      return async function interactionCallback(interaction: Interaction) {
        const middlewares: Middleware[] = await Promise.all(middlewarePromises);
        try {
          await self.validateMiddleware(middlewares)(interaction);
          const result = self.validateInteractionBasedOn(
            command,
            subCommand,
            commandGroup
          )(interaction);

          if (result) {
            self.#_info(`Calling ${module.metadata.item.name}::${rootCallback}`);
            (await onInstance)[rootCallback](interaction);
          }
        } catch (e) {
          onError && onError(e as Error);
        }
      };
    }

    const { name, callback, protectAll = [], protect = [] } = metadata;
    const middlewarePromises = this.getMiddlewarePromises(protectAll);

    if (command) {
      const { name: commandName, group, protect: groupProtect = [] } = command;

      const groupMiddlewarePromises = this.getMiddlewarePromises(groupProtect);
      const commandMiddlewarePromises = this.getMiddlewarePromises(
        protect
          .filter((p) => p.callback === command?.callback)
          .map(({ middleware }) => middleware)
      );

      if (typeof group === "string") {
        middlewarePromises.push(...groupMiddlewarePromises);
      }
      middlewarePromises.push(...commandMiddlewarePromises);
    }

    const interactionCallback = createInteractionCallback(
      (command?.callback || callback) as string,
      instance,
      name,
      command?.name,
      command?.group,
      middlewarePromises,
      (error) => {
        this.container.logger.info(error);
      }
    );
    this.slashCommandCallbacks.push(interactionCallback);
  }

  protected getMiddlewarePromises(names: ModuleNameOrType[]) {
    return names
      .map((name) => this.container.getModuleDefinition(name))
      .map((def) => this.getAsAsyncInstance<Middleware>(def));
  }

  protected validateInteractionBasedOn(
    name: string,
    subcommand?: string,
    group?: string | null
  ) {
    let self = this;

    return function (interaction: Interaction): boolean {
      let formatString = `/${name}`;

      if (!interaction.isChatInputCommand()) {
        self.#_debug(`${formatString}: failed command check`);
        return false;
      }

      // ! Always check name
      if (!(interaction.commandName === name)) {
        self.#_debug(`${formatString}: failed name check`);
        return false;
      }

      if (!("options" in interaction)) {
        self.#_debug(`${formatString}: failed options check`);
        return false;
      }

      if (subcommand && group) {
        formatString = `/${name} ${group} ${subcommand}`;

        // ! Type guard
        if (!("getSubcommandGroup" in interaction.options)) {
          self.#_debug(`${formatString}: failed group check`);
          return false;
        }

        // ! Type guard
        if (!("getSubcommand" in interaction.options)) {
          self.#_debug(`${formatString}: failed sub check`);
          return false;
        }

        // ! Check group and subcommand
        if (!(interaction.options.getSubcommandGroup() === group)) {
          self.#_debug(`${formatString}: failed group check`);
          return false;
        }

        if (!(interaction.options.getSubcommand() === subcommand)) {
          self.#_debug(`${formatString}: failed sub check`);
          return false;
        }
      } else if (subcommand && !group) {
        formatString = `/${name} ${subcommand}`;

        // ! Type guard
        if (!("getSubcommandGroup" in interaction.options)) {
          self.#_debug(`${formatString}: failed group check`);
          return false;
        }

        // ! Type guard
        if (!("getSubcommand" in interaction.options)) {
          self.#_debug(`${formatString}: failed sub check`);
          return false;
        }

        // ! Check NO group and subcommand
        if (interaction.options.getSubcommandGroup(false)) {
          self.#_debug(`${formatString}: failed group check`);
          return false;
        }

        if (!(interaction.options.getSubcommand() === subcommand)) {
          self.#_debug(`${formatString}: failed sub check`);
          return false;
        }
      } else {
        // ! Type guard
        if (!("getSubcommandGroup" in interaction.options)) {
          self.#_debug(`${formatString}: failed group check`);
          return false;
        }

        // ! Type guard
        if (!("getSubcommand" in interaction.options)) {
          self.#_debug(`${formatString}: failed sub check`);
          return false;
        }

        // ! Check NO group and NO subcommand
        if (interaction.options.getSubcommandGroup(false)) {
          self.#_debug(`${formatString}: failed group check`);
          return false;
        }

        if (interaction.options.getSubcommand(false)) {
          self.#_debug(`${formatString}: failed sub check`);
          return false;
        }
      }

      // ! All pass
      self.#_info(`${formatString}: all checks pass`);
      return true;
    };
  }

  protected validateMiddleware(middlewares: Middleware[]) {
    return async function (interaction: Interaction) {
      for (const middleware of middlewares) {
        const handleResult = await middleware.handle(interaction);
        if (handleResult !== true) throw handleResult;
      }
    };
  }
}
