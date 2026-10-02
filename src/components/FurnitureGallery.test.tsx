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

const wardrobes: Product[] = Array.from({ length: 18 }, (_, index) => ({
  id: `wardrobe-${index + 1}`,
  title: `ארון ${index + 1}`,
  category: 'wardrobes',
  image: '/images/white-wardrobe.webp',
  description: 'דוגמת ארון',
  published: true,
  order: index + 1,
}));

describe('furniture browsing', () => {
  it('pages through every photograph in groups of eight with bounded previous and next controls', async () => {
    const user = userEvent.setup();
    render(<FurnitureGallery items={[...wardrobes, ...items]} />);
    const previous = screen.getByRole('button', { name: 'העמוד הקודם' });
    const next = screen.getByRole('button', { name: 'העמוד הבא' });
    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();
    expect(screen.getAllByRole('button', { name: /הגדלת תמונה/ })).toHaveLength(
      8,
    );
    expect(screen.getByRole('status')).toHaveTextContent('עמוד 1 מתוך 3');
    expect(screen.queryByText('טיוטה פרטית')).not.toBeInTheDocument();

    await user.click(next);
    expect(previous).toBeEnabled();
    expect(screen.getByRole('status')).toHaveTextContent('עמוד 2 מתוך 3');
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ארון 9' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'הגדלת תמונה: ארון 1' }),
    ).not.toBeInTheDocument();

    await user.click(next);
    expect(screen.getAllByRole('button', { name: /הגדלת תמונה/ })).toHaveLength(
      3,
    );
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ארון 18' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ארון לבן' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('עמוד 3 מתוך 3');
    expect(next).toBeDisabled();

    await user.click(next);
    expect(screen.getByRole('status')).toHaveTextContent('עמוד 3 מתוך 3');
    await user.click(previous);
    expect(screen.getByRole('status')).toHaveTextContent('עמוד 2 מתוך 3');
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ארון 9' }),
    ).toBeInTheDocument();
  });
  it('starts each category on its first page and omits paging for a single page or an empty category', async () => {
    const user = userEvent.setup();
    render(<FurnitureGallery items={[...wardrobes, ...items]} />);
    await user.click(screen.getByRole('button', { name: 'העמוד הבא' }));
    await user.click(screen.getByRole('button', { name: 'סלונים' }));
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ספה אפורה' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('navigation', { name: 'דפדוף בתמונות רהיטים' }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ארונות' }));
    expect(screen.getByRole('status')).toHaveTextContent('עמוד 1 מתוך 3');
    expect(screen.getByRole('button', { name: 'העמוד הקודם' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'מזרנים' }));
    expect(
      screen.queryByRole('navigation', { name: 'דפדוף בתמונות רהיטים' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('0 תמונות');
  });
  it('keeps a valid page when published content is reduced', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<FurnitureGallery items={wardrobes} />);
    await user.click(screen.getByRole('button', { name: 'העמוד הבא' }));
    await user.click(screen.getByRole('button', { name: 'העמוד הבא' }));
    rerender(<FurnitureGallery items={wardrobes.slice(0, 4)} />);
    expect(screen.getAllByRole('button', { name: /הגדלת תמונה/ })).toHaveLength(
      4,
    );
    expect(
      screen.getByRole('button', { name: 'הגדלת תמונה: ארון 1' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('navigation', { name: 'דפדוף בתמונות רהיטים' }),
    ).not.toBeInTheDocument();
  });
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
