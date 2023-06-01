import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import server, { username } from '../mocks/api';
import { rest } from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'false');
});
afterAll(() => server.close());

test('renders the wall of fame', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Wall of fame 1v1/i));
    const wallOfFameText = await screen.findByText(/Wall of fame/i);
    expect(wallOfFameText).not.toBeNull();
    const player1Text = await screen.findByText(`${username}1`);
    expect(player1Text).not.toBeNull();
});

test('shows error message if there are no users', async () => {
    server.use(
        rest.get('http://localhost:8000/user', (req, res, ctx) => {
            return res.once(ctx.json([]));
        }),
    );
    render(<App />);
    const wallOfFameText = await screen.findByText(/Wall of fame/i);
    expect(wallOfFameText).not.toBeNull();
    const errorText = await screen.findByText(/No players found./i);
    expect(errorText).not.toBeNull();
})

test('shows error when not logged in', async () => {
    server.use(
        rest.get('http://localhost:8000/user', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    const wallOfFameText = await screen.findByText(/Wall of fame/i);
    expect(wallOfFameText).not.toBeNull();
    const errorText = await screen.findByText(/No players found./i);
    expect(errorText).not.toBeNull();
});

test('shows error when fetching fails', async () => {
    server.use(
        rest.get('http://localhost:8000/user', (req, res, ctx) => {
            return res.once(ctx.status(400), ctx.json({ message: 'error' }));
        }),
    );
    render(<App />);
    const wallOfFameText = await screen.findByText(/Wall of fame/i);
    expect(wallOfFameText).not.toBeNull();
    const errorText = await screen.findByText(/No players found./i);
    expect(errorText).not.toBeNull();
});