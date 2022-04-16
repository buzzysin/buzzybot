import { createOption } from "commander";


export const optForce = createOption(
  "-f, --force",
  "disables safety catches like writing into non-existant directories"
).default(false);
