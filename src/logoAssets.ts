export type LogoColor = 'original' | string;

const logoSources = import.meta.glob('./assets/logos/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface LogoAsset {
  id: string;
  title: string;
  kind: string;
  group: string;
  svg: string;
}

export const logoColors: Array<{ label: string; value: LogoColor }> = [
  { label: '原始', value: 'original' },
  { label: '黑色', value: '#000000' },
  { label: '白色', value: '#FFFFFF' },
  { label: '红色', value: '#DC2626' },
  { label: '橙色', value: '#EA580C' },
  { label: '绿色', value: '#16A34A' },
  { label: '蓝色', value: '#2563EB' },
  { label: '紫色', value: '#7C3AED' },
];

const platformMeta: Array<Omit<LogoAsset, 'svg'>> = [
  { id: 'UDS', title: 'UltraData Studio (UDS)', kind: '数据处理与管线平台', group: '数据' },
  { id: 'Craft', title: 'UltraData Craft (UDC)', kind: '数据标注平台', group: '数据' },
  { id: 'UDA', title: 'UltraData Acquire (UDA)', kind: '数据采集平台', group: '数据' },
  { id: 'Cybertron', title: '赛博坦 (Cybertron)', kind: '算力平台', group: '算力/训练' },
  { id: 'LTP', title: 'LLM Training Platform (LTP)', kind: '训练平台', group: '算力/训练' },
  { id: 'LIS', title: 'LLM Inference Serving (LIS)', kind: '推理平台', group: '推理' },
  { id: 'MAP', title: 'ModelBest API Platform (MAP)', kind: '对外 API 服务平台', group: '推理' },
  { id: 'LLMC', title: 'LLMCenter', kind: '对内模型网关辅助平台', group: '推理' },
  { id: 'UltraEval', title: 'UltraEval Hub (UEH)', kind: '统一评测平台', group: '评测' },
  { id: 'ERP', title: 'ERP 管理平台', kind: '工时 · 项目 · 预算', group: '其他' },
];

export const logoGroups = ['数据', '算力/训练', '推理', '评测', '其他'] as const;

export const logoAssets: LogoAsset[] = platformMeta.map((meta) => ({
  ...meta,
  svg: logoSources[`./assets/logos/${meta.id}.svg`] ?? '',
}));

export function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function applyLogoColor(svg: string, color: LogoColor): string {
  if (color === 'original' || !isHexColor(color)) {
    return svg;
  }

  return svg.replace(
    /\b(fill|stroke)="#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})"/g,
    (_match, attribute: string) => `${attribute}="${color}"`,
  );
}

export function getLogoSvg(id: string, color: LogoColor = 'original'): string {
  const asset = logoAssets.find((item) => item.id === id);

  if (!asset) {
    throw new Error(`Logo asset not found: ${id}`);
  }

  return applyLogoColor(asset.svg, color);
}

export function getLogoDataUrl(id: string, color: LogoColor = 'original'): string {
  const svg = getLogoSvg(id, color);

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function downloadSvg(asset: LogoAsset, color: LogoColor = 'original'): void {
  const svg = applyLogoColor(asset.svg, color);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `${asset.id}${color === 'original' ? '' : `-${color.slice(1)}`}.svg`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function downloadPng(
  asset: LogoAsset,
  size: number,
  color: LogoColor = 'original',
): Promise<void> {
  const image = new Image();

  image.src = getLogoDataUrl(asset.id, color);
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is unavailable');
  }

  context.drawImage(image, 0, 0, size, size);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) {
    throw new Error('PNG export failed');
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `${asset.id}-${size}px${color === 'original' ? '' : `-${color.slice(1)}`}.png`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function copySvgCode(asset: LogoAsset, color: LogoColor = 'original'): Promise<void> {
  const svg = applyLogoColor(asset.svg, color);

  await navigator.clipboard.writeText(svg);
}
