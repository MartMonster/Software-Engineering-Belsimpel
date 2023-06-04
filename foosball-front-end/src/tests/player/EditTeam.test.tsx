import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../../App';
import server, {teamName, username} from '../mocks/api';
import {rest} from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'false');
});
afterAll(() => server.close());

function editGame() {
    fireEvent.change(screen.getByPlaceholderText(/Team name/i), {target: {value: `${teamName}2`}});
    fireEvent.click(screen.getByText(/Save team/i));
}

test('renders the edit team page', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/Own teams/i));
    const createTeamText = await screen.findByText(/Your teams/i);
    expect(createTeamText).not.toBeNull();
    const player1Text = await screen.findByText(`${username}1`);
    expect(player1Text).not.toBeNull();
    fireEvent.click(await screen.findByText(`${teamName}1`));
    fireEvent.click((await screen.findAllByText(/Edit/i))[1]);
    const editGameText = await screen.findByText(/Edit your team/i);
    expect(editGameText).not.toBeNull();
});

test('can show error message', async () => {
    server.use(
        rest.put('http://localhost:8000/teams/1', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const editGameText = await screen.findByText(/Edit your team/i);
    expect(editGameText).not.toBeNull();
    editGame();
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('can edit a team', async () => {
    render(<App/>);
    const editGameText = await screen.findByText(/Edit your team/i);
    expect(editGameText).not.toBeNull();
    editGame();
    const createTeamText = await screen.findByText(/Your teams/i);
    expect(createTeamText).not.toBeNull();
});