import React from 'react';
import {render, screen} from '@testing-library/react';
import App from '../App';
import {loginRoute} from '../pages/Login';

test('forwards to login page on startup', () => {
    render(<App/>);
    expect(window.location.pathname).toEqual(loginRoute);
    const headerText = screen.getByText(/Welcome to the foosball tracking website!/i);
    const registerText = screen.getByText(/Don't have an account yet?/i);
    expect(headerText).not.toBeNull();
    expect(registerText).not.toBeNull();
});
