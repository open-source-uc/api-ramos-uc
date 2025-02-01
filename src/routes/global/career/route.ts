import createHono from "../../../lib/honoBase";

const app = createHono()

app.get('/', (c) => {
    return c.env.DB.prepare("SELECT name FROM career")
        .all()
        .then((data) => c.json(data, 200))
        .catch((error) => c.json({ message: error.message }, 500));
});

export default app