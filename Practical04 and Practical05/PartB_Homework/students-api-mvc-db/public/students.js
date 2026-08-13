const studentsListDiv = document.getElementById("studentsList");
const fetchStudentsBtn = document.getElementById("fetchStudentsBtn");
const messageDiv = document.getElementById("message");

const apiBaseUrl = "http://localhost:3000";

async function fetchStudents() {
  try {
    studentsListDiv.innerHTML = "Loading students...";
    messageDiv.textContent = "";

    const response = await fetch(`${apiBaseUrl}/students`);

    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };

      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    const students = await response.json();

    studentsListDiv.innerHTML = "";

    if (students.length === 0) {
      studentsListDiv.innerHTML = "<p>No students found.</p>";
    } else {
      students.forEach((student) => {
        const studentElement = document.createElement("div");

        studentElement.classList.add("student-item");
        studentElement.setAttribute("data-student-id", student.id);

        studentElement.innerHTML = `
          <h3>${student.name}</h3>
          <p>Email: ${student.email}</p>
          <p>ID: ${student.id}</p>
          <button onclick="editStudent(${student.id})">Edit</button>
          <button class="delete-btn" data-id="${student.id}">Delete</button>
        `;

        studentsListDiv.appendChild(studentElement);
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    studentsListDiv.innerHTML =
      `<p>Failed to load students: ${error.message}</p>`;
  }
}

function editStudent(studentId) {
  window.location.href = `edit-student.html?id=${studentId}`;
}

async function handleDeleteClick(event) {
  const studentId = event.target.getAttribute("data-id");

  try {
    const response = await fetch(
      `${apiBaseUrl}/students/${studentId}`,
      {
        method: "DELETE"
      }
    );

    if (response.status === 204) {
      event.target.closest(".student-item").remove();
      messageDiv.textContent = "Student deleted successfully.";
      messageDiv.style.color = "green";
    } else {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };

      throw new Error(
        `API error! status: ${response.status}, message: ${errorBody.message}`
      );
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    messageDiv.textContent =
      `Failed to delete student: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

fetchStudentsBtn.addEventListener("click", fetchStudents);