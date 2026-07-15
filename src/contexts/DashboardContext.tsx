"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { fetchMentorRecommendations } from "@/lib/api/mentor";
import { fetchTeacherAssistants } from "@/lib/api/teacher";
import type { ExamType } from "@/types/exam";
import { EXAM_COLORS } from "@/types/exam";
import type { MentorRecommendation } from "@/types/mentor";
import type { TeacherAssistantCard } from "@/types/teacher";
import type { UserRole } from "@/types/user";

export type DashboardNavItem =
  | "home"
  | "classes"
  | "ai-room"
  | "analytics"
  | "create-class"
  | "assignments";

type DashboardContextValue = {
  selectedExam: ExamType;
  setSelectedExam: (exam: ExamType) => void;
  examColor: string;
  recommendations: MentorRecommendation[];
  isLoadingRecommendations: boolean;
  refreshRecommendations: () => Promise<void>;
  teacherAssistants: TeacherAssistantCard[];
  isLoadingTeacherAssistants: boolean;
  refreshTeacherAssistants: () => Promise<void>;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeNav: DashboardNavItem;
  setActiveNav: (nav: DashboardNavItem) => void;
  selectedClassId: string | null;
  setSelectedClassId: (classId: string | null) => void;
  selectHome: () => void;
  selectClass: (classId: string) => void;
  userRole: UserRole;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

type DashboardProviderProps = {
  children: ReactNode;
  userRole: UserRole;
  initialExam?: ExamType;
};

export function DashboardProvider({
  children,
  userRole,
  initialExam = "TOEFL",
}: DashboardProviderProps) {
  const [selectedExam, setSelectedExam] = useState<ExamType>(initialExam);
  const [recommendations, setRecommendations] = useState<MentorRecommendation[]>(
    []
  );
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [teacherAssistants, setTeacherAssistants] = useState<
    TeacherAssistantCard[]
  >([]);
  const [isLoadingTeacherAssistants, setIsLoadingTeacherAssistants] =
    useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNavState] = useState<DashboardNavItem>("home");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) setSidebarCollapsed(true);
  }, []);

  const examColor = EXAM_COLORS[selectedExam];

  const setActiveNav = useCallback((nav: DashboardNavItem) => {
    setActiveNavState(nav);
    if (nav !== "classes") {
      setSelectedClassId(null);
    }
  }, []);

  const selectHome = useCallback(() => {
    setActiveNavState("home");
    setSelectedClassId(null);
  }, []);

  const selectClass = useCallback((classId: string) => {
    setActiveNavState("classes");
    setSelectedClassId(classId);
  }, []);

  const refreshRecommendations = useCallback(async () => {
    if (userRole !== "STUDENT" && userRole !== "TEACHER") return;

    setIsLoadingRecommendations(true);
    try {
      const data = await fetchMentorRecommendations({
        examType: selectedExam,
        role: userRole === "TEACHER" ? "TEACHER" : "STUDENT",
      });
      setRecommendations(data);
    } catch {
      setRecommendations([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [selectedExam, userRole]);

  const refreshTeacherAssistants = useCallback(async () => {
    if (userRole !== "TEACHER") return;

    setIsLoadingTeacherAssistants(true);
    try {
      const data = await fetchTeacherAssistants({ examType: selectedExam });
      setTeacherAssistants(data);
    } catch {
      setTeacherAssistants([]);
    } finally {
      setIsLoadingTeacherAssistants(false);
    }
  }, [selectedExam, userRole]);

  useEffect(() => {
    if (userRole === "STUDENT") {
      refreshRecommendations();
    } else if (userRole === "TEACHER") {
      refreshTeacherAssistants();
    }
  }, [userRole, refreshRecommendations, refreshTeacherAssistants]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <DashboardContext.Provider
      value={{
        selectedExam,
        setSelectedExam,
        examColor,
        recommendations,
        isLoadingRecommendations,
        refreshRecommendations,
        teacherAssistants,
        isLoadingTeacherAssistants,
        refreshTeacherAssistants,
        sidebarCollapsed,
        toggleSidebar,
        activeNav,
        setActiveNav,
        selectedClassId,
        setSelectedClassId,
        selectHome,
        selectClass,
        userRole,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
