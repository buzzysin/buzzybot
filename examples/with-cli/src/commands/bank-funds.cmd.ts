import {
  DiscordCommand,
  Middleware,
  slash,
} from "@buzzybot/injex-discord-plugin";
import { HandleResult } from "@buzzybot/injex-discord-plugin/dist/classes/middleware";
import {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

// bank-funds.cmd.ts

// ... imports

const requiredIntegerOption = (options: SlashCommandOptionsOnlyBuilder) =>
  options.addIntegerOption((integerOpts) =>
    integerOpts.setName("amount").setDescription("amount").setRequired(true)
  );

const requiredUserOption = (options: SlashCommandOptionsOnlyBuilder) =>
  options.addUserOption((userOpts) =>
    userOpts.setName("user").setDescription("user").setRequired(true)
  );

const optionalUserOption = (options: SlashCommandOptionsOnlyBuilder) =>
  options.addUserOption((userOpts) =>
    userOpts.setName("user").setDescription("user").setRequired(false)
  );

const compose =
  <T>(fns: Array<(options: T) => T>) =>
  (options: T) =>
    fns.reduce((acc, fn) => fn(acc), options);

class AdminsOnly extends Middleware {
  handle(
    interaction: Interaction<CacheType>
  ): HandleResult | Promise<HandleResult> {
    return {};
  }
}

class NonEmptyWallet extends Middleware {
  handle(
    interaction: Interaction<CacheType>
  ): HandleResult | Promise<HandleResult> {
    return {};
  }
}

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
      // protect: [AdminsOnly],
    },
    {
      name: "transact",
      description: "Give another user some money",
      options: requiredUserOption,
      // protect: [NonEmptyWallet],
    },
  ],
})
export class BankFundsCommand extends DiscordCommand {
  /* Note that `run()` is no longer implemented */
  async run(...args: [ChatInputCommandInteraction]) {
    const [interaction] = args;

    await interaction.reply("Money money money");
  }

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
    options: compose([requiredIntegerOption, requiredUserOption]),
  })
  async fundsEditIncrease(command: ChatInputCommandInteraction) {
    // ... command.options.getUser() is defined
    // ... command.options.getInteger() is defined

    const amount = command.options.getInteger("amount");
    const user = command.options.getUser("user");

    // ... do something with amount and user
    await command.reply(`Increased ${user?.username}'s wallet by ${amount}`);
  }

  // fundsEditDecrease(...) { /* ... */ }

  @slash.group.command({
    group: "transact",
    name: "pay",
    description: "Add `n` to the user's wallet.",
    options: compose([requiredIntegerOption, requiredUserOption]),
  })
  async fundsTransactPay(command: ChatInputCommandInteraction) {
    // ... command.options.getUser() is defined
    // ... command.options.getInteger() is NOT defined (not available in this group)

    const amount = command.options.getInteger("amount")!;
    const user = command.options.getUser("user")!;

    // ...
    await command.reply(`Paid ${user?.username} ${amount}`);
  }

  /** introducing @slash.sub */
  @slash.sub({
    name: "get",
    description: "Get the value of a wallet",
    options: optionalUserOption,
  })
  async fundsGet(command: ChatInputCommandInteraction) {
    // command.options.user() is available

    const user = command.options.getUser("user")!;

    // ...
    let balance = Math.floor(Math.random() * 10000); // mock balance
    await command.reply(`Got ${user?.username}'s wallet balance: ${balance}`);
  }

  // ... etc.
}
