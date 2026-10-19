import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App scaffold', () => {
  it('renders the approved masthead and blank layout', () => {
    render(<App />);
    expect(screen.getByText('themachinewrites.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Publication workspace')).toBeInTheDocument();
  });
});
