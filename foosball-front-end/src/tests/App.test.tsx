import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const fakeUserResponse = { token: 'fake_user_token' }
const server = setupServer(
    rest.get('http://localhost:8000/sanctum/csrf-cookie', (req, res, ctx) => {
        return res(ctx.json(fakeUserResponse))
    }),
    rest.post('http://localhost:8000/login', (req, res, ctx) => {
        return res(ctx.json(fakeUserResponse))
    }),
    rest.get('http://localhost:8000/admin', (req, res, ctx) => {
        return res(ctx.json(true))
    }),
)

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
    window.localStorage.removeItem('loggedIn')
    window.localStorage.removeItem('isAdmin')
})
afterAll(() => server.close())

test('forwards to login page on startup', () => {
    render(<App />);
    const headerText = screen.getByText(/Welcome to the foosball tracking website!/i);
    const registerText = screen.getByText(/Don't have an account yet?/i);
    expect(headerText).not.toBeNull();
    expect(registerText).not.toBeNull();
});

test('forwards to admin page when user is admin', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'test1@gmail.com'},
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: '123456789'},
    });
    fireEvent.click(screen.getByText(/login/i));
    const dashboardText = await screen.findAllByText(/Dashboard/i);
    expect(dashboardText[1]).not.toBeNull();
});
