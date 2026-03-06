"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface WalletContextType {
  // MetaMask (Ethereum)
  ethAddress: string | null;
  ethBalance: string | null;
  connectMetaMask: () => Promise<void>;
  disconnectMetaMask: () => void;
  isMetaMaskConnecting: boolean;
  
  // Algorand
  algoAddress: string | null;
  algoBalance: string | null;
  connectAlgorand: () => Promise<void>;
  disconnectAlgorand: () => void;
  isAlgorandConnecting: boolean;
  
  // Common
  isConnected: boolean;
  activeWallet: "metamask" | "algorand" | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  // MetaMask State
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [isMetaMaskConnecting, setIsMetaMaskConnecting] = useState(false);
  
  // Algorand State
  const [algoAddress, setAlgoAddress] = useState<string | null>(null);
  const [algoBalance, setAlgoBalance] = useState<string | null>(null);
  const [isAlgorandConnecting, setIsAlgorandConnecting] = useState(false);
  
  const [activeWallet, setActiveWallet] = useState<"metamask" | "algorand" | null>(null);
  
  const isConnected = !!(ethAddress || algoAddress);

  // Check for existing connections on mount
  useEffect(() => {
    checkExistingConnections();
  }, []);

  const checkExistingConnections = async () => {
    // Check MetaMask
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setEthAddress(accounts[0]);
          setActiveWallet("metamask");
          await fetchEthBalance(accounts[0]);
        }
      } catch (err) {
        console.log("No existing MetaMask connection");
      }
    }
    
    // Check Algorand (Pera Wallet)
    const savedAlgoAddress = localStorage.getItem("algorand-wallet");
    if (savedAlgoAddress) {
      setAlgoAddress(savedAlgoAddress);
      setActiveWallet("algorand");
    }
  };

  const fetchEthBalance = async (address: string) => {
    if (window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });
        const ethBalance = parseInt(balance, 16) / 1e18;
        setEthBalance(ethBalance.toFixed(4));
      } catch (err) {
        console.error("Failed to fetch ETH balance:", err);
      }
    }
  };

  // MetaMask Connection
  const connectMetaMask = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return;
    }
    
    setIsMetaMaskConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts.length > 0) {
        setEthAddress(accounts[0]);
        setActiveWallet("metamask");
        await fetchEthBalance(accounts[0]);
        
        // Listen for account changes
        window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
          if (newAccounts.length === 0) {
            disconnectMetaMask();
          } else {
            setEthAddress(newAccounts[0]);
            fetchEthBalance(newAccounts[0]);
          }
        });
        
        // Listen for chain changes
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      }
    } catch (err) {
      console.error("MetaMask connection error:", err);
    } finally {
      setIsMetaMaskConnecting(false);
    }
  };

  const disconnectMetaMask = () => {
    setEthAddress(null);
    setEthBalance(null);
    if (activeWallet === "metamask") {
      setActiveWallet(null);
    }
  };

  // Algorand Connection (Pera Wallet)
  const connectAlgorand = async () => {
    setIsAlgorandConnecting(true);
    try {
      // For demo purposes, simulate Pera Wallet connection
      // In production, use @perawallet/connect
      const mockAddress = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHI";
      setAlgoAddress(mockAddress);
      setAlgoBalance("1000.00");
      setActiveWallet("algorand");
      localStorage.setItem("algorand-wallet", mockAddress);
    } catch (err) {
      console.error("Algorand connection error:", err);
    } finally {
      setIsAlgorandConnecting(false);
    }
  };

  const disconnectAlgorand = () => {
    setAlgoAddress(null);
    setAlgoBalance(null);
    localStorage.removeItem("algorand-wallet");
    if (activeWallet === "algorand") {
      setActiveWallet(null);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        ethAddress,
        ethBalance,
        connectMetaMask,
        disconnectMetaMask,
        isMetaMaskConnecting,
        algoAddress,
        algoBalance,
        connectAlgorand,
        disconnectAlgorand,
        isAlgorandConnecting,
        isConnected,
        activeWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

// TypeScript declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (data: any) => void) => void;
      removeListener: (event: string, callback: (data: any) => void) => void;
    };
  }
}
