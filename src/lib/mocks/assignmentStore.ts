import {
  MOCK_STUDENT_ASSIGNMENTS,
  generateMockAiAnalysis,
  type AiAnalysis,
  type StudentAssignment,
  type StudentAssignmentType,
} from "@/lib/mocks/studentMockData";
import { MOCK_TEACHER_ASSIGNMENTS, MOCK_TEACHER_CLASSES } from "@/lib/mocks/teacherData";
import type { ExamType } from "@/types/exam";
import type {
  TeacherAssignment,
  TeacherClass,
  TeacherStudentSubmission,
  ClassStudent,
} from "@/types/teacher";

export const CURRENT_MOCK_STUDENT = {
  id: "sudenaz",
  name: "Sudenaz Şenbay",
} as const;

type Listener = () => void;

function cloneStudentAssignments(): StudentAssignment[] {
  return MOCK_STUDENT_ASSIGNMENTS.map((a) => ({
    ...a,
    aiAnalysis: a.aiAnalysis ? { ...a.aiAnalysis, metrics: { ...a.aiAnalysis.metrics } } : undefined,
  }));
}

function cloneTeacherAssignments(): TeacherAssignment[] {
  return MOCK_TEACHER_ASSIGNMENTS.map((a) => ({
    ...a,
    submissions: a.submissions.map((s) => ({
      ...s,
      aiAnalysis: s.aiAnalysis
        ? { ...s.aiAnalysis, metrics: { ...s.aiAnalysis.metrics } }
        : undefined,
    })),
  }));
}

function cloneTeacherClasses(): TeacherClass[] {
  return MOCK_TEACHER_CLASSES.map((c) => ({
    ...c,
    students: c.students.map((s) => ({ ...s })),
  }));
}

let studentAssignments = cloneStudentAssignments();
let teacherAssignments = cloneTeacherAssignments();
let teacherClasses = cloneTeacherClasses();
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeAssignmentStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStudentAssignments(): StudentAssignment[] {
  return studentAssignments.map((a) => ({ ...a }));
}

export function getStudentAssignmentById(
  id: string
): StudentAssignment | undefined {
  const found = studentAssignments.find((a) => a.id === id);
  return found ? { ...found } : undefined;
}

export function getPendingStudentCount(): number {
  return studentAssignments.filter((a) => a.status === "pending").length;
}

export function getTeacherAssignments(): TeacherAssignment[] {
  return teacherAssignments.map((a) => {
    const submittedCount = a.submissions.filter(
      (s) => s.status === "grading" || s.status === "graded"
    ).length;
    return {
      ...a,
      submittedCount,
      submissions: a.submissions.map((s) => ({ ...s })),
    };
  });
}

export function getTeacherAssignmentsByExam(
  examType: ExamType
): TeacherAssignment[] {
  return getTeacherAssignments().filter((a) => a.examType === examType);
}

export function getTeacherAssignmentById(
  id: string
): TeacherAssignment | undefined {
  return getTeacherAssignments().find((a) => a.id === id);
}

function mapStudentTypeToTeacher(
  type: StudentAssignmentType
): TeacherAssignment["assignmentType"] {
  if (type === "SPEAKING") return "Speaking";
  if (type === "WRITING") return "Writing";
  return "MULTIPLE_CHOICE";
}

function findMatchingTeacherAssignment(
  studentAssignment: StudentAssignment
): TeacherAssignment | undefined {
  const desiredType = mapStudentTypeToTeacher(studentAssignment.type);
  return teacherAssignments.find(
    (a) =>
      a.className === studentAssignment.className &&
      (a.assignmentType === desiredType ||
        (desiredType === "MULTIPLE_CHOICE" &&
          (a.assignmentType === "Grammar" || a.assignmentType === "Reading")))
  );
}

function recountSubmitted(assignment: TeacherAssignment) {
  assignment.submittedCount = assignment.submissions.filter(
    (s) => s.status === "grading" || s.status === "graded"
  ).length;
}

