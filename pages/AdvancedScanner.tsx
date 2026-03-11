import React, { useState, useEffect, useMemo } from 'react';
import { Stock, FilterState } from '../types';
import { TrendingUp, TrendingDown, Activity, RefreshCw, Database, Zap } from 'lucide-react';
import AdvancedFilterSidebar from '../components/AdvancedFilterSidebar';
import AdvancedStockTable from '../components/AdvancedStockTable';
import StockDetailPanel from '../components/StockDetailPanel';
import { useStockFilter } from '../hooks/useStockFilter';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { mockStocks } from '../data/mockData';
import { calculateStockScore } from '../utils/scoring';

const AdvancedScanner = () => {
  const [filters, setFilters] = useState<FilterState>({
    priceVsEMA: [],
    rsiRange: { min: 0, max: 100 },
    macdSignal: [],
    volumeSpikeMin: 0,
    adxMin: 0,
    peMin: 0,
    peMax: 999,
    roeMin: 0,
    roceMin: 0,
    debtToEquityMax: 999,
    fiiNetMin: -9999,
    pcrMin: 0,
    pcrMax: 5,
    analystBuyMin: 0,
    newsSentimentFilter: [],
    sectors: []
  });

  const [sortColumn, setSortColumn] = useState('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dataSource, setDataSource] = useState<'simulated' | 'real'>('simulated');
  const [marketData, setMarketData] = useState({
    nifty50: 22150.45,
    niftyChange: 0.85,
    vix: 13.45,
    fiiFlow: 1250.5
  });
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const { stocks: realTimeStocks, loading, error, refresh } = useRealTimeData(dataSource, ['large', 'mid', 'small']);
  
  // Use mockStocks as fallback if realTimeStocks is empty
  const activeStocks = dataSource === 'simulated' ? mockStocks : (realTimeStocks.length > 0 ? realTimeStocks : mockStocks);
  const filteredStocks = useStockFilter(activeStocks, filters);

  // Debug logging
  useEffect(() => {
    console.log('AdvancedScanner - activeStocks:', activeStocks.length, 'loading:', loading, 'error:', error, 'dataSource:', dataSource);
  }, [activeStocks, loading, error, dataSource]);

  // Simulate real-time market data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev: any) => ({
        nifty50: prev.nifty50 + (Math.random() - 0.5) * 20,
        niftyChange: prev.niftyChange + (Math.random() - 0.5) * 0.1,
        vix: Math.max(10, Math.min(25, prev.vix + (Math.random() - 0.5) * 0.5)),
        fiiFlow: prev.fiiFlow + (Math.random() - 0.5) * 50
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedStocks = useMemo(() => {
    try {
      const sorted = [...filteredStocks];
      sorted.sort((a, b) => {
        let aVal: any, bVal: any;

        switch (sortColumn) {
          case 'symbol':
            aVal = a.symbol;
            bVal = b.symbol;
            break;
          case 'price':
            aVal = a.price;
            bVal = b.price;
            break;
          case 'change':
            aVal = a.changePercent;
            bVal = b.changePercent;
            break;
          case 'pe':
            aVal = a.fundamental?.pe || 0;
            bVal = b.fundamental?.pe || 0;
            break;
          case 'roe':
            aVal = a.fundamental?.roe || 0;
            bVal = b.fundamental?.roe || 0;
            break;
          case 'rsi':
            aVal = a.technical?.rsi14 || 0;
            bVal = b.technical?.rsi14 || 0;
            break;
          case 'pcr':
            aVal = a.sentiment?.optionsPCR || 0;
            bVal = b.sentiment?.optionsPCR || 0;
            break;
          case 'fii':
            aVal = a.macro?.fiiNetBuySell || 0;
            bVal = b.macro?.fiiNetBuySell || 0;
            break;
          case 'score':
            aVal = calculateStockScore(a).overall;
            bVal = calculateStockScore(b).overall;
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      return sorted;
    } catch (error) {
      console.error('Error sorting stocks:', error);
      return filteredStocks;
    }
  }, [filteredStocks, sortColumn, sortDirection]);

  const avgScore = useMemo(() => {
    try {
      if (sortedStocks.length === 0) return 0;
      return sortedStocks.reduce((sum: number, stock: Stock) => sum + calculateStockScore(stock).overall, 0) / sortedStocks.length;
    } catch (error) {
      console.error('Error calculating avg score:', error);
      return 0;
    }
  }, [sortedStocks]);

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div style={styles.marketItem}>
            <span style={styles.marketLabel}>NIFTY 50</span>
            <span style={styles.marketValue}>{marketData.nifty50.toFixed(2)}</span>
            <span style={{
              ...styles.marketChange,
              color: marketData.niftyChange >= 0 ? '#00ff41' : '#ff4136'
            }}>
              {marketData.niftyChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(marketData.niftyChange).toFixed(2)}%
            </span>
          </div>
          <div style={styles.separator} />
          <div style={styles.marketItem}>
            <span style={styles.marketLabel}>INDIA VIX</span>
            <span style={styles.marketValue}>{marketData.vix.toFixed(2)}</span>
            <span style={{
              ...styles.marketBadge,
              background: marketData.vix < 15 ? 'rgba(0,255,65,0.15)' : marketData.vix > 20 ? 'rgba(255,65,54,0.15)' : 'rgba(240,180,41,0.15)',
              color: marketData.vix < 15 ? '#00ff41' : marketData.vix > 20 ? '#ff4136' : '#F0B429'
            }}>
              {marketData.vix < 15 ? 'CALM' : marketData.vix > 20 ? 'FEAR' : 'NEUTRAL'}
            </span>
          </div>
          <div style={styles.separator} />
          <div style={styles.marketItem}>
            <span style={styles.marketLabel}>FII FLOW</span>
            <span style={{
              ...styles.marketValue,
              color: marketData.fiiFlow >= 0 ? '#00ff41' : '#ff4136'
            }}>
              ₹{Math.abs(marketData.fiiFlow).toFixed(0)} Cr
            </span>
            <span style={styles.marketLabel}>{marketData.fiiFlow >= 0 ? 'NET BUY' : 'NET SELL'}</span>
          </div>
        </div>
        <div style={styles.topBarRight}>
          {/* Data Source Toggle */}
          <div style={styles.dataSourceToggle}>
            <button
              onClick={() => setDataSource('simulated')}
              style={dataSource === 'simulated' ? styles.toggleButtonActive : styles.toggleButton}
            >
              <Database size={12} />
              MOCK
            </button>
            <button
              onClick={() => setDataSource('real')}
              style={dataSource === 'real' ? styles.toggleButtonActive : styles.toggleButton}
            >
              <Zap size={12} />
              LIVE
            </button>
          </div>

          <div style={styles.statsItem}>
            <Activity size={14} />
            <span>{sortedStocks.length} QUALIFIED</span>
          </div>
          <div style={styles.statsItem}>
            <span style={styles.scoreLabel}>AVG SCORE</span>
            <span style={{
              ...styles.scoreValue,
              color: avgScore >= 70 ? '#00ff41' : avgScore >= 50 ? '#F0B429' : '#ff4136'
            }}>
              {avgScore.toFixed(0)}
            </span>
          </div>
          {dataSource === 'real' && (
            <button 
              style={{...styles.refreshButton, opacity: loading ? 0.6 : 1}}
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              REFRESH
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <AdvancedFilterSidebar filters={filters} onFilterChange={setFilters} />
        <div style={styles.content}>
          {loading && activeStocks.length === 0 ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner} />
              <div style={styles.loadingText}>LOADING MARKET DATA...</div>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <div style={styles.errorTitle}>CONNECTION ERROR</div>
              <div style={styles.errorText}>{error}</div>
              <div style={styles.errorHint}>
                This may be due to network restrictions or proxy settings. Please try using MOCK data mode or check your connection.
              </div>
            </div>
          ) : sortedStocks.length === 0 && activeStocks.length > 0 ? (
            <div style={styles.noResultsContainer}>
              <div style={styles.noResultsText}>NO STOCKS MATCH YOUR FILTER CRITERIA</div>
              <div style={styles.noResultsHint}>Try adjusting your filters or reset to default</div>
            </div>
          ) : (
            <AdvancedStockTable
              stocks={sortedStocks}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onStockClick={setSelectedStock}
            />
          )}
        </div>
      </div>

      {/* Stock Detail Panel */}
      <StockDetailPanel stock={selectedStock} onClose={() => setSelectedStock(null)} />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    height: '100vh',
    background: '#0A0E17',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
  },
  topBar: {
    height: '60px',
    background: 'linear-gradient(180deg, #0d1117 0%, #0A0E17 100%)',
    borderBottom: '2px solid #F0B429',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    flexShrink: 0,
  },
  topBarLeft: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  topBarRight: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  marketItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  marketLabel: {
    color: '#8b949e',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  marketValue: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'Consolas, Monaco, monospace',
  },
  marketChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: 'Consolas, Monaco, monospace',
  },
  marketBadge: {
    padding: '4px 8px',
    borderRadius: '3px',
    fontSize: '9px',
    fontWeight: 'bold',
  },
  separator: {
    width: '1px',
    height: '30px',
    background: '#30363d',
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#F0B429',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  dataSourceToggle: {
    display: 'flex',
    gap: '4px',
    background: '#161b22',
    borderRadius: '4px',
    padding: '4px',
    border: '1px solid #30363d',
  },
  toggleButton: {
    background: 'transparent',
    border: 'none',
    color: '#8b949e',
    padding: '6px 10px',
    borderRadius: '3px',
    fontSize: '9px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  },
  toggleButtonActive: {
    background: '#F0B429',
    border: 'none',
    color: '#0A0E17',
    padding: '6px 10px',
    borderRadius: '3px',
    fontSize: '9px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  },
  scoreLabel: {
    color: '#8b949e',
    fontSize: '10px',
  },
  scoreValue: {
    fontSize: '16px',
    fontFamily: 'Consolas, Monaco, monospace',
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid #F0B429',
    borderRadius: '4px',
    color: '#F0B429',
    fontSize: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflow: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '20px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #30363d',
    borderTop: '3px solid #F0B429',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#F0B429',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '16px',
    padding: '40px',
  },
  errorTitle: {
    color: '#ff4136',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  errorText: {
    color: '#ff8800',
    fontSize: '14px',
    textAlign: 'center',
    maxWidth: '600px',
  },
  errorHint: {
    color: '#8b949e',
    fontSize: '12px',
    textAlign: 'center',
    maxWidth: '600px',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  noResultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '12px',
  },
  noResultsText: {
    color: '#F0B429',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  noResultsHint: {
    color: '#8b949e',
    fontSize: '12px',
  },
};

export default AdvancedScanner;
