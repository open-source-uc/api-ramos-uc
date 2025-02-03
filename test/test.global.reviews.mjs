import test from "node:test"
import assert from 'node:assert'
import process from "node:process"

const TEST_BASE_URL = process.env.TEST_BASE_URL

test("Test GLOBAL reviews", async (t) => {

    await t.test("get review user at course", async () => {
        let res = await fetch(`${TEST_BASE_URL}/reviews/user/cambiado11/ACO4004`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        assert.equal(res.status, 200)
        const body = await res.json()
        assert.ok(body.review !== undefined)
    })

    await t.test("get edited review user at course, but not existed", async () => {
        let res = await fetch(`${TEST_BASE_URL}/reviews/user/cambiado11/IMT2220`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        assert.equal(res.status, 404)
    })

    await t.test("get all reviews", async () => {
        let res = await fetch(`${TEST_BASE_URL}/reviews`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        assert.equal(res.status, 200)
        const body = await res.json()
        assert.ok(body.reviews)
    })

    await t.test("get all reviews of course", async () => {
        let res = await fetch(`${TEST_BASE_URL}/reviews/course/ACO4004`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        assert.equal(res.status, 200)
        const body = await res.json()
        assert.ok(body.reviews)
    })

    // Para que esto funcione debe agregarse manualmete el permiso de SUDO, puesto que hono al ser fetch no puede tener eventos de on setup
    await t.test("get all reviews of usernick", async () => {
        let res = await fetch(`${TEST_BASE_URL}/reviews/user/cambiado11`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        assert.equal(res.status, 200)
        const body = await res.json()
        assert.ok(body.reviews)
    })


})
