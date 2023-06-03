import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import server, { teamName } from '../mocks/api';
import { rest } from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'false');
});
afterAll(() => server.close());

test('renders the wall of fame', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Wall of fame 2v2/i));
    const wallOfFameText = await screen.findByText(/Wall of fame/i);
    expect(wallOfFameText).not.toBeNull();
    const team1Text = await screen.findByText(`${teamName}1`);
    expect(team1Text).not.toBeNull();
});

test('shows error message if there are no teams', async () => {
    server.use(
        rest.get('http://localhost:8000/teams', (req, res, ctx) => {
            return res.once(ctx.json([]));
        }),
    );
    render(<App />);
    const wallOfFameText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wallOfFameText).not.toBeNull();
    const errorText = await screen.findByText(/No teams found./i);
    expect(errorText).not.toBeNull();
});

test('shows error when not logged in', async () => {
    server.use(
        rest.get('http://localhost:8000/teams', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    const wallOfFameText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wallOfFameText).not.toBeNull();
    const errorText = await screen.findByText(/No teams found./i);
    expect(errorText).not.toBeNull();
});