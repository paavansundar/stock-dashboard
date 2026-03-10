import React from 'react';
import { Stock } from '../types';
import { getAllSectors } from '../services/api';

const SECTORS = getAllSectors();

interface SectorHeatmapProps {
  stocks: Stock[];
}

const SectorHeatmap: React.FC<SectorHeatmapProps> = ({ stocks }) => {
  const sectorData = SECTORS.map(sector => {
    const sectorStocks = stocks.filter(s => s.sector === sector);
    if (sectorStocks.length === 0) return null;

    const avgChange = sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) / sectorStocks.length;
    const avgRS = sectorStocks.reduce((sum, s) => sum + s.micro.sectorRelativeStrength, 0) / sectorStocks.length;
    
    return {
      sector,
      avgChange,
      avgRS,
      count: sectorStocks.length,
    };
  }).filter(Boolean);

  return (
    <div style={styles.container}>
      <div style={styles.header}>SECTOR HEATMAP</div>
      <div style={styles.grid}>
        {sectorData.map(data => {
          if (!data) return null;
          
          const intensity = Math.min(Math.abs(data.avgChange) / 3, 1);
          const bgColor = data.avgChange >= 0
            ? `rgba(0, 255, 65, ${0.1 + intensity * 0.3})`
            : `rgba(255, 65, 54, ${0.1 + intensity * 0.3})`;

          return (
            <div
              key={data.sector}
              style={{
                ...styles.cell,
                background: bgColor,
                borderColor: data.avgChange >= 0 ? '#00ff41' : '#ff4136',
              }}
            >
              <div style={styles.sectorName}>{data.sector}</div>
              <div style={{
                ...styles.sectorChange,
                color: data.avgChange >= 0 ? '#00ff41' : '#ff4136'
              }}>
                {data.avgChange >= 0 ? '+' : ''}{data.avgChange.toFixed(2)}%
              </div>
              <div style={styles.sectorRS}>RS: {data.avgRS.toFixed(2)}</div>
              <div style={styles.sectorCount}>{data.count} stocks</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '20px',
  },
  header: {
    fontSize: '11px',
    color: '#58a6ff',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '8px',
  },
  cell: {
    padding: '12px',
    borderRadius: '3px',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    transition: 'transform 0.2s ease',
  },
  sectorName: {
    fontSize: '10px',
    color: '#58a6ff',
    fontWeight: 'bold',
    marginBottom: '2px',
  },
  sectorChange: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  sectorRS: {
    fontSize: '9px',
    color: '#8b949e',
  },
  sectorCount: {
    fontSize: '8px',
    color: '#8b949e',
  },
};

export default SectorHeatmap;
