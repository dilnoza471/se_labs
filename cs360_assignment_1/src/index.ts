/**
 * @fileOverview Transcript Manager REST API server.
 * Provides CRUD operations on students and their transcripts.
 * @author Dilnoza Eraliyeva 230029
 */

import express, { Request, Response } from "express";
import * as db from "./TranscriptManager";

const app = express();
const port = 4001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize with some default students
db.initialize();

/**
 * GET /transcripts
 * Returns all transcripts.
 */
app.get("/transcripts", (req: Request, res: Response) => {
  const data = db.getAll();
  res.status(200).send(data);
});

/**
 * POST /transcripts/addStudent
 * Adds a student with a given name and creates an empty transcript.
 * Expects { "name": string } in the request body.
 */
app.post("/transcripts/addStudent", (req: Request, res: Response) => {
  const studentName: string = req.body.name;
  if (!studentName) {
    return res.status(400).send({ error: "Missing student name" });
  }

  const studentID = db.addStudent(studentName);
  console.log(
    `Handling POST /transcripts/addStudent name=${studentName}, id=${studentID}`
  );
  res.status(200).send({ studentID });
});

/**
 * GET /transcripts/:id
 * Returns transcript for student with given ID.
 * 404 if no such student.
 */
app.get("/transcripts/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const transcript = db.getTranscript(id);

  if (!transcript) {
    return res.status(404).send(`No student with id = ${id}`);
  }
  res.status(200).send(transcript);
});

/**
 * GET /studentids?name=NAME
 * Returns all IDs of students with the given name.
 */
app.get("/studentids", (req: Request, res: Response) => {
  const studentName = req.query.name as string;
  if (!studentName) {
    return res.status(400).send({ error: "Missing 'name' query parameter" });
  }
  console.log(`Handling GET /studentids?name=${studentName}`);

  const ids = db.getStudentIDs(studentName);
  res.status(200).send(ids);
});

/**
 * POST /transcripts/:id/grades
 * Body: { "courseName": string, "grade": number }
 */
app.post("/transcripts/:id/grades", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { courseName, grade } = req.body;

  if (!courseName || grade === undefined) {
    return res.status(400).send({ error: "Missing courseName or grade" });
  }

  const success = db.addGrade(id, { courseName, grade });

  if (!success) {
    return res.status(404).send(`No student with id = ${id}`);
  }

  res.status(200).send({ studentId: id, courseName, grade });
});

app.post("/transcripts/:id/grades/update", (req, res) => {
    const id = parseInt(req.params.id);
    const { courseName, grade } = req.body;

    if (!courseName || grade === undefined) {
        return res.status(400).send({ error: "Missing courseName or grade" });
    }

    const success = db.updateGrade(id, courseName, grade);
    if (!success) {
        return res.status(404).send(`No student or course found for id = ${id}`);
    }

    res.status(200).send({ studentId: id, courseName, grade });
});


/**
 * DELETE /transcripts/:id
 * Deletes transcript (and student) with the given ID.
 * Returns 200 if deleted, 404 if not found.
 */
app.delete("/transcripts/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  console.log(`Handling DELETE /transcripts, id=${id}`);

  const deleted = db.deleteStudent(id);
  if (deleted) {
    return res.sendStatus(200);
  } else {
    return res.status(404).send(`No student with id = ${id}`);
  }
});

/**
 * Catch-all for all unknown requests
 */
app.all(/.*/, (req: Request, res: Response) => {
  console.log(defaultErrorMessage(req.method, req.path));
  res.sendStatus(404);
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/**
 * Builds a default error message string
 */
function defaultErrorMessage(method: string, request: string): string {
  return `unknown ${method} request "${request}"`;
}
