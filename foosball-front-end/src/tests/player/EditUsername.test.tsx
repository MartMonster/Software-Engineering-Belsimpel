import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import server, { username } from '../mocks/api';
import { rest } from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'false');
    window.sessionStorage.setItem('username', `${username}1}`);
});
afterAll(() => server.close());

test('renders edit username page', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Edit username/i));
    const editUsernameText = await screen.findByText(/Edit your username/i);
    expect(editUsernameText).not.toBeNull();
});

test('shows error message when username has not changed', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Edit username/i));
    const errorText = await screen.findByText(/You already have this username./i);
    expect(errorText).not.toBeNull();
});

test('shows error when not logged in', async () => {
    server.use(
        rest.put('http://localhost:8000/user/username', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'newUsername' } });
    fireEvent.click(screen.getByText(/Edit username/i));
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
})

test('navigates to dashboard after successful username change', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'newUsername' } });
    fireEvent.click(screen.getByText(/Edit username/i));
    const dashboardText = await screen.findAllByText(/Dashboard/i);
    expect(dashboardText[1]).not.toBeNull();
});