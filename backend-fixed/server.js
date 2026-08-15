import express from "express";
const app = express();
const port = process.env.PORT || 8000;
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import connectDB from "./database/db.js";
import { Todo } from "./models/todo.js";
import { User } from "./models/user.js";
import { requireAuth } from "./middleware/auth.js";
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ---------- AUTH ----------

app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.send({
        success: false,
        message: "Username, email, and password are all required.",
      });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.send({
        success: false,
        message: "An account with that email or username already exists.",
      });
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user._id);

    res.send({
      success: true,
      message: "Account created successfully.",
      data: { token, user: { id: user._id, username: user.username, email: user.email } },
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Failed to create account.",
      error: error.message,
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.send({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = signToken(user._id);
    res.send({
      success: true,
      message: "Logged in successfully.",
      data: { token, user: { id: user._id, username: user.username, email: user.email } },
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
});

// ---------- TODOS (all require login, all scoped to req.userId) ----------

app.get("/todos", requireAuth, async (req, res) => {
  try {
    const result = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Todo lists retrieved successfully.",
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Failed to retrieve Todo lists.",
      error: error.message,
    });
  }
});

app.post("/create-todo", requireAuth, async (req, res) => {
  try {
    const result = await Todo.create({ ...req.body, user: req.userId });
    res.send({
      success: true,
      message: "Todo created successfully..",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Failed to create Todo",
      error: error.message,
    });
  }
});

app.get("/:todoID", requireAuth, async (req, res) => {
  try {
    const result = await Todo.findOne({ _id: req.params.todoID, user: req.userId });
    res.send({
      success: true,
      message: "Todo retrived successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Todo retrival failed",
      error: error.message,
    });
  }
});

app.patch("/:todoId", requireAuth, async (req, res) => {
  try {
    const result = await Todo.findOneAndUpdate(
      { _id: req.params.todoId, user: req.userId },
      req.body,
      { new: true }
    );
    res.send({
      success: true,
      message: "Todo list updated successfully..",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Todo updation failed",
      error: error.message,
    });
  }
});

app.delete("/delete/:todoId", requireAuth, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.todoId, user: req.userId });
    res.send({
      success: true,
      message: "Todo deleted successfully..",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Todo deletion failed",
      error: error.message,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
