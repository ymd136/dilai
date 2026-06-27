import type { ExamType } from "./exam";

export type MentorCardType =
  | "speaking_simulation"
  | "weakness_boost"
  | "word_of_day";

export type MentorRecommendation = {
  id: string;
  type: MentorCardType;
  title: string;
  description: string;
  examType: ExamType;
  priority: "high" | "medium" | "low";
  meta?: {
    weakness?: string;
    word?: string;
    meaning?: string;
    exampleSentence?: string;
  };
};
