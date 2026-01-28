const express = require("express");
const { Book, BorrowLog } = require("./db");
const { checkRole } = require("./middleware");
const app = express();

app.use(express.json());

app.get("/api/books", async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

app.get("/api/books/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});

app.post("/api/books", checkRole("admin"), async (req, res) => {
  try {
    const { title, author, stock } = req.body;

    if (!title || !author)
      return res.status(400).json({ message: "Title/Author required" });

    const newBook = await Book.create({ title, author, stock });
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/borrow", checkRole("user"), async (req, res) => {
  const userId = req.headers["x-user-id"];
  const { bookId, latitude, longitude } = req.body;

  try {
    const book = await Book.findByPk(bookId);

    if (!book || book.stock <= 0) {
      return res
        .status(400)
        .json({ message: "Book unavailable or out of stock" });
    }

    await book.decrement("stock");

    const log = await BorrowLog.create({
      userId,
      bookId,
      latitude,
      longitude,
    });

    res.json({ message: "Borrow successful", data: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
