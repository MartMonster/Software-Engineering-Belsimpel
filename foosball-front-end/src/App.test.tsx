import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Hello user text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello/i);
  expect(linkElement).not.toBeNull();
});
