import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../../App';
import server, {teamName, username} from '../mocks/api';
import {rest} from 'msw';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'true');
});
afterAll(() => server.close());

function createTeam() {
    fireEvent.change(screen.getByPlaceholderText(/Team name/i), {target: {value: `${teamName}1`}});
    fireEvent.change(screen.getAllByPlaceholderText(/Username/i)[0], {target: {value: `${username}1`}});
    fireEvent.change(screen.getAllByPlaceholderText(/Username/i)[1], {target: {value: `${username}2`}});
    fireEvent.click(screen.getByText(/Create team/i));
}

test('renders create team page', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/Create team/i));
    const createTeamText = await screen.findByText(/Make a new foosball team/i);
    expect(createTeamText).not.toBeNull();
});

test('can show error message when creating team', async () => {
    server.use(
        rest.post('http://localhost:8000/admin/teams', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const createTeamText = await screen.findByText(/Make a new foosball team/i);
    expect(createTeamText).not.toBeNull();
    createTeam();
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('navigates to dashboard after creating team', async () => {
    render(<App/>);
    const createTeamText = await screen.findByText(/Make a new foosball team/i);
    expect(createTeamText).not.toBeNull();
    createTeam();
    const ownTeamsText = (await screen.findAllByText(/Dashboard/i))[1];
    expect(ownTeamsText).not.toBeNull();
});