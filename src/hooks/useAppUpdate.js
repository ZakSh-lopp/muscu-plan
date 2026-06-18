import { useState, useEffect } from 'react';

const GITHUB_REPO = 'ZakSh-lopp/muscu-plan';
const CURRENT_BUILD = parseInt(typeof __BUILD_NUMBER__ !== 'undefined' ? __BUILD_NUMBER__ : '0', 10);

export function useAppUpdate() {
  const [update, setUpdate] = useState(null); // { version, downloadUrl }

  useEffect(() => {
    if (CURRENT_BUILD === 0) return; // dev mode — skip check
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
          { headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const latestBuild = parseInt((data.tag_name || '').replace('v', ''), 10);
        if (isNaN(latestBuild) || latestBuild <= CURRENT_BUILD) return;

        const asset = (data.assets || []).find(a => a.name.endsWith('.apk'));
        if (!asset || cancelled) return;

        setUpdate({
          version: data.tag_name,
          downloadUrl: asset.browser_download_url,
          currentBuild: CURRENT_BUILD,
        });
      } catch {
        // silently ignore — network errors are expected offline
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  return update;
}
