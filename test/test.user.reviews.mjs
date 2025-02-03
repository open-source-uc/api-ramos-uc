import test from "node:test"
import assert from 'node:assert'
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

    await t.test("create first review user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            },
            body: JSON.stringify({
                course_sigle: "ACO4004",
                year: 2020,
                section_number: 2,
                liked: false,
                comment: "test create 1",
                estimated_credits: 10
            })
        })
        assert.equal(res.status, 201)
    })

    await t.test("create SECOND review user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            },
            body: JSON.stringify({
                course_sigle: "IMT2220",
                year: 2020,
                section_number: 2,
                liked: true,
                comment: "test create 1",
                estimated_credits: 10
            })
        })
        assert.equal(res.status, 201)
    })

    await t.test("delete first review user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user/reviews`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            },
            body: JSON.stringify({
                course_sigle: "IMT2220",
            })
        })
        assert.equal(res.status, 200)
    })

    await t.test("delete first review user, but not exists", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user/reviews`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            },
            body: JSON.stringify({
                course_sigle: "IMT2220",
            })
        })
        assert.equal(res.status, 404)
    })

    await t.test("update second review user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user/reviews`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            },
            body: JSON.stringify({
                course_sigle: "ACO4004",
                year: 2025,
                section_number: 1,
                liked: true,
                comment: "test update 1",
                estimated_credits: 99
            })
        })
        assert.equal(res.status, 200)
    })

    await t.test("get edited review user", async () => {
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

    await t.test("get edited review user, but not existed", async () => {
        let res = await fetch(`${TEST_BASE_URL}/reviews/user/cambiado11/IMT2220`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        assert.equal(res.status, 404)
    })


})
