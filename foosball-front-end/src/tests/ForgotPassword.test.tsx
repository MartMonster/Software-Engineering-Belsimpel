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

function resetPassword() {
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: {value: 'email@belsimpel.nl'},
    });
    fireEvent.click(screen.getByText(/Send/i));
}

test('can navigate to forgot password page', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/Click here/i));
    const headerText = await screen.findByText(/Forgot password/i);
    const resetButton = await screen.findByText(/Send/i);
    expect(headerText).not.toBeNull();
    expect(resetButton).not.toBeNull();
    expect(window.location.pathname).toEqual('/forgot-password');
});

test('forwards to login page after resetting password', async () => {
    render(<App/>);
    resetPassword();
    const headerText = await screen.findByText(/Welcome to the foosball tracking website!/i);
    const registerText = await screen.findByText(/Don't have an account yet?/i);
    expect(headerText).not.toBeNull();
    expect(registerText).not.toBeNull();
    expect(window.location.pathname).toEqual('/login');
    fireEvent.click(screen.getByText(/Click here/i));

});

test('displays error message when resetting password fails', async () => {
    server.use(
        rest.post('http://localhost:8000/forgot-password', (req, res, ctx) => {
            return res.once(ctx.status(400), ctx.json({message: 'error'}));
        }),
    );

    render(<App/>);
    resetPassword();
    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).not.toBeNull();
});