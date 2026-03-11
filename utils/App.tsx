import React, { useState, useEffect } from 'react';
import FilterPanel from './components/FilterPanel';
import StockTable from './components/StockTable';
import MarketSummary from './components/MarketSummary';
import SectorHeatmap from './components/SectorHeatmap';
import AdvancedScanner from './pages/AdvancedScanner';
import StockDetailPanel from './components/StockDetailPanel';
import Watchlist from './components/Watchlist';
import CompareView from './components/CompareView';
import { mockStocks } from './data/mockData';
import { useStockFilter, getDefaultFilters } from './hooks/useStockFilter';
import { useRealTimeData } from './hooks/useRealTimeData';
import { FilterState, Stock } from './types';
import { BarChart3, RefreshCw, Database, Zap, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'basic' | 'advanced'>('basic');
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [dataSource, setDataSource] = useState<'simulated' | 'real'>('simulated');
  const [marketCapFilter, setMarketCapFilter] = useState<('large' | 'mid' | 'small')[]>(['large']);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('stockWatchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    localStorage.setItem('stockWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  const handleToggleCompare = (symbol: string) => {
    if (compareList.includes(symbol)) {
      setCompareList(compareList.filter(s => s !== symbol));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, symbol]);
    }
  };

  const handleRemoveFromCompare = (symbol: string) => {
    setCompareList(compareList.filter(s => s !== symbol));
  };
  
  const { 
    stocks: realStocks, 
    loading, 
    error, 
    lastUpdate, 
    refresh 
  } = useRealTimeData(dataSource, marketCapFilter);
  
  const activeStocks = dataSource === 'simulated' ? mockStocks : realStocks;
  const filteredStocks = useStockFilter(activeStocks, filters);

  const handleReset = () => {
    setFilters(getDefaultFilters());
  };

  const toggleMarketCap = (cap: 'large' | 'mid' | 'small') => {
    setMarketCapFilter(prev => 
      prev.includes(cap) 
        ? prev.filter(c => c !== cap)
        : [...prev, cap]
    );
  };

  // Show Advanced Scanner if selected
  if (currentView === 'advanced') {
    return <AdvancedScanner />;
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <BarChart3 size={24} />
            <h1 style={styles.title}>INDIAN STOCK SCREENER</h1>
          </div>
          <div style={styles.subtitle}>NSE/BSE • 5-DIMENSION ANALYSIS • {activeStocks.length} STOCKS</div>
        </div>
        
        <div style={styles.headerControls}>
          {/* View Switcher */}
          <div style={styles.viewSwitcher}>
            <button
              onClick={() => setCurrentView('basic')}
              style={currentView === 'basic' ? styles.viewButtonActive : styles.viewButton}
            >
              <BarChart3 size={14} />
              BASIC
            </button>
            <button
              onClick={() => setCurrentView('advanced')}
              style={currentView === 'advanced' ? styles.viewButtonActive : styles.viewButton}
            >
              <Activity size={14} />
              INSTITUTIONAL
            </button>
          </div>

          {/* Data Source Toggle */}
          <div style={styles.dataSourceToggle}>
            <button
              onClick={() => setDataSource('simulated')}
              style={dataSource === 'simulated' ? styles.toggleButtonActive : styles.toggleButton}
            >
              <Database size={14} />
              SIMULATED
            </button>
            <button
              onClick={() => setDataSource('real')}
              style={dataSource === 'real' ? styles.toggleButtonActive : styles.toggleButton}
            >
              <Zap size={14} />
              REAL-TIME
            </button>
          </div>

          {/* Market Cap Filter */}
          <div style={styles.marketCapFilter}>
            <button
              onClick={() => toggleMarketCap('large')}
              style={marketCapFilter.includes('large') ? styles.capButtonActive : styles.capButton}
            >
              LARGE CAP
            </button>
            <button
              onClick={() => toggleMarketCap('mid')}
              style={marketCapFilter.includes('mid') ? styles.capButtonActive : styles.capButton}
            >
              MID CAP
            </button>
            <button
              onClick={() => toggleMarketCap('small')}
              style={marketCapFilter.includes('small') ? styles.capButtonActive : styles.capButton}
            >
              SMALL CAP
            </button>
          </div>

          {/* Compare Button */}
          <button
            onClick={() => setShowCompare(true)}
            style={{
              ...styles.compareButton,
              opacity: compareList.length === 0 ? 0.5 : 1
            }}
            disabled={compareList.length === 0}
          >
            <BarChart3 size={14} />
            COMPARE ({compareList.length}/3)
          </button>

          {/* Refresh Button */}
          {dataSource === 'real' && (
            <button
              onClick={refresh}
              disabled={loading}
              style={styles.refreshButton}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              REFRESH
            </button>
          )}

          {/* Timestamp */}
          <div style={styles.timestamp}>
            {lastUpdate 
              ? lastUpdate.toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  timeStyle: 'short'
                }) + ' IST'
              : new Date().toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }) + ' IST'
            }
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.container}>
        {/* Left Sidebar - Filters */}
        <aside style={styles.sidebar}>
          <FilterPanel 
            filters={filters} 
            onFilterChange={setFilters}
            onReset={handleReset}
          />
        </aside>

        {/* Right Content */}
        <main style={styles.main}>
          {loading && (
            <div style={styles.loadingOverlay}>
              <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
              <div style={styles.loadingText}>Loading stock data...</div>
            </div>
          )}
          {error && (
            <div style={styles.errorBanner}>
              <strong>Error:</strong> {error}
            </div>
          )}
          <Watchlist 
            stocks={activeStocks} 
            watchlist={watchlist}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onStockClick={setSelectedStock}
          />
          <MarketSummary stocks={activeStocks} filteredStocks={filteredStocks} />
          <SectorHeatmap stocks={filteredStocks} />
          <StockTable 
            stocks={filteredStocks} 
            onStockClick={setSelectedStock}
            watchlist={watchlist}
            onToggleWatchlist={(symbol) => {
              if (watchlist.includes(symbol)) {
                handleRemoveFromWatchlist(symbol);
              } else {
                handleAddToWatchlist(symbol);
              }
            }}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
          />
        </main>
      </div>

      {/* Stock Detail Panel */}
      <StockDetailPanel stock={selectedStock} onClose={() => setSelectedStock(null)} />

      {/* Footer */}
      <footer style={styles.footer}>
        <div>
          © 2026 Indian Stock Screener • Mock Data for Educational Purposes Only
        </div>
        <div style={styles.footerLinks}>
          <span>Technical</span>
          <span>•</span>
          <span>Fundamental</span>
          <span>•</span>
          <span>Macro</span>
          <span>•</span>
          <span>Micro</span>
          <span>•</span>
          <span>Sentiment</span>
        </div>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0a0e1a',
  },
  header: {
    background: '#0d1117',
    borderBottom: '2px solid #1f6feb',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  viewSwitcher: {
    display: 'flex',
    gap: '4px',
    background: '#161b22',
    borderRadius: '4px',
    padding: '4px',
    border: '1px solid #F0B429',
  },
  viewButton: {
    background: 'transparent',
    border: 'none',
    color: '#8b949e',
    padding: '8px 16px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  viewButtonActive: {
    background: '#F0B429',
    border: 'none',
    color: '#0A0E17',
    padding: '8px 16px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
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
    padding: '6px 12px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  toggleButtonActive: {
    background: '#1f6feb',
    border: 'none',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  marketCapFilter: {
    display: 'flex',
    gap: '4px',
    background: '#161b22',
    borderRadius: '4px',
    padding: '4px',
    border: '1px solid #30363d',
  },
  capButton: {
    background: 'transparent',
    border: 'none',
    color: '#8b949e',
    padding: '6px 10px',
    borderRadius: '3px',
    fontSize: '9px',
    fontWeight: 'bold',
  },
  capButtonActive: {
    background: 'rgba(0, 255, 65, 0.2)',
    border: '1px solid #00ff41',
    color: '#00ff41',
    padding: '6px 10px',
    borderRadius: '3px',
    fontSize: '9px',
    fontWeight: 'bold',
  },
  compareButton: {
    background: 'rgba(240, 180, 41, 0.15)',
    border: '1px solid #f0b429',
    color: '#f0b429',
    padding: '8px 14px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  refreshButton: {
    background: 'rgba(88, 166, 255, 0.15)',
    border: '1px solid #58a6ff',
    color: '#58a6ff',
    padding: '6px 12px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#00ff41',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    margin: 0,
  },
  subtitle: {
    fontSize: '10px',
    color: '#8b949e',
    letterSpacing: '1px',
    paddingLeft: '36px',
  },
  timestamp: {
    fontSize: '11px',
    color: '#58a6ff',
    fontWeight: 'bold',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '20px',
    padding: '20px 24px',
    flex: 1,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  sidebar: {
    position: 'sticky',
    top: '20px',
    height: 'fit-content',
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  footer: {
    background: '#0d1117',
    borderTop: '1px solid #30363d',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '10px',
    color: '#8b949e',
  },
  footerLinks: {
    display: 'flex',
    gap: '8px',
  },
  loadingOverlay: {
    background: 'rgba(13, 17, 23, 0.95)',
    border: '1px solid #30363d',
    borderRadius: '4px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    color: '#58a6ff',
  },
  loadingText: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  errorBanner: {
    background: 'rgba(255, 65, 54, 0.15)',
    border: '1px solid #ff4136',
    borderRadius: '4px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#ff4136',
    fontSize: '12px',
  },
};

// Add keyframe animation for spin
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default App;
