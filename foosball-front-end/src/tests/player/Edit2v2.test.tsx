import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import server, { teamName, username } from '../mocks/api';
import { rest } from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'false');
});
afterAll(() => server.close());

function editGame() {
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Points/i)[0], { target: { value: '10' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Points/i)[1], { target: { value: '3' } });
    fireEvent.click(screen.getByText(/Save game/i));
}

test('renders the edit game page', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/2v2 games/i));
    fireEvent.click(screen.getByText(/own games/i));
    const player1Text = await screen.findByText(`${teamName}1`);
    expect(player1Text).not.toBeNull();
    fireEvent.click(await screen.findByText(`${teamName}1`));
    fireEvent.click((await screen.findAllByText(/Edit/i))[1]);
    const editGameText = await screen.findByText(/Edit your 2v2 game/i);
    expect(editGameText).not.toBeNull();
});

test('renders the edit game but on red side', async () => {
    window.sessionStorage.setItem('username', `${username}1`);
    render(<App />);
    const editGameText = await screen.findByText(/Edit your 2v2 game/i);
    expect(editGameText).not.toBeNull();
});

test('can edit a game', async () => {
    render(<App />);
    const editGameText = await screen.findByText(/Edit your 2v2 game/i);
    expect(editGameText).not.toBeNull();
    editGame();
    const lastGamesText = await screen.findByText(/Your last 2v2 games/i);
    expect(lastGamesText).not.toBeNull();
});

test('can show error message', async () => {
    server.use(
        rest.put('http://localhost:8000/games2v2/1', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    const lastGamesText = await screen.findByText(/Your last 2v2 games/i);
    expect(lastGamesText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${teamName}1`));
    fireEvent.click((await screen.findAllByText(/Edit/i))[1]);
    const editGameText = await screen.findByText(/Edit your 2v2 game/i);
    expect(editGameText).not.toBeNull();
    editGame();
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('can show error message, but from getUsersFromTeam endpoint', async () => {
    server.use(
        rest.get('http://localhost:8000/teams/users/:teamName', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    const editGameText = await screen.findByText(/Edit your 2v2 game/i);
    expect(editGameText).not.toBeNull();
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});