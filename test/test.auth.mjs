import test from "node:test"
import assert from 'node:assert'
import process from "node:process"
const TEST_BASE_URL = process.env.TEST_BASE_URL

test("test create user", { timeout: 60_000 }, async (t) => {
    await t.test("create user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "test11@uc.cl",
                password: "123456789Aa",
                nickname: "test11",
                admission_year: 2023,
                carrer_name: "Licenciatura en Ingeniería en Ciencia De Datos"
            })
        })
        const body = await res.json()
        assert.equal(res.status, 201)

        assert.ok(body.nickname !== undefined)
        assert.ok(body.token !== undefined)
    })

    await t.test("login user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "test11@uc.cl",
                password: "123456789Aa",
            })
        })
        assert.equal(res.status, 200)

        const body = await res.json()
        assert.ok(body.nickname !== undefined)
        assert.ok(body.token !== undefined)
    })

})