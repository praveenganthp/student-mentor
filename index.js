const express = require("express");
const app = express();
app.use(express.json()); // middleware

let mentors = [];
let students = [];

// Function to find a mentor by ID
function findMentorById(mentorId) {
  return mentors.find((mentor) => mentor.id === mentorId);
}

// Function to find a student by ID
function findStudentById(studentId) {
  return students.find((student) => student.id === studentId);
}

// Create a Mentor
app.post("/mentors", (req, res) => {
  const { name, email } = req.body;
  const mentor = {
    id: mentors.length + 1,
    name,
    email,
    students: [],
  };

  mentors.push(mentor);
  res.json({ message: "Mentor created successfully", mentor });
});

// Create a Student
app.post("/students", (req, res) => {
  const { name } = req.body;
  const student = {
    id: students.length + 1,
    ...req.body,
    name,
    mentorId: null,
  };

  students.push(student);
  res.json({ message: "Student created successfully", student });
});

// Assign Students to a Mentor
app.post("/mentors/:mentorId/students", (req, res) => {
  const { mentorId } = req.params;
  const mentor = findMentorById(parseInt(mentorId));
  if (!mentor) {
    return res.status(404).json({ error: "Mentor not found" });
  }
  const studentIds = req.body;
  for (const studentId of studentIds) {
    const student = findStudentById(parseInt(studentId));
    if (student) {
      student.mentorId = mentor.id;
      mentor.students.push(student);
    }
  }
  res.json({ message: "Students assigned to mentor successfully", mentor });
});

// Assign or Change Mentor for a Student
app.put("/students/:studentId/mentor", (req, res) => {
  const { studentId } = req.params;
  const student = findStudentById(parseInt(studentId));
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  const { mentorId } = req.body;
  const mentor = findMentorById(parseInt(mentorId));
  if (!mentor) {
    return res.status(404).json({ error: "Mentor not found" });
  }
  student.mentorId = mentor.id;
  res.json({ message: "Mentor assigned to student successfully", student });
});

// Show All Students for a Mentor
app.get("/mentors/:mentorId/students", (req, res) => {
  const { mentorId } = req.params;
  const mentor = findMentorById(parseInt(mentorId));
  if (!mentor) {
    return res.status(404).json({ error: "Mentor not found" });
  }
  const studentsWithMentorInfo = mentor.students.map((student) => ({
    id: student.id,
    name: student.name,
    email: student.email,
  }));
  res.json(studentsWithMentorInfo);
});

// Show Previously Assigned Mentor for a Student
app.get("/students/:studentId/mentor", (req, res) => {
  const { studentId } = req.params;
  const student = findStudentById(parseInt(studentId));
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  const mentor = findMentorById(student.mentorId);
  if (!mentor) {
    return res.status(404).json({ message: "No mentor assigned yet" });
  }
  res.json({ id: mentor.id, name: mentor.name, email: mentor.email });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
