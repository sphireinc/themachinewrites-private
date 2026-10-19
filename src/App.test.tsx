import { fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';

describe('App scaffold', () => {
  it('renders the approved masthead and blank layout', () => {
    render(<App />);
    expect(screen.getByText('themachinewrites.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Publication timeline')).toBeInTheDocument();
    expect(screen.getByLabelText('Filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Publication context')).toBeInTheDocument();
    expect(screen.getByLabelText('Site footer')).toBeInTheDocument();
  });
  it('toggles dark mode without altering the approved light layout', () => {
    const { container } = render(<App />);
    const shell = container.querySelector('.site-shell');
    expect(shell).not.toHaveClass('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Use dark theme' }));
    expect(shell).toHaveClass('dark');
  });
});
