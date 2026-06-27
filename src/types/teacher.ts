import type { ExamType } from "./exam";

export type TeacherAssistantCardType =
  | "create_assignment"
  | "performance_forecast"
  | "weekly_vocabulary";

export type TeacherAssistantCard = {
  id: string;
  type: TeacherAssistantCardType;
  title: string;
  description: string;
  examType: ExamType;
  meta?: {
    projectedSuccess?: string;
    optimizationTip?: string;
    wordCount?: number;
    sampleWords?: string[];
  };
};

export type ClassStudent = {
  id: string;
  name: string;
  progressScore: number;
};

export type TeacherClass = {
  id: string;
  name: string;
  examType: ExamType;
  studentCount: number;
  students: ClassStudent[];
};

export type TeacherAssignmentType =
  | "Speaking"
  | "Reading"
  | "Writing"
  | "Listening"
  | "Grammar";

export type TeacherAssignment = {
  id: string;
  title: string;
  examType: ExamType;
  assignmentType: TeacherAssignmentType;
  submittedCount: number;
  totalCount: number;
  className: string;
  dueDate: string;
};
