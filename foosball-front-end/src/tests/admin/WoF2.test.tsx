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

test('renders the WoF 2v2 page', async () => {
    render(<App/>);
    fireEvent.click(screen.getByText(/Wall of fame 2v2/i));
    const wofText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wofText).not.toBeNull();
    const paginate1Button = (await screen.findAllByText('1'))[1];
    expect(paginate1Button).not.toBeNull();
    const paginateDotText = await screen.findByText('...');
    expect(paginateDotText).not.toBeNull();
});

test('shows error message if there are no teams', async () => {
    server.use(
        rest.get('http://localhost:8000/admin/teams', (req, res, ctx) => {
            return res.once(ctx.json({data: [], current_page: 1, last_page: -10}));
        }),
    );
    render(<App/>);
    const wofText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wofText).not.toBeNull();
    const errorText = await screen.findByText(/No teams found./i);
    expect(errorText).not.toBeNull();
});

test('shows error when not logged in', async () => {
    server.use(
        rest.get('http://localhost:8000/admin/teams', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const wofText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wofText).not.toBeNull();
    const errorText = await screen.findByText(/No teams found./i);
    expect(errorText).not.toBeNull();
});

test('can delete a player', async () => {
    render(<App/>);
    const wofText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wofText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);
    fireEvent.click(screen.getAllByText(/Delete/i)[2]);
});

test('delete modal can show error message', async () => {
    server.use(
        rest.delete('http://localhost:8000/admin/teams/:id', (req, res, ctx) => {
            return res.once(ctx.status(401), ctx.json({message: 'Unauthenticated.'}));
        }),
    );
    render(<App/>);
    const wofText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wofText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}2`));
    fireEvent.click(screen.getAllByText(/Delete/i)[1]);
    fireEvent.click(screen.getAllByText(/Delete/i)[2]);
    const errorText = await screen.findByText(/Unauthenticated./i);
    expect(errorText).not.toBeNull();
});

test('can close options modal', async () => {
    render(<App/>);
    const wofText = await screen.findByText(/Wall of fame 2v2/i);
    expect(wofText).not.toBeNull();
    fireEvent.click(await screen.findByText(`${username}1`));
    fireEvent.click(screen.getByText(/Close/i));
});