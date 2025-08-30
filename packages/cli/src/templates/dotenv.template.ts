import dedent from "dedent";

export type DotenvTemplateOpts = {};

export default function dotenvTemplate({}: DotenvTemplateOpts = {}) {
  return dedent`
  NODE_ENV=development

  # Here goes your bot's API token, retreiveable from the Discord developer portal
  DISCORD_API_TOKEN=<BOT_TOKEN>

  # With application commands, you must deploy the commands before they can be used.
  # These options below aim to try and deploy your commands so that they can be used
  # in all the servers your bot occupies.

  # This is the ID of your testing server (guild)
  DISCORD_GUILD_ID=<GUILD_ID>
  # This is your bot/application ID
  DISCORD_BOT_ID=<BOT_ID>

  # Remember - this file will almost always contain information sensitive to your
  # application. Do not commit this file to any public repositories.
  `.trimStart();
}
