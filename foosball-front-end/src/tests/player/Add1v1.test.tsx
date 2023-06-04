import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../../App';
import server from '../mocks/api';
import {rest} from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'false');
});
afterAll(() => server.close());

function addGame() {
    fireEvent.change(screen.getByRole('combobox'), {target: {value: '2'}});
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {target: {value: 'test'}});
    fireEvent.change(screen.getAllByPlaceholderText(/Points/i)[0], {target: {value: '10'}});
    fireEvent.change(screen.getAllByPlaceholderText(/Points/i)[1], {target: {value: '3'}});
    fireEvent.click(screen.getByText(/Enter game/i));
}

test('renders the add 1v1 game page', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/Add 1v1 game/i));
    const addGameText = await screen.findByText(/Make a new 1v1 game/i);
    expect(addGameText).not.toBeNull();
});

test('can enter game', async () => {
    render(<App/>);
    const addGameText = await screen.findByText(/Make a new 1v1 game/i);
    expect(addGameText).not.toBeNull();
    addGame();
})

test('can show error message', async () => {
    server.use(
        rest.post('http://localhost:8000/games1v1', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const dashboardButton = await screen.findByText(/Dashboard/i)
    expect(dashboardButton).not.toBeNull();
    fireEvent.click(dashboardButton);
    fireEvent.click(await screen.findByText(/Add 1v1 game/i));
    const addGameText = await screen.findByText(/Make a new 1v1 game/i);
    expect(addGameText).not.toBeNull();
    addGame();
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});