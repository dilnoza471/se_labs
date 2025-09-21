import {StudentID, Student, Course, CourseGrade, Transcript} from "./types";
import {remoteGet, remotePost, remoteDelete} from "./remoteService";

/**
 * @desc Gets all transcripts from the server
 * @returns Promise containing array of all transcripts
 */
export async function getAllTranscripts(): Promise<Transcript[]> {
    let arr = await remoteGet('transcripts');
    return arr;
}

/**
 * @desc Creates a new student
 * @param name - The student's name
 * @returns Promise containing the new student's ID
 */
export async function createStudent(name: string): Promise<{studentID: StudentID}> {
    let result = await remotePost('transcripts', {name: name});
    return result;
}

/**
 * @desc Gets a specific student's transcript by ID
 * @param id - The student's ID
 * @returns Promise containing the student's transcript
 */
export async function getTranscriptById(id: StudentID): Promise<Transcript> {
    let transcript = await remoteGet(`transcripts/${id}`);
    return transcript;
}

/**
 * @desc Gets all student IDs for students with the given name
 * @param name - The student name to search for
 * @returns Promise containing array of student IDs
 */
export async function getStudentIdsByName(name: string): Promise<StudentID[]> {
    let ids = await remoteGet(`studentids?name=${encodeURIComponent(name)}`);
    return ids;
}

/**
 * @desc Deletes a student and their transcript
 * @param id - The student's ID to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteStudent(id: StudentID): Promise<void> {
    await remoteDelete(`transcripts/${id}`);
}

/**
 * @desc Adds a grade for a student in a specific course
 * @param studentID - The student's ID
 * @param course - The course name
 * @param grade - The grade to assign
 * @returns Promise that resolves when grade is added
 */
export async function addGrade(studentID: StudentID, course: Course, grade: number): Promise<void> {
    await remotePost(`transcripts/${studentID}/${encodeURIComponent(course)}`, {grade: grade});
}

/**
 * @desc Gets a specific grade for a student in a course
 * @param studentID - The student's ID
 * @param course - The course name
 * @returns Promise containing the grade information
 */
export async function getGrade(studentID: StudentID, course: Course): Promise<{studentID: StudentID, course: Course, grade: number}> {
    let gradeInfo = await remoteGet(`transcripts/${studentID}/${encodeURIComponent(course)}`);
    return gradeInfo;
}