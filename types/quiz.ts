export const QuestionType = {
  LONG_ANSWER: "LONG_ANSWER",
  SHORT_ANSWER: "SHORT_ANSWER",
  RADIO: "RADIO",
  CHECKBOX: "CHECKBOX",
  SELECT: "SELECT",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface BaseQuestion {
  text: string;
  type: QuestionType;
  required?: boolean;
}

export interface LongAnswerQuestion extends BaseQuestion {
  type: typeof QuestionType.LONG_ANSWER;
  placeholder?: string;
  maxLength?: number;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: typeof QuestionType.SHORT_ANSWER;
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
}

export interface RadioQuestion extends BaseQuestion {
  type: typeof QuestionType.RADIO;
  options: string[];
  correctOption: number;
}

export interface CheckboxQuestion extends BaseQuestion {
  type: typeof QuestionType.CHECKBOX;
  options: string[];
  correctOptions: number[];
}

export interface SelectQuestion extends BaseQuestion {
  type: typeof QuestionType.SELECT;
  options: string[];
  correctOption: number;
}

export type Question =
  | LongAnswerQuestion
  | ShortAnswerQuestion
  | RadioQuestion
  | CheckboxQuestion
  | SelectQuestion;
