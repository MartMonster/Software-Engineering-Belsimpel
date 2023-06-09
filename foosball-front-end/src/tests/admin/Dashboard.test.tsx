import React from 'react';
import {render, screen} from '@testing-library/react';
import App from '../../App';
import server from '../mocks/api';

beforeAll(() => server.listen());
beforeEach(() => {
    window.sessionStorage.setItem('loggedIn', 'true');
    window.sessionStorage.setItem('isAdmin', 'true');
});
afterAll(() => server.close());

test('renders the admin dashboard page', async () => {
    render(<App/>);
    const dashboardText = await screen.findAllByText(/Dashboard/i);
    expect(dashboardText[1]).not.toBeNull();
    const userTopText = screen.queryByText(/on the leaderboard, and you have/i);
    expect(userTopText).toBeNull();
});

test('goes to regular dashboard when admin session storage is false', async () => {
    window.sessionStorage.setItem('isAdmin', 'false');
    render(<App/>);
    const userTopText = screen.queryByText(/on the leaderboard, and you have/i);
    expect(userTopText).not.toBeNull();
});