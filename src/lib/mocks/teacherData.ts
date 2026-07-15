import type { ExamType } from "@/types/exam";
import type {
  TeacherAssistantCard,
  TeacherAssignment,
  TeacherClass,
  TeacherStudentSubmission,
} from "@/types/teacher";
import type { AiAnalysis } from "@/lib/mocks/studentMockData";
import { generateMockAiAnalysis } from "@/lib/mocks/studentMockData";

export const MOCK_TEACHER_CLASSES: TeacherClass[] = [
  {
    id: "cls-toefl-1",
    name: "TOEFL Akademik",
    examType: "TOEFL",
    studentCount: 8,
    students: [
      { id: "s1", name: "Ahmet Yılmaz", progressScore: 78 },
      { id: "s2", name: "Elif Kaya", progressScore: 85 },
      { id: "s3", name: "Can Öztürk", progressScore: 62 },
      { id: "s4", name: "Zeynep Arslan", progressScore: 91 },
    ],
  },
  {
    id: "cls-toefl-2",
    name: "TOEFL Speaking Bootcamp",
    examType: "TOEFL",
    studentCount: 6,
    students: [
      { id: "s5", name: "Burak Demir", progressScore: 70 },
      { id: "s6", name: "Selin Aydın", progressScore: 88 },
      { id: "s7", name: "Emre Çelik", progressScore: 74 },
    ],
  },
  {
    id: "cls-yds-1",
    name: "YDS İlkbahar Grubu",
    examType: "YDS",
    studentCount: 12,
    students: [
      { id: "s8", name: "Ayşe Yılmaz", progressScore: 82 },
      { id: "s9", name: "Mehmet Koç", progressScore: 67 },
      { id: "s10", name: "Deniz Şahin", progressScore: 75 },
      { id: "s11", name: "Fatma Güneş", progressScore: 90 },
    ],
  },
  {
    id: "cls-yds-2",
    name: "YDS Kelime Kampı",
    examType: "YDS",
    studentCount: 10,
    students: [
      { id: "s12", name: "Oğuz Kara", progressScore: 58 },
      { id: "s13", name: "Merve Ak", progressScore: 72 },
    ],
  },
  {
    id: "cls-yokdil-1",
    name: "YÖKDİL Fen Bilimleri",
    examType: "YOKDIL",
    studentCount: 9,
    students: [
      { id: "s14", name: "Kerem Polat", progressScore: 80 },
      { id: "s15", name: "Gizem Tunç", progressScore: 86 },
      { id: "s16", name: "Barış Erdoğan", progressScore: 69 },
    ],
  },
  {
    id: "cls-yokdil-2",
    name: "YÖKDİL Sağlık Bilimleri",
    examType: "YOKDIL",
    studentCount: 7,
    students: [
      { id: "s17", name: "Seda Yıldız", progressScore: 77 },
      { id: "s18", name: "Hakan Uçar", progressScore: 83 },
    ],
  },
];

function buildSubmissions(
  items: Array<Omit<TeacherStudentSubmission, "id"> & { id?: string }>
): TeacherStudentSubmission[] {
  return items.map((item, index) => ({
    id: item.id ?? `sub-${index + 1}`,
    studentId: item.studentId,
    studentName: item.studentName,
    status: item.status,
    content: item.content,
    audioLabel: item.audioLabel,
    submittedAt: item.submittedAt,
    aiAnalysis: item.aiAnalysis,
  }));
}

