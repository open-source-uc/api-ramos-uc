import test from "node:test"
import assert from 'node:assert'
import process from "node:process"

const TEST_BASE_URL = process.env.TEST_BASE_URL

test("test global general routes", { timeout: 60_000 }, async (t) => {
    await t.test("schools", async () => {
        let res = await fetch(`${TEST_BASE_URL}/general/school`)
        assert.equal(res.status, 200)

        let body = await res.json()
        assert.ok(body.schools)
        assert.equal(Array.isArray(body.schools), true)
        body.schools.forEach(element => {
            assert.ok(element.school !== undefined)
        });
    })
    await t.test("category", async () => {
        let res = await fetch(`${TEST_BASE_URL}/general/category`)
        assert.equal(res.status, 200)

        let body = await res.json()
        assert.ok(body.categorys)
        assert.equal(Array.isArray(body.categorys), true)
        body.categorys.forEach(element => {
            assert.ok(element.category !== undefined)
        });
    })
    await t.test("area", async () => {
        let res = await fetch(`${TEST_BASE_URL}/general/area`)
        assert.equal(res.status, 200)

        let body = await res.json()
        assert.ok(body.areas)
        assert.equal(Array.isArray(body.areas), true)
        body.areas.forEach(element => {
            assert.ok(element.area !== undefined)
        });
    })
    await t.test("school", async () => {
        let res = await fetch(`${TEST_BASE_URL}/general/school`)
        assert.equal(res.status, 200)

        let body = await res.json()
        assert.ok(body.schools)
        assert.equal(Array.isArray(body.schools), true)
        body.schools.forEach(element => {
            assert.ok(element.school !== undefined)
        });
    })
})