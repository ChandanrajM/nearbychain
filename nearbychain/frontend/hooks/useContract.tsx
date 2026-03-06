"use client";

import { useState, useCallback } from "react";
import { useWallet } from "./useWallet";

// Mock contract ABIs - In production, import from your deployed contracts
const ORDER_CONTRACT_ABI = [
  "function createOrder(address shop, uint256 amount, string memory service) public returns (uint256)",
  "function confirmOrder(uint256 orderId) public",
  "function getOrder(uint256 orderId) public view returns (address buyer, address shop, uint256 amount, string memory service, uint8 status)",
  "event OrderCreated(uint256 indexed orderId, address indexed buyer, address indexed shop, uint256 amount)",
  "event OrderConfirmed(uint256 indexed orderId)"
];

const ESCROW_CONTRACT_ABI = [
  "function deposit(address shop) public payable",
  "function release(uint256 orderId) public",
  "function refund(uint256 orderId) public",
  "function getBalance() public view returns (uint256)"
];

// Contract addresses (mock - replace with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  ethereum: {
    orderContract: "0x1234567890123456789012345678901234567890",
    escrowContract: "0x0987654321098765432109876543210987654321"
  },
  algorand: {
    orderAppId: 123456789,
    escrowAppId: 987654321
  }
};

interface Transaction {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

interface OrderDetails {
  orderId: string;
  buyer: string;
  shop: string;
  amount: string;
  service: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export function useContract() {
  const { ethAddress, algoAddress, activeWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /**
   * Create a new order on the blockchain
   */
  const createOrder = useCallback(async (
    shopAddress: string,
    amount: string,
    service: string
  ): Promise<string | null> => {
    if (!ethAddress && !algoAddress) {
      setError("No wallet connected");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeWallet === "metamask" && window.ethereum) {
        // Ethereum transaction
        const txHash = await createEthereumOrder(shopAddress, amount, service);
        
        // Add to transaction history
        const newTx: Transaction = {
          hash: txHash,
          status: "pending",
          from: ethAddress!,
          to: shopAddress,
          amount,
          timestamp: Date.now()
        };
        setTransactions(prev => [newTx, ...prev]);

        // Simulate confirmation
        setTimeout(() => {
          setTransactions(prev => 
            prev.map(tx => 
              tx.hash === txHash ? { ...tx, status: "confirmed" } : tx
            )
          );
        }, 3000);

        return txHash;
      } else if (activeWallet === "algorand") {
        // Algorand transaction (mock)
        const txId = await createAlgorandOrder(shopAddress, amount, service);
        
        const newTx: Transaction = {
          hash: txId,
          status: "confirmed",
          from: algoAddress!,
          to: shopAddress,
          amount,
          timestamp: Date.now()
        };
        setTransactions(prev => [newTx, ...prev]);

        return txId;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create order");
      return null;
    } finally {
      setLoading(false);
    }

    return null;
  }, [ethAddress, algoAddress, activeWallet]);

  /**
   * Deposit funds to escrow
   */
  const depositToEscrow = useCallback(async (
    orderId: string,
    amount: string
  ): Promise<string | null> => {
    if (!ethAddress && !algoAddress) {
      setError("No wallet connected");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeWallet === "metamask" && window.ethereum) {
        // Convert ETH to Wei
        const amountInWei = BigInt(parseFloat(amount) * 1e18);

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: ethAddress,
            to: CONTRACT_ADDRESSES.ethereum.escrowContract,
            value: "0x" + amountInWei.toString(16),
            data: "0x" // Contract method call data
          }]
        });

        const newTx: Transaction = {
          hash: txHash,
          status: "pending",
          from: ethAddress!,
          to: CONTRACT_ADDRESSES.ethereum.escrowContract,
          amount,
          timestamp: Date.now()
        };
        setTransactions(prev => [newTx, ...prev]);

        return txHash;
      } else if (activeWallet === "algorand") {
        // Mock Algorand deposit
        const txId = "ALGO" + Math.random().toString(36).substring(7);
        
        const newTx: Transaction = {
          hash: txId,
          status: "confirmed",
          from: algoAddress!,
          to: CONTRACT_ADDRESSES.algorand.escrowAppId.toString(),
          amount,
          timestamp: Date.now()
        };
        setTransactions(prev => [newTx, ...prev]);

        return txId;
      }
    } catch (err: any) {
      setError(err.message || "Failed to deposit");
      return null;
    } finally {
      setLoading(false);
    }

    return null;
  }, [ethAddress, algoAddress, activeWallet]);

  /**
   * Release funds from escrow to shop
   */
  const releaseEscrow = useCallback(async (
    orderId: string
  ): Promise<boolean> => {
    if (!ethAddress && !algoAddress) {
      setError("No wallet connected");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate release transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to release escrow");
      return false;
    } finally {
      setLoading(false);
    }
  }, [ethAddress, algoAddress]);

  /**
   * Get order details from blockchain
   */
  const getOrderDetails = useCallback(async (
    orderId: string
  ): Promise<OrderDetails | null> => {
    setLoading(true);
    setError(null);

    try {
      // Mock order details
      const mockOrder: OrderDetails = {
        orderId,
        buyer: ethAddress || algoAddress || "",
        shop: "0xShopAddress...",
        amount: "0.1",
        service: "Print Documents",
        status: "pending"
      };

      return mockOrder;
    } catch (err: any) {
      setError(err.message || "Failed to get order details");
      return null;
    } finally {
      setLoading(false);
    }
  }, [ethAddress, algoAddress]);

  /**
   * Send direct payment (non-escrow)
   */
  const sendPayment = useCallback(async (
    to: string,
    amount: string
  ): Promise<string | null> => {
    if (!ethAddress && !algoAddress) {
      setError("No wallet connected");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeWallet === "metamask" && window.ethereum) {
        const amountInWei = BigInt(parseFloat(amount) * 1e18);

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: ethAddress,
            to,
            value: "0x" + amountInWei.toString(16)
          }]
        });

        const newTx: Transaction = {
          hash: txHash,
          status: "pending",
          from: ethAddress!,
          to,
          amount,
          timestamp: Date.now()
        };
        setTransactions(prev => [newTx, ...prev]);

        return txHash;
      } else if (activeWallet === "algorand") {
        const txId = "ALGO" + Math.random().toString(36).substring(7);
        
        const newTx: Transaction = {
          hash: txId,
          status: "confirmed",
          from: algoAddress!,
          to,
          amount,
          timestamp: Date.now()
        };
        setTransactions(prev => [newTx, ...prev]);

        return txId;
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
      return null;
    } finally {
      setLoading(false);
    }

    return null;
  }, [ethAddress, algoAddress, activeWallet]);

  // Helper function for Ethereum order creation
  const createEthereumOrder = async (
    shopAddress: string,
    amount: string,
    service: string
  ): Promise<string> => {
    // In production, use ethers.js or web3.js to interact with contract
    // This is a mock implementation
    const mockTxHash = "0x" + Math.random().toString(16).substring(2, 34);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockTxHash;
  };

  // Helper function for Algorand order creation
  const createAlgorandOrder = async (
    shopAddress: string,
    amount: string,
    service: string
  ): Promise<string> => {
    // In production, use algosdk to interact with Algorand
    const mockTxId = "ALGO" + Math.random().toString(36).substring(7);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockTxId;
  };

  return {
    createOrder,
    depositToEscrow,
    releaseEscrow,
    getOrderDetails,
    sendPayment,
    transactions,
    loading,
    error,
    clearError: () => setError(null)
  };
}
