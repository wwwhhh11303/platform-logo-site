import { useState } from 'react';

import {
  copySvgCode,
  downloadPng,
  downloadSvg,
  getLogoDataUrl,
  isHexColor,
  logoColors,
  type LogoAsset,
  type LogoColor,
} from '../logoAssets';

interface LogoDownloadDialogProps {
  asset: LogoAsset;
  onClose: () => void;
}

const sizeOptions = [16, 32, 48, 64, 128, 256];

export function LogoDownloadDialog({ asset, onClose }: LogoDownloadDialogProps) {
  const [color, setColor] = useState<LogoColor>('original');
  const [hexInput, setHexInput] = useState('');
  const [size, setSize] = useState(256);
  const src = getLogoDataUrl(asset.id, color);

  function selectPresetColor(value: LogoColor) {
    setColor(value);
    setHexInput(value === 'original' ? '' : value);
  }

  function selectCustomColor(value: string) {
    setHexInput(value);

    if (value === '') {
      setColor('original');
    } else if (isHexColor(value)) {
      setColor(value);
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${asset.title} Logo`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dialog-header">
          <div>
            <h2>{asset.title} Logo</h2>
            <p>{asset.kind}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>

        <section className="preview-section" aria-label="图标预览">
          <div className="preview-stage">
            <img src={src} width={size} height={size} alt={`${asset.title} Logo`} />
          </div>
        </section>

        <section className="size-section" aria-label="尺寸选择">
          <h3>尺寸</h3>
          <div className="size-options" role="group" aria-label="尺寸选择">
            {sizeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={size === option ? 'active' : ''}
                aria-pressed={size === option}
                onClick={() => setSize(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="color-section" aria-label="色彩选择与多色定制">
          <h3>颜色</h3>
          <div className="color-swatches">
            {logoColors.map((option) => (
              <button
                key={option.label}
                type="button"
                className={color === option.value ? 'active' : ''}
                aria-label={option.label}
                onClick={() => selectPresetColor(option.value)}
                style={{
                  backgroundColor: option.value === 'original' ? '#373ED8' : option.value,
                }}
              />
            ))}
          </div>
          <label className="hex-input">
            十六进制色值
            <input
              type="text"
              value={hexInput}
              placeholder="#373ED8"
              onChange={(event) => selectCustomColor(event.target.value)}
            />
          </label>
        </section>

        <section className="download-section" aria-label="多种格式下载">
          <h3>下载</h3>
          <div className="download-actions">
            <button type="button" onClick={() => downloadSvg(asset, color)}>
              SVG 下载
            </button>
            <button type="button" onClick={() => downloadPng(asset, size, color)}>
              PNG 下载
            </button>
          </div>
        </section>

        <section className="code-section" aria-label="SVG 代码复制">
          <h3>代码</h3>
          <button type="button" onClick={() => copySvgCode(asset, color)}>
            复制 SVG 代码
          </button>
        </section>
      </div>
    </div>
  );
}
