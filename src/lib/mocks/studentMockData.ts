import type { ExamType } from "@/types/exam";
import type { QuestionLevel } from "@/types/question";

export type StudentAssignmentStatus = "pending" | "grading" | "completed";
export type StudentAssignmentType = "SPEAKING" | "WRITING" | "MULTIPLE_CHOICE";

export type AiAnalysis = {
  score: number;
  cefrLevel: QuestionLevel;
  grammarFeedback: string;
  vocabularyFeedback: string;
  generalReview: string;
  metrics: {
    grammar: number;
    vocabulary: number;
    coherence: number;
    fluency?: number;
    pronunciation?: number;
    taskAchievement?: number;
  };
};

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
  content?: string;
  aiAnalysis?: AiAnalysis;
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

const COMPLETED_WRITING_ANALYSIS: AiAnalysis = {
  score: 76,
  cefrLevel: "B2",
  grammarFeedback:
    "Tense kullanımı genel olarak doğru. Subject-verb agreement hatalarına dikkat edilmeli.",
  vocabularyFeedback:
    "Akademik kelime çeşitliliği artırılabilir. Aynı sıfatların tekrarı azaltılmalı.",
  generalReview:
    "Essay yapısı iyi ancak kelime çeşitliliği artırılmalı. Bağlaç kullanımı güçlü. Paragraf geçişlerinde daha akıcı olunabilir.",
  metrics: {
    grammar: 80,
    vocabulary: 70,
    coherence: 78,
    taskAchievement: 76,
  },
};

const COMPLETED_SPEAKING_ANALYSIS: AiAnalysis = {
  score: 71,
  cefrLevel: "B1",
  grammarFeedback:
    "Basit cümle yapıları doğru; karmaşık cümlelerde daha dikkatli olunmalı.",
  vocabularyFeedback:
    "Konuya uygun kelimeler kullanılmış; akademik ifadeler artırılabilir.",
  generalReview:
    "Akıcılık orta seviyede. Kelime bilgisi yeterli ama telaffuz iyileştirilmeli. Dilbilgisi hatalarına dikkat.",
  metrics: {
    grammar: 75,
    vocabulary: 68,
    coherence: 72,
    fluency: 72,
    pronunciation: 70,
  },
};

const COMPLETED_QUIZ_ANALYSIS: AiAnalysis = {
  score: 82,
  cefrLevel: "B1",
  grammarFeedback:
    "Past Perfect ve Conditionals konularında tekrar faydalı olacaktır.",
  vocabularyFeedback:
    "Kelime sorularında başarı yüksek; collocation çalışması önerilir.",
  generalReview:
    "Genel olarak iyi bir performans. Tenses konusunda 'Past Perfect' kullanımında hata yapıyorsun. Conditional cümlelerde de dikkatli ol.",
  metrics: {
    grammar: 80,
    vocabulary: 85,
    coherence: 88,
    taskAchievement: 82,
  },
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
    className: "YÖKDİL Sağlık Bilimleri",
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
    aiAnalysis: COMPLETED_QUIZ_ANALYSIS,
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
    content:
      "Environmental protection has become one of the most critical challenges of our time. Governments and individuals must cooperate to reduce carbon emissions and promote sustainable practices.",
    aiAnalysis: COMPLETED_WRITING_ANALYSIS,
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
    aiAnalysis: COMPLETED_SPEAKING_ANALYSIS,
  },
];

