const express = require("express");
const bodyParser = require("body-parser");

// initialize Express.js server and save as a variable
// so it can be referred to as `app`
const app = express();

// Add this line near the top of your file, under the existing imports
const serveStatic = require("serve-static");
// Add this line after `app.use(bodyParser.json());`
app.use(serveStatic("public"));

app.use(bodyParser.json());
let todos = []; // In-memory storage for todos

// GET endpoint to fetch all todo items
app.get("/todos", (req, res) => {
  res.json(todos);
});

// GET endpoint to get an existing todo item with the specified `id`
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  res.json(todo);
});

// POST endpoint to create a new todo item
// provide `title` and optionally `completed` in the request body as JSON
app.post("/todos", (req, res) => {
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: req.body.completed || false,
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT endpiont to update an existing todo item with the specified `id`
// provide updated `title` and/or `completed` in the request body as JSON
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todo.title = req.body.title || todo.title;
  // check if req.body.completed is undefined
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  //todo.completed = req.body.completed || todo.completed;
  res.json(todo);
});

// DELETE endpoint to remove an existing todo item with the specified `id`
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// run the server on port 3000
// for example the app can run locally at this URL: http://localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});