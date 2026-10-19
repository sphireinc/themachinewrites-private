import { render } from '@testing-library/react';
import { MarkdownBody } from './MarkdownBody';

describe('MarkdownBody',()=>{
  it('renders headings, paragraphs and safe external links',()=>{
    const {container}=render(<MarkdownBody markdown={'# Heading\n\nA [source](https://example.org).'}/>);
    expect(container.querySelector('h1')).toHaveTextContent('Heading');
    expect(container.querySelector('a')).toHaveAttribute('rel','noopener noreferrer');
  });
  it('does not render executable raw HTML or unsafe protocols',()=>{
    const {container}=render(<MarkdownBody markdown={'<script>alert(1)</script>\n\n[Bad](javascript:alert(1))\n\n<img onerror=alert(1)>'}/>);
    expect(container.querySelector('script')).toBeNull(); expect(container.querySelector('img')).toBeNull(); expect(container.innerHTML).not.toContain('javascript:');
  });
});