export const MOCK_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: "asg-1",
    title: "TOEFL Speaking Task 1 — Kişisel Tercih",
    examType: "TOEFL",
    assignmentType: "Speaking",
    submittedCount: 6,
    totalCount: 8,
    className: "TOEFL Akademik",
    dueDate: "2026-07-05",
    submissions: buildSubmissions([
      {
        id: "asg1-s1",
        studentId: "s1",
        studentName: "Ahmet Yılmaz",
        status: "grading",
        audioLabel: "speaking-ahmet-recording.webm",
        submittedAt: "2026-07-04T18:20:00Z",
      },
      {
        id: "asg1-s2",
        studentId: "s2",
        studentName: "Elif Kaya",
        status: "graded",
        audioLabel: "speaking-elif-recording.webm",
        submittedAt: "2026-07-03T14:10:00Z",
        aiAnalysis: generateMockAiAnalysis("SPEAKING", "B2"),
      },
      {
        id: "asg1-s3",
        studentId: "s3",
        studentName: "Can Öztürk",
        status: "grading",
        audioLabel: "speaking-can-recording.webm",
        submittedAt: "2026-07-04T09:45:00Z",
      },
      {
        id: "asg1-s4",
        studentId: "s4",
        studentName: "Zeynep Arslan",
        status: "graded",
        audioLabel: "speaking-zeynep-recording.webm",
        submittedAt: "2026-07-02T16:00:00Z",
        aiAnalysis: generateMockAiAnalysis("SPEAKING", "C1"),
      },
      {
        id: "asg1-sudenaz",
        studentId: "sudenaz",
        studentName: "Sudenaz Şenbay",
        status: "not_submitted",
      },
      {
        id: "asg1-pending",
        studentId: "s-pending-1",
        studentName: "Burak Demir",
        status: "not_submitted",
      },
    ]),
  },
  {
    id: "asg-2",
    title: "Integrated Reading — Campus Facilities",
    examType: "TOEFL",
    assignmentType: "Reading",
    submittedCount: 8,
    totalCount: 8,
    className: "TOEFL Akademik",
    dueDate: "2026-06-28",
    submissions: buildSubmissions([
      {
        studentId: "s1",
        studentName: "Ahmet Yılmaz",
        status: "graded",
        content: "Campus facilities play a critical role in student engagement...",
        submittedAt: "2026-06-27T11:00:00Z",
        aiAnalysis: generateMockAiAnalysis("MULTIPLE_CHOICE", "B2"),
      },
      {
        studentId: "s2",
        studentName: "Elif Kaya",
        status: "graded",
        content: "Libraries and labs are essential academic resources...",
        submittedAt: "2026-06-26T10:00:00Z",
        aiAnalysis: generateMockAiAnalysis("MULTIPLE_CHOICE", "B2"),
      },
    ]),
  },
  {
    id: "asg-3",
    title: "Speaking Bootcamp — Independent Task",
    examType: "TOEFL",
    assignmentType: "Speaking",
    submittedCount: 4,
    totalCount: 6,
    className: "TOEFL Speaking Bootcamp",
    dueDate: "2026-07-10",
    submissions: buildSubmissions([
      {
        studentId: "s5",
        studentName: "Burak Demir",
        status: "grading",
        audioLabel: "bootcamp-burak.webm",
        submittedAt: "2026-07-09T12:00:00Z",
      },
      {
        studentId: "s6",
        studentName: "Selin Aydın",
        status: "graded",
        audioLabel: "bootcamp-selin.webm",
        submittedAt: "2026-07-08T15:30:00Z",
        aiAnalysis: generateMockAiAnalysis("SPEAKING", "B2"),
      },
      {
        studentId: "s7",
        studentName: "Emre Çelik",
        status: "not_submitted",
      },
    ]),
  },
  {
    id: "asg-4",
    title: "YDS Çeviri Seti — Bilim ve Teknoloji",
    examType: "YDS",
    assignmentType: "Reading",
    submittedCount: 9,
    totalCount: 12,
    className: "YDS İlkbahar Grubu",
    dueDate: "2026-07-02",
    submissions: buildSubmissions([
      {
        studentId: "s8",
        studentName: "Ayşe Yılmaz",
        status: "graded",
        content: "Bilim ve teknoloji çevirisinde önemli noktalar...",
        submittedAt: "2026-07-01T13:00:00Z",
        aiAnalysis: generateMockAiAnalysis("MULTIPLE_CHOICE", "B1"),
      },
      {
        studentId: "s9",
        studentName: "Mehmet Koç",
        status: "grading",
        content: "Teknolojik gelişmeler toplumsal yapıları dönüştürür...",
        submittedAt: "2026-07-01T18:40:00Z",
      },
    ]),
  },
  {
    id: "asg-5",
    title: "YDS Kelime Testi — Hafta 4",
    examType: "YDS",
    assignmentType: "Grammar",
    submittedCount: 7,
    totalCount: 10,
    className: "YDS Kelime Kampı",
    dueDate: "2026-07-08",
    submissions: buildSubmissions([
      {
        studentId: "s12",
        studentName: "Oğuz Kara",
        status: "grading",
        content: "Quiz answers submitted (MC).",
        submittedAt: "2026-07-07T20:00:00Z",
      },
      {
        studentId: "s13",
        studentName: "Merve Ak",
        status: "graded",
        content: "Quiz answers submitted (MC).",
        submittedAt: "2026-07-06T19:00:00Z",
        aiAnalysis: generateMockAiAnalysis("MULTIPLE_CHOICE", "B1"),
      },
    ]),
  },
  {
    id: "asg-6",
    title: "YÖKDİL Fen Metni Okuma Analizi",
    examType: "YOKDIL",
    assignmentType: "Reading",
    submittedCount: 5,
    totalCount: 9,
    className: "YÖKDİL Fen Bilimleri",
    dueDate: "2026-07-01",
    submissions: buildSubmissions([
      {
        studentId: "s14",
        studentName: "Kerem Polat",
        status: "grading",
        content: "Fen metnindeki ana fikir bilimsel yöntemdir...",
        submittedAt: "2026-06-30T17:00:00Z",
      },
      {
        studentId: "s15",
        studentName: "Gizem Tunç",
        status: "graded",
        content: "Hipotez oluşturma süreci kritik bir adımdır...",
        submittedAt: "2026-06-29T12:20:00Z",
        aiAnalysis: generateMockAiAnalysis("WRITING", "C1"),
      },
    ]),
  },
  {
    id: "asg-7",
    title: "YÖKDİL Sağlık Terminolojisi",
    examType: "YOKDIL",
    assignmentType: "Writing",
    submittedCount: 3,
    totalCount: 7,
    className: "YÖKDİL Sağlık Bilimleri",
    dueDate: "2026-07-12",
    submissions: buildSubmissions([
      {
        studentId: "s17",
        studentName: "Seda Yıldız",
        status: "grading",
        content:
          "Healthcare terminology requires precision. Clinical communication depends on accurate vocabulary and clear structure.",
        submittedAt: "2026-07-11T10:15:00Z",
      },
      {
        studentId: "s18",
        studentName: "Hakan Uçar",
        status: "not_submitted",
      },
      {
        id: "asg7-sudenaz",
        studentId: "sudenaz",
        studentName: "Sudenaz Şenbay",
        status: "not_submitted",
      },
    ]),
  },
];

