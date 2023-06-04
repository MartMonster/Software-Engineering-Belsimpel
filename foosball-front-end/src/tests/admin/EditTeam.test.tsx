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

test('renders the edit teams page', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/Wall of fame 2v2/i));
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click((await screen.findAllByText(/Edit/i))[1]);
    const editTeamText = await screen.findByText(/Edit a team/i);
    expect(editTeamText).not.toBeNull();
});

test('shows error when team name has not changed', async () => {
    render(<App/>);
    const editUserText = await screen.findByText(/Edit a team/i);
    expect(editUserText).not.toBeNull();
    fireEvent.click(screen.getByText(/Edit team/i));
    const errorText = await screen.findByText(/team already has this name./i);
    expect(errorText).not.toBeNull();
});

test('can show error message', async () => {
    server.use(
        rest.put('http://localhost:8000/admin/teams/:id', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const editUserText = await screen.findByText(/Edit a team/i);
    expect(editUserText).not.toBeNull();
    fireEvent.change(screen.getByPlaceholderText(/Team name/i), {target: {value: 'test'}});
    fireEvent.click(screen.getByText(/Edit team/i));
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('can edit a team', async () => {
    render(<App/>);
    const editUserText = await screen.findByText(/Edit a team/i);
    expect(editUserText).not.toBeNull();
    fireEvent.change(screen.getByPlaceholderText(/Team name/i), {target: {value: 'test'}});
    fireEvent.click(screen.getByText(/Edit team/i));
    const wofText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wofText).not.toBeNull();
});