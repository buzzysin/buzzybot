import { createOption } from "commander";


export const optForce = createOption(
  "-F, --force",
  "disables safety catches like writing into non-existant directories"
).default(false);