export const MOCK_TEACHER_ASSISTANT_CARDS: TeacherAssistantCard[] = [
  {
    id: "ta-toefl-create",
    type: "create_assignment",
    title: "Yapay Zeka ile Yeni Ödev/Sınav Oluştur",
    description:
      "TOEFL formatında okuma veya kelime ödevi tek tıkla oluştur. AI, rubric kriterlerine uygun prompt ve değerlendirme şablonu üretir.",
    examType: "TOEFL",
  },
  {
    id: "ta-toefl-forecast",
    type: "performance_forecast",
    title: "AI Sınıf Performans Tahmini",
    description:
      "TOEFL Akademik grubunun genel başarı projeksiyonu ve materyal optimizasyon önerileri.",
    examType: "TOEFL",
    meta: {
      projectedSuccess: "%74 → %81 (4 hafta)",
      optimizationTip: "Speaking pratiği haftada 2 oturuma çıkarılırsa projeksiyon +%6",
    },
  },
  {
    id: "ta-toefl-vocab",
    type: "weekly_vocabulary",
    title: "Haftalık Akademik Kelime Paketi",
    description:
      "TOEFL Reading metinlerinde sık geçen 15 akademik kelime. Öğrencilere tek tıkla gönder.",
    examType: "TOEFL",
    meta: {
      wordCount: 15,
      sampleWords: ["Hypothesis", "Leverage", "Comprehensive", "Paradigm", "Facilitate"],
    },
  },
  {
    id: "ta-yds-create",
    type: "create_assignment",
    title: "Yapay Zeka ile Yeni Ödev/Sınav Oluştur",
    description:
      "YDS formatında kelime, dilbilgisi veya çeviri ödevi oluştur. AI, soru havuzundan uygun maddeler seçer.",
    examType: "YDS",
  },
  {
    id: "ta-yds-forecast",
    type: "performance_forecast",
    title: "AI Sınıf Performans Tahmini",
    description:
      "YDS İlkbahar grubunun başarı projeksiyonu ve zayıf konu analizi.",
    examType: "YDS",
    meta: {
      projectedSuccess: "%68 → %76 (5 hafta)",
      optimizationTip: "Çeviri pratiği +%5 etki gösterir",
    },
  },
  {
    id: "ta-yds-vocab",
    type: "weekly_vocabulary",
    title: "Haftalık Akademik Kelime Paketi",
    description: "YDS'de sık çıkan 20 akademik kelime paketi.",
    examType: "YDS",
    meta: {
      wordCount: 20,
      sampleWords: ["Comprise", "Implicate", "Substantial", "Prevail", "Constitute"],
    },
  },
  {
    id: "ta-yokdil-create",
    type: "create_assignment",
    title: "Yapay Zeka ile Yeni Ödev/Sınav Oluştur",
    description:
      "YÖKDİL alanına özel okuma ve terminoloji ödevi oluştur.",
    examType: "YOKDIL",
  },
  {
    id: "ta-yokdil-forecast",
    type: "performance_forecast",
    title: "AI Sınıf Performans Tahmini",
    description: "YÖKDİL Fen grubu başarı projeksiyonu.",
    examType: "YOKDIL",
    meta: {
      projectedSuccess: "%71 → %79 (4 hafta)",
      optimizationTip: "Alan terminolojisi yoğunluğu artırılmalı",
    },
  },
  {
    id: "ta-yokdil-vocab",
    type: "weekly_vocabulary",
    title: "Haftalık Akademik Kelime Paketi",
    description: "YÖKDİL Fen Bilimleri terminoloji seti.",
    examType: "YOKDIL",
    meta: {
      wordCount: 18,
      sampleWords: ["Molecule", "Hypothesis", "Synthesis", "Variable", "Protocol"],
    },
  },
];

