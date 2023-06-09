import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../App';
import server from './mocks/api';
import {rest} from 'msw';

beforeAll(() => server.listen());
afterEach(() => {
    window.sessionStorage.removeItem('loggedIn');
    window.sessionStorage.removeItem('isAdmin');
});
afterAll(() => server.close());

function register() {
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: {value: 'email@belsimpel.nl'},
    });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
        target: {value: 'username'},
    });
    fireEvent.change(screen.getByPlaceholderText(/First name/i), {
        target: {value: 'firstName'},
    });
    fireEvent.change(screen.getByPlaceholderText(/Last name/i), {
        target: {value: 'lastName'},
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], {
        target: {value: 'password'},
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[1], {
        target: {value: 'password'},
    });
    fireEvent.click(screen.getByText(/Register/i));
}

test('can navigate to register page', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/Register/i));
    const registerButton = await screen.findByText(/Register/i);
    expect(registerButton).not.toBeNull();
    expect(window.location.pathname).toEqual('/register');
});

test('forwards to dashboard after registering', async () => {
    render(<App/>);
    expect(window.location.pathname).toEqual('/register');
    register();
    const dashboardText = await screen.findAllByText(/Dashboard/i);
    const userTopText = await screen.findByText(/on the leaderboard, and you have/i);
    expect(dashboardText[1]).not.toBeNull();
    expect(userTopText).not.toBeNull();
    expect(window.sessionStorage.getItem('loggedIn')).toEqual('true');
    fireEvent.click(screen.getByText(/Logout/i));
});

test('displays error message when registering fails', async () => {
    server.use(
        rest.post('http://localhost:8000/register', (req, res, ctx) => {
            return res.once(ctx.status(400), ctx.json({message: 'error'}));
        }),
    )

    render(<App/>);
    fireEvent.click(screen.getByText(/Register/i));
    expect(window.location.pathname).toEqual('/register');
    register();
    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).not.toBeNull();
    expect(window.sessionStorage.getItem('loggedIn')).toEqual('false');
});

test('forwards to dashboard when logged in', () => {
    window.sessionStorage.setItem('loggedIn', 'true');
    render(<App/>);
    const dashboardText = screen.getAllByText(/Dashboard/i);
    expect(dashboardText[1]).not.toBeNull();
});