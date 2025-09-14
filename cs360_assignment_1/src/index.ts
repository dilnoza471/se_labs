/**
 * @fileOverview Transcript Manager REST API server.
 * Provides CRUD operations on students and their transcripts.
 * @author
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
 * Catch-all for unknown GET requests
 */
app.get("/:request*", (req: Request, res: Response) => {
  console.log(defaultErrorMessage("GET", req.params["request*"]));
  res.sendStatus(404);
});

/**
 * Catch-all for unknown POST requests
 */
app.post("/:request*", (req: Request, res: Response) => {
  console.log(defaultErrorMessage("POST", req.params["request*"]));
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
