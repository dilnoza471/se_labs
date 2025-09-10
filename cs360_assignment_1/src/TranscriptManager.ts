export type StudentID = number;
export type Student = {studentID: StudentID, studentName: string};
export type Course = {courseName: string};
export type CourseGrade = {courseName: string, grade:number};
export type Transcript = {student: Student, grades: CourseGrade[]};


// initializes the database with 4 students,
// each with an empty transcript (handy for debugging)
let transcripts: Transcript[] = [];

export function initialize(){
    addStudent("Sardor");
    addStudent("Jasur");
    addStudent("Jasur");
    addStudent("Nigora");
    console.log("Initial list of transcripts:");
    for(let t of transcripts){
        console.log(t);
    }


}

// returns a list of all the transcripts.
// handy for debugging
export function getAll(){

}

// creates an empty transcript for a student with this name,
// and returns a fresh ID number
export function addStudent(name:string) : StudentID{
    let newStudentID = transcripts.length == 0? 1: transcripts[transcripts.length-1].student.studentID;
    let student: Student = {studentID:newStudentID, studentName:name};
}

// gets transcript for given ID.  Returns undefined if missing
export function getTranscript(studentID:number) : Transcript{
    throw new Error('Not implemented');
}

// returns list of studentIDs matching a given name
export function getStudentIDs(studentName:string) : StudentID[]{
    throw new Error('Not implemented');
}
