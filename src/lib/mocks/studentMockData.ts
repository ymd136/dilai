import type { ExamType } from "@/types/exam";

export type StudentAssignmentStatus = "pending" | "in_progress" | "completed";
export type StudentAssignmentType = "SPEAKING" | "WRITING" | "MULTIPLE_CHOICE";

export type StudentAssignment = {
  id: string;
  title: string;
  examType: ExamType;
  type: StudentAssignmentType;
  level: string;
  questionCount: number;
  dueDate: string;
  status: StudentAssignmentStatus;
  score?: number;
  className: string;
};

export type SubmissionResult = {
  assignmentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  feedback: string;
  aiAnalysis: Record<string, number>;
  submittedAt: string;
};

export type StudentWeeklyTrend = {
  week: string;
  score: number;
};

export type StudentSkillScore = {
  label: string;
  value: number;
};

export const MOCK_STUDENT_ASSIGNMENTS: StudentAssignment[] = [
  {
    id: "sa-1",
    title: "Seviye Tespit Sınavı — A2 Grammar",
    examType: "YDS",
    type: "MULTIPLE_CHOICE",
    level: "A2",
    questionCount: 10,
    dueDate: "2026-07-20",
    status: "pending",
    className: "YDS İlkbahar Grubu",
  },
  {
    id: "sa-2",
    title: "TOEFL Speaking Practice — B2",
    examType: "TOEFL",
    type: "SPEAKING",
    level: "B2",
    questionCount: 3,
    dueDate: "2026-07-18",
    status: "pending",
    className: "TOEFL Akademik",
  },
  {
    id: "sa-3",
    title: "YÖKDİL Writing Task — C1",
    examType: "YOKDIL",
    type: "WRITING",
    level: "C1",
    questionCount: 2,
    dueDate: "2026-07-22",
    status: "pending",
    className: "YÖKDİL Fen Bilimleri",
  },
  {
    id: "sa-4",
    title: "B1 Grammar Tenses Quiz",
    examType: "YDS",
    type: "MULTIPLE_CHOICE",
    level: "B1",
    questionCount: 15,
    dueDate: "2026-07-15",
    status: "completed",
    score: 82,
    className: "YDS İlkbahar Grubu",
  },
  {
    id: "sa-5",
    title: "TOEFL Writing — Environment Essay",
    examType: "TOEFL",
    type: "WRITING",
    level: "B2",
    questionCount: 1,
    dueDate: "2026-07-12",
    status: "completed",
    score: 76,
    className: "TOEFL Akademik",
  },
  {
    id: "sa-6",
    title: "Speaking Practice — Daily Life",
    examType: "TOEFL",
    type: "SPEAKING",
    level: "B1",
    questionCount: 2,
    dueDate: "2026-07-10",
    status: "completed",
    score: 71,
    className: "TOEFL Speaking Bootcamp",
  },
];

export const MOCK_SUBMISSION_RESULTS: SubmissionResult[] = [
  {
    assignmentId: "sa-4",
    score: 82,
    totalQuestions: 15,
    correctAnswers: 12,
    wrongAnswers: 3,
    feedback:
      "Genel olarak iyi bir performans. Tenses konusunda 'Past Perfect' kullanımında hata yapıyorsun. Conditional cümlelerde de dikkatli ol.",
    aiAnalysis: {
      tenses: 78,
      vocabulary: 85,
      grammar: 80,
      comprehension: 88,
    },
    submittedAt: "2026-07-14T14:30:00Z",
  },
  {
    assignmentId: "sa-5",
    score: 76,
    totalQuestions: 1,
    correctAnswers: 1,
    wrongAnswers: 0,
    feedback:
      "Essay yapısı iyi ancak kelime çeşitliliği artırılmalı. Bağlaç kullanımı güçlü. Paragraf geçişlerinde daha akıcı olunabilir.",
    aiAnalysis: {
      grammar: 80,
      vocabulary: 70,
      coherence: 78,
      taskAchievement: 76,
    },
    submittedAt: "2026-07-11T10:15:00Z",
  },
  {
    assignmentId: "sa-6",
    score: 71,
    totalQuestions: 2,
    correctAnswers: 2,
    wrongAnswers: 0,
    feedback:
      "Akıcılık orta seviyede. Kelime bilgisi yeterli ama telaffuz iyileştirilmeli. Dilbilgisi hatalarına dikkat.",
    aiAnalysis: {
      fluency: 72,
      vocabulary: 68,
      grammar: 75,
      pronunciation: 70,
    },
    submittedAt: "2026-07-09T16:45:00Z",
  },
];

export const MOCK_STUDENT_WEEKLY_TREND: StudentWeeklyTrend[] = [
  { week: "H1", score: 58 },
  { week: "H2", score: 63 },
  { week: "H3", score: 67 },
  { week: "H4", score: 71 },
  { week: "H5", score: 74 },
  { week: "H6", score: 76 },
  { week: "H7", score: 79 },
];

export const MOCK_STUDENT_SKILL_SCORES: StudentSkillScore[] = [
  { label: "Speaking", value: 71 },
  { label: "Writing", value: 76 },
  { label: "Grammar", value: 82 },
  { label: "Vocabulary", value: 74 },
];

export const MOCK_TOPIC_ERROR_RATES: { topic: string; errorRate: number }[] = [
  { topic: "Past Perfect", errorRate: 42 },
  { topic: "Conditionals", errorRate: 38 },
  { topic: "Passive Voice", errorRate: 31 },
  { topic: "Modals", errorRate: 27 },
  { topic: "Prepositions", errorRate: 24 },
  { topic: "Collocations", errorRate: 21 },
  { topic: "Articles", errorRate: 18 },
  { topic: "Conjunctions", errorRate: 14 },
];

export function getStudentAssignmentsByStatus(
  status?: StudentAssignmentStatus
): StudentAssignment[] {
  if (!status) return MOCK_STUDENT_ASSIGNMENTS;
  return MOCK_STUDENT_ASSIGNMENTS.filter((a) => a.status === status);
}

export function getSubmissionResult(
  assignmentId: string
): SubmissionResult | undefined {
  return MOCK_SUBMISSION_RESULTS.find((r) => r.assignmentId === assignmentId);
}
