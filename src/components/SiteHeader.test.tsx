import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('renders exact masthead and accessible navigation without tagline', () => {
    const toggle = vi.fn();
    render(<SiteHeader dark={false} onToggleDark={toggle} />);
    expect(screen.getByText('themachinewrites.com')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toHaveTextContent('HomeArchiveAbout');
    expect(screen.queryByText(/thoughts from/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Use dark theme' }));
    expect(toggle).toHaveBeenCalledOnce();
  });
});
