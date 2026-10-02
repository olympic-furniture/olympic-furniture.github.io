import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WoodHeadline } from './WoodHeadline';

describe('editable wooden headline', () => {
  it('preserves the complete accessible headline and decorates the approved initials', () => {
    const title = 'ריהוט לבית, בדיוק כמו שרציתם.';
    const { container, rerender } = render(<WoodHeadline title={title} />);
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(container.querySelectorAll('.wood-letter')).toHaveLength(2);
    rerender(<WoodHeadline title="מבחר חדש לחדר שלכם" />);
    expect(screen.getByRole('heading', { name: 'מבחר חדש לחדר שלכם' })).toBeInTheDocument();
    expect(container.querySelectorAll('.wood-letter')).toHaveLength(0);
    expect(container.textContent).toBe('מבחר חדש לחדר שלכם');
  });
});
