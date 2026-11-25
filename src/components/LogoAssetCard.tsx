import { getLogoDataUrl, type LogoAsset } from '../logoAssets';

interface LogoAssetCardProps {
  asset: LogoAsset;
  onDownload: () => void;
}

export function LogoAssetCard({ asset, onDownload }: LogoAssetCardProps) {
  const src = getLogoDataUrl(asset.id);

  return (
    <article
      className="logo-card compact"
      aria-label={asset.title}
      onClick={onDownload}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onDownload();
        }
      }}
      tabIndex={0}
    >
      <div className="card-main">
        <div className="logo-frame">
          <img src={src} width={48} height={48} alt={`${asset.title} Logo`} />
        </div>
        <div className="card-text">
          <h2>{asset.title}</h2>
          <p>{asset.kind}</p>
        </div>
        <button
          type="button"
          className="card-download ghost"
          aria-label="下载"
          onClick={onDownload}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v10" />
            <path d="m7.5 10.5 4.5 4 4.5-4" />
            <path d="M5 19h14" />
          </svg>
        </button>
      </div>
    </article>
  );
}
