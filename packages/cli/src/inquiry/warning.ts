import { confirmQuestion } from "@buzzybot/cli/inquiry/standard";
import { Logger } from "@buzzybot/cli/logger";
import { prompt } from "inquirer";

export const forceWarning = async (
  log: Logger,
  forceFlag: boolean,
  failTest: boolean,
  confirm: string,
  warning: string,
  error: string
) => {
  // If successful
  if (!failTest) return true;

  // If unsuccessful test but force is enabled
  if (forceFlag) {
    // ! Do not ask permission
    log.warn(`Warning - using the \`--force\`, ${warning}`);
    return true;
  }

  // ? Get permission
  const permission = await prompt(confirmQuestion(confirm));

  // ? Permission recieved?
  if (permission.confirm_) {
    return true;
  }

  // ! Exit
  log.error(error);
  log.error("");
  log.error("To ignore this message, use the `--force`!");
  return false;
};
