import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import server, { username } from '../mocks/api';
import { rest } from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'true');
});
afterAll(() => server.close());

function editGame() {
    fireEvent.click(screen.getByText(/Swap/i));
    fireEvent.change(screen.getAllByPlaceholderText(/Points/i)[0], { target: { value: '10' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Points/i)[1], { target: { value: '3' } });
    fireEvent.click(screen.getByText(/Save game/i));
}

test('renders the edit game page', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/1v1 games/i));
    const player1Text = await screen.findByText(`${username}1`);
    expect(player1Text).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click((await screen.findAllByText(/Edit/i))[1]);
    const editGameText = await screen.findByText(/Edit a 1v1 game/i);
    expect(editGameText).not.toBeNull();
});

test('can edit a game', async () => {
    render(<App />);
    const editGameText = await screen.findByText(/Edit a 1v1 game/i);
    expect(editGameText).not.toBeNull();
    editGame();
    const lastGamesText = await screen.findByText(/Last 1v1 games/i);
    expect(lastGamesText).not.toBeNull();
});

test('can show error message', async () => {
    server.use(
        rest.put('http://localhost:8000/admin/games1v1/:id', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({ message: 'Unauthenticated.' }));
        }),
    );
    render(<App />);
    const lastGamesText = await screen.findByText(/Last 1v1 games/i);
    expect(lastGamesText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click((await screen.findAllByText(/Edit/i))[1]);
    const editGameText = await screen.findByText(/Edit a 1v1 game/i);
    expect(editGameText).not.toBeNull();
    editGame();
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});