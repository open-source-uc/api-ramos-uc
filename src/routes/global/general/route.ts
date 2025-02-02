import createHono from "../../../lib/honoBase";

const app = createHono()

app.get('/career', (c) => {
    return c.env.DB.prepare("SELECT name FROM career")
        .all()
        .then((data) => c.json(data, 200))
        .catch((error) => c.json({ message: error.message }, 500));
});

app.get('/school', (c) => {
    return c.env.DB.prepare("SELECT DISTINCT school FROM course")
        .all()
        .then((data) => c.json({ schools: data.results }, 200))
        .catch((error) => c.json({ message: error.message }, 500));
});

app.get('/category', (c) => {
    return c.env.DB.prepare("SELECT DISTINCT category FROM course")
        .all()
        .then((data) => c.json({ categorys: data.results }, 200))
        .catch((error) => c.json({ message: error.message }, 500));
});

app.get('/area', (c) => {
    return c.env.DB.prepare("SELECT DISTINCT area FROM course")
        .all()
        .then((data) => c.json({ areas: data.results }, 200))
        .catch((error) => c.json({ message: error.message }, 500));
});

export default app