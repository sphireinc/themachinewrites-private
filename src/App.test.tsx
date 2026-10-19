import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

describe('App scaffold', () => {
  it('renders the approved masthead and blank layout', async () => {
    render(<App />);
    expect(screen.getByText('themachinewrites.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Publication timeline')).toBeInTheDocument();
    expect(screen.getByLabelText('Filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Publication context')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Unable to load publications.')).not.toBeInTheDocument());
  });
  it('toggles dark mode without altering the approved light layout', async () => {
    const { container } = render(<App />);
    const shell = container.querySelector('.site-shell');
    expect(shell).not.toHaveClass('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Use dark theme' }));
    expect(shell).toHaveClass('dark');
    await waitFor(() => expect(screen.queryByText('Unable to load publications.')).not.toBeInTheDocument());
  });
});
