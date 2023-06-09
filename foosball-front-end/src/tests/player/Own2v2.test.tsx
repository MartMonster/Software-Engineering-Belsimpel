import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../../App';
import server, {teamName} from '../mocks/api';
import {rest} from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'false');
});
afterAll(() => server.close());

test('renders own last games', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/2v2 games/i));
    fireEvent.click(screen.getByText(/own games/i));
    const lastGamesText = await screen.findByText(/Your last 2v2 games/i);
    expect(lastGamesText).not.toBeNull();
    const player1Text = await screen.findByText(`${teamName}1`);
    expect(player1Text).not.toBeNull();
});

test('shows error message if there are no games', async () => {
    server.use(
        rest.get('http://localhost:8000/games2v2/self', (req, res, ctx) => {
            return res.once(ctx.json({data: [], current_page: 1, last_page: -10}));
        }),
    );
    render(<App/>);
    const lastGamesText = await screen.findByText(/Your last 2v2 games/i);
    expect(lastGamesText).not.toBeNull();
    const errorText = await screen.findByText(/No games found./i);
    expect(errorText).not.toBeNull();
});

test('shows error when not logged in', async () => {
    server.use(
        rest.get('http://localhost:8000/games2v2/self', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const lastGamesText = await screen.findByText(/Your last 2v2 games/i);
    expect(lastGamesText).not.toBeNull();
    const errorText = await screen.findByText(/No games found./i);
    expect(errorText).not.toBeNull();
});

test('can delete a game', async () => {
    render(<App/>);
    const lastGamesText = await screen.findByText(/Your last 2v2 games/i);
    expect(lastGamesText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${teamName}1`));
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);
    fireEvent.click(screen.getAllByText(/Delete/i)[2]);
});

test('delete modal can show error message', async () => {
    server.use(
        rest.delete('http://localhost:8000/games2v2/1', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const lastGamesText = await screen.findByText(/Your last 2v2 games/i);
    expect(lastGamesText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${teamName}2`));
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);
    fireEvent.click(screen.getAllByText(/Delete/i)[2]);
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('can close options modal', async () => {
    render(<App/>);
    const lastGamesText = await screen.findByText(/Your last 2v2 games/i);
    expect(lastGamesText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${teamName}1`));
    fireEvent.click(screen.getByText(/Close/i));
});