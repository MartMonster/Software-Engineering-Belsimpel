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

test('renders own teams page', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Own teams/i));
    const createTeamText = await screen.findByText(/Your teams/i);
    expect(createTeamText).not.toBeNull();
    const player1Text = await screen.findByText(`${username}1`);
    expect(player1Text).not.toBeNull();
});

test('shows error message if there are no teams', async () => {
    server.use(
        rest.get('http://localhost:8000/teams/self', (req, res, ctx) => {
            return res.once(ctx.json({ data: [], current_page: 1, last_page: -10 }));
        }),
    );
    render(<App />);
    const yourTeamsText = await screen.findByText(/Your teams/i);
    expect(yourTeamsText).not.toBeNull();
    const errorText = await screen.findByText(/No teams found./i);
    expect(errorText).not.toBeNull();
});

test('shows error when not logged in', async () => {
    server.use(
        rest.get('http://localhost:8000/teams/self', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    const yourTeamsText = await screen.findByText(/Your teams/i);
    expect(yourTeamsText).not.toBeNull();
    const errorText = await screen.findByText(/No teams found./i);
    expect(errorText).not.toBeNull();
});

test('can delete a team', async () => {
    render(<App />);
    const yourTeamsText = await screen.findByText(/Your teams/i);
    expect(yourTeamsText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);
    fireEvent.click(screen.getAllByText(/Delete/i)[2]);
    
});

test('delete modal can show error message', async () => {
    server.use(
        rest.delete('http://localhost:8000/teams/1', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    const yourTeamsText = await screen.findByText(/Your teams/i);
    expect(yourTeamsText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}2`));
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);
    fireEvent.click(screen.getAllByText(/Delete/i)[2]);
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('can close options modal', async () => {
    render(<App />);
    const yourTeamsText = await screen.findByText(/Your teams/i);
    expect(yourTeamsText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click(screen.getByText(/Close/i));
});