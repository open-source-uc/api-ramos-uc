import test from "node:test"
import assert from "node:assert"
import process from "node:process"

const TEST_BASE_URL = process.env.TEST_BASE_URL

test("Test MANAGER reviews", async (t) => {
    let token
    await t.test("login user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "admin@uc.cl",
                password: "123456789ab",
            })
        })
        assert.equal(res.status, 200)

        const body = await res.json()
        assert.ok(body.nickname !== undefined)
        assert.ok(body.token !== undefined)
        token = body.token
    })

})