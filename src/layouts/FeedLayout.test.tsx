import { render, screen } from '@testing-library/react';
import { FeedLayout } from './FeedLayout';

describe('FeedLayout', () => {
  it('exposes three labelled visual regions', () => {
    render(<FeedLayout left="left" center="center" right="right" />);
    expect(screen.getByLabelText('Filters')).toHaveTextContent('left');
    expect(screen.getByLabelText('Publications')).toHaveTextContent('center');
    expect(screen.getByLabelText('Publication context')).toHaveTextContent('right');
  });
});
