import { testClient } from 'hono/testing'
import test from "node:test"
import assert from 'node:assert'

const TEST_BASE_URL = process.env.TEST_BASE_URL

test("test global course", { timeout: 60_000 }, async (t) => {
    await t.test("course", async () => {
        let res = await fetch(`${TEST_BASE_URL}/course`)
        assert.equal(res.status, 200)

        let body = await res.json()
        assert.ok(body.courses)
        assert.equal(Array.isArray(body.courses), true)
    })
    await t.test("ofg", async () => {
        let res = await fetch(`${TEST_BASE_URL}/course`)
        assert.equal(res.status, 200)

        let body = await res.json()
        assert.ok(body.courses)
        assert.equal(Array.isArray(body.courses), true)
    })
    await t.test("school Ing Matemática Y Computacional", async () => {
        let res = await fetch(`${TEST_BASE_URL}/course?school=Ing Matemática Y Computacional`)
        assert.equal(res.status, 200)

        let body = await res.json()
        assert.ok(body.courses)
        assert.equal(Array.isArray(body.courses), true)
    })
})