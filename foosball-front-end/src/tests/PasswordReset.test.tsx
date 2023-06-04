import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import server from './mocks/api';
import {rest} from 'msw';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import PasswordReset from '../pages/PasswordReset';
import {Login} from '../pages/Login';

beforeAll(() => server.listen());
afterEach(() => {
        window.sessionStorage.removeItem('loggedIn');
        window.sessionStorage.removeItem('isAdmin');
    }
);
afterAll(() => server.close());

function resetPassword() {
    fireEvent.change(screen.getByPlaceholderText(/New password/i), {
        target: {value: 'password'},
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), {
        target: {value: 'password'},
    });
    fireEvent.click(screen.getAllByText(/Reset/i)[1]);
}

function renderPasswordResetPage() {
    render(
        <MemoryRouter initialEntries={['/password-reset/hash?email=email@belsimpel.nl']}>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/password-reset/:hash" element={<PasswordReset/>}/>
            </Routes>
        </MemoryRouter>
    );
}

test('password reset page exists', async () => {
    renderPasswordResetPage();
    const headerText = (await screen.findAllByText(/Reset password/i))[0];
    const resetButton = (await screen.findAllByText(/Reset/i))[1];
    expect(headerText).not.toBeNull();
    expect(resetButton).not.toBeNull();
});

test('forwards to login page after resetting password', async () => {
    renderPasswordResetPage();
    resetPassword();
    const headerText = await screen.findByText(/Welcome to the foosball tracking website!/i);
    const registerText = await screen.findByText(/Don't have an account yet?/i);
    expect(headerText).not.toBeNull();
    expect(registerText).not.toBeNull();
});

test('displays error message when resetting password fails', async () => {
    server.use(
        rest.post('http://localhost:8000/reset-password', (req, res, ctx) => {
            return res.once(ctx.status(400), ctx.json({message: 'error'}));
        }),
    );

    renderPasswordResetPage();
    resetPassword();
    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).not.toBeNull();
});

test('navigates to dashboard if logged in', async () => {
    window.sessionStorage.setItem('loggedIn', 'true');
    renderPasswordResetPage();
    const headerText = await screen.findByText(/Welcome to the foosball tracking website!/i);
    const registerText = await screen.findByText(/Don't have an account yet?/i);
    expect(headerText).not.toBeNull();
    expect(registerText).not.toBeNull();
});