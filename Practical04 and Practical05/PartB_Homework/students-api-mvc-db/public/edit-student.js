const editStudentForm = document.getElementById("editStudentForm");
const loadingMessageDiv = document.getElementById("loadingMessage");
const messageDiv = document.getElementById("message");
const studentIdInput = document.getElementById("studentId");
const editNameInput = document.getElementById("editName");
const editEmailInput = document.getElementById("editEmail");

const apiBaseUrl = "http://localhost:3000";

function getStudentIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchStudentData(studentId) {
  try {
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`);

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

    return await response.json();
  } catch (error) {
    console.error("Error fetching student data:", error);
    messageDiv.textContent =
      `Failed to load student data: ${error.message}`;
    messageDiv.style.color = "red";
    loadingMessageDiv.textContent = "";
    return null;
  }
}

function populateForm(student) {
  studentIdInput.value = student.id;
  editNameInput.value = student.name;
  editEmailInput.value = student.email;

  loadingMessageDiv.style.display = "none";
  editStudentForm.style.display = "block";
}

const studentIdToEdit = getStudentIdFromUrl();

if (studentIdToEdit) {
  fetchStudentData(studentIdToEdit).then((student) => {
    if (student) {
      populateForm(student);
    } else {
      loadingMessageDiv.textContent =
        "Student not found or failed to load.";
      messageDiv.textContent =
        "Could not find the student to edit.";
      messageDiv.style.color = "red";
    }
  });
} else {
  loadingMessageDiv.textContent =
    "No student ID specified for editing.";
  messageDiv.textContent =
    "Please provide a student ID in the URL.";
  messageDiv.style.color = "orange";
}

editStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const studentId = studentIdInput.value;

  const updatedStudentData = {
    name: editNameInput.value,
    email: editEmailInput.value
  };

  try {
    const response = await fetch(
      `${apiBaseUrl}/students/${studentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedStudentData)
      }
    );

    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (response.status === 200) {
      messageDiv.textContent =
        "Student updated successfully!";
      messageDiv.style.color = "green";
    } else if (response.status === 400) {
      messageDiv.textContent =
        `Validation Error: ${responseBody.message}`;
      messageDiv.style.color = "red";
    } else if (response.status === 404) {
      messageDiv.textContent = "Student not found.";
      messageDiv.style.color = "red";
    } else {
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`
      );
    }
  } catch (error) {
    console.error("Error updating student:", error);
    messageDiv.textContent =
      `Failed to update student: ${error.message}`;
    messageDiv.style.color = "red";
  }
});