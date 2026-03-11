import { useState, useEffect } from 'react';
import { Stock } from '../types';
import { 
  fetchCompleteStockData, 
  STOCK_UNIVERSE, 
  STOCK_METADATA 
} from '../services/api';

export const useRealTimeData = (
  dataSource: 'simulated' | 'real',
  marketCapFilter: ('large' | 'mid' | 'small')[]
) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get symbols based on market cap filter
        const symbols: string[] = [];
        if (marketCapFilter.includes('large')) {
          symbols.push(...STOCK_UNIVERSE.largeCap);
        }
        if (marketCapFilter.includes('mid')) {
          symbols.push(...STOCK_UNIVERSE.midCap);
        }
        if (marketCapFilter.includes('small')) {
          symbols.push(...STOCK_UNIVERSE.smallCap);
        }

        // Fetch data for all selected stocks
        const stockPromises = symbols.map(symbol => {
          const metadata = STOCK_METADATA[symbol];
          if (!metadata) return null;
          return fetchCompleteStockData(symbol, metadata.sector, metadata.name);
        }).filter(Boolean);

        const stockData = await Promise.all(stockPromises as Promise<Stock>[]);
        setStocks(stockData);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
        console.error('Error loading stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();

    // Auto-refresh for real data every 30 seconds
    if (dataSource === 'real') {
      const interval = setInterval(loadStocks, 30000);
      return () => clearInterval(interval);
    }
  }, [dataSource, marketCapFilter.join(',')]);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const symbols: string[] = [];
      if (marketCapFilter.includes('large')) {
        symbols.push(...STOCK_UNIVERSE.largeCap);
      }
      if (marketCapFilter.includes('mid')) {
        symbols.push(...STOCK_UNIVERSE.midCap);
      }
      if (marketCapFilter.includes('small')) {
        symbols.push(...STOCK_UNIVERSE.smallCap);
      }

      const stockPromises = symbols.map(symbol => {
        const metadata = STOCK_METADATA[symbol];
        if (!metadata) return null;
        return fetchCompleteStockData(symbol, metadata.sector, metadata.name);
      }).filter(Boolean);

      const stockData = await Promise.all(stockPromises as Promise<Stock>[]);
      setStocks(stockData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh stock data');
    } finally {
      setLoading(false);
    }
  };

  return { stocks, loading, error, lastUpdate, refresh };
};
