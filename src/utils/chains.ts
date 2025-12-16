export const SUPPORTED_CHAINS = {
  "0x1d1fa": { name: "Monad", symbol: "MON" },
} as const;

export type ChainId = keyof typeof SUPPORTED_CHAINS;

export function isChainSupported(chainId: string): chainId is ChainId {
  return chainId in SUPPORTED_CHAINS;
}

export function getChainName(chainId: string): string {
  if (isChainSupported(chainId)) {
    return SUPPORTED_CHAINS[chainId].name;
  }
  return "Unknown Chain";
}

export function getChainSymbol(chainId: string): string {
  if (isChainSupported(chainId)) {
    return SUPPORTED_CHAINS[chainId].symbol;
  }
  return "???";
}

export function validateChain(chainId: string): {
  isValid: boolean;
  message?: string;
} {
  if (!isChainSupported(chainId)) {
    return {
      isValid: false,
      message: `Chain ${chainId} is not supported. Only Monad network is supported.`,
    };
  }

  return { isValid: true };
}
