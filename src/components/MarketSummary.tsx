import React from 'react';
import { Stock } from '../types';

interface MarketSummaryProps {
  stocks: Stock[];
  filteredStocks: Stock[];
}

const MarketSummary: React.FC<MarketSummaryProps> = ({ stocks, filteredStocks }) => {
  const avgRSI = filteredStocks.length > 0
    ? (filteredStocks.reduce((sum, s) => sum + s.technical.rsi14, 0) / filteredStocks.length).toFixed(1)
    : '0.0';

  const bullishCount = filteredStocks.filter(s => s.technical.supertrendSignal === 'buy').length;
  const bearishCount = filteredStocks.filter(s => s.technical.supertrendSignal === 'sell').length;

  const avgPCR = filteredStocks.length > 0
    ? (filteredStocks.reduce((sum, s) => sum + s.sentiment.optionsPCR, 0) / filteredStocks.length).toFixed(2)
    : '0.00';

  const positiveNews = filteredStocks.filter(s => s.sentiment.newsSentiment === 'positive').length;
  const totalFII = filteredStocks.reduce((sum, s) => sum + s.macro.fiiNetBuySell, 0).toFixed(0);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardLabel}>FILTERED / TOTAL</div>
        <div style={styles.cardValue}>{filteredStocks.length} / {stocks.length}</div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardLabel}>AVG RSI (14)</div>
        <div style={{
          ...styles.cardValue,
          color: Number(avgRSI) > 70 ? '#ff4136' : Number(avgRSI) < 30 ? '#00ff41' : '#58a6ff'
        }}>
          {avgRSI}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardLabel}>BULLISH / BEARISH</div>
        <div style={styles.cardValue}>
          <span style={{ color: '#00ff41' }}>{bullishCount}</span>
          {' / '}
          <span style={{ color: '#ff4136' }}>{bearishCount}</span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardLabel}>AVG OPTIONS PCR</div>
        <div style={{
          ...styles.cardValue,
          color: Number(avgPCR) > 1.2 ? '#00ff41' : Number(avgPCR) < 0.8 ? '#ff4136' : '#58a6ff'
        }}>
          {avgPCR}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardLabel}>POSITIVE NEWS</div>
        <div style={styles.cardValue}>{positiveNews}</div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardLabel}>TOTAL FII (₹Cr)</div>
        <div style={{
          ...styles.cardValue,
          color: Number(totalFII) >= 0 ? '#00ff41' : '#ff4136'
        }}>
          {Number(totalFII) >= 0 ? '+' : ''}{totalFII}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  card: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '4px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  cardLabel: {
    fontSize: '9px',
    color: '#8b949e',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '18px',
    color: '#58a6ff',
    fontWeight: 'bold',
  },
};

export default MarketSummary;
