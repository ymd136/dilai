export type ExamType = "TOEFL" | "YDS" | "YOKDIL";

export type ExamOption = {
  id: ExamType;
  name: string;
  fullName: string;
  color: string;
  sections: string[];
};

export const EXAM_COLORS: Record<ExamType, string> = {
  TOEFL: "#6366f1",
  YDS: "#8b5cf6",
  YOKDIL: "#a855f7",
};
