import React from 'react';
import { Stock } from '../types';
import { calculateStockScore, getScoreColor, getRatingColor } from '../utils/scoring';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AdvancedStockTableProps {
  stocks: Stock[];
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

const AdvancedStockTable = ({ 
  stocks, 
  onSort, 
  sortColumn, 
  sortDirection 
}: AdvancedStockTableProps) => {
  const formatMarketCap = (price: number): string => {
    // Simplified market cap estimation based on price
    const cap = price * 500; // Rough estimation
    if (cap >= 20000) return 'Large Cap';
    if (cap >= 5000) return 'Mid Cap';
    return 'Small Cap';
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th} onClick={() => onSort('symbol')}>
                SYMBOL {renderSortIcon('symbol')}
              </th>
              <th style={styles.thRight} onClick={() => onSort('price')}>
                CMP (₹) {renderSortIcon('price')}
              </th>
              <th style={styles.thRight} onClick={() => onSort('change')}>
                CHANGE% {renderSortIcon('change')}
              </th>
              <th style={styles.th} onClick={() => onSort('marketCap')}>
                MKT CAP {renderSortIcon('marketCap')}
              </th>
              <th style={styles.thRight} onClick={() => onSort('pe')}>
                P/E {renderSortIcon('pe')}
              </th>
              <th style={styles.thRight} onClick={() => onSort('roe')}>
                ROE% {renderSortIcon('roe')}
              </th>
              <th style={styles.thRight} onClick={() => onSort('rsi')}>
                RSI {renderSortIcon('rsi')}
              </th>
              <th style={styles.th} onClick={() => onSort('macd')}>
                MACD {renderSortIcon('macd')}
              </th>
              <th style={styles.th} onClick={() => onSort('supertrend')}>
                SUPERTREND {renderSortIcon('supertrend')}
              </th>
              <th style={styles.thRight} onClick={() => onSort('pcr')}>
                PCR {renderSortIcon('pcr')}
              </th>
              <th style={styles.thRight} onClick={() => onSort('fii')}>
                FII FLOW {renderSortIcon('fii')}
              </th>
              <th style={styles.th} onClick={() => onSort('analyst')}>
                ANALYST {renderSortIcon('analyst')}
              </th>
              <th style={styles.thRight} onClick={() => onSort('score')}>
                SCORE {renderSortIcon('score')}
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={13} style={styles.noData}>
                  NO STOCKS MATCH YOUR CRITERIA
                </td>
              </tr>
            ) : (
              stocks.map((stock) => {
                const score = calculateStockScore(stock);
                const scoreColor = getScoreColor(score.overall);
                const ratingColor = getRatingColor(score.rating);

                return (
                  <tr key={stock.symbol} style={styles.row}>
                    <td style={styles.tdSymbol}>{stock.symbol}</td>
                    <td style={styles.tdPrice}>₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{
                      ...styles.tdRight,
                      color: stock.changePercent >= 0 ? '#00ff41' : '#ff4136',
                      fontWeight: 'bold'
                    }}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td style={styles.tdCap}>{formatMarketCap(stock.price)}</td>
                    <td style={styles.tdRight}>{stock.fundamental.pe.toFixed(1)}</td>
                    <td style={{
                      ...styles.tdRight,
                      color: stock.fundamental.roe > 15 ? '#00ff41' : '#F0B429'
                    }}>
                      {stock.fundamental.roe.toFixed(1)}%
                    </td>
                    <td style={{
                      ...styles.tdRight,
                      color: stock.technical.rsi14 > 70 ? '#ff4136' : 
                             stock.technical.rsi14 < 30 ? '#00ff41' : '#F0B429'
                    }}>
                      {stock.technical.rsi14.toFixed(0)}
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={{
                        ...styles.badge,
                        background: stock.technical.macdSignal === 'bullish' ? 'rgba(0, 255, 65, 0.15)' : 
                                   stock.technical.macdSignal === 'bearish' ? 'rgba(255, 65, 54, 0.15)' : 
                                   'rgba(240, 180, 41, 0.15)',
                        color: stock.technical.macdSignal === 'bullish' ? '#00ff41' : 
                              stock.technical.macdSignal === 'bearish' ? '#ff4136' : '#F0B429'
                      }}>
                        {stock.technical.macdSignal === 'bullish' && <TrendingUp size={10} />}
                        {stock.technical.macdSignal === 'bearish' && <TrendingDown size={10} />}
                        {stock.technical.macdSignal === 'neutral' && <Minus size={10} />}
                      </div>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={{
                        ...styles.badge,
                        background: stock.technical.supertrendSignal === 'buy' ? 'rgba(0, 255, 65, 0.15)' : 
                                   stock.technical.supertrendSignal === 'sell' ? 'rgba(255, 65, 54, 0.15)' : 
                                   'rgba(240, 180, 41, 0.15)',
                        color: stock.technical.supertrendSignal === 'buy' ? '#00ff41' : 
                              stock.technical.supertrendSignal === 'sell' ? '#ff4136' : '#F0B429'
                      }}>
                        {stock.technical.supertrendSignal.toUpperCase()}
                      </div>
                    </td>
                    <td style={{
                      ...styles.tdRight,
                      color: stock.sentiment.optionsPCR > 1.2 ? '#00ff41' : '#F0B429'
                    }}>
                      {stock.sentiment.optionsPCR.toFixed(2)}
                    </td>
                    <td style={{
                      ...styles.tdRight,
                      color: stock.macro.fiiNetBuySell >= 0 ? '#00ff41' : '#ff4136'
                    }}>
                      {stock.macro.fiiNetBuySell >= 0 ? '+' : ''}{stock.macro.fiiNetBuySell.toFixed(0)}
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={{
                        ...styles.badge,
                        background: `${ratingColor}22`,
                        color: ratingColor
                      }}>
                        {score.rating.toUpperCase()}
                      </div>
                    </td>
                    <td style={styles.tdScore}>
                      <div style={styles.scoreContainer}>
                        <div style={{
                          ...styles.scoreBar,
                          width: `${score.overall}%`,
                          background: `linear-gradient(90deg, ${scoreColor}22 0%, ${scoreColor} 100%)`
                        }} />
                        <span style={{ ...styles.scoreText, color: scoreColor }}>
                          {score.overall}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div style={styles.footer}>
        SHOWING {stocks.length} STOCK{stocks.length !== 1 ? 'S' : ''} • COMPOSITE SCORING: TECH(25) + FUND(25) + MACRO(20) + MICRO(15) + SENT(15) = 100
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: '#0d1117',
    border: '1px solid #F0B429',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 280px)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '11px',
    fontFamily: 'Consolas, Monaco, monospace',
  },
  headerRow: {
    background: '#161b22',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  th: {
    padding: '14px 12px',
    textAlign: 'left',
    borderBottom: '2px solid #F0B429',
    color: '#F0B429',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  },
  thRight: {
    padding: '14px 12px',
    textAlign: 'right',
    borderBottom: '2px solid #F0B429',
    color: '#F0B429',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  },
  row: {
    borderBottom: '1px solid #21262d',
    transition: 'background 0.15s ease',
  },
  tdSymbol: {
    padding: '12px',
    color: '#00ff41',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  tdPrice: {
    padding: '12px',
    textAlign: 'right',
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'Consolas, Monaco, monospace',
    whiteSpace: 'nowrap',
  },
  tdRight: {
    padding: '12px',
    textAlign: 'right',
    color: '#8b949e',
    fontFamily: 'Consolas, Monaco, monospace',
    whiteSpace: 'nowrap',
  },
  tdCenter: {
    padding: '12px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  tdCap: {
    padding: '12px',
    color: '#58a6ff',
    fontSize: '10px',
    whiteSpace: 'nowrap',
  },
  tdScore: {
    padding: '12px',
    whiteSpace: 'nowrap',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '3px',
    fontSize: '9px',
    fontWeight: 'bold',
  },
  scoreContainer: {
    position: 'relative',
    width: '80px',
    height: '24px',
    background: '#0A0E17',
    borderRadius: '3px',
    overflow: 'hidden',
    border: '1px solid #30363d',
  },
  scoreBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  scoreText: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontWeight: 'bold',
    fontSize: '11px',
    fontFamily: 'Consolas, Monaco, monospace',
    textShadow: '0 0 4px rgba(0,0,0,0.8)',
  },
  noData: {
    padding: '40px',
    textAlign: 'center',
    color: '#8b949e',
    fontSize: '14px',
  },
  footer: {
    padding: '12px 16px',
    background: '#0A0E17',
    borderTop: '1px solid #F0B429',
    color: '#F0B429',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
};

export default AdvancedStockTable;
