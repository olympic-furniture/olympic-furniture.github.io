import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Header } from './Header';

it('closes mobile navigation when an anchor is chosen', async () => {
  const user = userEvent.setup();
  render(<Header />);
  const toggle = screen.getByRole('button', { name: 'פתיחת תפריט' });
  await user.click(toggle);
  const nav = screen.getByRole('navigation', { name: 'תפריט נייד' });
  await user.click(within(nav).getByRole('link', { name: 'הסיפור שלנו' }));
  expect(
    screen.queryByRole('navigation', { name: 'תפריט נייד' }),
  ).not.toBeInTheDocument();
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
it('dismisses navigation on Escape and restores focus', async () => {
  const user = userEvent.setup();
  render(<Header />);
  const toggle = screen.getByRole('button', { name: 'פתיחת תפריט' });
  await user.click(toggle);
  await user.tab();
  await user.keyboard('{Escape}');
  expect(
    screen.queryByRole('navigation', { name: 'תפריט נייד' }),
  ).not.toBeInTheDocument();
  expect(toggle).toHaveFocus();
});
