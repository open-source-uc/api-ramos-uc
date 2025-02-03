import test from "node:test"
import assert from "node:assert"
import process from "node:process"

const TEST_BASE_URL = process.env.TEST_BASE_URL

test("Test USER reviews", async (t) => {
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

    await t.test("reviews get from all", async () => {
        let res = await fetch(`${TEST_BASE_URL}/admin/reviews`)
        assert.equal(res.status, 200)
    })

    await t.test("reviews get from all", async () => {
        let res = await fetch(`${TEST_BASE_URL}/admin/reviews`)
        assert.equal(res.status, 200)
    })

    await t.test("reviews get from sigle", async () => {
        let res = await fetch(`${TEST_BASE_URL}/admin/reviews/course/IMT2220`)
        assert.equal(res.status, 200)
    })

    await t.test("reviews get from sigle", async () => {
        let res = await fetch(`${TEST_BASE_URL}/admin/reviews/user/cambiado11`)
        assert.equal(res.status, 200)
    })
})