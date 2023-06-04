import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../../App';
import server, {username} from '../mocks/api';
import {rest} from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'true');
});
afterAll(() => server.close());

test('renders the last games', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/1v1 games/i));
    const lastGamesText = await screen.findByText(/Last 1v1 games/i);
    expect(lastGamesText).not.toBeNull();
    const player1Text = await screen.findByText(`${username}1`);
    expect(player1Text).not.toBeNull();
});

test('shows error message if there are no games', async () => {
    server.use(
        rest.get('http://localhost:8000/games1v1', (req, res, ctx) => {
            return res.once(ctx.json({data: [], current_page: 1, last_page: -10}));
        }),
    );
    render(<App/>);
    const lastGamesText = await screen.findByText(/Last 1v1 games/i);
    expect(lastGamesText).not.toBeNull();
    const errorText = await screen.findByText(/No games found./i);
    expect(errorText).not.toBeNull();
});

test('shows error when not logged in', async () => {
    server.use(
        rest.get('http://localhost:8000/games1v1', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const lastGamesText = await screen.findByText(/Last 1v1 games/i);
    expect(lastGamesText).not.toBeNull();
    const errorText = await screen.findByText(/No games found./i);
    expect(errorText).not.toBeNull();
});

test('can delete a game', async () => {
    render(<App/>);
    const lastGamesText = await screen.findByText(/Last 1v1 games/i);
    expect(lastGamesText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);
    fireEvent.click(screen.getAllByText(/Delete/i)[2]);
});

test('delete modal can show error message', async () => {
    server.use(
        rest.delete('http://localhost:8000/admin/games1v1/:id', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const lastGamesText = await screen.findByText(/Last 1v1 games/i);
    expect(lastGamesText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}2`));
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);
    fireEvent.click(screen.getAllByText(/Delete/i)[2]);
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('can close options modal', async () => {
    render(<App/>);
    const lastGamesText = await screen.findByText(/Last 1v1 games/i);
    expect(lastGamesText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click(screen.getByText(/Close/i));
});