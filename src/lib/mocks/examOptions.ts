import type { ExamOption } from "@/types/exam";

export const MOCK_EXAM_OPTIONS: ExamOption[] = [
  {
    id: "TOEFL",
    name: "TOEFL",
    fullName: "Test of English as a Foreign Language",
    color: "#6366f1",
    sections: ["Reading", "Listening", "Speaking", "Writing"],
  },
  {
    id: "YDS",
    name: "YDS",
    fullName: "Yabancı Dil Bilgisi Seviye Tespit Sınavı",
    color: "#8b5cf6",
    sections: ["Vocabulary", "Grammar", "Translation", "Reading"],
  },
  {
    id: "YOKDIL",
    name: "YÖKDİL",
    fullName: "Yükseköğretim Kurumları Yabancı Dil Sınavı",
    color: "#a855f7",
    sections: ["Science", "Social", "Health", "Reading"],
  },
];
