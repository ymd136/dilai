import { apiClient } from "./client";
import { MOCK_MENTOR_RECOMMENDATIONS } from "@/lib/mocks/mentorRecommendations";
import type { ExamType } from "@/types/exam";
import type { MentorRecommendation } from "@/types/mentor";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export function isMockMode(): boolean {
  return USE_MOCK;
}

export async function fetchMentorRecommendations(params: {
  examType: ExamType;
  role: "STUDENT" | "TEACHER";
}): Promise<MentorRecommendation[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const filtered = MOCK_MENTOR_RECOMMENDATIONS.filter(
      (item) => item.examType === params.examType
    );

    const orderedTypes = [
      "speaking_simulation",
      "weakness_boost",
      "word_of_day",
    ] as const;

    return orderedTypes
      .map((type) => filtered.find((item) => item.type === type))
      .filter((item): item is MentorRecommendation => item !== undefined);
  }

  return apiClient<MentorRecommendation[]>("/api/mentor/recommendations", {
    params: {
      examType: params.examType,
      role: params.role,
    },
  });
}
