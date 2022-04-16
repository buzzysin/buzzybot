import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { IConstructor, MetadataHandlers } from "@injex/stdlib";
import { Client, ClientOptions } from "discord.js";
import { Middleware } from "../classes/middleware";


export type TSlashCommandBuilderCallback<R = any> = (builder: SlashCommandBuilder) => R;
export type TClassDecorator<C extends Function = any> = (target: IConstructor<C>) => IConstructor<any> | void;
export type TMethodDecorator<C extends Function = any> = (
  target: { constructor: C },
  key: string | symbol,
  desc: TypedPropertyDescriptor<C>
) => TypedPropertyDescriptor<C> | void;

export type IDiscordPluginCreateConfig = { token: string; clientId: string; devServer?: string } & {
  client?: ClientOptions | Client;
};
export type IDiscordPluginConfig = { token: string; client: Client; clientId: string; devServer?: string };

export type IInteractionConfig = {
  name: string;
  description?: string;
  extendPath?: string[];
};

export type Unit<T> = T extends (infer U)[] ? U : T;
export type OneOrN<T> = T | T[];

export type ModuleNameOrType<T = any> = IConstructor<T> | string;

export interface SlashMetadataPublic {
  /**
   * The name of the slash command
   */
  name: string;
  /**
   * The description for the slash command
   */
  description: string;
  /**
   * Configure options, if any
   */
  options?: (
    builder: SlashCommandOptionsOnlyBuilder
  ) => Omit<SlashCommandOptionsOnlyBuilder, "addSubcommand" | "addSubcommandGroup">;
}

export interface MiddlewareMetadata {
  middleware: true;
}
export interface SlashMetadataPrivate {
  // Hidden API
  slash: "button" | "command" | "contextMenu" | "selectMenu" | "messageComponent";
  /**
   * Defined root command callback (`run` unless configured otherwise)
   */
  callback: string | symbol;
  /**
   * Define command groups (disables root command)
   */
  groups?: (SlashMetadataPublic & {
    /**
     * Group-level protection
     */
    protect?: ModuleNameOrType<Middleware>[];
  })[];
  /**
   * Callback-level proptection
   */
  protect: {
    /**
     * The name of the protected method
     */
    callback: string | symbol;
    /**
     *
     */
    middleware: ModuleNameOrType<Middleware>;
  }[];
  /**
   * Map of commands to methods
   * - **Note** this is a partial due to resolution order of decorators
   * and I'm too lazy to fix it right now
   *
   * @todo Make this Required!
   */
  commands?: (SlashMetadataPublic & {
    /**
     * The name of the method
     */
    callback: string | symbol;
    /**
     * The name of the group of the command, if applicable
     */
    group: string | null;
    /**
     * Command-level protection
     */
    protect: ModuleNameOrType<Middleware>[];
  })[];
  /**
   * Root-level protection
   */
  protectAll: ModuleNameOrType<Middleware>[];
}
export interface SlashMetadata extends SlashMetadataPublic, SlashMetadataPrivate {}

export interface MessageMetadata {
  message: true;
}

export interface Metadata extends Partial<SlashMetadata>, Partial<MessageMetadata>, Partial<MiddlewareMetadata> {}

export interface MyMetadataHandlers<T> extends MetadataHandlers<T> {
  setMetadata: <K extends keyof T>(target: any, key: K, value: T[K]) => void;
  pushMetadata: <K extends keyof T>(target: any, key: K, value: Unit<T[K]>) => void;
}