export function getClassesByExam(examType: ExamType): TeacherClass[] {
  return MOCK_TEACHER_CLASSES.filter((cls) => cls.examType === examType);
}

export function getAssignmentsByExam(examType: ExamType): TeacherAssignment[] {
  return MOCK_TEACHER_ASSIGNMENTS.filter((asg) => asg.examType === examType);
}

export function getAssistantCardsByExam(
  examType: ExamType
): TeacherAssistantCard[] {
  const filtered = MOCK_TEACHER_ASSISTANT_CARDS.filter(
    (card) => card.examType === examType
  );

  const orderedTypes = [
    "create_assignment",
    "performance_forecast",
    "weekly_vocabulary",
  ] as const;

  return orderedTypes
    .map((type) => filtered.find((card) => card.type === type))
    .filter((card): card is TeacherAssistantCard => card !== undefined);
}

export type AiWorkroomTool = "reading" | "questions" | "vocabulary";

export type AiWorkroomOutput = {
  tool: AiWorkroomTool;
  label: string;
  content: string;
};

export type AnalyticsSnapshot = {
  examType: ExamType;
  avgProgressScore: number;
  completionRate: number;
  activeStudents: number;
  weeklyTrend: number[];
  sectionScores: { label: string; value: number }[];
};

export const MOCK_AI_WORKROOM_OUTPUTS: Record<
  ExamType,
  Record<AiWorkroomTool, AiWorkroomOutput>
