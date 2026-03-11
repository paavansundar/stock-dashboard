import { X } from 'lucide-react';
import { Stock } from '../types';
import { calculateStockScore } from '../utils/scoring';

interface StockDetailPanelProps {
  stock: Stock | null;
  onClose: () => void;
}

const StockDetailPanel = ({ stock, onClose }: StockDetailPanelProps) => {
  if (!stock) return null;

  const scores = calculateStockScore(stock);

  // Radar chart data points for 5 dimensions
  const radarData = [
    { label: 'Technical', value: scores.technical, max: 25 },
    { label: 'Fundamental', value: scores.fundamental, max: 25 },
    { label: 'Macro', value: scores.macro, max: 20 },
    { label: 'Micro', value: scores.micro, max: 15 },
    { label: 'Sentiment', value: scores.sentiment, max: 15 },
  ];

  // Generate SVG radar chart
  const generateRadarChart = () => {
    const centerX = 120;
    const centerY = 120;
    const radius = 100;
    const points = radarData.length;

    // Calculate polygon points
    const dataPoints = radarData.map((item, index) => {
      const angle = (Math.PI * 2 * index) / points - Math.PI / 2;
      const percentage = item.value / item.max;
      const x = centerX + radius * percentage * Math.cos(angle);
      const y = centerY + radius * percentage * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    // Calculate max polygon points (outer boundary)
    const maxPoints = radarData.map((item, index) => {
      const angle = (Math.PI * 2 * index) / points - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    // Calculate label positions
    const labels = radarData.map((item, index) => {
      const angle = (Math.PI * 2 * index) / points - Math.PI / 2;
      const labelRadius = radius + 25;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      return { ...item, x, y };
    });

    return (
      <svg width="240" height="240" style={{ margin: '0 auto', display: 'block' }}>
        {/* Grid circles */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
          <circle
            key={scale}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            fill="none"
            stroke="#30363d"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {radarData.map((_, index) => {
          const angle = (Math.PI * 2 * index) / points - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#30363d"
              strokeWidth="1"
            />
          );
        })}

        {/* Max polygon (outline) */}
        <polygon
          points={maxPoints}
          fill="rgba(88, 166, 255, 0.05)"
          stroke="#30363d"
          strokeWidth="1"
        />

        {/* Data polygon */}
        <polygon
          points={dataPoints}
          fill="rgba(0, 255, 65, 0.2)"
          stroke="#00ff41"
          strokeWidth="2"
        />

        {/* Data points */}
        {labels.map((item, index) => {
          const angle = (Math.PI * 2 * index) / points - Math.PI / 2;
          const percentage = item.value / item.max;
          const x = centerX + radius * percentage * Math.cos(angle);
          const y = centerY + radius * percentage * Math.sin(angle);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#00ff41"
              stroke="#0d1117"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {labels.map((item, index) => (
          <text
            key={index}
            x={item.x}
            y={item.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#58a6ff"
            fontSize="11"
            fontWeight="bold"
          >
            {item.label}
          </text>
        ))}

        {/* Score values */}
        {labels.map((item, index) => (
          <text
            key={`val-${index}`}
            x={item.x}
            y={item.y + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#00ff41"
            fontSize="10"
          >
            {item.value.toFixed(0)}/{item.max}
          </text>
        ))}
      </svg>
    );
  };

  // Generate mini price sparkline (simplified)
  const generateSparkline = (trend: 'up' | 'down' | 'neutral') => {
    const width = 120;
    const height = 40;
    const points = 20;
    
    // Generate random walk data based on trend
    let value = 50;
    const data: number[] = [];
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.5) * 10;
      const trendBias = trend === 'up' ? 2 : trend === 'down' ? -2 : 0;
      value = Math.max(10, Math.min(90, value + change + trendBias));
      data.push(value);
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const pathData = data
      .map((val, i) => {
        const x = (i / (points - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
      })
      .join(' ');

    const color = trend === 'up' ? '#00ff41' : trend === 'down' ? '#ff4136' : '#58a6ff';

    return (
      <svg width={width} height={height}>
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const trend = stock.changePercent >= 0 ? 'up' : 'down';

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.symbol}>{stock.symbol}</div>
            <div style={styles.name}>{stock.name}</div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Price Info */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>PRICE</div>
            <div style={styles.priceBox}>
              <div style={styles.price}>₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div style={{
                ...styles.change,
                color: stock.changePercent >= 0 ? '#00ff41' : '#ff4136'
              }}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
            </div>
            <div style={styles.sparklineBox}>
              {generateSparkline(trend)}
            </div>
          </div>

          {/* Overall Score */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>OVERALL SCORE</div>
            <div style={styles.scoreCircle}>
              <div style={styles.scoreValue}>{scores.overall.toFixed(0)}</div>
              <div style={styles.scoreMax}>/100</div>
            </div>
          </div>

          {/* Radar Chart */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>5-DIMENSION ANALYSIS</div>
            {generateRadarChart()}
          </div>

          {/* Score Breakdown */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>SCORE BREAKDOWN</div>
            <div style={styles.scoreGrid}>
              <div style={styles.scoreItem}>
                <div style={styles.scoreLabel}>Technical</div>
                <div style={styles.scoreBar}>
                  <div style={{
                    ...styles.scoreBarFill,
                    width: `${(scores.technical / 25) * 100}%`,
                    background: '#00ff41'
                  }} />
                </div>
                <div style={styles.scoreText}>{scores.technical.toFixed(1)}/25</div>
              </div>
              <div style={styles.scoreItem}>
                <div style={styles.scoreLabel}>Fundamental</div>
                <div style={styles.scoreBar}>
                  <div style={{
                    ...styles.scoreBarFill,
                    width: `${(scores.fundamental / 25) * 100}%`,
                    background: '#58a6ff'
                  }} />
                </div>
                <div style={styles.scoreText}>{scores.fundamental.toFixed(1)}/25</div>
              </div>
              <div style={styles.scoreItem}>
                <div style={styles.scoreLabel}>Macro</div>
                <div style={styles.scoreBar}>
                  <div style={{
                    ...styles.scoreBarFill,
                    width: `${(scores.macro / 20) * 100}%`,
                    background: '#f0b429'
                  }} />
                </div>
                <div style={styles.scoreText}>{scores.macro.toFixed(1)}/20</div>
              </div>
              <div style={styles.scoreItem}>
                <div style={styles.scoreLabel}>Micro</div>
                <div style={styles.scoreBar}>
                  <div style={{
                    ...styles.scoreBarFill,
                    width: `${(scores.micro / 15) * 100}%`,
                    background: '#ff7b72'
                  }} />
                </div>
                <div style={styles.scoreText}>{scores.micro.toFixed(1)}/15</div>
              </div>
              <div style={styles.scoreItem}>
                <div style={styles.scoreLabel}>Sentiment</div>
                <div style={styles.scoreBar}>
                  <div style={{
                    ...styles.scoreBarFill,
                    width: `${(scores.sentiment / 15) * 100}%`,
                    background: '#a371f7'
                  }} />
                </div>
                <div style={styles.scoreText}>{scores.sentiment.toFixed(1)}/15</div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>KEY METRICS</div>
            <div style={styles.metricsGrid}>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>RSI(14)</div>
                <div style={styles.metricValue}>{stock.technical?.rsi14?.toFixed(1) || 'N/A'}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>P/E Ratio</div>
                <div style={styles.metricValue}>{stock.fundamental?.pe?.toFixed(1) || 'N/A'}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>ROE %</div>
                <div style={styles.metricValue}>{stock.fundamental?.roe?.toFixed(1) || 'N/A'}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>FII Flow (Cr)</div>
                <div style={styles.metricValue}>{stock.macro?.fiiNetBuySell?.toFixed(0) || 'N/A'}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>PCR</div>
                <div style={styles.metricValue}>{stock.sentiment?.optionsPCR?.toFixed(2) || 'N/A'}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Supertrend</div>
                <div style={styles.metricValue}>{stock.technical?.supertrendSignal?.toUpperCase() || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  panel: {
    width: '400px',
    background: '#0d1117',
    borderLeft: '1px solid #30363d',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #30363d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'sticky',
    top: 0,
    background: '#0d1117',
    zIndex: 10,
  },
  symbol: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00ff41',
    marginBottom: '4px',
  },
  name: {
    fontSize: '12px',
    color: '#8b949e',
  },
  closeBtn: {
    background: 'transparent',
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
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#58a6ff',
    letterSpacing: '0.5px',
  },
  priceBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#c9d1d9',
  },
  change: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  sparklineBox: {
    padding: '8px',
    background: '#161b22',
    borderRadius: '4px',
    border: '1px solid #30363d',
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(88, 166, 255, 0.1))',
    border: '3px solid #00ff41',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  scoreValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#00ff41',
  },
  scoreMax: {
    fontSize: '14px',
    color: '#8b949e',
  },
  scoreGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  scoreItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  scoreLabel: {
    width: '90px',
    fontSize: '11px',
    color: '#8b949e',
  },
  scoreBar: {
    flex: 1,
    height: '20px',
    background: '#161b22',
    borderRadius: '4px',
    border: '1px solid #30363d',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    transition: 'width 0.6s ease',
  },
  scoreText: {
    width: '50px',
    textAlign: 'right',
    fontSize: '11px',
    color: '#c9d1d9',
    fontWeight: 'bold',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  metric: {
    padding: '12px',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '4px',
  },
  metricLabel: {
    fontSize: '10px',
    color: '#8b949e',
    marginBottom: '6px',
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#c9d1d9',
  },
};

export default StockDetailPanel;
