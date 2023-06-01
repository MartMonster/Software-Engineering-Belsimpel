import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Page404 from '../pages/404';

test('renders 404 page', () => {
    render(
        <MemoryRouter>
            <Page404 />
        </MemoryRouter>
    );
    const text404 = screen.getByText(/404/i);
    expect(text404).not.toBeNull();
});