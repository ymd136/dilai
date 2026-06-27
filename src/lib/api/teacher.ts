import { apiClient } from "./client";
import { getAssistantCardsByExam } from "@/lib/mocks/teacherData";
import type { ExamType } from "@/types/exam";
import type { TeacherAssistantCard } from "@/types/teacher";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function fetchTeacherAssistants(params: {
  examType: ExamType;
}): Promise<TeacherAssistantCard[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getAssistantCardsByExam(params.examType);
  }

  return apiClient<TeacherAssistantCard[]>("/api/teacher/assistants", {
    params: { examType: params.examType },
  });
}
