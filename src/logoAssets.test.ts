import { describe, expect, it } from 'vitest';

const logoSources = import.meta.glob('./assets/logos/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function readLogo(id: string): string {
  return logoSources[`./assets/logos/${id}.svg`] ?? '';
}

describe('platform logo visual language', () => {
  it('keeps MAP and UDS as the two anchor marks', () => {
    expect(readLogo('MAP')).toContain('fill="#373ED8"');
    expect(readLogo('UDS')).toContain('fill="#315EFE"');
    expect(readLogo('UDS')).toContain('fill="#00D3ED"');
  });

  it('keeps UDS as the official UltraData mark', () => {
    const svg = readLogo('UDS');

    expect(svg).toContain('viewBox="0 0 96 96"');
    expect([...svg.matchAll(/<rect/g)]).toHaveLength(5);
    expect([...svg.matchAll(/<path/g)]).toHaveLength(3);
    expect(svg).toContain('M59.9509 37.8437');
    expect(svg).toContain('M19 73.4941');
  });

  it('rotates only the UDC pencil label toward the lower left', () => {
    const svg = readLogo('Craft');

    expect(svg).toContain('data-semantics="annotation-label-pencil-down-left"');
    expect([...svg.matchAll(/<rect/g)]).toHaveLength(0);
    expect([...svg.matchAll(/<path/g)]).toHaveLength(3);
    expect(svg).not.toContain('stroke=');
    expect(svg).toContain('transform="rotate(135 11 12)"');
    expect(svg).toContain('M4 4h5v2H6v3H4V4z M15 4h5v5h-2V6h-3V4z M4 15h2v3h3v2H4v-5z M15 18h3v-3h2v5h-5v-2z');
    expect(svg).toContain('M7 10h8v4H7z');
    expect(svg).toContain('M15 10l3 2-3 2z');
    expect(svg).toContain('fill="#315EFE"');
    expect([...svg.matchAll(/#00D3ED/g)]).toHaveLength(1);
  });

  it('uses a data-aggregation funnel with four converging streams for UDA', () => {
    const svg = readLogo('UDA');

    expect(svg).toContain('data-semantics="data-aggregation-funnel"');
    expect(svg).not.toContain('transform=');
    expect(svg).not.toContain('stroke=');
    expect([...svg.matchAll(/<path/g)]).toHaveLength(2);
    expect([...svg.matchAll(/M/g)]).toHaveLength(6);
    expect(svg).toContain('fill="#315EFE"');
    expect([...svg.matchAll(/#00D3ED/g)]).toHaveLength(1);
  });

  it('aligns LIS and LLMC with the unified silhouette language', () => {
    const targets = [
      { id: 'LIS', primary: '#373ED8' },
      { id: 'LLMC', primary: '#373ED8' },
    ];

    for (const { id, primary } of targets) {
      const svg = readLogo(id);

      expect(svg, `${id} should not use a global tilt`).not.toContain('transform=');
      expect([...svg.matchAll(/<path/g)], `${id} should use the unified silhouette language`).toHaveLength(2);
      expect(svg, `${id} should stay flat and filled`).not.toContain('stroke=');
      expect(svg, `${id} should use its brand blue`).toContain(primary);
      expect([...svg.matchAll(/#00D3ED/g)], `${id} should keep one cyan accent`).toHaveLength(1);
    }
  });
});
