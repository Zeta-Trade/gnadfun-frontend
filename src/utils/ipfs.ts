/*
  Lightweight IPFS helpers for browser usage.

  - Uploads JSON metadata as a single file to Web3.Storage if `VITE_WEB3_STORAGE_TOKEN` is set.
  - Falls back to returning null if no token is configured.
  - Provides a helper to fetch JSON from public IPFS gateways.

  Note: Add your Web3.Storage API token to `.env` as `VITE_WEB3_STORAGE_TOKEN`.
*/

export async function uploadJsonToWeb3Storage(obj: unknown): Promise<{ cid: string } | null> {
  // prefer Vite env variable in the browser
  const token = (import.meta as any).env?.VITE_WEB3_STORAGE_TOKEN;
  if (!token) return null;

  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });

  try {
    const res = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: blob,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Web3.Storage upload failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    // response contains `cid`
    return { cid: data.cid };
  } catch (err) {
    console.error('IPFS upload error', err);
    return null;
  }
}

export async function fetchJsonFromIpfs(cid: string, gateway = 'https://ipfs.io/ipfs') {
  const url = `${gateway}/${cid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch IPFS content: ${res.status}`);
  return res.json();
}

export default { uploadJsonToWeb3Storage, fetchJsonFromIpfs };

export async function uploadFileToWeb3Storage(file: Blob | File): Promise<{ cid: string } | null> {
  const token = (import.meta as any).env?.VITE_WEB3_STORAGE_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: file,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Web3.Storage upload failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    return { cid: data.cid };
  } catch (err) {
    console.error('IPFS file upload error', err);
    return null;
  }
}
