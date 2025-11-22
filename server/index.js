import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const db = new Client({
  user: process.env.MYSQLUSER,
  host: process.env.MYSQLHOST,    
  database: process.env.MYSQLDATABASE,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("DB Connection Error:", err.message));

app.use(cors());
app.use(json());

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

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await db.query("SELECT * FROM todos");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
