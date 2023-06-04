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

test('renders the edit user page', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/Wall of fame 1v1/i));
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click((await screen.findAllByText(/Edit/i))[1]);
    const editUserText = await screen.findByText(/Edit a player/i);
    expect(editUserText).not.toBeNull();
});

test('shows error when username has not changed', async () => {
    render(<App/>);
    const editUserText = await screen.findByText(/Edit a player/i);
    expect(editUserText).not.toBeNull();
    fireEvent.click(screen.getByText(/Edit player/i));
    const errorText = await screen.findByText(/Player already has this username./i);
    expect(errorText).not.toBeNull();
});

test('can show error message', async () => {
    server.use(
        rest.put('http://localhost:8000/admin/user/:id', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const editUserText = await screen.findByText(/Edit a player/i);
    expect(editUserText).not.toBeNull();
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {target: {value: 'test'}});
    fireEvent.click(screen.getByText(/Edit player/i));
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('can edit a user', async () => {
    render(<App/>);
    const editUserText = await screen.findByText(/Edit a player/i);
    expect(editUserText).not.toBeNull();
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {target: {value: 'test'}});
    fireEvent.click(screen.getByText(/Edit player/i));
    const wofText = await screen.findByText(/Wall of fame 1v1/i);
    expect(wofText).not.toBeNull();
});