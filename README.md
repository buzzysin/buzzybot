# `@buzzybot/buzzybot` <!-- omit in toc -->

- [Introduction](#introduction)
  - [What is this?](#what-is-this)
  - [Why?](#why)
- [Packages](#packages)
- [Usage](#usage)
  - [Prerequisites](#prerequisites)
  - [`@buzzybot/cli`](#buzzybotcli)
    - [Directory structure](#directory-structure)
  - [`@buzzybot/injex-discord-plugin`](#buzzybotinjex-discord-plugin)
    - [`@slash`](#slash)
    - [`@slash.group` and `@slash.group.command`](#slashgroup-and-slashgroupcommand)
    - [`@slash.sub`](#slashsub)
    - [Features](#features)
      - [(Almost) Automatic](#almost-automatic)
      - [Granular Protection](#granular-protection)
      - [No faff](#no-faff)
- [Disclaimers](#disclaimers)
- [Thanks](#thanks)

## Introduction

### What is this?

This is a proof-of-concept 'framework' (using that term very lightly) that makes use of dependency injection to write Discord bots. I'm currently writing mine with this!

### Why?

This is mainly a project to develop my understanding of:

- Typescript
- Industry-standard publishing lifecycle of NPM projects
- Continuous integration/deployment and workflows/actions

In no way is this expected to be used in a serious manner (see [disclaimers](#disclaimers)).

## Packages

This repo currently defines two repos: `@buzzybot/injex-discord-plugin` and `@buzzybot/cli`.

## Usage

Please note that the following only contains _intended_ API usage. If the usage is unimplemented, it will be marked as such.

### Prerequisites

It would help you if you were familiar with the [Discord.JS Guide][discord-js]. I'm still learning myself.

### `@buzzybot/cli`

#### Directory structure

```bash
> src
|-- > commands
|   |-- > example.cmd.ts # Custom extensions don't matter here
|
|-- > middleware
|   |-- > example.mdw.ts
|
|-- > setup/injex
|   |-- > bootstrap.ts
|   |-- > index.ts
...
```

### `@buzzybot/injex-discord-plugin`

This [Injex] plugin introduces a few decorators to be used on classes.

<details>

  <summary> For your information</summary>

> 06/09/2021 - As of writing this, there is only support for slash commands, and the names of the decorators are written to reflect this. Full slash support hopefully means a full release (1.0.0).

</details>

#### `@slash`

This `ClassDecorator` factory has three possible uses. It can be used to define a slash command, define subcommands, or scoped subcommands (subcommand groups). It is the bulkiest and most flexible available - a whole tree of subcommands and group subcommands can be created using this.

```ts
// example-one.cmd.ts

// ... imports

@slash({
  name: "ping",
  description: "Send the user a ping!",
  options: addUserOption /* recieves a `SlashCommandOptions` builder* */,
  protect: [OnlyRolesThatCanPing],
  protectAll: [OnlyOnlineMembers],
})
export class ExampleOneCommand {
  /* must implement run(...) if the command is a root slash command ONLY */
  async run(interaction: CommandInteraction) {
    const user = interaction.options.getUser();

    if (user) {
      await command.reply(`Hello, ${user}! ${command.user.username} says hi!`);
    } else {
      await command.reply(`Hello ${command.user}!`);
    }
  }
}
```

> Asterisk\* - implementation omitted for brevity.

The true features of this API come to light under the `protect` and `protectAll` options. These take in middleware-like class definitions that provide different levels of [protection](#granular-protection).

#### `@slash.group` and `@slash.group.command`

The `ClassDecorator` factory `@slash.group` does **not** define a command, so using `@slash({ name: "..." })` is still required.

However using `@slash({ groups: [] })` is almost functionally equivalent and is a viable alternative if you want rules and options to be scoped by group.

> _This is almost analogous to the @define() decorator in [Injex]. In fact, it [uses](./packages/injex-discord-plugin/src/decorators/slash.ts) it_.

The `MethodDecorator` `@slash.group.command` works in tandem with `@slash.group`, as it defines commands but not the groups they belong to. If a group is not defined, the subcommand it would belong to is ignored.

> _Perhaps there is scope for this to be done dynamically._

```ts
// bank-funds.cmd.ts

// ... imports

// @slash({ groups: [...] }) syntax
@slash({
  name: "funds",
  description: "Manage a user's wallet",
  groups: [
    {
      name: "edit",
      description: "Edit the value of a user's wallet",
      /* this compose function does not exist, it is merely conceptual */
      options: compose([requiredIntegerOption, requiredUserOption]),
      protect: [AdminsOnly],
    },
    {
      name: "transact",
      description: "Give another user some money",
      options: requiredUserOption,
      protect: [NonEmptyWallet]
    },
  ],
})
export class BankFundsCommand {
  /* Note that `run()` is no longer implemented */

  /**
   * Also note that the defining a group does not define its subcommands,
   * therefore this class could still be valid even if it was empty.
   */

  /**
   * Finally note that options and protections apply to ALL subcommands in
   * the defined group, so they will have the same options and protections.
   */

  /**
   * As above, @slash.group.commands is used to define the grouped commands.
   */

  @slash.group.command({
    group: "edit",
    name: "increase",
    description: "Add `n` to the user's wallet.",
  })
  fundsEditIncrease(command: CommandInteraction) {
    // ... command.options.getUser() is defined
    // ... command.options.getInteger() is defined
  }

  fundsEditDecrease(...) { /* ... */ }

  @slash.group.command({
    group: "transact",
    name: "pay",
    description: "Add `n` to the user's wallet.",
  })
  fundsTransactPay(command: CommandInteraction) {
    // ... command.options.getUser() is defined
    // ... command.options.getInteger() is NOT defined (not available in this group)
  }

  // ... etc.
}
```

#### `@slash.sub`

This `MethodDecorator` factory is almost identical in fashion to `@slash.command`, except there is no need to specify a group (since subcommands do not have groups). Subcommands (not to be confused with grouped subcommands) can coexist with grouped subcommands, but both erase the use of a base command (refer to [this][discord-api-subcmd] page) and therefore `run()` is no longer required. Reusing the previous example:

```ts
/**
 * ...the same @slash declaration as before, just in a
 * different syntax
 */
@slash({ name: "funds", ... })
@slash.group({ name: "edit", ... })
@slash.group({ name: "transact", ... })
export class BankFundsCommand {
  /** ...same functions and @slash.group.commands as before */

  /** introducing @slash.sub */
  @slash.sub({
    name: "get",
    description: "Get the value of a wallet",
    options: optionalUserOption
  })
  fundsGet(command: CommandInteraction) {
    // command.options.user() is available
  }

}
```

#### Features

##### (Almost) Automatic

Because of [Injex][injex]'s ability to read and register command files, any decorated command class is registered and immediately available for use. The full power of this framework isn't even realised fully here! _(Yet?)_

##### Granular Protection

The `protect` and `protectAll` options available on each decorator provides you with base command-, group command-, endpoint- and _method_-level protection, hopefully making scoping permissions easier.

##### No faff

No more of this:

```ts
if (!interaction.isCommand()) return;
if (interaction.options.getSubcommand() !== subCommand) return;
...
```

... I mean, it is in the source code if you want to read it, but you don't have to type it!

## Disclaimers

This is a proof-of-concept project only. Use at your own risk, as this library is:

- **UNtested** - is yet to be `jest`-ified
- **UNverified** - the only user is [me][@buzzysin]
- **UNsafe** - there is no sanitisation

## Thanks

Projects

![discordjs](https://github.com/discordjs.png?size=50 "For putting up with Discord HQ and their weird policies")
![lerna](https://github.com/lerna.png?size=50 "For making monorepos easier (?)")

People

![uditalias](https://github.com/uditalias.png?size=50 "For being and active maintainer of an awesome framework")
![leone25](https://github.com/leone25.png?size=50 "For making me love hating Typescript")

---

![🐝](https://github.com/buzzysin.png?size=50 "🐝")

Copyright &copy; [@buzzysin] 2021

[@buzzysin]: https://github.com/buzzysin
[injex]: https://github.com/uditalias/injex
[discord-js]: https://discordjs.guide
[discord-api-subcmd]: https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups
