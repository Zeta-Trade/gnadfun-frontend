export const STORAGE_KEYS = {
  WALLET_ADDRESS: "walletAddress",
  CHAIN_ID: "chainId",
  WALLET_CONNECTED: "walletConnected",
} as const;

export function getStoredWallet(): {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
} {
  if (typeof window === "undefined") {
    return {
      address: null,
      chainId: null,
      isConnected: false,
    };
  }

  return {
    address: window.localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS),
    chainId: window.localStorage.getItem(STORAGE_KEYS.CHAIN_ID),
    isConnected:
      window.localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) === "true",
  };
}

export function storeWallet(
  address: string,
  chainId: string,
  isConnected: boolean = true
): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
  window.localStorage.setItem(STORAGE_KEYS.CHAIN_ID, chainId);
  window.localStorage.setItem(
    STORAGE_KEYS.WALLET_CONNECTED,
    isConnected ? "true" : "false"
  );
}

export function clearWalletStorage(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
  window.localStorage.removeItem(STORAGE_KEYS.CHAIN_ID);
  window.localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
}
