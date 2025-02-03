import test from "node:test"
import assert from 'node:assert'
import process from "node:process"

const TEST_BASE_URL = process.env.TEST_BASE_URL
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test("Test obtener, editar, y cambiar contraseña de usuario", async (t) => {
    let token
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
        token = body.token
    })
    await t.test("update user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            },
            body: JSON.stringify({
                current_nickname: "test11",
                nickname: "cambiado11",
                admission_year: 2025,
                career_name: "Licenciatura en Interpretación Musical"
            })
        })
        assert.equal(res.status, 200)
    })

    await t.test("get user", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            }
        })
        let body = await res.json()
        assert.equal(res.status, 200)
        assert.deepEqual(body, {
            user: {
                nickname: "cambiado11",
                admission_year: 2025,
                career_name: "Licenciatura en Interpretación Musical"
            }
        })
    })
    await delay(1500)
    await t.test("change password", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            },
            body: JSON.stringify({
                currentPassword: "123456789Aa",
                newPassword: "123456789Ab",
            })
        })
        assert.equal(res.status, 200)
    })

    await t.test("login user / with old password", async () => {
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

        assert.equal(res.status, 401)
    })
    let new_token
    await t.test("login user / with new password", async () => {
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
        new_token = body.token
    })

    await t.test("get user with old token version", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": token
            }
        })
        assert.equal(res.status, 403)
    })

    await t.test("get user with new token version", async () => {
        let res = await fetch(`${TEST_BASE_URL}/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "osuctoken": new_token
            }
        })
        let body = await res.json()
        assert.equal(res.status, 200)
        assert.deepEqual(body, {
            user: {
                nickname: "cambiado11",
                admission_year: 2025,
                career_name: "Licenciatura en Interpretación Musical"
            }
        })
    })
})
