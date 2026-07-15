"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getStudentAssignments,
  getTeacherAssignments,
  getTeacherAssignmentsByExam,
  getTeacherClasses,
  getPendingStudentCount,
  getPendingGradingCount,
  subscribeAssignmentStore,
} from "@/lib/mocks/assignmentStore";
import {
  getStudentClasses,
  type StudentAssignment,
  type StudentClassInfo,
} from "@/lib/mocks/studentMockData";
import type { ExamType } from "@/types/exam";
import type { TeacherAssignment, TeacherClass } from "@/types/teacher";

export function useStudentAssignments(): StudentAssignment[] {
  const [assignments, setAssignments] = useState(getStudentAssignments);

  useEffect(() => {
    return subscribeAssignmentStore(() => {
      setAssignments(getStudentAssignments());
    });
  }, []);

  return assignments;
}

export function useStudentClasses(): StudentClassInfo[] {
  const assignments = useStudentAssignments();
  return useMemo(() => getStudentClasses(assignments), [assignments]);
}

export function usePendingAssignmentCount(): number {
  const [count, setCount] = useState(getPendingStudentCount);

  useEffect(() => {
    return subscribeAssignmentStore(() => {
      setCount(getPendingStudentCount());
    });
  }, []);

  return count;
}

export function useTeacherClasses(): TeacherClass[] {
  const [classes, setClasses] = useState(getTeacherClasses);

  useEffect(() => {
    return subscribeAssignmentStore(() => {
      setClasses(getTeacherClasses());
    });
  }, []);

  return classes;
}

export function useAllTeacherAssignments(): TeacherAssignment[] {
  const [assignments, setAssignments] = useState(getTeacherAssignments);

  useEffect(() => {
    return subscribeAssignmentStore(() => {
      setAssignments(getTeacherAssignments());
    });
  }, []);

  return assignments;
}

export function usePendingGradingCount(): number {
  const [count, setCount] = useState(getPendingGradingCount);

  useEffect(() => {
    return subscribeAssignmentStore(() => {
      setCount(getPendingGradingCount());
    });
  }, []);

  return count;
}

export function useTeacherAssignments(examType: ExamType): TeacherAssignment[] {
  const [assignments, setAssignments] = useState(() =>
    getTeacherAssignmentsByExam(examType)
  );

  useEffect(() => {
    setAssignments(getTeacherAssignmentsByExam(examType));
    return subscribeAssignmentStore(() => {
      setAssignments(getTeacherAssignmentsByExam(examType));
    });
  }, [examType]);

  return assignments;
}