> = {
  TOEFL: {
    reading: {
      tool: "reading",
      label: "Okuma Metni",
      content: `【TOEFL Academic Reading — Generated Draft】

Climate change is reshaping global agriculture at an unprecedented pace. Researchers at the International Food Policy Institute report that rising temperatures could reduce crop yields by up to 25% in subtropical regions by 2050.

Farmers in developing nations face the greatest risk, as limited access to irrigation and adaptive technologies compounds the challenge. However, precision agriculture — leveraging satellite data and AI-driven soil analysis — offers a promising pathway toward resilient food systems.

Questions for students:
1. What percentage yield reduction is projected for subtropical regions?
2. Which technology is cited as a promising solution?`,
    },
    questions: {
      tool: "questions",
      label: "Soru Bankası",
      content: `【TOEFL Speaking & Writing — Question Bank】

Task 1 (Independent):
"Some people prefer to study alone, while others prefer group study. Which do you prefer and why?"

Task 2 (Integrated — Reading + Lecture):
Reading passage: University library hours extension proposal.
Lecture: Professor argues against the proposal citing budget constraints.

Task 3 (Academic Discussion):
Prompt: Should universities require AI literacy courses for all students?

→ 5 rubric-aligned follow-up questions auto-generated with AI scoring criteria.`,
    },
    vocabulary: {
      tool: "vocabulary",
      label: "Kelime Listesi",
      content: `【TOEFL Academic Vocabulary — Week 12】

1. Hypothesis (n.) — A proposed explanation for a phenomenon
2. Correlation (n.) — A mutual relationship between two variables
3. Substantial (adj.) — Of considerable importance or size
4. Preliminary (adj.) — Preceding the main part; introductory
5. Consequently (adv.) — As a result; therefore
6. Facilitate (v.) — To make an action easier
7. Comprehensive (adj.) — Complete; including all elements
8. Paradigm (n.) — A typical example or pattern of something

AI-generated example sentences included for each entry.`,
    },
  },
  YDS: {
    reading: {
      tool: "reading",
      label: "Okuma Metni",
      content: `【YDS Reading Passage — Generated Draft】

Küresel enerji dönüşümü, gelişmekte olan ülkelerin ekonomik büyüme stratejilerini köklü biçimde etkilemektedir. Rüzgar ve güneş enerjisi yatırımları son on yılda %340 artış göstermiştir.

Uzmanlar, fosil yakıt bağımlılığının azaltılmasının hem çevresel hem de jeopolitik açıdan kritik olduğunu vurgulamaktadır. Türkiye'nin yenilenebilir enerji kapasitesi 2030 hedeflerine doğru hızla ilerlemektedir.

Çeviri ve anlama soruları otomatik üretildi (12 adet).`,
    },
    questions: {
      tool: "questions",
      label: "Soru Bankası",
      content: `【YDS Soru Bankası — Dilbilgisi & Çeviri】

1. Had the government ___ earlier, the crisis might have been avoided.
   a) acted  b) act  c) acting  d) has acted  e) to act

2. Translate: "The findings suggest a strong correlation between sleep quality and cognitive performance."

3. Cloze test (5 blanks) — Academic vocabulary in context.

→ Toplam 20 soru, cevap anahtarı ve AI açıklamaları dahil.`,
    },
    vocabulary: {
      tool: "vocabulary",
      label: "Kelime Listesi",
      content: `【YDS Akademik Kelime Paketi — Hafta 6】

1. Comprehensive — Kapsamlı
2. Subsequently — Bunun ardından
3. Nevertheless — Bununla birlikte
4. Preliminary — Ön, ilk
5. Substantial — Önemli, kayda değer
6. Consequently — Sonuç olarak
7. Furthermore — Ayrıca, dahası
8. Accordingly — Buna göre

Her kelime için YDS formatında örnek cümle ve eş anlamlı eşleştirme üretildi.`,
    },
  },
  YOKDIL: {
    reading: {
      tool: "reading",
      label: "Okuma Metni",
      content: `【YÖKDİL Fen Bilimleri — Generated Draft】

The process of photosynthesis converts light energy into chemical energy stored in glucose molecules. Chlorophyll, the primary pigment in plant cells, absorbs light most efficiently in the blue and red wavelengths.

Recent studies indicate that elevated atmospheric CO₂ levels may increase photosynthetic rates in C3 plants, though the long-term ecological implications remain under investigation.

→ 8 comprehension questions aligned with YÖKDİL Science field rubric.`,
    },
    questions: {
      tool: "questions",
      label: "Soru Bankası",
      content: `【YÖKDİL Soru Bankası — Fen Bilimleri】

1. What is the primary function of chlorophyll in photosynthesis?
2. Which wavelengths does chlorophyll absorb most efficiently?
3. How might elevated CO₂ affect C3 plants?

Cloze test: Technical terminology in biochemistry context (6 blanks).
Translation: Turkish ↔ English scientific paragraph.

→ 15 soru, alan bazlı rubric ile puanlama kriterleri eklendi.`,
    },
    vocabulary: {
      tool: "vocabulary",
      label: "Kelime Listesi",
      content: `【YÖKDİL Fen Terminolojisi — Hafta 3】

1. Hypothesis — Varsayım
2. Variable — Değişken
3. Synthesis — Sentez
4. Empirical — Deneysel, gözleme dayalı
5. Correlation — Korelasyon, ilişki
6. Catalyst — Katalizör
7. Equilibrium — Denge
8. Metabolism — Metabolizma

AI tarafından alan metinlerinden çıkarılan bağlam cümleleri eklendi.`,
    },
  },
};

