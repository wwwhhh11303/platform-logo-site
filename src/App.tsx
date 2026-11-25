import { useMemo, useState } from 'react';

import { LogoAssetCard, LogoDownloadDialog } from './components';
import { logoAssets, logoGroups } from './logoAssets';

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedAsset = useMemo(
    () => logoAssets.find((asset) => asset.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>平台 Logo 资产库</h1>
          <p>在线换色、多尺寸预览、SVG / PNG 下载与 SVG 代码复制</p>
        </div>
      </header>

      <div className="logo-groups">
        {logoGroups.map((group) => (
          <section key={group} className="logo-group" aria-label={group}>
            <h2>{group}</h2>
            <div className="logo-grid">
              {logoAssets
                .filter((asset) => asset.group === group)
                .map((asset) => (
                  <LogoAssetCard
                    key={asset.id}
                    asset={asset}
                    onDownload={() => setSelectedId(asset.id)}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      {selectedAsset && (
        <LogoDownloadDialog asset={selectedAsset} onClose={() => setSelectedId(null)} />
      )}
    </main>
  );
}
