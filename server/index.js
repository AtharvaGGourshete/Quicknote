import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure DB connection
const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,     // IMPORTANT for Docker: "postgres"
  database: process.env.DB_NAME, // FIXED (was DATABASE)
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("DB Connection Error:", err.message));

app.use(cors());
app.use(json());

// CREATE TODO
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res
        .status(400)
        .json({ error: "Task cannot be empty. Please add a task." });
    }

    const newTodo = await db.query(
      "INSERT INTO todos (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

// GET ALL TODOS
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await db.query("SELECT * FROM todos");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

// GET TODO BY ID
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await db.query("SELECT * FROM todos WHERE todo_id = $1", [id]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

// UPDATE TODO
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    await db.query(
      "UPDATE todos SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    res.json({ message: "Todo was updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

// DELETE TODO
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM todos WHERE todo_id = $1", [id]);
    res.json({ message: "Todo was deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