export const MOCK_ANALYTICS: Record<ExamType, AnalyticsSnapshot> = {
  TOEFL: {
    examType: "TOEFL",
    avgProgressScore: 84,
    completionRate: 76,
    activeStudents: 14,
    weeklyTrend: [62, 68, 71, 74, 78, 81, 84],
    sectionScores: [
      { label: "Reading", value: 82 },
      { label: "Listening", value: 79 },
      { label: "Speaking", value: 71 },
      { label: "Writing", value: 88 },
    ],
  },
  YDS: {
    examType: "YDS",
    avgProgressScore: 79,
    completionRate: 68,
    activeStudents: 22,
    weeklyTrend: [58, 63, 67, 70, 74, 77, 79],
    sectionScores: [
      { label: "Kelime", value: 85 },
      { label: "Dilbilgisi", value: 74 },
      { label: "Çeviri", value: 78 },
      { label: "Okuma", value: 81 },
    ],
  },
  YOKDIL: {
    examType: "YOKDIL",
    avgProgressScore: 81,
    completionRate: 72,
    activeStudents: 16,
    weeklyTrend: [60, 65, 69, 73, 76, 79, 81],
    sectionScores: [
      { label: "Fen", value: 83 },
      { label: "Sağlık", value: 77 },
      { label: "Sosyal", value: 80 },
      { label: "Okuma", value: 85 },
    ],
  },
};

export function getAiWorkroomOutput(
  examType: ExamType,
  tool: AiWorkroomTool
): AiWorkroomOutput {
  return MOCK_AI_WORKROOM_OUTPUTS[examType][tool];
}

export function getAnalyticsByExam(examType: ExamType): AnalyticsSnapshot {
  return MOCK_ANALYTICS[examType];
}

/** Re-export for teacher grading panel convenience */
export type { AiAnalysis };

export type TeacherInsight = {
  id: string;
  title: string;
  description: string;
  className?: string;
  urgency: "high" | "medium" | "low";
};

export const MOCK_TEACHER_INSIGHTS: TeacherInsight[] = [
  {
    id: "insight-1",
    title: "Bağlaç Zayıflığı Tespit Edildi",
    description:
      "YDS İlkbahar Grubu öğrencileri bağlaç kullanımında zorlanıyor. Kısa bir cloze quiz hazırlamanız önerilir.",
    className: "YDS İlkbahar Grubu",
    urgency: "high",
  },
  {
    id: "insight-2",
    title: "Speaking Akıcılık Fırsatı",
    description:
      "TOEFL Akademik grubunda konuşma ödevlerinin tamamlanma oranı yüksek. Bağımsız speaking pratiği ekleyerek skoru +%5 yükseltebilirsiniz.",
    className: "TOEFL Akademik",
    urgency: "medium",
  },
  {
    id: "insight-3",
    title: "Ödev Değerlendirme Bekliyor",
    description:
      "Birkaç teslim hâlâ AI değerlendirme kuyruğunda. Ödev Takip panelinden Yapay Zeka Analizi başlatabilirsiniz.",
    urgency: "medium",
  },
];
