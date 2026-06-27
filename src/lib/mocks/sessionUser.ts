import type { SessionUser } from "@/types/user";

export const MOCK_STUDENT: SessionUser = {
  id: "mock-student-1",
  email: "ogrenci@dilai.com",
  firstName: "Ayşe",
  lastName: "Yılmaz",
  role: "STUDENT",
};

export const MOCK_TEACHER: SessionUser = {
  id: "mock-teacher-1",
  email: "egitmen@dilai.com",
  firstName: "Mehmet",
  lastName: "Demir",
  role: "TEACHER",
};
