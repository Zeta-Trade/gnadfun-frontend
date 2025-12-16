import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import type { Token } from "../types/token";
import { useTokenStore } from "../store/tokenStore";
import { useWallet } from "../hooks/useWallet";

interface GlobalContextType {
  tokens: Token[];
  addToken: (token: Token) => void;
  setTokens: (tokens: Token[]) => void;
  account: string | null;
  chainId: string | number | null;
  isConnecting: boolean;
  walletError: string | null;
  formatAccount: (address: string) => string;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  resetWalletError: () => void;
  switchToMonad: () => Promise<boolean>;
  isTokenDialogOpen: boolean;
  setIsTokenDialogOpen: (open: boolean) => void;
  language: "en" | "zh";
  setLanguage: (language: "en" | "zh") => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { tokens, addToken, setTokens } = useTokenStore();
  const {
    account,
    chainId,
    isConnecting,
    walletError,
    formatAccount,
    connectWallet,
    disconnectWallet,
    resetWalletError,
    switchToMonad,
  } = useWallet();

  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "zh">(() => {
    const savedLanguage = localStorage.getItem('language') as "en" | "zh" | null;
    return savedLanguage || "en";
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('dark');
    htmlElement.classList.add('light');
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const value: GlobalContextType = {
    tokens,
    addToken,
    setTokens,
    account,
    chainId,
    isConnecting,
    walletError,
    formatAccount,
    connectWallet,
    disconnectWallet,
    resetWalletError,
    switchToMonad,
    isTokenDialogOpen,
    setIsTokenDialogOpen,
    language,
    setLanguage,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
