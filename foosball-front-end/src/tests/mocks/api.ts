import { rest } from 'msw'
import { setupServer } from 'msw/node'

const fakeUserResponse = { token: 'fake_user_token' }
export const username = "Username"
export const position = 15
export const elo = 1010
export const teamName = "Team"
const server = setupServer(
    rest.get('http://localhost:8000/sanctum/csrf-cookie', (req, res, ctx) => {
        return res(ctx.json(fakeUserResponse))
    }),
    rest.post('http://localhost:8000/login', (req, res, ctx) => {
        return res(ctx.json('logged in'))
    }),
    rest.get('http://localhost:8000/admin', (req, res, ctx) => {
        return res(ctx.status(200))
    }),
    rest.get('http://localhost:8000/user/summary', (req, res, ctx) => {
        return res(ctx.json({
            username: username,
            position: position,
            elo : elo,
        }))
    }),
    rest.post('http://localhost:8000/register', (req, res, ctx) => {
        return res(ctx.json('registered'))
    }),
    rest.post('http://localhost:8000/forgot-password', (req, res, ctx) => {
        return res(ctx.json('sent email'))
    }),
    rest.post('http://localhost:8000/reset-password', (req, res, ctx) => {
        return res(ctx.json('reset password'))
    }),
    rest.post('http://localhost:8000/logout', (req, res, ctx) => {
        return res(ctx.json('logged out'))
    }),
    rest.get('http://localhost:8000/user', (req, res, ctx) => {
        let users = []
        for (let i = 0; i < 10; i++) {
            users.push({
                id: i+1,
                username: `${username}${(i+1).toString()}`,
                elo: `${elo+i}`
            })
        }
        return res(ctx.json(users))
    }),
    rest.get('http://localhost:8000/teams', (req, res, ctx) => {
        let teams = []
        for (let i = 0; i < 10; i++) {
            teams.push({
                id: i+1,
                team_name: `${teamName}${(i+1).toString()}`,
                player1_username: `${username}${(i*2+1).toString()}`,
                player2_username: `${username}${(i+2).toString()}`,
                elo: `${elo+i}`
            })
        }
        return res(ctx.json(teams))
    }),
    rest.post('http://localhost:8000/games1v1', (req, res, ctx) => {
        return res(ctx.json('game created'))
    }),
    rest.post('http://localhost:8000/games2v2', (req, res, ctx) => {
        return res(ctx.json('game created'))
    }),
    rest.get('http://localhost:8000/games1v1', (req, res, ctx) => {
        let page = req.url.searchParams.get('page')
        console.log(page)
        let games = []
        for (let i = 0; i < 10; i++) {
            games.push({
                id: i+1,
                player1_username: `${username}${(i*2+1).toString()}`,
                player2_username: `${username}${(i*2+2).toString()}`,
                player1_score: i,
                player2_score: i+1
            })
        }
        return res(ctx.json({data: games, current_page: page, last_page: 10}))
    }),
    rest.get('http://localhost:8000/games1v1/self', (req, res, ctx) => {
        let page = req.url.searchParams.get('page')
        console.log(page)
        let games = []
        for (let i = 0; i < 10; i++) {
            games.push({
                id: i + 1,
                player1_username: `${username}${(i * 2 + 1).toString()}`,
                player2_username: `${username}${(i * 2 + 2).toString()}`,
                player1_score: i,
                player2_score: i + 1
            })
        }
        return res(ctx.json({ data: games, current_page: 9, last_page: 10 }))
    }),
    rest.delete('http://localhost:8000/games1v1/:id', (req, res, ctx) => {
        return res(ctx.json('game deleted'))
    }),
    rest.put('http://localhost:8000/games1v1/:id', (req, res, ctx) => {
        return res(ctx.json('game updated'))
    }),
    rest.get('http://localhost:8000/games2v2', (req, res, ctx) => {
        let page = req.url.searchParams.get('page')
        console.log(page)
        let games = []
        for (let i = 0; i < 10; i++) {
            games.push({
                id: i + 1,
                team1_name: `${teamName}${(i * 2 + 1).toString()}`,
                team2_name: `${teamName}${(i * 2 + 2).toString()}`,
                team1_score: i,
                team2_score: i + 1
            })
        }
        return res(ctx.json({ data: games, current_page: page, last_page: 10 }))
    }),
    rest.get('http://localhost:8000/games2v2/self', (req, res, ctx) => {
        let page = req.url.searchParams.get('page')
        console.log(page)
        let games = []
        for (let i = 0; i < 10; i++) {
            games.push({
                id: i + 1,
                team1_name: `${teamName}${(i * 2 + 1).toString()}`,
                team2_name: `${teamName}${(i * 2 + 2).toString()}`,
                team1_score: i,
                team2_score: i + 1
            })
        }
        return res(ctx.json({ data: games, current_page: page, last_page: 10 }))
    }),
    rest.delete('http://localhost:8000/games2v2/:id', (req, res, ctx) => {
        return res(ctx.json('game deleted'))
    }),
    rest.put('http://localhost:8000/games2v2/:id', (req, res, ctx) => {
        return res(ctx.json('game updated'))
    }),
    rest.get('http://localhost:8000/teams/users/:teamName', (req, res, ctx) => {
        return res(ctx.json([`${username}1`, `${username}2`]))
    }),
    rest.post('http://localhost:8000/teams', (req, res, ctx) => {
        return res(ctx.json('team created'))
    }),
    rest.get('http://localhost:8000/teams/self', (req, res, ctx) => {
        let page = req.url.searchParams.get('page')
        console.log(page)
        let games = []
        for (let i = 0; i < 10; i++) {
            games.push({
                team_name: `${teamName}${(i + 1).toString()}`,
                id: i + 1,
                player1_username: `${username}${(i * 2 + 1).toString()}`,
                player2_username: `${username}${(i * 2 + 2).toString()}`,
                elo: elo + i
            })
        }
        return res(ctx.json({ data: games, current_page: page, last_page: 10 }))
    }),
    rest.delete('http://localhost:8000/teams/:id', (req, res, ctx) => {
        return res(ctx.json('team deleted'))
    }),
    rest.put('http://localhost:8000/teams/:id', (req, res, ctx) => {
        return res(ctx.json('team updated'))
    }),
    rest.put('http://localhost:8000/user/username', (req, res, ctx) => {
        return res(ctx.json('username updated'))
    }),
    rest.get('http://localhost:8000/admin/user', (req, res, ctx) => {
        let page = req.url.searchParams.get('page')
        let users = []
        for (let i = 0; i < 10; i++) {
            users.push({
                id: i+1,
                username: `${username}${(i+1).toString()}`,
                elo: `${elo+i}`
            })
        }
        return res(ctx.json({ data: users, current_page: page, last_page: 10 }))
    }),
    rest.delete('http://localhost:8000/admin/user/:id', (req, res, ctx) => {
        return res(ctx.json('user deleted'))
    }),
    rest.put('http://localhost:8000/admin/user/:id', (req, res, ctx) => {
        return res(ctx.json('user updated'))
    }),
    rest.get('http://localhost:8000/admin/teams', (req, res, ctx) => {
        let page = req.url.searchParams.get('page')
        let teams = []
        for (let i = 0; i < 10; i++) {
            teams.push({
                id: i+1,
                team_name: `${teamName}${(i+1).toString()}`,
                player1_username: `${username}${(i*2+1).toString()}`,
                player2_username: `${username}${(i+2).toString()}`,
                elo: `${elo+i}`
            })
        }
        return res(ctx.json({ data: teams, current_page: page, last_page: 10 }))
    }),
    rest.delete('http://localhost:8000/admin/teams/:id', (req, res, ctx) => {
            return res(ctx.json('team deleted'))
    }),
    rest.put('http://localhost:8000/admin/teams/:id', (req, res, ctx) => {
            return res(ctx.json('team updated'))
    }),
    rest.post('http://localhost:8000/admin/teams', (req, res, ctx) => {
            return res(ctx.json('team created'))
    }),
)

export default server