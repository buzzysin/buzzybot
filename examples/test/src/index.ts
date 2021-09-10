import setupInjex from "./setup/injex"
import { apiToken, clientId, guildId } from "./util/environment/variables"

setupInjex({ token: apiToken, clientId, guildId })