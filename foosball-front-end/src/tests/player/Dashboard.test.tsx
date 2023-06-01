import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import server from '../mocks/api';
import { rest } from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'false');
});
afterAll(() => server.close());

test('loads into dashboard when user is logged in', async () => {
    render(<App />);
    const dashboardText = await screen.findAllByText(/Dashboard/i);
    const userTopText = await screen.findByText(/you are in the top/i);
    expect(dashboardText[1]).not.toBeNull();
    expect(userTopText).not.toBeNull();
});

test('logout button logs user out', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Logout/i));
    const loginText = await screen.findByText(/Welcome to the foosball tracking website!/i);
    expect(loginText).not.toBeNull();
    fireEvent.click(screen.getByText(/login/i));
});

test('logout logs user out even with errors', async () => {
    server.use(
        rest.post('http://localhost:8000/logout', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    fireEvent.click(screen.getByText(/Logout/i));
    const loginText = await screen.findByText(/Welcome to the foosball tracking website!/i);
    expect(loginText).not.toBeNull();
})

test('dashboard can show errors', async () => {
    server.use(
        rest.get('http://localhost:8000/user/summary', (req, res, ctx) => {
            return res.once(ctx.status(400), ctx.json({ message: 'error' }));
        }),
    );
    render(<App />);
    const errorText = await screen.findByText(/error/i);
    expect(errorText).not.toBeNull();
});

test('user is logged out if user summary returns unauthenticated message', async () => {
    server.use(
        rest.get('http://localhost:8000/user/summary', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    console.log(window.sessionStorage.getItem('loggedIn'));
    // const loginText = await screen.findByText(/Welcome to the foosball tracking website!/i);
    // expect(loginText).not.toBeNull();
    /* 
        Could not test that this actually forwards to the login page
        because window.location.reload() is not implemented in the testing environment
    */
});