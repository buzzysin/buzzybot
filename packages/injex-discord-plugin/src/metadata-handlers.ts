import { createMetadataHandlers } from "@injex/stdlib";
import { Metadata, MyMetadataHandlers } from "./interfaces/internal";

const metadataKey = Symbol("injex-discord-plugin");

export const metadataHandlers: MyMetadataHandlers<Metadata> = createMetadataHandlers(metadataKey);
export const m = metadataHandlers