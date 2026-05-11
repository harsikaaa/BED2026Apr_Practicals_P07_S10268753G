const express = require("express");
const app = express();
const PORT = 3000;

// 1. Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to Homework API");
});

// 2. Intro Route
app.get("/intro", (req, res) => {
  res.send("I am a student at Ngee Ann Poly learning back-end development.");
});

// 3. Name Route
app.get("/name", (req, res) => {
  res.send("My name is Harsika"); 
});

// 4. Hobbies Route
app.get("/hobbies", (req, res) => {
  res.json(["sleeping", "reading", "eating"]);
});

// 5. Food Route
app.get("/food", (req, res) => {
  res.send("My favorite foods are Mala and Basil Chicken Rice.");
});

app.get("/student", (req, res) => {
  // Sending a JSON object
  res.json({
    name: "Harsika",
    hobbies: ["sleeping", "reading", "eating"],
    intro: "Hi, I'm Harsika, a Year 2 student passionate about building APIs!"
  });
});

app.listen(PORT, () => {
  console.log(`Homework API is running on http://localhost:${PORT}`);
});