/* @ts-ignore-next-line */
import inquirer, { Question, QuestionCollection } from "inquirer";

export interface Answers {
  confirm: boolean;
}
/* @ts-ignore-next-line */
export type AnswerConfirm<N extends string = ""> = QuestionCollection<
  {
    [x in `confirm_${N}`]: boolean;
  }
>;
/* @ts-ignore-next-line */
export const confirmQuestion = <N extends string = "">(message: string, name: N = ""): AnswerConfirm<N> => ({
  name: `confirm_${name}`,
  message,
  type: "confirm",
});

