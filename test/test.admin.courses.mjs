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
                email: "test11@uc.cl",
                password: "123456789Ab",
            })
        })
        assert.equal(res.status, 200)

        const body = await res.json()
        assert.ok(body.nickname !== undefined)
        assert.ok(body.token !== undefined)
        token = body.token
    })

    await t.test("create course", async () => {
        let res = await fetch(`${TEST_BASE_URL}/admin/course`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            },
            body: JSON.stringify({
                sigle: "419",
                name: "curso test",
                credits: 10,
                school: "",
                area: "",
                category: ""
            })
        })
        assert.equal(res.status, 201)
    })
})