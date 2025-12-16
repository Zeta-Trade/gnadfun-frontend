export const CHAIN_EXPLORERS: Record<string, string> = {
  "0x1d1fa": "https://monadexplorer.com",
};

export function getExplorerUrl(chainId: string, address: string): string {
  const baseUrl = CHAIN_EXPLORERS[chainId] || CHAIN_EXPLORERS["0x1d1fa"];
  return `${baseUrl}/address/${address}`;
}

export function openExplorer(chainId: string, address: string): void {
  const url = getExplorerUrl(chainId, address);
  window.open(url, "_blank");
}
