import React from 'react';
import { Stock } from '../types';
import { calculateStockScore } from '../utils/scoring';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

interface CompareViewProps {
  stocks: Stock[];
  compareList: string[];
  onRemoveFromCompare: (symbol: string) => void;
  onClose: () => void;
}

const CompareView: React.FC<CompareViewProps> = ({ 
  stocks, 
  compareList, 
  onRemoveFromCompare,
  onClose 
}) => {
  const compareStocks = stocks.filter(s => compareList.includes(s.symbol));

  const renderRadarChart = (scores: any) => {
    const dimensions = [
      { label: 'Tech', value: scores.technical, angle: 0 },
      { label: 'Fund', value: scores.fundamental, angle: 72 },
      { label: 'Macro', value: scores.macro, angle: 144 },
      { label: 'Micro', value: scores.micro, angle: 216 },
      { label: 'Sent', value: scores.sentiment, angle: 288 },
    ];

    const points = dimensions.map(d => {
      const angle = (d.angle - 90) * (Math.PI / 180);
      const radius = (d.value / 100) * 45;
      return {
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
      };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    return (
      <svg viewBox="0 0 100 100" style={{ width: '140px', height: '140px' }}>
        {/* Grid circles */}
        {[20, 40, 60, 80, 100].map(pct => (
          <circle
            key={pct}
            cx="50"
            cy="50"
            r={(pct / 100) * 45}
            fill="none"
            stroke="#30363d"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Axes */}
        {dimensions.map(d => {
          const angle = (d.angle - 90) * (Math.PI / 180);
          const x2 = 50 + 45 * Math.cos(angle);
          const y2 = 50 + 45 * Math.sin(angle);
          return (
            <line
              key={d.label}
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke="#30363d"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={pathData}
          fill="#f0b429"
          fillOpacity="0.3"
          stroke="#f0b429"
          strokeWidth="1.5"
        />

        {/* Labels */}
        {dimensions.map(d => {
          const angle = (d.angle - 90) * (Math.PI / 180);
          const x = 50 + 52 * Math.cos(angle);
          const y = 50 + 52 * Math.sin(angle);
          return (
            <text
              key={d.label}
              x={x}
              y={y}
              fontSize="6"
              fill="#8b949e"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#3fb950';
    if (score >= 50) return '#f0b429';
    return '#f85149';
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            STOCK COMPARISON ({compareStocks.length}/3)
          </h2>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {compareStocks.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No stocks selected for comparison</p>
            <p style={styles.emptyHint}>
              Click the compare checkbox (☐) on up to 3 stocks to compare them side-by-side
            </p>
          </div>
        ) : (
          <div style={styles.compareGrid}>
            {compareStocks.map(stock => {
              const scores = calculateStockScore(stock);
              const isPositive = stock.changePercent >= 0;

              return (
                <div key={stock.symbol} style={styles.compareCard}>
                  {/* Header */}
                  <div style={styles.cardHeader}>
                    <div>
                      <div style={styles.cardSymbol}>{stock.symbol}</div>
                      <div style={styles.cardName}>{stock.name}</div>
                      <div style={styles.cardSector}>{stock.sector}</div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCompare(stock.symbol)}
                      style={styles.removeButton}
                      title="Remove from comparison"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Price */}
                  <div style={styles.priceSection}>
                    <div style={styles.price}>₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div style={{
                      ...styles.change,
                      color: isPositive ? '#3fb950' : '#f85149'
                    }}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div style={styles.overallScore}>
                    <div style={styles.scoreLabel}>OVERALL SCORE</div>
                    <div style={{
                      ...styles.scoreBig,
                      color: getScoreColor(scores.overall)
                    }}>
                      {scores.overall.toFixed(0)}
                      <span style={styles.scoreMax}>/100</span>
                    </div>
                  </div>

                  {/* Radar Chart */}
                  <div style={styles.radarContainer}>
                    {renderRadarChart(scores)}
                  </div>

                  {/* Dimension Scores */}
                  <div style={styles.dimensionScores}>
                    {[
                      { label: 'Technical', value: scores.technical },
                      { label: 'Fundamental', value: scores.fundamental },
                      { label: 'Macro', value: scores.macro },
                      { label: 'Micro', value: scores.micro },
                      { label: 'Sentiment', value: scores.sentiment },
                    ].map(dim => (
                      <div key={dim.label} style={styles.dimensionRow}>
                        <span style={styles.dimLabel}>{dim.label}</span>
                        <div style={styles.dimBar}>
                          <div
                            style={{
                              ...styles.dimBarFill,
                              width: `${dim.value}%`,
                              backgroundColor: getScoreColor(dim.value)
                            }}
                          />
                        </div>
                        <span style={styles.dimValue}>{dim.value.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Metrics */}
                  <div style={styles.metricsGrid}>
                    <div style={styles.metricItem}>
                      <div style={styles.metricLabel}>RSI</div>
                      <div style={styles.metricValue}>{stock.technical.rsi14.toFixed(1)}</div>
                    </div>
                    <div style={styles.metricItem}>
                      <div style={styles.metricLabel}>P/E</div>
                      <div style={styles.metricValue}>{stock.fundamental.pe.toFixed(1)}</div>
                    </div>
                    <div style={styles.metricItem}>
                      <div style={styles.metricLabel}>ROE</div>
                      <div style={styles.metricValue}>{stock.fundamental.roe.toFixed(1)}%</div>
                    </div>
                    <div style={styles.metricItem}>
                      <div style={styles.metricLabel}>P/B</div>
                      <div style={styles.metricValue}>{stock.fundamental.pb.toFixed(1)}</div>
                    </div>
                    <div style={styles.metricItem}>
                      <div style={styles.metricLabel}>PCR</div>
                      <div style={styles.metricValue}>{stock.sentiment.optionsPCR.toFixed(2)}</div>
                    </div>
                    <div style={styles.metricItem}>
                      <div style={styles.metricLabel}>FII</div>
                      <div style={{
                        ...styles.metricValue,
                        color: stock.macro.fiiNetBuySell >= 0 ? '#3fb950' : '#f85149'
                      }}>
                        {stock.macro.fiiNetBuySell >= 0 ? '+' : ''}{stock.macro.fiiNetBuySell.toFixed(0)}
                      </div>
                    </div>
                  </div>

                  {/* Signals */}
                  <div style={styles.signals}>
                    <div style={styles.signalBadge}>
                      MACD: {stock.technical.macdSignal.toUpperCase()}
                    </div>
                    <div style={styles.signalBadge}>
                      FOI: {stock.sentiment.foiBuildup.toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
    maxWidth: '1400px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #30363d',
    position: 'sticky',
    top: 0,
    backgroundColor: '#0d1117',
    zIndex: 10,
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#f0b429',
    letterSpacing: '0.5px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#8b949e',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  emptyState: {
    padding: '80px 24px',
    textAlign: 'center',
    color: '#8b949e',
  },
  emptyHint: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#6e7681',
  },
  compareGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '20px',
    padding: '24px',
  },
  compareCard: {
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '8px',
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  cardSymbol: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f0b429',
    letterSpacing: '0.5px',
  },
  cardName: {
    fontSize: '13px',
    color: '#c9d1d9',
    marginTop: '4px',
    lineHeight: '1.3',
  },
  cardSector: {
    fontSize: '11px',
    color: '#6e7681',
    marginTop: '4px',
  },
  removeButton: {
    background: '#21262d',
    border: '1px solid #30363d',
    color: '#8b949e',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  priceSection: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #21262d',
  },
  price: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#c9d1d9',
    marginBottom: '6px',
  },
  change: {
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  overallScore: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: '11px',
    color: '#6e7681',
    fontWeight: '600',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  scoreBig: {
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '1',
  },
  scoreMax: {
    fontSize: '20px',
    color: '#6e7681',
    fontWeight: '400',
  },
  radarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  dimensionScores: {
    marginBottom: '20px',
  },
  dimensionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  dimLabel: {
    fontSize: '12px',
    color: '#8b949e',
    width: '90px',
    flexShrink: 0,
  },
  dimBar: {
    flex: 1,
    height: '8px',
    backgroundColor: '#21262d',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  dimBarFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  dimValue: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#c9d1d9',
    width: '30px',
    textAlign: 'right',
    flexShrink: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #21262d',
  },
  metricItem: {
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: '10px',
    color: '#6e7681',
    fontWeight: '600',
    marginBottom: '4px',
    letterSpacing: '0.5px',
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#c9d1d9',
  },
  signals: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  signalBadge: {
    fontSize: '10px',
    padding: '4px 10px',
    backgroundColor: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '12px',
    color: '#8b949e',
    fontWeight: '600',
    letterSpacing: '0.3px',
  },
};

export default CompareView;
