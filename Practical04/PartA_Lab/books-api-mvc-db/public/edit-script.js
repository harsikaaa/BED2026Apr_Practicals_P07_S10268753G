const editBookForm = document.getElementById("editBookForm");
const loadingMessageDiv = document.getElementById("loadingMessage");
const messageDiv = document.getElementById("message");
const bookIdInput = document.getElementById("bookId");
const editTitleInput = document.getElementById("editTitle");
const editAuthorInput = document.getElementById("editAuthor");

const apiBaseUrl = "http://localhost:3000";

function getBookIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchBookData(bookId) {
  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);

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
    console.error("Error fetching book data:", error);
    messageDiv.textContent = `Failed to load book data: ${error.message}`;
    messageDiv.style.color = "red";
    loadingMessageDiv.textContent = "";
    return null;
  }
}

function populateForm(book) {
  bookIdInput.value = book.id;
  editTitleInput.value = book.title;
  editAuthorInput.value = book.author;
  loadingMessageDiv.style.display = "none";
  editBookForm.style.display = "block";
}

const bookIdToEdit = getBookIdFromUrl();

if (bookIdToEdit) {
  fetchBookData(bookIdToEdit).then((book) => {
    if (book) {
      populateForm(book);
    } else {
      loadingMessageDiv.textContent = "Book not found or failed to load.";
      messageDiv.textContent = "Could not find the book to edit.";
      messageDiv.style.color = "red";
    }
  });
} else {
  loadingMessageDiv.textContent = "No book ID specified for editing.";
  messageDiv.textContent =
    "Please provide a book ID in the URL (e.g., edit.html?id=1).";
  messageDiv.style.color = "orange";
}

editBookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bookId = bookIdInput.value;

  const updatedBookData = {
    title: editTitleInput.value,
    author: editAuthorInput.value
  };

  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedBookData)
    });

    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (response.status === 200) {
      messageDiv.textContent = "Book updated successfully!";
      messageDiv.style.color = "green";
    } else if (response.status === 400) {
      messageDiv.textContent = `Validation Error: ${responseBody.message}`;
      messageDiv.style.color = "red";
    } else if (response.status === 404) {
      messageDiv.textContent = "Book not found.";
      messageDiv.style.color = "red";
    } else {
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`
      );
    }
  } catch (error) {
    console.error("Error updating book:", error);
    messageDiv.textContent = `Failed to update book: ${error.message}`;
    messageDiv.style.color = "red";
  }
});