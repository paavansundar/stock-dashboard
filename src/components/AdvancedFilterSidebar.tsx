import React from 'react';
import { FilterState } from '../types';
import { getDefaultFilters, getPresetFilters } from '../hooks/useStockFilter';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const AdvancedFilterSidebar = ({ filters, onFilterChange }: AdvancedFilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(['technical', 'fundamental', 'macro', 'sentiment'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.title}>INSTITUTIONAL SCANNER</div>
        <div style={styles.subtitle}>MULTI-FACTOR COMPOSITE SCORING</div>
      </div>

      {/* Preset Filters */}
      <div style={styles.presets}>
        <div style={styles.presetsTitle}>STRATEGY PRESETS</div>
        <div style={styles.presetGrid}>
          <button
            onClick={() => onFilterChange(getPresetFilters('momentum'))}
            style={styles.presetButton}
            title="Strong uptrend stocks with high momentum"
          >
            <div style={styles.presetIcon}>🚀</div>
            <div style={styles.presetLabel}>MOMENTUM</div>
          </button>
          <button
            onClick={() => onFilterChange(getPresetFilters('value'))}
            style={styles.presetButton}
            title="Undervalued quality stocks"
          >
            <div style={styles.presetIcon}>💎</div>
            <div style={styles.presetLabel}>VALUE</div>
          </button>
          <button
            onClick={() => onFilterChange(getPresetFilters('fno'))}
            style={styles.presetButton}
            title="High liquidity F&O stocks"
          >
            <div style={styles.presetIcon}>📊</div>
            <div style={styles.presetLabel}>F&O</div>
          </button>
          <button
            onClick={() => onFilterChange(getPresetFilters('fii'))}
            style={styles.presetButton}
            title="FII buying favorites"
          >
            <div style={styles.presetIcon}>🏦</div>
            <div style={styles.presetLabel}>FII</div>
          </button>
        </div>
      </div>

      {/* Preset Filters */}
      <div style={styles.presets}>
        <div style={styles.presetsTitle}>STRATEGY PRESETS</div>
        <div style={styles.presetGrid}>
          <button
            onClick={() => onFilterChange(getPresetFilters('momentum'))}
            style={styles.presetButton}
            title="Strong uptrend stocks with high momentum"
          >
            <div style={styles.presetIcon}>🚀</div>
            <div style={styles.presetLabel}>MOMENTUM</div>
          </button>
          <button
            onClick={() => onFilterChange(getPresetFilters('value'))}
            style={styles.presetButton}
            title="Undervalued quality stocks"
          >
            <div style={styles.presetIcon}>💎</div>
            <div style={styles.presetLabel}>VALUE</div>
          </button>
          <button
            onClick={() => onFilterChange(getPresetFilters('fno'))}
            style={styles.presetButton}
            title="High liquidity F&O stocks"
          >
            <div style={styles.presetIcon}>📊</div>
            <div style={styles.presetLabel}>F&O</div>
          </button>
          <button
            onClick={() => onFilterChange(getPresetFilters('fii'))}
            style={styles.presetButton}
            title="FII buying favorites"
          >
            <div style={styles.presetIcon}>🏦</div>
            <div style={styles.presetLabel}>FII</div>
          </button>
        </div>
      </div>

      {/* Technical Filters */}
      <div style={styles.section}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('technical')}>
          <span style={styles.sectionTitle}>TECHNICAL ANALYSIS</span>
          {expandedSections.has('technical') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {expandedSections.has('technical') && (
          <div style={styles.sectionContent}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>RSI RANGE</label>
              <div style={styles.rangeInputs}>
                <input
                  type="number"
                  value={filters.rsiRange.min}
                  onChange={(e) => updateFilter('rsiRange', { ...filters.rsiRange, min: Number(e.target.value) })}
                  style={styles.input}
                  placeholder="Min"
                />
                <span style={styles.rangeSeparator}>to</span>
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
              <label style={styles.label}>EMA CROSSOVER</label>
              <select
                multiple
                value={filters.priceVsEMA}
                onChange={(e) => updateFilter('priceVsEMA', Array.from(e.target.selectedOptions, option => option.value))}
                style={styles.multiSelect}
              >
                <option value="above-all">Above All EMAs</option>
                <option value="above-200">Above 200 EMA</option>
                <option value="above-50">Above 50 EMA</option>
                <option value="9-21-cross">9/21 Bullish Cross</option>
                <option value="below-50">Below 50 EMA</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>MACD SIGNAL</label>
              <select
                multiple
                value={filters.macdSignal}
                onChange={(e) => updateFilter('macdSignal', Array.from(e.target.selectedOptions, option => option.value))}
                style={styles.multiSelect}
              >
                <option value="bullish">Bullish</option>
                <option value="neutral">Neutral</option>
                <option value="bearish">Bearish</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>VOLUME SPIKE (Min)</label>
              <input
                type="number"
                step="0.1"
                value={filters.volumeSpikeMin}
                onChange={(e) => updateFilter('volumeSpikeMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 1.5"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>SUPERTREND</label>
              <select
                multiple
                value={filters.supertrendSignal || []}
                onChange={(e) => updateFilter('supertrendSignal', Array.from(e.target.selectedOptions, option => option.value))}
                style={styles.multiSelect}
              >
                <option value="buy">Buy</option>
                <option value="neutral">Neutral</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>52W HIGH/LOW %</label>
              <div style={styles.rangeInputs}>
                <input
                  type="number"
                  value={filters.fiftyTwoWeekRange?.min || -100}
                  onChange={(e) => updateFilter('fiftyTwoWeekRange', { min: Number(e.target.value), max: filters.fiftyTwoWeekRange?.max || 100 })}
                  style={styles.input}
                  placeholder="Min %"
                />
                <span style={styles.rangeSeparator}>to</span>
                <input
                  type="number"
                  value={filters.fiftyTwoWeekRange?.max || 100}
                  onChange={(e) => updateFilter('fiftyTwoWeekRange', { min: filters.fiftyTwoWeekRange?.min || -100, max: Number(e.target.value) })}
                  style={styles.input}
                  placeholder="Max %"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fundamental Filters */}
      <div style={styles.section}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('fundamental')}>
          <span style={styles.sectionTitle}>FUNDAMENTAL METRICS</span>
          {expandedSections.has('fundamental') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {expandedSections.has('fundamental') && (
          <div style={styles.sectionContent}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>P/E RANGE</label>
              <div style={styles.rangeInputs}>
                <input
                  type="number"
                  value={filters.peMin}
                  onChange={(e) => updateFilter('peMin', Number(e.target.value))}
                  style={styles.input}
                  placeholder="Min"
                />
                <span style={styles.rangeSeparator}>to</span>
                <input
                  type="number"
                  value={filters.peMax}
                  onChange={(e) => updateFilter('peMax', Number(e.target.value))}
                  style={styles.input}
                  placeholder="Max"
                />
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>ROE MIN %</label>
              <input
                type="number"
                value={filters.roeMin}
                onChange={(e) => updateFilter('roeMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 15"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>DEBT/EQUITY MAX</label>
              <input
                type="number"
                step="0.1"
                value={filters.debtToEquityMax}
                onChange={(e) => updateFilter('debtToEquityMax', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 1.5"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>REVENUE GROWTH MIN %</label>
              <input
                type="number"
                value={filters.revenueGrowthMin || 0}
                onChange={(e) => updateFilter('revenueGrowthMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 10"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>PROMOTER HOLDING MIN %</label>
              <input
                type="number"
                value={filters.promoterHoldingMin || 0}
                onChange={(e) => updateFilter('promoterHoldingMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 50"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.fcfPositive || false}
                  onChange={(e) => updateFilter('fcfPositive', e.target.checked)}
                  style={styles.checkbox}
                />
                <span>FREE CASH FLOW POSITIVE</span>
              </label>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>MARKET CAP</label>
              <select
                multiple
                value={filters.marketCapCategory || []}
                onChange={(e) => updateFilter('marketCapCategory', Array.from(e.target.selectedOptions, option => option.value))}
                style={styles.multiSelect}
              >
                <option value="large">Large Cap (₹20k Cr+)</option>
                <option value="mid">Mid Cap (₹5k-20k Cr)</option>
                <option value="small">Small Cap (&lt;₹5k Cr)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Macro Filters */}
      <div style={styles.section}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('macro')}>
          <span style={styles.sectionTitle}>MACRO INDICATORS</span>
          {expandedSections.has('macro') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {expandedSections.has('macro') && (
          <div style={styles.sectionContent}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>FII NET FLOW</label>
              <select
                value={filters.fiiFlowDirection || 'any'}
                onChange={(e) => updateFilter('fiiFlowDirection', e.target.value)}
                style={styles.select}
              >
                <option value="any">Any</option>
                <option value="positive">Positive (Buying)</option>
                <option value="negative">Negative (Selling)</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>FII NET MIN (Cr)</label>
              <input
                type="number"
                value={filters.fiiNetMin}
                onChange={(e) => updateFilter('fiiNetMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 50"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>INDIA VIX RANGE</label>
              <div style={styles.rangeInputs}>
                <input
                  type="number"
                  value={filters.vixRange?.min || 0}
                  onChange={(e) => updateFilter('vixRange', { min: Number(e.target.value), max: filters.vixRange?.max || 50 })}
                  style={styles.input}
                  placeholder="Min"
                />
                <span style={styles.rangeSeparator}>to</span>
                <input
                  type="number"
                  value={filters.vixRange?.max || 50}
                  onChange={(e) => updateFilter('vixRange', { min: filters.vixRange?.min || 0, max: Number(e.target.value) })}
                  style={styles.input}
                  placeholder="Max"
                />
              </div>
              <div style={styles.hint}>Calm: &lt;15 | Fear: &gt;20</div>
            </div>
          </div>
        )}
      </div>

      {/* Sentiment Filters */}
      <div style={styles.section}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('sentiment')}>
          <span style={styles.sectionTitle}>SENTIMENT ANALYSIS</span>
          {expandedSections.has('sentiment') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {expandedSections.has('sentiment') && (
          <div style={styles.sectionContent}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>PCR RANGE</label>
              <div style={styles.rangeInputs}>
                <input
                  type="number"
                  step="0.1"
                  value={filters.pcrMin}
                  onChange={(e) => updateFilter('pcrMin', Number(e.target.value))}
                  style={styles.input}
                  placeholder="Min"
                />
                <span style={styles.rangeSeparator}>to</span>
                <input
                  type="number"
                  step="0.1"
                  value={filters.pcrMax}
                  onChange={(e) => updateFilter('pcrMax', Number(e.target.value))}
                  style={styles.input}
                  placeholder="Max"
                />
              </div>
              <div style={styles.hint}>Bullish: &gt;1.2 | Bearish: &lt;0.8</div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>F&O BUILDUP</label>
              <select
                multiple
                value={filters.foiBuildupType || []}
                onChange={(e) => updateFilter('foiBuildupType', Array.from(e.target.selectedOptions, option => option.value))}
                style={styles.multiSelect}
              >
                <option value="long">Long Buildup</option>
                <option value="short">Short Buildup</option>
                <option value="neutral">Neutral</option>
                <option value="long-unwinding">Long Unwinding</option>
                <option value="short-covering">Short Covering</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>ANALYST BUY % MIN</label>
              <input
                type="number"
                value={filters.analystBuyMin}
                onChange={(e) => updateFilter('analystBuyMin', Number(e.target.value))}
                style={styles.input}
                placeholder="e.g., 60"
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.insiderActivity || false}
                  onChange={(e) => updateFilter('insiderActivity', e.target.checked)}
                  style={styles.checkbox}
                />
                <span>INSIDER BUYING ACTIVITY</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <button 
          style={styles.resetButton}
          onClick={() => onFilterChange(getDefaultFilters())}
        >
          RESET ALL FILTERS
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '320px',
    background: '#0A0E17',
    borderRight: '1px solid #F0B429',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
  },
  header: {
    padding: '20px',
    borderBottom: '2px solid #F0B429',
    background: 'linear-gradient(180deg, #0A0E17 0%, #0d1117 100%)',
  },
  title: {
    color: '#F0B429',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#8b949e',
    fontSize: '10px',
    letterSpacing: '0.5px',
  },
  presets: {
    padding: '16px 20px',
    borderBottom: '2px solid #F0B429',
    background: '#0A0E17',
  },
  presetsTitle: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#F0B429',
    marginBottom: '12px',
    letterSpacing: '1px',
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  presetButton: {
    background: 'linear-gradient(135deg, #0A0E17, #1C2128)',
    border: '1px solid #F0B429',
    padding: '12px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  presetIcon: {
    fontSize: '20px',
  },
  presetLabel: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#F0B429',
    letterSpacing: '0.5px',
  },
  section: {
    borderBottom: '1px solid #21262d',
  },
  sectionHeader: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#0d1117',
    transition: 'background 0.2s ease',
  },
  sectionTitle: {
    color: '#F0B429',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  sectionContent: {
    padding: '16px 20px',
    background: '#0A0E17',
  },
  filterGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    color: '#8b949e',
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '4px',
    color: '#c9d1d9',
    fontSize: '12px',
    fontFamily: 'Consolas, Monaco, monospace',
    outline: 'none',
  },
  rangeInputs: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  rangeSeparator: {
    color: '#8b949e',
    fontSize: '10px',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '4px',
    color: '#c9d1d9',
    fontSize: '12px',
    outline: 'none',
  },
  multiSelect: {
    width: '100%',
    padding: '8px 12px',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '4px',
    color: '#c9d1d9',
    fontSize: '11px',
    outline: 'none',
    minHeight: '80px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#c9d1d9',
    fontSize: '11px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  hint: {
    marginTop: '6px',
    color: '#58a6ff',
    fontSize: '9px',
    fontStyle: 'italic',
  },
  footer: {
    padding: '20px',
    marginTop: 'auto',
    borderTop: '1px solid #F0B429',
  },
  resetButton: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '1px solid #F0B429',
    borderRadius: '4px',
    color: '#F0B429',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.5px',
  },
};

export default AdvancedFilterSidebar;
