const booksListDiv = document.getElementById("booksList");
const fetchBooksBtn = document.getElementById("fetchBooksBtn");
const messageDiv = document.getElementById("message");
const apiBaseUrl = "http://localhost:3000";

async function fetchBooks() {
  try {
    booksListDiv.innerHTML = "Loading books...";
    messageDiv.textContent = "";

    const response = await fetch(`${apiBaseUrl}/books`);

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

    const books = await response.json();

    booksListDiv.innerHTML = "";

    if (books.length === 0) {
      booksListDiv.innerHTML = "<p>No books found.</p>";
    } else {
      books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        bookElement.setAttribute("data-book-id", book.id);

        bookElement.innerHTML = `
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>ID: ${book.id}</p>
          <button onclick="viewBookDetails(${book.id})">View Details</button>
          <button onclick="editBook(${book.id})">Edit</button>
          <button class="delete-btn" data-id="${book.id}">Delete</button>
        `;

        booksListDiv.appendChild(bookElement);
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    booksListDiv.innerHTML = `<p style="color: red;">Failed to load books: ${error.message}</p>`;
  }
}

function viewBookDetails(bookId) {
  alert(`View details for book ID: ${bookId} (Not implemented yet)`);
}

function editBook(bookId) {
  window.location.href = `edit.html?id=${bookId}`;
}

async function handleDeleteClick(event) {
  const bookId = event.target.getAttribute("data-id");

  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`, {
      method: "DELETE"
    });

    if (response.status === 204) {
      event.target.closest(".book-item").remove();
      messageDiv.textContent = "Book deleted successfully.";
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
    console.error("Error deleting book:", error);
    messageDiv.textContent = `Failed to delete book: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

fetchBooksBtn.addEventListener("click", fetchBooks);