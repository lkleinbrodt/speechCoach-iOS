import React, { createContext, useCallback, useContext, useState } from 'react';

import { getBalance } from '@/api/balance';

interface BalanceContextType {
  balance: number | null;
  loading: boolean;
  error: string | null;
  loadBalance: () => Promise<void>;
  updateBalance: (newBalance: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBalance();
      setBalance(data.balance);
    } catch (err) {
      setError('Failed to load balance');
      console.error('Failed to load balance:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setBalance(newBalance);
  }, []);

  return (
    <BalanceContext.Provider
      value={{
        balance,
        loading,
        error,
        loadBalance,
        updateBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}
