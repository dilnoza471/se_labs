import { before } from 'node:test';
import * as db from './transcriptManager';
import { addStudent, StudentID } from './transcriptManager';

describe('Testing addStudent() method', () => {
  beforeEach(() => {
    db.initialize();
  });

  it('should create 4 dummy students when you call initialize()', () => {
    let transcripts = db.getAll();
    expect(transcripts.length).toBe(4);
  });

  it('should check valid inputs for addStudent()', () => {
    let length = db.getAll().length;
    let id = addStudent('Li');
    expect(typeof id).toBe('number');
    expect(id).toBeGreaterThanOrEqual(length);
  });

  it('should check invalid inputs for addStudent()', () => {
    expect(() => addStudent(null)).toThrow();
    expect(() => addStudent('')).toThrow();
    expect(() => addStudent('A')).toThrow();
    expect(() => addStudent('Abcd1234')).toThrow();
  });

  it('should give different ids to students with the same name', () => {
    let id1: StudentID = addStudent('Alice');
    let id2: StudentID = addStudent('Alice');
    expect(id1).not.toBe(id2);
  });

  it('getStudentIDs(name) includes both', () => {
    let id1: StudentID = addStudent('Alice');
    let id2: StudentID = addStudent('Alice');
    let ids: StudentID[] = db.getStudentIDs('Alice');
    expect(ids).toContain(id1);
    expect(ids).toContain(id2);
  });
});

describe('Testing getTranscript() method', () => {
  beforeEach(() => {
    db.initialize();
  });

  it('should get transcript for valid studentID', () => {
    let transcripts = db.getAll();
    for (let transcript of transcripts) {
      let id = transcript.student.studentID;
      let t = db.getTranscript(id); 
      expect(t).toBe(transcript);
    }
  });

  it('should return undefined for invalid studentID', () => {
    let t = db.getTranscript(9999);
    expect(t).toBeUndefined();
  });

  
});

describe("Testing deleteStudent() method", () => {
  beforeEach(() => {
    db.initialize();
  });
  
  it("should delete student for valid studentID", () => { 
    let transcripts = db.getAll();
    let length = transcripts.length;
    let id = transcripts[0].student.studentID;
    db.deleteStudent(id);
    expect(db.getAll().length).toBe(length - 1);
    expect(db.getTranscript(id)).toBeUndefined();
  });

  it("should throw exception for invalid studentID", () => { 
    expect(() => db.deleteStudent(9999)).toThrow();
  });

  it("Create two students, delete one; getStudentIDs() shows only the other;", ()=>{
    let id1:StudentID = db.addStudent('Alice');
    let id2:StudentID = db.addStudent('Alice');
    db.deleteStudent(id1);
    let ids: StudentID[] = db.getStudentIDs('Alice');
    expect(ids).not.toContain(id1);
    expect(ids).toContain(id2);
  });

  it("deleting again throws.", ()=>{
    let id1:StudentID = db.addStudent('Alice');
    db.deleteStudent(id1);
    expect(() => db.deleteStudent(id1)).toThrow();  

  });
});

describe("Testing addGrade() method", ()=>{
  beforeEach(() => {
    db.initialize();
  });

  it("should add grade to valid studentID", ()=>{
    let transcripts = db.getAll();
    let id = transcripts[0].student.studentID;
    let t1 = db.getTranscript(id);
    let len = t1.grades.length;
    db.addGrade(id, "CS360", 95);
    let t2 = db.getTranscript(id);
    expect(t2.grades.length).toBe(len + 1);
    expect(t2.grades).toContainEqual({course: "CS360", grade: 95});
  });

  it("should throw exception for invalid studentID", ()=>{
    expect(() => db.addGrade(9999, "CS360", 95)).toThrow();
  });

  it("should throw exception for invalid course name", ()=>{
    let transcripts = db.getAll();
    let id = transcripts[0].student.studentID;
    expect(() => db.addGrade(id, "", 95)).toThrow();
    expect(() => db.addGrade(id, null, 95)).toThrow();
  });

  it("should throw exception for invalid grade", ()=>{
    let transcripts = db.getAll();
    let id = transcripts[0].student.studentID;
    expect(() => db.addGrade(id, "CS360", -5)).toThrow();
    expect(() => db.addGrade(id, "CS360", 105)).toThrow();
    expect(() => db.addGrade(id, "CS360", 4.5)).toThrow();   //these tests fail (grade check is not implemented in addGrade())
  });

  it("should not accept two grades with the same course name", ()=>{
    let transcripts = db.getAll();
    let id = transcripts[0].student.studentID;
    db.addGrade(id, "CS360", 95);
    db.addGrade(id, "CS411", 85);
    expect(() => db.addGrade(id, "CS360", 85)).toThrow();   
  });
});

describe('Testing getGrade() method', () => {
  beforeEach(() => {
    db.initialize();
  });

  it('should get grade for valid studentID and course', () => {
    let transcripts = db.getAll();
    for (let transcript of transcripts) {
      let id = transcript.student.studentID;
      for (let cg of transcript.grades) {
        let grade = db.getGrade(id, cg.course);
        expect(grade).toBe(cg.grade);
      }
    }
  });

  it('should return undefined for invalid studentID', () => {
    let grade = db.getGrade(9999, 'CS360');
    expect(grade).toBeUndefined();
  });

  it('should return undefined for invalid course', () => {
    let transcripts = db.getAll();
    for (let transcript of transcripts) {
      let id = transcript.student.studentID;
      let grade = db.getGrade(id, 'INVALID-COURSE');
      expect(grade).toBeUndefined();
    }       
  });
  
  it('should return undefined for student without that course', () => {
    let id = db.addStudent('Alice');
    let grade = db.getGrade(id, 'CS360');
    expect(grade).toBeUndefined();
  });

});
    
