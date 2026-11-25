import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { App } from './App';
import { logoAssets } from './logoAssets';

describe('App', () => {
  it('renders all platform logo cards', () => {
    render(<App />);

    expect(screen.getAllByRole('article')).toHaveLength(logoAssets.length);
  });

  it('groups logos using the Infra platform groups', () => {
    render(<App />);

    const expectedGroups: Array<[string, string[]]> = [
      ['数据', ['UltraData Studio (UDS)', 'UltraData Craft (UDC)', 'UltraData Acquire (UDA)']],
      ['算力/训练', ['赛博坦 (Cybertron)', 'LLM Training Platform (LTP)']],
      ['推理', ['LLM Inference Serving (LIS)', 'ModelBest API Platform (MAP)', 'LLMCenter']],
      ['评测', ['UltraEval Hub (UEH)']],
      ['其他', ['ERP 管理平台']],
    ];

    for (const [groupName, expectedTitles] of expectedGroups) {
      const group = screen.getByRole('region', { name: groupName });
      const articles = within(group).getAllByRole('article');

      expect(articles).toHaveLength(expectedTitles.length);
      expect(articles.map((article) => article.getAttribute('aria-label'))).toEqual(
        expectedTitles,
      );
    }
  });

  it('places the download button on the same row as the logo', () => {
    render(<App />);

    const article = screen.getByRole('article', { name: 'LLM Training Platform (LTP)' });
    const button = within(article).getByRole('button', { name: '下载' });

    expect(button.closest('.card-main')).not.toBeNull();
    expect(button.closest('footer')).toBeNull();
  });

  it('uses a compact card layout and a subtle download button', () => {
    render(<App />);

    const article = screen.getByRole('article', { name: 'LLM Training Platform (LTP)' });
    const button = within(article).getByRole('button', { name: '下载' });

    expect(article).toHaveClass('logo-card', 'compact');
    expect(button).toHaveClass('card-download', 'ghost');
  });

  it('uses a subtle icon-only download button', () => {
    render(<App />);

    const article = screen.getByRole('article', { name: 'LLM Training Platform (LTP)' });
    const button = within(article).getByRole('button', { name: '下载' });

    expect(button).toHaveClass('card-download', 'ghost');
    expect(button).toHaveTextContent('');
    expect(button.querySelector('svg')).not.toBeNull();
  });

  it('does not render variant switch or view button', () => {
    render(<App />);

    expect(screen.queryByRole('button', { name: '亮色' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '泛白' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '查看' })).not.toBeInTheDocument();
  });

  it('opens the download dialog when clicking download', async () => {
    const user = userEvent.setup();
    render(<App />);

    const article = screen.getByRole('article', { name: 'LLM Training Platform (LTP)' });
    await user.click(within(article).getByRole('button', { name: '下载' }));

    expect(
      screen.getByRole('dialog', { name: 'LLM Training Platform (LTP) Logo' }),
    ).toBeInTheDocument();
  });

  it('opens the download dialog when clicking anywhere on the card', async () => {
    const user = userEvent.setup();
    render(<App />);

    const article = screen.getByRole('article', { name: 'LLM Training Platform (LTP)' });
    await user.click(article);

    expect(
      screen.getByRole('dialog', { name: 'LLM Training Platform (LTP) Logo' }),
    ).toBeInTheDocument();
  });

  it('uses a size dropdown and renders only the selected preview', async () => {
    const user = userEvent.setup();
    render(<App />);

    const article = screen.getByRole('article', { name: 'LLM Training Platform (LTP)' });
    await user.click(within(article).getByRole('button', { name: '下载' }));

    const dialog = screen.getByRole('dialog', { name: 'LLM Training Platform (LTP) Logo' });
    const sizeGroup = within(dialog).getByRole('group', { name: '尺寸选择' });
    const sizeButtons = within(sizeGroup).getAllByRole('button');

    expect(within(dialog).getByRole('heading', { name: '尺寸' })).toBeInTheDocument();
    expect(sizeButtons.map((button) => button.textContent)).toEqual([
      '16',
      '32',
      '48',
      '64',
      '128',
      '256',
    ]);
    expect(sizeButtons[5]).toHaveAttribute('aria-pressed', 'true');
    expect(within(dialog).getAllByAltText('LLM Training Platform (LTP) Logo')).toHaveLength(1);

    const colorSection = within(dialog).getByRole('region', {
      name: '色彩选择与多色定制',
    });
    const sizeSection = sizeGroup.closest('section');

    expect(sizeSection).toHaveAccessibleName('尺寸选择');

    expect(sizeGroup.compareDocumentPosition(colorSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );

    await user.click(sizeButtons[1]);

    expect(sizeButtons[1]).toHaveAttribute('aria-pressed', 'true');
    expect(within(dialog).getAllByAltText('LLM Training Platform (LTP) Logo')).toHaveLength(1);
    expect(within(dialog).getByAltText('LLM Training Platform (LTP) Logo')).toHaveAttribute(
      'width',
      '32',
    );
  });

  it('supports choosing a preset color and custom hex color', async () => {
    const user = userEvent.setup();
    render(<App />);

    const article = screen.getByRole('article', { name: 'LLM Training Platform (LTP)' });
    await user.click(within(article).getByRole('button', { name: '下载' }));

    const dialog = screen.getByRole('dialog', { name: 'LLM Training Platform (LTP) Logo' });
    await user.click(within(dialog).getByRole('button', { name: '红色' }));

    const preview = within(dialog).getByAltText('LLM Training Platform (LTP) Logo');
    expect(preview.getAttribute('src')).toContain(encodeURIComponent('#DC2626'));

    const input = within(dialog).getByLabelText('十六进制色值');
    await user.clear(input);
    await user.type(input, '#123456');
    await user.tab();

    expect(preview.getAttribute('src')).toContain(encodeURIComponent('#123456'));
  });

  it('provides SVG and PNG download options and copies SVG code', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<App />);

    const article = screen.getByRole('article', { name: 'LLM Training Platform (LTP)' });
    await user.click(within(article).getByRole('button', { name: '下载' }));

    const dialog = screen.getByRole('dialog', { name: 'LLM Training Platform (LTP) Logo' });
    expect(within(dialog).getByRole('button', { name: 'SVG 下载' })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'PNG 下载' })).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: '复制 SVG 代码' }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('<svg'));
  });
});
