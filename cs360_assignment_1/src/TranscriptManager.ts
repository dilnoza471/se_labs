/**
 * @fileOverview In-memory "database" and helper functions
 * for managing students and their transcripts.
 */

export type StudentID = number;
export type Student = { studentID: StudentID; studentName: string };
export type Course = { courseName: string };
export type CourseGrade = { courseName: string; grade: number };
export type Transcript = { student: Student; grades: CourseGrade[] };

// Internal storage for all transcripts
let transcripts: Transcript[] = [];

/**
 * Initializes the "database" with 4 demo students.
 * Each starts with an empty transcript.
 * 
 */
export function initialize(): void {
  addStudent("Sardor");
  addStudent("Jasur");
  addStudent("Jasur");
  addStudent("Nigora");

  console.log("Initial list of transcripts:");
  for (let t of transcripts) {
    console.log(t);
  }
}

/**
 * Returns a list of all transcripts.
 */
export function getAll(): Transcript[] {
  return transcripts;
}

/**
 * Creates an empty transcript for a new student with the given name.
 * @param name Student's name
 * @returns StudentID newly assigned unique ID
 */
export function addStudent(name: string): StudentID {
  const newStudentID =
    transcripts.length === 0
      ? 1
      : transcripts[transcripts.length - 1].student.studentID + 1;

  const rec: Transcript = {
    student: { studentID: newStudentID, studentName: name },
    grades: [],
  };

  transcripts.push(rec);
  return newStudentID;
}

/**
 * Gets the transcript for a given student ID.
 * @param studentID ID of student
 * @returns Transcript if found, otherwise undefined
 */
export function getTranscript(studentID: number): Transcript | undefined {
  return transcripts.find((t) => t.student.studentID === studentID);
}

/**
 * Returns all student IDs matching a given name.
 * @param studentName Student name to search for
 * @returns Array of StudentIDs
 */
export function getStudentIDs(studentName: string): StudentID[] {
  return transcripts
    .filter((t) => t.student.studentName === studentName)
    .map((t) => t.student.studentID);
}
/**
 * Adds a grade to a student's transcript.
 * @param studentId ID of the student
 * @param courseGrade Course name and grade
 * @returns true if grade added, false if student not found
 */
export function addGrade(studentId: StudentID, courseGrade: CourseGrade): boolean {
  const transcript = transcripts.find(t => t.student.studentID === studentId);
  if (!transcript) return false;

  transcript.grades.push(courseGrade);
  return true;
}

/**
 * Updates an existing grade for a student.
 * @param studentId Student ID
 * @param courseName Course name
 * @param newGrade New grade
 * @returns true if updated, false if student or course not found
 */
export function updateGrade(studentId: StudentID, courseName: string, newGrade: number): boolean {
    const transcript = transcripts.find(t => t.student.studentID === studentId);
    if (!transcript) return false;
    const course = transcript.grades.find(g => g.courseName === courseName);
    if (!course) return false;
    course.grade = newGrade;
    return true;
}


/**
 * Deletes a student and their transcript by ID.
 * @param id StudentID to delete
 * @returns true if deleted, false if not found
 */
export function deleteStudent(id: StudentID): boolean {
  const index = transcripts.findIndex((t) => t.student.studentID === id);

  if (index === -1) {
    return false; // not found
  }

  transcripts.splice(index, 1);
  return true;
}
