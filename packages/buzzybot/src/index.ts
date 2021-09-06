import setupInjex from "@buzzybot/buzzybot/setup/injex";
import { apiToken, clientId, guildId } from "@buzzybot/buzzybot/util/environment/variables";

setupInjex({ token: apiToken, clientId, guildId });