/** Mark student assignment as grading and sync teacher row */
export function markStudentSubmitting(
  assignmentId: string,
  payload?: { content?: string; audioLabel?: string }
): StudentAssignment | undefined {
  const assignment = studentAssignments.find((a) => a.id === assignmentId);
  if (!assignment || assignment.status === "completed") return undefined;

  assignment.status = "grading";
  if (payload?.content) assignment.content = payload.content;

  const teacherAsg = findMatchingTeacherAssignment(assignment);
  if (teacherAsg) {
    let submission = teacherAsg.submissions.find(
      (s) => s.studentId === CURRENT_MOCK_STUDENT.id
    );
    if (!submission) {
      submission = {
        id: `${teacherAsg.id}-${CURRENT_MOCK_STUDENT.id}`,
        studentId: CURRENT_MOCK_STUDENT.id,
        studentName: CURRENT_MOCK_STUDENT.name,
        status: "grading",
      };
      teacherAsg.submissions.push(submission);
    }
    submission.status = "grading";
    submission.submittedAt = new Date().toISOString();
    if (payload?.content) submission.content = payload.content;
    if (payload?.audioLabel) submission.audioLabel = payload.audioLabel;
    recountSubmitted(teacherAsg);
  }

  notify();
  return { ...assignment };
}

/** Complete student assignment with AI analysis after simulated delay */
export function completeStudentAssignment(
  assignmentId: string,
  analysis?: AiAnalysis
): StudentAssignment | undefined {
  const assignment = studentAssignments.find((a) => a.id === assignmentId);
  if (!assignment) return undefined;

  const aiAnalysis =
    analysis ?? generateMockAiAnalysis(assignment.type, assignment.level);

  assignment.status = "completed";
  assignment.score = aiAnalysis.score;
  assignment.aiAnalysis = aiAnalysis;

  const teacherAsg = findMatchingTeacherAssignment(assignment);
  if (teacherAsg) {
    const submission = teacherAsg.submissions.find(
      (s) => s.studentId === CURRENT_MOCK_STUDENT.id
    );
    if (submission) {
      submission.status = "graded";
      submission.aiAnalysis = aiAnalysis;
      if (assignment.content) submission.content = assignment.content;
    }
    recountSubmitted(teacherAsg);
  }

  notify();
  return { ...assignment };
}

export function gradeTeacherSubmission(
  assignmentId: string,
  submissionId: string
): TeacherStudentSubmission | undefined {
  const assignment = teacherAssignments.find((a) => a.id === assignmentId);
  if (!assignment) return undefined;

  const submission = assignment.submissions.find((s) => s.id === submissionId);
  if (!submission || submission.status === "not_submitted") return undefined;

  const typeHint: StudentAssignmentType =
    assignment.assignmentType === "Speaking"
      ? "SPEAKING"
      : assignment.assignmentType === "Writing"
        ? "WRITING"
        : "MULTIPLE_CHOICE";

  const aiAnalysis = generateMockAiAnalysis(typeHint);
  submission.status = "graded";
  submission.aiAnalysis = aiAnalysis;
  recountSubmitted(assignment);
  notify();
  return { ...submission, aiAnalysis };
}

export function getTeacherClasses(): TeacherClass[] {
  return teacherClasses.map((c) => ({
    ...c,
    students: c.students.map((s) => ({ ...s })),
  }));
}

export function getTeacherClassById(id: string): TeacherClass | undefined {
  const found = teacherClasses.find((c) => c.id === id);
  return found
    ? { ...found, students: found.students.map((s) => ({ ...s })) }
    : undefined;
}

export function getPendingGradingCount(): number {
  return teacherAssignments.reduce(
    (sum, a) =>
      sum + a.submissions.filter((s) => s.status === "grading").length,
    0
  );
}

export function addTeacherClass(input: {
  name: string;
  examType: ExamType;
}): TeacherClass {
  const id = `cls-${Date.now()}`;
  const created: TeacherClass = {
    id,
    name: input.name,
    examType: input.examType,
    studentCount: 0,
    students: [],
  };
  teacherClasses = [created, ...teacherClasses];
  notify();
  return { ...created };
}

export function addStudentToClass(
  classId: string,
  student: ClassStudent
): TeacherClass | undefined {
  const cls = teacherClasses.find((c) => c.id === classId);
  if (!cls) return undefined;
  cls.students.push(student);
  cls.studentCount = cls.students.length;
  notify();
  return getTeacherClassById(classId);
}

export function resetAssignmentStore() {
  studentAssignments = cloneStudentAssignments();
  teacherAssignments = cloneTeacherAssignments();
  teacherClasses = cloneTeacherClasses();
  notify();
}
