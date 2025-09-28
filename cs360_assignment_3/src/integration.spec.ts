import * as client from './client/client';
import Express from 'express';
import * as http from 'http';
import transcriptServer from './server/transcriptServer';
import { AddressInfo } from 'net';
import { setBaseURL } from './client/remoteService';
import * as db from './server/transcriptManager';

/**
 * Tests for the Transcript Manager. This test suite automatically deploys a local testing server
 * and cleans it up when it's done. Each test is hermetic, as the datastore is cleared before each
 * test runs.
 */
describe('TranscriptManager', () => {
  // The server instance, once deployed for testing purposes
  let server: http.Server;

  // Set up the server once before all tests run
  beforeAll(async () => {
    const app = Express();
    server = http.createServer(app);
    transcriptServer(app);
    db.initialize();

    await server.listen();
    const address = server.address() as AddressInfo;
    setBaseURL(`http://localhost:${address.port}`);
  });

  // Tear down the server once all tests are done
  afterAll(async () => {
    await server.close();
  });

  // Clear the datastore before each test to ensure hermetic tests
  beforeEach(() => {
    db.initialize();
  });

  // Unit tests - create a student
  describe('Unit tests: creating students', () => {
    it('should return an ID', async () => {
      const createdStudent = await client.addStudent('Aziza');
      expect(createdStudent.studentID).toBeGreaterThan(0);
      await expect(client.getStudentIDs('Aziza')).resolves.toContain(createdStudent.studentID);
    });

    it('should return different IDs for different students', async () => {
      const s1 = await client.addStudent('Aziza');
      const s2 = await client.addStudent('Yusuf');
      expect(s2.studentID).not.toBe(s1.studentID);
    });

    it('should return different IDs for same-named students', async () => {
      const s1 = await client.addStudent('Aziza');
      const s2 = await client.addStudent('Aziza');
      expect(s2.studentID).not.toBe(s1.studentID);
    });

    it('should reject invalid names and assert error message mentions reason', async () => {
      await expect(client.addStudent('')).rejects.toThrow(/name/i);
      await expect(client.addStudent('A')).rejects.toThrow(/name/i);
      await expect(client.addStudent('Abcd1234')).rejects.toThrow(/name/i);
      await expect(client.addStudent(null)).rejects.toThrow(/name/i);
    });
  });

  // Unit tests - post a grade
  describe('Unit tests: posting grades', () => {
    it('should not accept grades for invalid student IDs', async () => {
      await expect(client.addGrade(9999, 'CS360', 95)).rejects.toThrow();
    });

    it('should accept grades for students', async () => {
      const s = await client.addStudent('Aziza');
      const grade = await client.addGrade(s.studentID, 'CS360', 95);
      expect(grade).toBe(95);
    });

    it('should not accept grades for invalid course names', async () => {
      const s = await client.addStudent('Aziza');
      await expect(client.addGrade(s.studentID, '', 95)).rejects.toThrow();
      await expect(client.addGrade(s.studentID, null, 95)).rejects.toThrow();
    });

    it('should not accept grades twice for the same course', async () => {
      const s = await client.addStudent('Aziza');
      await client.addGrade(s.studentID, 'CS360', 95);
      await expect(client.addGrade(s.studentID, 'CS360', 85)).rejects.toThrow();
    });

    it('should not accept invalid grades', async () => {
      const s = await client.addStudent('Aziza');
      await expect(client.addGrade(s.studentID, 'CS360', -5)).rejects.toThrow();
      await expect(client.addGrade(s.studentID, 'CS360', 105)).rejects.toThrow();
      await expect(client.addGrade(s.studentID, 'CS360', 4.5)).rejects.toThrow();
    });

    it('should fetch grades once posted', async () => {
      const s = await client.addStudent('Aziza');
      await client.addGrade(s.studentID, 'CS360', 95);
      await client.addGrade(s.studentID, 'CS411', 85);
      await expect(client.getGrade(s.studentID, 'CS360')).resolves.toBe(95);
      await expect(client.getGrade(s.studentID, 'CS411')).resolves.toBe(85);
    });
  });

  // Full system tests
  describe('Full-system tests', () => {
    it('should allow multiple students to have the same name, giving them different IDs', async () => {
      const [s1, s2] = await Promise.all([
        client.addStudent('Aziza'),
        client.addStudent('Aziza'),
      ]);
      expect(s2.studentID).not.toBe(s1.studentID);
      const ids = await client.getStudentIDs('Aziza');
      expect(ids).toContain(s1.studentID);
      expect(ids).toContain(s2.studentID);
    });

    it('should remove a deleted student from the list of students', async () => {
      const s = await client.addStudent('Aziza');
      await client.deleteStudent(s.studentID);
      const ids = await client.getStudentIDs('Aziza');
      expect(ids).not.toContain(s.studentID);

      await expect(client.deleteStudent(s.studentID)).rejects.toThrow();
      await expect(client.getTranscript(s.studentID)).rejects.toThrow();
    });

    it('should get transcript by a valid Id', async () => {
      const s = await client.addStudent('Aziza');
      await client.addGrade(s.studentID, 'CS360', 95);
      await client.addGrade(s.studentID, 'CS411', 85);
      const transcript = await client.getTranscript(s.studentID);

      expect(transcript.student.studentName).toBe('Aziza');
      expect(transcript.student.studentID).toBe(s.studentID);
      expect(transcript.grades).toContainEqual({ course: 'CS360', grade: 95 });
      expect(transcript.grades).toContainEqual({ course: 'CS411', grade: 85 });
    });

    it('should reject requests for transcripts with invalid Ids', async () => {
      await expect(client.getTranscript(9999)).rejects.toThrow();
    });
  });
});
