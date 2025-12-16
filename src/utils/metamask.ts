export function isMetaMaskInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.ethereum?.isMetaMask;
}

export function getMetaMaskDeepLink(): string | null {
  if (typeof navigator === "undefined") return null;

  const userAgent = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return "https://metamask.app.link/connect";
  } else if (/Android/.test(userAgent)) {
    return "https://metamask.app.link/connect";
  }
  return null;
}

export function getMetaMaskDownloadUrl(): string {
  return "https://metamask.io/download/";
}

export async function requestAccounts(): Promise<string[]> {
  if (!window.ethereum) throw new Error("MetaMask not available");

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    return accounts;
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code === 4001) {
      throw new Error("User rejected the connection request");
    }
    throw error;
  }
}

export async function getCurrentChainId(): Promise<string> {
  if (!window.ethereum) throw new Error("MetaMask not available");

  const chainId = (await window.ethereum.request({
    method: "eth_chainId",
  })) as string;

  return chainId;
}

export async function getCurrentAccounts(): Promise<string[]> {
  if (!window.ethereum) throw new Error("MetaMask not available");

  const accounts = (await window.ethereum.request({
    method: "eth_accounts",
  })) as string[];

  return accounts;
}

const MONAD_TESTNET_CONFIG = {
  chainId: "0x1d1fa",
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
};

export async function addMonadNetwork(): Promise<void> {
  if (!window.ethereum) throw new Error("MetaMask not available");

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [MONAD_TESTNET_CONFIG],
    });
  } catch (error) {
    const code = (error as { code?: number }).code;
    const message = (error as { message?: string }).message || "";
    
    if (code === 4001) {
      throw new Error("User rejected adding Monad network");
    }
    
    if (code === 4002 || message.includes("already exists")) {
      return;
    }
    
    throw error;
  }
}

export async function switchNetwork(chainId: string): Promise<void> {
  if (!window.ethereum) throw new Error("MetaMask not available");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code === 4902) {
      if (chainId === MONAD_TESTNET_CONFIG.chainId) {
        try {
          await addMonadNetwork();
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          });
        } catch (addError) {
          const addCode = (addError as { code?: number }).code;
          if (addCode === 4001) {
            throw addError;
          }
        }
      } else {
        throw new Error("Chain not added to MetaMask");
      }
    } else {
      throw error;
    }
  }
}
