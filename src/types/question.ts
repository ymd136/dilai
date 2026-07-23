export type QuestionLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface BaseQuestion {
  id: string;
  level: QuestionLevel;
  topic: string;
  question: string;
}

export interface SpeakingQuestion extends BaseQuestion {
  recommendedDuration: number; // in seconds
}

export interface WritingQuestion extends BaseQuestion {
  minWords: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  options: string[];
  correctAnswer: string;
}

export interface QuestionBank {
  speaking: SpeakingQuestion[];
  writing: WritingQuestion[];
  multiple_choice: MultipleChoiceQuestion[];
}
