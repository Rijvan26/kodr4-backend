import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [
  {
    id: 1,
    title: "Learn Hono",
    completed: false,
  },
  {
    id: 2,
    title: "Build CRUD API",
    completed: false,
  },
];




app.get("/", (c) => {
  return c.json({
    message: "Hono CRUD API",
    todos: todos,

  },200);
});

app.post("/todos", async (c) => {
  const body = await c.req.json();
  const newTodo: Todo = {
    id: todos.length + 1,
    title: body.title,
    completed: false,
  };
  todos.push(newTodo);
  return c.json(newTodo, 201);
})


app.delete("/todos/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  todos = todos.filter((todo) => todo.id !== id);
  return c.json(null, 204);
})

app.patch("/todos/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }
  todo.title = body.title ?? todo.title;
  todo.completed = body.completed ?? todo.completed;
  return c.json({message:"update success", todo},200);
})

export default app;

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
