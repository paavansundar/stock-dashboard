import React, { useState } from 'react';
import { Stock } from '../types';
import { Star, X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface WatchlistProps {
  stocks: Stock[];
  watchlist: string[];
  onAddToWatchlist: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onStockClick?: (stock: Stock) => void;
}

const Watchlist = ({ stocks, watchlist, onAddToWatchlist, onRemoveFromWatchlist, onStockClick }: WatchlistProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));

  const getRSIAlert = (rsi: number) => {
    if (rsi >= 70) {
      return { type: 'overbought', color: '#ff4136', icon: <AlertTriangle size={12} />, label: 'OVERBOUGHT' };
    }
    if (rsi <= 30) {
      return { type: 'oversold', color: '#00ff41', icon: <AlertTriangle size={12} />, label: 'OVERSOLD' };
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={styles.headerLeft}>
          <Star size={16} fill="#f0b429" color="#f0b429" />
          <span style={styles.title}>WATCHLIST</span>
          <span style={styles.count}>{watchlistStocks.length}</span>
        </div>
        <div style={styles.headerRight}>
          {watchlistStocks.filter(s => {
            const alert = getRSIAlert(s.technical.rsi14);
            return alert !== null;
          }).length > 0 && (
            <span style={styles.alertBadge}>
              <AlertTriangle size={12} />
              {watchlistStocks.filter(s => {
                const alert = getRSIAlert(s.technical.rsi14);
                return alert !== null;
              }).length} ALERTS
            </span>
          )}
          <span style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {isExpanded && (
        <div style={styles.content}>
          {watchlistStocks.length === 0 ? (
            <div style={styles.empty}>
              <Star size={32} color="#30363d" />
              <div style={styles.emptyText}>No stocks in watchlist</div>
              <div style={styles.emptyHint}>Click the star icon on any stock to add</div>
            </div>
          ) : (
            <div style={styles.list}>
              {watchlistStocks.map(stock => {
                const alert = getRSIAlert(stock.technical.rsi14);
                return (
                  <div 
                    key={stock.symbol} 
                    style={styles.item}
                    onClick={() => onStockClick?.(stock)}
                  >
                    <div style={styles.itemHeader}>
                      <div style={styles.symbolRow}>
                        <span style={styles.symbol}>{stock.symbol}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromWatchlist(stock.symbol);
                          }}
                          style={styles.removeBtn}
                        >
                          <X size={12} />
                        </button>
                      </div>
                      {alert && (
                        <div style={{
                          ...styles.alertTag,
                          background: alert.type === 'overbought' ? 'rgba(255, 65, 54, 0.15)' : 'rgba(0, 255, 65, 0.15)',
                          color: alert.color,
                          border: `1px solid ${alert.color}`
                        }}>
                          {alert.icon}
                          <span>{alert.label}</span>
                        </div>
                      )}
                    </div>

                    <div style={styles.itemDetails}>
                      <div style={styles.priceRow}>
                        <span style={styles.price}>₹{stock.price.toFixed(2)}</span>
                        <span style={{
                          ...styles.change,
                          color: stock.changePercent >= 0 ? '#00ff41' : '#ff4136'
                        }}>
                          {stock.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>

                      <div style={styles.metrics}>
                        <div style={styles.metric}>
                          <span style={styles.metricLabel}>RSI</span>
                          <span style={{
                            ...styles.metricValue,
                            color: stock.technical.rsi14 > 70 ? '#ff4136' : 
                                   stock.technical.rsi14 < 30 ? '#00ff41' : '#8b949e'
                          }}>
                            {stock.technical.rsi14.toFixed(1)}
                          </span>
                        </div>
                        <div style={styles.metric}>
                          <span style={styles.metricLabel}>P/E</span>
                          <span style={styles.metricValue}>{stock.fundamental.pe.toFixed(1)}</span>
                        </div>
                        <div style={styles.metric}>
                          <span style={styles.metricLabel}>VOL</span>
                          <span style={styles.metricValue}>{stock.technical.volumeSpike.toFixed(1)}x</span>
                        </div>
                      </div>

                      <div style={styles.signalRow}>
                        <div style={{
                          ...styles.signal,
                          background: stock.technical.supertrendSignal === 'buy' ? 'rgba(0, 255, 65, 0.15)' :
                                     stock.technical.supertrendSignal === 'sell' ? 'rgba(255, 65, 54, 0.15)' :
                                     'rgba(139, 148, 158, 0.15)',
                          color: stock.technical.supertrendSignal === 'buy' ? '#00ff41' :
                                stock.technical.supertrendSignal === 'sell' ? '#ff4136' : '#8b949e'
                        }}>
                          {stock.technical.supertrendSignal.toUpperCase()}
                        </div>
                        <div style={styles.sector}>{stock.sector}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    background: '#161b22',
    borderBottom: '1px solid #30363d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#f0b429',
    letterSpacing: '0.5px',
  },
  count: {
    fontSize: '10px',
    color: '#8b949e',
    background: '#21262d',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  alertBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#ff4136',
    background: 'rgba(255, 65, 54, 0.15)',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #ff4136',
  },
  expandIcon: {
    fontSize: '10px',
    color: '#8b949e',
  },
  content: {
    maxHeight: '500px',
    overflowY: 'auto',
  },
  empty: {
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  emptyText: {
    fontSize: '13px',
    color: '#8b949e',
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: '11px',
    color: '#6e7681',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    padding: '12px 16px',
    borderBottom: '1px solid #21262d',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  symbolRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  symbol: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#00ff41',
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6e7681',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '3px',
    transition: 'all 0.2s',
  },
  alertTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '8px',
    fontWeight: 'bold',
    padding: '3px 6px',
    borderRadius: '3px',
    letterSpacing: '0.5px',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#c9d1d9',
  },
  change: {
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  metrics: {
    display: 'flex',
    gap: '12px',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  metricLabel: {
    fontSize: '9px',
    color: '#6e7681',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#8b949e',
  },
  signalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signal: {
    fontSize: '9px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '3px',
    letterSpacing: '0.5px',
  },
  sector: {
    fontSize: '9px',
    color: '#58a6ff',
  },
};

export default Watchlist;