export const MOCK_SUBMISSION_RESULTS: SubmissionResult[] = [
  {
    assignmentId: "sa-4",
    score: 82,
    totalQuestions: 15,
    correctAnswers: 12,
    wrongAnswers: 3,
    feedback: COMPLETED_QUIZ_ANALYSIS.generalReview,
    aiAnalysis: COMPLETED_QUIZ_ANALYSIS.metrics as Record<string, number>,
    submittedAt: "2026-07-14T14:30:00Z",
  },
  {
    assignmentId: "sa-5",
    score: 76,
    totalQuestions: 1,
    correctAnswers: 1,
    wrongAnswers: 0,
    feedback: COMPLETED_WRITING_ANALYSIS.generalReview,
    aiAnalysis: COMPLETED_WRITING_ANALYSIS.metrics as Record<string, number>,
    submittedAt: "2026-07-11T10:15:00Z",
  },
  {
    assignmentId: "sa-6",
    score: 71,
    totalQuestions: 2,
    correctAnswers: 2,
    wrongAnswers: 0,
    feedback: COMPLETED_SPEAKING_ANALYSIS.generalReview,
    aiAnalysis: COMPLETED_SPEAKING_ANALYSIS.metrics as Record<string, number>,
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

const CEFR_LEVELS: QuestionLevel[] = ["A2", "B1", "B2", "C1", "C2"];

export function generateMockAiAnalysis(
  type: StudentAssignmentType,
  levelHint?: string
): AiAnalysis {
  const score = 72 + Math.floor(Math.random() * 23);
  const cefrLevel =
    (CEFR_LEVELS.find((l) => l === levelHint) as QuestionLevel | undefined) ??
    CEFR_LEVELS[Math.min(Math.floor(score / 20), CEFR_LEVELS.length - 1)];

  const grammar = Math.min(98, score + Math.floor(Math.random() * 8) - 2);
  const vocabulary = Math.min(98, score + Math.floor(Math.random() * 10) - 4);
  const coherence = Math.min(98, score + Math.floor(Math.random() * 6) - 1);

  if (type === "SPEAKING") {
    return {
      score,
      cefrLevel,
      grammarFeedback:
        "Cümle yapıları anlaşılır; karmaşık dilbilgisi yapıları daha tutarlı kullanılabilir.",
      vocabularyFeedback:
        "Kelime dağarcığı yeterli. Daha fazla akademik ve bağlaç ifadesi eklenebilir.",
      generalReview:
        "Konuşma akıcılığı iyi seviyede. Telaffuz ve vurgu çalışması ile skor yükseltilebilir. Konuya bağlı kalma başarılı.",
      metrics: {
        grammar,
        vocabulary,
        coherence,
        fluency: Math.min(98, score + Math.floor(Math.random() * 5)),
        pronunciation: Math.min(98, score - 2 + Math.floor(Math.random() * 6)),
      },
    };
  }

  if (type === "WRITING") {
    return {
      score,
      cefrLevel,
      grammarFeedback:
        "Dilbilgisi genel olarak güçlü. Zaman uyumu ve bağlaç seçimlerinde küçük iyileştirmeler mümkün.",
      vocabularyFeedback:
        "Kelime çeşitliliği iyi. Eş anlamlı akademik kelimelerle zenginleştirme önerilir.",
      generalReview:
        "Yazı yapısı net ve görev odaklı. Giriş-gelişme-sonuç dengesi korunmuş. Detaylı örnekler puanı daha da yükseltebilir.",
      metrics: {
        grammar,
        vocabulary,
        coherence,
        taskAchievement: Math.min(98, score + Math.floor(Math.random() * 4)),
      },
    };
  }

  return {
    score,
    cefrLevel,
    grammarFeedback:
      "Gramer sorularında başarı yüksek. Zayıf konulara özel tekrar listesi oluşturulabilir.",
    vocabularyFeedback:
      "Kelime bilgisi tutarlı. Collocation ve phrasal verb pratiği faydalı olur.",
    generalReview:
      "Quiz tamamlandı. Genel doğruluk oranı güçlü; hatalı konular için kısa bir tekrar seti önerilir.",
    metrics: {
      grammar,
      vocabulary,
      coherence,
      taskAchievement: score,
    },
  };
}

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

export type StudentClassInfo = {
  id: string;
  name: string;
  examType: ExamType;
};

/** Stable id from class display name for sidebar selection */
export function classNameToId(className: string): string {
  return className
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStudentClasses(
  assignments: StudentAssignment[]
): StudentClassInfo[] {
  const map = new Map<string, StudentClassInfo>();
  for (const assignment of assignments) {
    const id = classNameToId(assignment.className);
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: assignment.className,
        examType: assignment.examType,
      });
    }
  }
  return Array.from(map.values());
}
