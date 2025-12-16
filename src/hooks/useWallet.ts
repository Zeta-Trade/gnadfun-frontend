import { useCallback, useEffect, useMemo, useState } from "react";
import { switchNetwork } from "../utils/metamask";

const STORAGE_KEY = "walletAddress";
const CHAIN_STORAGE_KEY = "chainId";
const CONNECTED_STORAGE_KEY = "walletConnected";
const MONAD_TESTNET_CHAIN_ID = "0x279f";

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);

  const isMetaMaskAvailable = useMemo(
    () => typeof window !== "undefined" && !!window.ethereum?.isMetaMask,
    [],
  );

  const formatAccount = useCallback((address: string) => {
    console.log('Formatting address:', address);
    if (address.length <= 10) {
      return address;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMetaMaskAvailable) {
      return;
    }

    const restoreWalletConnection = async () => {
      const savedAddress = window.localStorage.getItem(STORAGE_KEY);
      const wasConnected = window.localStorage.getItem(CONNECTED_STORAGE_KEY) === "true";
      const savedChainId = window.localStorage.getItem(CHAIN_STORAGE_KEY);

      if (wasConnected && savedAddress) {
        try {
          const currentAccounts = await window.ethereum?.request({
            method: "eth_accounts",
          }) as string[];

          if (currentAccounts.includes(savedAddress)) {
            setAccount(savedAddress);
            if (savedChainId) {
              setChainId(savedChainId);
            }
          }
        } catch (err) {
          // Error restoring wallet connection
        }
      }
    };

    restoreWalletConnection();
  }, [isMetaMaskAvailable]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum?.on) {
      return;
    }

    const handleAccountsChanged = (accounts: unknown) => {
      if (!Array.isArray(accounts) || accounts.length === 0) {
        clearWalletSession();
        return;
      }

      const nextAccount = accounts[0];
      if (typeof nextAccount === "string") {
        setAccount(nextAccount);
        window.localStorage.setItem(STORAGE_KEY, nextAccount);
      }
    };

    const handleChainChanged = (newChainId: unknown) => {
      if (typeof newChainId === "string") {
        setChainId(newChainId);
        window.localStorage.setItem(CHAIN_STORAGE_KEY, newChainId);
      }
    };

    const handleDisconnect = () => {
      clearWalletSession();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
      window.ethereum?.removeListener?.("disconnect", handleDisconnect);
    };
  }, []);

  const clearWalletSession = useCallback(() => {
    setAccount(null);
    setChainId(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(CHAIN_STORAGE_KEY);
      window.localStorage.removeItem(CONNECTED_STORAGE_KEY);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!isMetaMaskAvailable) {
      setWalletError("MetaMask is not available in this browser.");
      return false;
    }

    const previousAccount = account;
    const previousChainId = chainId;

    try {
      setWalletError(null);
      setIsConnecting(true);
      console.log("Connecting to MetaMask...", isConnecting);

      const accounts = (await window.ethereum?.request({
        method: "eth_requestAccounts",
      })) as string[];

      console.log("isConnecting:", isConnecting);

      if (!Array.isArray(accounts) || accounts.length === 0) {
        setWalletError("No accounts found in MetaMask.");
        if (previousAccount) {
          setAccount(previousAccount);
          setChainId(previousChainId);
        } else {
          clearWalletSession();
        }
        return false;
      }

      const selectedAccount = accounts[0];
      const currentChainId = (await window.ethereum?.request({
        method: "eth_chainId",
      })) as string;

      if (currentChainId !== MONAD_TESTNET_CHAIN_ID) {
        await switchNetwork(MONAD_TESTNET_CHAIN_ID);
      }

      setAccount(selectedAccount);
      setChainId(currentChainId);
      window.localStorage.setItem(STORAGE_KEY, selectedAccount);
      window.localStorage.setItem(CONNECTED_STORAGE_KEY, "true");
      window.localStorage.setItem(CHAIN_STORAGE_KEY, currentChainId);
      
      return true;
    } catch (error) {
      const code = (error as { code?: number }).code;
      if (code === 4001) {
        setWalletError("Connection request was rejected.");
      } else {
        setWalletError("Failed to connect to MetaMask.");
      }
      if (previousAccount) {
        setAccount(previousAccount);
        setChainId(previousChainId);
      } else {
        clearWalletSession();
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [account, chainId, isMetaMaskAvailable, clearWalletSession]);

  const disconnectWallet = useCallback(() => {
    clearWalletSession();
    setWalletError(null);
  }, [clearWalletSession]);

  const resetWalletError = useCallback(() => {
    setWalletError(null);
  }, []);

  const selectAccount = useCallback(async (selectedAddress: string) => {
    const previousAccount = account;
    const previousChainId = chainId;

    try {
      setWalletError(null);

      if (!availableAccounts.includes(selectedAddress)) {
        setWalletError("Selected account is not available.");
        return false;
      }

      const newChainId = (await window.ethereum?.request({
        method: "eth_chainId",
      })) as string;

      setAccount(selectedAddress);
      setChainId(newChainId);
      window.localStorage.setItem(STORAGE_KEY, selectedAddress);
      window.localStorage.setItem(CONNECTED_STORAGE_KEY, "true");
      window.localStorage.setItem(CHAIN_STORAGE_KEY, newChainId);
      setAvailableAccounts([]);

      return true;
    } catch (error) {
      setWalletError("Failed to select account.");
      if (previousAccount) {
        setAccount(previousAccount);
        setChainId(previousChainId);
      }
      return false;
    }
  }, [account, chainId, availableAccounts]);

  const switchToMonad = useCallback(async () => {
    try {
      setWalletError(null);
      await switchNetwork(MONAD_TESTNET_CHAIN_ID);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to switch network";
      setWalletError(errorMessage);
      return false;
    }
  }, []);

  return {
    account,
    chainId,
    isConnecting,
    walletError,
    isMetaMaskAvailable,
    formatAccount,
    connectWallet,
    disconnectWallet,
    resetWalletError,
    switchToMonad,
    availableAccounts,
    selectAccount,
  };
}

