import React from 'react';
import { Stock } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockTableProps {
  stocks: Stock[];
}

const StockTable: React.FC<StockTableProps> = ({ stocks }) => {
  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>SYMBOL</th>
              <th style={styles.th}>NAME</th>
              <th style={styles.th}>SECTOR</th>
              <th style={styles.thRight}>PRICE</th>
              <th style={styles.thRight}>CHG %</th>
              <th style={styles.thRight}>RSI(14)</th>
              <th style={styles.thRight}>P/E</th>
              <th style={styles.thRight}>ROE %</th>
              <th style={styles.thRight}>FII(Cr)</th>
              <th style={styles.thRight}>PCR</th>
              <th style={styles.th}>SIGNAL</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={11} style={styles.noData}>
                  NO STOCKS MATCH YOUR CRITERIA
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.symbol} style={styles.row}>
                  <td style={styles.tdSymbol}>{stock.symbol}</td>
                  <td style={styles.td}>{stock.name}</td>
                  <td style={styles.tdSector}>{stock.sector}</td>
                  <td style={styles.tdRight}>₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{
                    ...styles.tdRight,
                    color: stock.changePercent >= 0 ? '#00ff41' : '#ff4136'
                  }}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </td>
                  <td style={{
                    ...styles.tdRight,
                    color: stock.technical.rsi14 > 70 ? '#ff4136' : stock.technical.rsi14 < 30 ? '#00ff41' : '#8b949e'
                  }}>
                    {stock.technical.rsi14.toFixed(1)}
                  </td>
                  <td style={styles.tdRight}>{stock.fundamental.pe.toFixed(1)}</td>
                  <td style={{
                    ...styles.tdRight,
                    color: stock.fundamental.roe > 15 ? '#00ff41' : '#8b949e'
                  }}>
                    {stock.fundamental.roe.toFixed(1)}
                  </td>
                  <td style={{
                    ...styles.tdRight,
                    color: stock.macro.fiiNetBuySell >= 0 ? '#00ff41' : '#ff4136'
                  }}>
                    {stock.macro.fiiNetBuySell >= 0 ? '+' : ''}{stock.macro.fiiNetBuySell.toFixed(0)}
                  </td>
                  <td style={{
                    ...styles.tdRight,
                    color: stock.sentiment.optionsPCR > 1.2 ? '#00ff41' : stock.sentiment.optionsPCR < 0.8 ? '#ff4136' : '#8b949e'
                  }}>
                    {stock.sentiment.optionsPCR.toFixed(2)}
                  </td>
                  <td style={styles.tdSignal}>
                    <div style={{
                      ...styles.signalBadge,
                      background: stock.technical.supertrendSignal === 'buy' ? 'rgba(0, 255, 65, 0.15)' :
                                 stock.technical.supertrendSignal === 'sell' ? 'rgba(255, 65, 54, 0.15)' :
                                 'rgba(139, 148, 158, 0.15)',
                      color: stock.technical.supertrendSignal === 'buy' ? '#00ff41' :
                            stock.technical.supertrendSignal === 'sell' ? '#ff4136' : '#8b949e'
                    }}>
                      {stock.technical.supertrendSignal === 'buy' && <TrendingUp size={12} />}
                      {stock.technical.supertrendSignal === 'sell' && <TrendingDown size={12} />}
                      <span>{stock.technical.supertrendSignal.toUpperCase()}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={styles.footer}>
        SHOWING {stocks.length} STOCK{stocks.length !== 1 ? 'S' : ''}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 300px)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  headerRow: {
    background: '#161b22',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '2px solid #30363d',
    color: '#58a6ff',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  thRight: {
    padding: '12px 16px',
    textAlign: 'right',
    borderBottom: '2px solid #30363d',
    color: '#58a6ff',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  row: {
    borderBottom: '1px solid #21262d',
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '10px 16px',
    color: '#8b949e',
    whiteSpace: 'nowrap',
  },
  tdSymbol: {
    padding: '10px 16px',
    color: '#00ff41',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  tdSector: {
    padding: '10px 16px',
    color: '#58a6ff',
    fontSize: '11px',
    whiteSpace: 'nowrap',
  },
  tdRight: {
    padding: '10px 16px',
    textAlign: 'right',
    color: '#8b949e',
    whiteSpace: 'nowrap',
  },
  tdSignal: {
    padding: '10px 16px',
  },
  signalBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
  },
  noData: {
    padding: '40px',
    textAlign: 'center',
    color: '#8b949e',
    fontSize: '14px',
  },
  footer: {
    padding: '12px 16px',
    background: '#161b22',
    borderTop: '1px solid #30363d',
    color: '#58a6ff',
    fontSize: '11px',
    fontWeight: 'bold',
  },
};

export default StockTable;
