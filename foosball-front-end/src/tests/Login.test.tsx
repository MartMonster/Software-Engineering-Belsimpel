import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import server from './mocks/api';
import { rest } from 'msw';

beforeAll(() => server.listen())
afterEach(() => {
    window.sessionStorage.removeItem('loggedIn');
    window.sessionStorage.removeItem('isAdmin');
})
afterAll(() => server.close())

test('forwards to admin dashboard when user is admin', async () => {
    server.use(
        rest.get('http://localhost:8000/admin', (req, res, ctx) => {
            return res.once(ctx.json(1))
        }),
    );

    render(<App />);
    login();
    const dashboardText = await screen.findAllByText(/Dashboard/i);
    const userTopText = screen.queryByText(/on the leaderboard, and you have/i);
    expect(dashboardText[1]).not.toBeNull();
    expect(userTopText).toBeNull();
    expect(window.sessionStorage.getItem('loggedIn')).toEqual('true');
    expect(window.sessionStorage.getItem('isAdmin')).toEqual('true');
});

test('forwards to user dashboard when user is not admin', async () => {
    render(<App />);
    login();
    const dashboardText = await screen.findAllByText(/Dashboard/i);
    const userTopText = await screen.findByText(/on the leaderboard, and you have/i);
    expect(dashboardText[1]).not.toBeNull();
    expect(userTopText).not.toBeNull();
    expect(window.sessionStorage.getItem('loggedIn')).toEqual('true');
    expect(window.sessionStorage.getItem('isAdmin')).toEqual('false');
});

test('forgot password link works', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Click here!/i));
    const forgotPasswordText = await screen.findByText(/Forgot password/i);
    expect(forgotPasswordText).not.toBeNull();
    expect(window.location.pathname).toEqual('/forgot-password');
    fireEvent.click(screen.getByText(/Login/i));
});

test('register link works', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Register/i));
    const registerButton = await screen.findByText(/Register/i);
    expect(registerButton).not.toBeNull();
    expect(window.location.pathname).toEqual('/register');
    fireEvent.click(screen.getByText(/Login/i));
});

test('displays error message when login fails', async () => {
    server.use(
        rest.post('http://localhost:8000/login', (req, res, ctx) => {
            return res.once(ctx.status(422), ctx.json({ message: 'These credentials do not match our records.' }));
        })
    );

    render(<App />);
    login();
    const dashboardText = screen.queryByText(/Dashboard/i);
    const userTopText = screen.queryByText(/on the leaderboard, and you have/i);
    const errorText = await screen.findByText(/These credentials do not match our records./i);
    expect(dashboardText).toBeNull();
    expect(userTopText).toBeNull();
    expect(errorText).not.toBeNull();
    expect(window.sessionStorage.getItem('loggedIn')).toEqual('false');
});

test('displays error message when session token has problems', async () => {
    server.use(
        rest.get('http://localhost:8000/sanctum/csrf-cookie', (req, res, ctx) => {
            return res.once(ctx.status(422), ctx.json({ message: 'CSRF token mismatch.' }))
        }),
        rest.post('http://localhost:8000/login', (req, res, ctx) => {
            return res.once(ctx.status(422), ctx.json({ message: 'CSRF token mismatch.' }))
        }),
    );

    render(<App />);
    login();
    const dashboardText = screen.queryByText(/Dashboard/i);
    const userTopText = screen.queryByText(/on the leaderboard, and you have/i);
    const errorText = await screen.findByText(/CSRF token mismatch./i);
    expect(dashboardText).toBeNull();
    expect(userTopText).toBeNull();
    expect(errorText).not.toBeNull();
    expect(window.sessionStorage.getItem('loggedIn')).toEqual('false');
});

test('removes \'loggedIn\' session storage when admin endpoint fails', async () => {
    server.use(
        rest.get('http://localhost:8000/admin', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }))
        })
    );
    
    render(<App />);
    login();
    const dashboardText = screen.queryByText(/Dashboard/i);
    const userTopText = screen.queryByText(/on the leaderboard, and you have/i);
    expect(dashboardText).toBeNull();
    expect(userTopText).toBeNull();
    expect(window.sessionStorage.getItem('loggedIn')).toBeNull();
    expect(window.sessionStorage.getItem('isAdmin')).toBeNull();
});

function login() {
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'test1@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: '123456789' },
    });
    fireEvent.click(screen.getByText(/login/i));
}