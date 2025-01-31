import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => c.json({
  message: "Hola mundo",
  date: "2025-01-31",
}))

app.get('/test', (c) => {
  return c.env.DB.prepare("SELECT * FROM cursos")
    .all()
    .then((data) => c.json(data))
    .catch((error) => c.json({ message: error.message }, 500));
});


export default app