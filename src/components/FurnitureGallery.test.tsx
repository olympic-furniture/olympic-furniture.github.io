import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FurnitureGallery } from './FurnitureGallery';
import type { Product } from '../content';

const items: Product[] = [
  {
    id: 'one',
    title: 'ארון לבן',
    category: 'wardrobes',
    image: '/images/white-wardrobe.webp',
    description: 'דוגמת ארון',
    published: true,
    order: 1,
  },
  {
    id: 'two',
    title: 'ספה אפורה',
    category: 'sofas',
    image: '/images/showroom-sofa.webp',
    description: 'דוגמת ספה',
    published: true,
    order: 2,
  },
  {
    id: 'draft',
    title: 'טיוטה פרטית',
    category: 'wardrobes',
    image: '/images/white-wardrobe.webp',
    description: '',
    published: false,
    order: 3,
  },
];

describe('furniture browsing', () => {
  it('filters published photographs and resets the visible selection on category changes', async () => {
    const user = userEvent.setup();
    render(<FurnitureGallery items={items} />);
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ארון לבן' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('טיוטה פרטית')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'הגדלת תמונה: ספה אפורה' }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'סלונים' }));
    expect(
      screen.queryByRole('button', { name: 'הגדלת תמונה: ארון לבן' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ספה אפורה' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ארונות' }));
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ארון לבן' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('offers a real phone link for an empty category without invented photographs', async () => {
    const user = userEvent.setup();
    render(<FurnitureGallery items={items} />);
    await user.click(screen.getByRole('button', { name: 'מזרנים' }));
    expect(
      screen.queryByRole('button', { name: /הגדלת תמונה/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /דברו איתנו/ })).toHaveAttribute(
      'href',
      'tel:098618985',
    );
  });
  it('names the dialog, locks scrolling, closes on Escape and restores trigger focus', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'auto';
    render(<FurnitureGallery items={items} />);
    const trigger = screen.getByRole('button', {
      name: 'הגדלת תמונה: ארון לבן',
    });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'ארון לבן' });
    expect(
      within(dialog).getByRole('img', { name: 'ארון לבן' }),
    ).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('auto');
    document.body.style.overflow = '';
  });
  it('keeps content clicks open and dismisses the dialog on an outside click', async () => {
    const user = userEvent.setup();
    render(<FurnitureGallery items={items} />);
    await user.click(
      screen.getByRole('button', { name: 'הגדלת תמונה: ארון לבן' }),
    );
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('img'));
    expect(dialog).toBeInTheDocument();
    fireEvent.click(dialog, { clientX: -1, clientY: -1 });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
