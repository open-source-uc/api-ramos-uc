import { createRoute, z } from "@hono/zod-openapi";
import createHono from "../../../lib/honoBase";

const app = createHono()

app.openapi(
    createRoute({
        path: "/career",
        method: "get",
        tags: ["information"],
        responses: {
            200: {
                description: "Carreras",
                content: {
                    "application/json": {
                        schema: z.object({
                            career: z.array(z.object({
                                id: z.number(),
                                name: z.string()
                            }))
                        })
                    },
                },
            },
            500: {
                description: "Error interno",
                content: {
                    "application/json": {
                        schema: z.object({
                            message: z.string()
                        })
                    }
                }
            }
        }
    }), (c) => {
        return c.env.DB.prepare("SELECT * FROM career")
            .all<{ id: number, name: string }>()
            .then((data) => c.json({ career: data.results }, 200))
            .catch((error) => c.json({ message: error.message }, 500));
    });

app.openapi(createRoute({
    path: "/school",
    method: "get",
    tags: ["information"],
    responses: {
        200: {
            description: "Escuelas",
            content: {
                "application/json": {
                    schema: z.object({
                        schools: z.array(z.object({
                            id: z.number(),
                            school: z.string()
                        }))
                    })
                },
            },
        },
        500: {
            description: "Error interno",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    })
                }
            }
        }
    }
}), (c) => {
    return c.env.DB.prepare("SELECT * FROM school")
        .all<{
            school: string;
            id: number;
        }>()
        .then((data) => c.json({ schools: data.results }, 200))
        .catch((error) => c.json({ message: error.message }, 500));
});

app.openapi(createRoute({
    path: "/category",
    method: "get",
    tags: ["information"],
    responses: {
        200: {
            description: "Categorias",
            content: {
                "application/json": {
                    schema: z.object({
                        categorys: z.array(z.object({
                            id: z.number(),
                            category: z.string()
                        }))
                    })
                },
            },
        },
        500: {
            description: "Error interno",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    })
                }
            }
        }
    }
}), (c) => {
    return c.env.DB.prepare("SELECT * FROM category")
        .all<{
            category: string;
            id: number;
        }>()
        .then((data) => c.json({ categorys: data.results }, 200))
        .catch((error) => c.json({ message: error.message }, 500));
});

app.openapi(createRoute({
    path: "/area",
    method: "get",
    tags: ["information"],
    responses: {
        200: {
            description: "Areas",
            content: {
                "application/json": {
                    schema: z.object({
                        areas: z.array(z.object({
                            id: z.number(),
                            area: z.string()
                        }))
                    })
                },
            },
        },
        500: {
            description: "Error interno",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    })
                }
            }
        }
    }
}), (c) => {
    return c.env.DB.prepare("SELECT * FROM area")
        .all<{
            area: string;
            id: number;
        }>()
        .then((data) => c.json({ areas: data.results }, 200))
        .catch((error) => c.json({ message: error.message }, 500));
});

export default app