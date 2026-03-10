import React from 'react';
import { FilterState } from '../types';
import { getAllSectors } from '../services/api';
import { Activity, TrendingUp, Globe, Building2, MessageSquare, X } from 'lucide-react';

const SECTORS = getAllSectors();

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onReset }) => {
  const [activeTab, setActiveTab] = React.useState<'technical' | 'fundamental' | 'macro' | 'micro' | 'sentiment'>('technical');

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof FilterState>(
    key: K,
    value: string
  ) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as FilterState[K]);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>5-DIMENSION SCREENER</h2>
        <button onClick={onReset} style={styles.resetButton}>
          <X size={14} />
          RESET ALL
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('technical')}
          style={activeTab === 'technical' ? styles.tabActive : styles.tab}
        >
          <Activity size={14} />
          TECHNICAL
        </button>
        <button
          onClick={() => setActiveTab('fundamental')}
          style={activeTab === 'fundamental' ? styles.tabActive : styles.tab}
        >
          <TrendingUp size={14} />
          FUNDAMENTAL
        </button>
        <button
          onClick={() => setActiveTab('macro')}
          style={activeTab === 'macro' ? styles.tabActive : styles.tab}
        >
          <Globe size={14} />
          MACRO
        </button>
        <button
          onClick={() => setActiveTab('micro')}
          style={activeTab === 'micro' ? styles.tabActive : styles.tab}
        >
          <Building2 size={14} />
          MICRO
        </button>
        <button
          onClick={() => setActiveTab('sentiment')}
          style={activeTab === 'sentiment' ? styles.tabActive : styles.tab}
        >
          <MessageSquare size={14} />
          SENTIMENT
        </button>
      </div>

      {/* Filter Content */}
      <div style={styles.content}>
        {activeTab === 'technical' && (
          <div style={styles.filterSection}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>PRICE vs EMA</label>
              <div style={styles.checkboxGroup}>
                {['above-all', 'below-all', 'any'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.priceVsEMA.includes(val as any)}
                      onChange={() => toggleArrayFilter('priceVsEMA', val)}
                      style={styles.checkbox}
                    />
                    {val.replace('-', ' ').toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>RSI (14) RANGE</label>
              <div style={styles.rangeGroup}>
                <input
                  type="number"
                  value={filters.rsiRange.min}
                  onChange={(e) => updateFilter('rsiRange', { ...filters.rsiRange, min: Number(e.target.value) })}
                  style={styles.input}
                  placeholder="Min"
                />
                <span style={styles.rangeSeparator}>—</span>
                <input
                  type="number"
                  value={filters.rsiRange.max}
                  onChange={(e) => updateFilter('rsiRange', { ...filters.rsiRange, max: Number(e.target.value) })}
                  style={styles.input}
                  placeholder="Max"
                />
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>MACD SIGNAL</label>
              <div style={styles.checkboxGroup}>
                {['bullish', 'bearish', 'neutral'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.macdSignal.includes(val as any)}
                      onChange={() => toggleArrayFilter('macdSignal', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>BOLLINGER BAND STATUS</label>
              <div style={styles.checkboxGroup}>
                {['squeeze', 'breakout', 'normal'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.bollingerStatus.includes(val as any)}
                      onChange={() => toggleArrayFilter('bollingerStatus', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>VOLUME SPIKE (MIN)</label>
              <input
                type="number"
                step="0.1"
                value={filters.volumeSpikeMin}
                onChange={(e) => updateFilter('volumeSpikeMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 2.0"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>ADX (MIN - Trend Strength)</label>
              <input
                type="number"
                value={filters.adxMin}
                onChange={(e) => updateFilter('adxMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 25"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>52-WEEK HIGH PROXIMITY (%)</label>
              <input
                type="number"
                value={filters.week52HighProximity}
                onChange={(e) => updateFilter('week52HighProximity', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 10"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>SUPERTREND SIGNAL</label>
              <div style={styles.checkboxGroup}>
                {['buy', 'sell', 'neutral'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.supertrendSignal.includes(val as any)}
                      onChange={() => toggleArrayFilter('supertrendSignal', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fundamental' && (
          <div style={styles.filterSection}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>P/E RATIO (MAX)</label>
              <input
                type="number"
                value={filters.peMax === 999 ? '' : filters.peMax}
                onChange={(e) => updateFilter('peMax', e.target.value === '' ? 999 : Number(e.target.value))}
                style={styles.input}
                placeholder="Any"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>P/B RATIO (MAX)</label>
              <input
                type="number"
                value={filters.pbMax === 999 ? '' : filters.pbMax}
                onChange={(e) => updateFilter('pbMax', e.target.value === '' ? 999 : Number(e.target.value))}
                style={styles.input}
                placeholder="Any"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>ROE % (MIN)</label>
              <input
                type="number"
                value={filters.roeMin}
                onChange={(e) => updateFilter('roeMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 15"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>ROCE % (MIN)</label>
              <input
                type="number"
                value={filters.roceMin}
                onChange={(e) => updateFilter('roceMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 20"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>DEBT-TO-EQUITY (MAX)</label>
              <input
                type="number"
                step="0.1"
                value={filters.debtToEquityMax === 999 ? '' : filters.debtToEquityMax}
                onChange={(e) => updateFilter('debtToEquityMax', e.target.value === '' ? 999 : Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 1.0"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>REVENUE GROWTH YoY % (MIN)</label>
              <input
                type="number"
                value={filters.revenueGrowthMin === -999 ? '' : filters.revenueGrowthMin}
                onChange={(e) => updateFilter('revenueGrowthMin', e.target.value === '' ? -999 : Number(e.target.value))}
                style={styles.input}
                placeholder="Any"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>PAT GROWTH YoY % (MIN)</label>
              <input
                type="number"
                value={filters.patGrowthMin === -999 ? '' : filters.patGrowthMin}
                onChange={(e) => updateFilter('patGrowthMin', e.target.value === '' ? -999 : Number(e.target.value))}
                style={styles.input}
                placeholder="Any"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>PROMOTER HOLDING % (MIN)</label>
              <input
                type="number"
                value={filters.promoterHoldingMin}
                onChange={(e) => updateFilter('promoterHoldingMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 50"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>PROMOTER PLEDGE % (MAX)</label>
              <input
                type="number"
                value={filters.promoterPledgeMax === 100 ? '' : filters.promoterPledgeMax}
                onChange={(e) => updateFilter('promoterPledgeMax', e.target.value === '' ? 100 : Number(e.target.value))}
                style={styles.input}
                placeholder="Any"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>DIVIDEND YIELD % (MIN)</label>
              <input
                type="number"
                step="0.1"
                value={filters.dividendYieldMin}
                onChange={(e) => updateFilter('dividendYieldMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 1.0"
              />
            </div>
          </div>
        )}

        {activeTab === 'macro' && (
          <div style={styles.filterSection}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>FII NET BUY/SELL ₹Cr (MIN)</label>
              <input
                type="number"
                value={filters.fiiNetMin === -9999 ? '' : filters.fiiNetMin}
                onChange={(e) => updateFilter('fiiNetMin', e.target.value === '' ? -9999 : Number(e.target.value))}
                style={styles.input}
                placeholder="Any"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>DII NET BUY/SELL ₹Cr (MIN)</label>
              <input
                type="number"
                value={filters.diiNetMin === -9999 ? '' : filters.diiNetMin}
                onChange={(e) => updateFilter('diiNetMin', e.target.value === '' ? -9999 : Number(e.target.value))}
                style={styles.input}
                placeholder="Any"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>INDIA VIX (MAX)</label>
              <input
                type="number"
                value={filters.vixMax === 999 ? '' : filters.vixMax}
                onChange={(e) => updateFilter('vixMax', e.target.value === '' ? 999 : Number(e.target.value))}
                style={styles.input}
                placeholder="Any"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>REPO RATE SENSITIVITY</label>
              <div style={styles.checkboxGroup}>
                {['high', 'medium', 'low'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.repoRateSensitivity.includes(val as any)}
                      onChange={() => toggleArrayFilter('repoRateSensitivity', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>USD/INR IMPACT</label>
              <div style={styles.checkboxGroup}>
                {['positive', 'negative', 'neutral'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.usdInrImpact.includes(val as any)}
                      onChange={() => toggleArrayFilter('usdInrImpact', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>CRUDE OIL IMPACT</label>
              <div style={styles.checkboxGroup}>
                {['positive', 'negative', 'neutral'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.crudeOilImpact.includes(val as any)}
                      onChange={() => toggleArrayFilter('crudeOilImpact', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'micro' && (
          <div style={styles.filterSection}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>SECTOR RELATIVE STRENGTH vs NIFTY (MIN)</label>
              <input
                type="number"
                step="0.01"
                value={filters.sectorRelativeStrengthMin}
                onChange={(e) => updateFilter('sectorRelativeStrengthMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 1.0"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>MANAGEMENT SCORE (MIN 0-10)</label>
              <input
                type="number"
                value={filters.managementScoreMin}
                onChange={(e) => updateFilter('managementScoreMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 7"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>EARNINGS SURPRISES (Last 4Q MIN)</label>
              <input
                type="number"
                value={filters.earningsSurprisesMin}
                onChange={(e) => updateFilter('earningsSurprisesMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 2"
              />
            </div>
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div style={styles.filterSection}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>OPTIONS PCR (MIN)</label>
              <input
                type="number"
                step="0.01"
                value={filters.pcrMin}
                onChange={(e) => updateFilter('pcrMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 1.2 (bullish)"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>F&O OI BUILDUP</label>
              <div style={styles.checkboxGroup}>
                {['long', 'short', 'unwinding-long', 'unwinding-short', 'neutral'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.foiBuildup.includes(val as any)}
                      onChange={() => toggleArrayFilter('foiBuildup', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>NEWS SENTIMENT</label>
              <div style={styles.checkboxGroup}>
                {['positive', 'neutral', 'negative'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.newsSentiment.includes(val as any)}
                      onChange={() => toggleArrayFilter('newsSentiment', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>ANALYST BUY % (MIN)</label>
              <input
                type="number"
                value={filters.analystBuyMin}
                onChange={(e) => updateFilter('analystBuyMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 60"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>INSIDER ACTIVITY</label>
              <div style={styles.checkboxGroup}>
                {['buying', 'selling', 'neutral'].map((val) => (
                  <label key={val} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.insiderActivity.includes(val as any)}
                      onChange={() => toggleArrayFilter('insiderActivity', val)}
                      style={styles.checkbox}
                    />
                    {val.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Common Filters */}
        <div style={styles.commonFilters}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>SECTORS</label>
            <div style={styles.sectorGrid}>
              {SECTORS.map((sector) => (
                <label key={sector} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.sectors.includes(sector)}
                    onChange={() => toggleArrayFilter('sectors', sector)}
                    style={styles.checkbox}
                  />
                  {sector}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>PRICE RANGE (₹)</label>
            <div style={styles.rangeGroup}>
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
                style={styles.input}
                placeholder="Min"
              />
              <span style={styles.rangeSeparator}>—</span>
              <input
                type="number"
                value={filters.priceRange.max === 99999 ? '' : filters.priceRange.max}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: e.target.value === '' ? 99999 : Number(e.target.value) })}
                style={styles.input}
                placeholder="Max"
              />
            </div>
          </div>
        </div>
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
  header: {
    padding: '16px 20px',
    background: '#161b22',
    borderBottom: '1px solid #30363d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '14px',
    color: '#58a6ff',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  resetButton: {
    background: 'rgba(255, 65, 54, 0.15)',
    border: '1px solid #ff4136',
    color: '#ff4136',
    padding: '6px 12px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  tabs: {
    display: 'flex',
    background: '#161b22',
    borderBottom: '1px solid #30363d',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  tab: {
    flex: '0 0 auto',
    minWidth: '120px',
    padding: '12px 8px',
    background: 'transparent',
    border: 'none',
    color: '#8b949e',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderBottom: '2px solid transparent',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    flex: '0 0 auto',
    minWidth: '120px',
    padding: '12px 8px',
    background: 'rgba(88, 166, 255, 0.1)',
    border: 'none',
    color: '#58a6ff',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderBottom: '2px solid #58a6ff',
    whiteSpace: 'nowrap',
  },
  content: {
    padding: '20px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '11px',
    color: '#58a6ff',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  input: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '3px',
    padding: '8px 12px',
    color: '#00ff41',
    fontSize: '12px',
    width: '100%',
  },
  rangeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rangeSeparator: {
    color: '#8b949e',
    fontSize: '14px',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#8b949e',
    fontSize: '11px',
    cursor: 'pointer',
  },
  checkbox: {
    cursor: 'pointer',
  },
  sectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  commonFilters: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #30363d',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
};

export default FilterPanel;
