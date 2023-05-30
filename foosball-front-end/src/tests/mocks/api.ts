import { rest } from 'msw'
import { setupServer } from 'msw/node'

const fakeUserResponse = { token: 'fake_user_token' }
export const username = "Username"
export const position = 15
export const elo = 1010
const server = setupServer(
    rest.get('http://localhost:8000/sanctum/csrf-cookie', (req, res, ctx) => {
        return res(ctx.json(fakeUserResponse))
    }),
    rest.post('http://localhost:8000/login', (req, res, ctx) => {
        return res(ctx.json(fakeUserResponse))
    }),
    rest.get('http://localhost:8000/admin', (req, res, ctx) => {
        return res(ctx.json(1))
    }),
    rest.get('http://localhost:8000/user/summary', (req, res, ctx) => {
        return res(ctx.json({
            username: username,
            position: position,
            elo : elo,
        }))
    })
)

export default server