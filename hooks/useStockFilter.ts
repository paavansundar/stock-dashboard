import { Stock, FilterState } from '../types';

export const useStockFilter = (stocks: Stock[], filters: FilterState): Stock[] => {
  return stocks.filter((stock) => {
    // Price Range
    if (stock.price < filters.priceRange.min || stock.price > filters.priceRange.max) {
      return false;
    }

    // Sector Filter
    if (filters.sectors.length > 0 && !filters.sectors.includes(stock.sector)) {
      return false;
    }

    // === TECHNICAL FILTERS ===
    
    // Price vs EMA
    if (filters.priceVsEMA.length > 0) {
      const aboveAll = stock.price > stock.technical.ema9 && 
                      stock.price > stock.technical.ema21 && 
                      stock.price > stock.technical.ema50 && 
                      stock.price > stock.technical.ema200;
      const belowAll = stock.price < stock.technical.ema9 && 
                      stock.price < stock.technical.ema21 && 
                      stock.price < stock.technical.ema50 && 
                      stock.price < stock.technical.ema200;
      
      if (filters.priceVsEMA.includes('above-all') && !aboveAll) return false;
      if (filters.priceVsEMA.includes('below-all') && !belowAll) return false;
    }

    // RSI Range
    if (stock.technical.rsi14 < filters.rsiRange.min || stock.technical.rsi14 > filters.rsiRange.max) {
      return false;
    }

    // MACD Signal
    if (filters.macdSignal.length > 0 && !filters.macdSignal.includes(stock.technical.macdSignal)) {
      return false;
    }

    // Bollinger Status
    if (filters.bollingerStatus.length > 0 && !filters.bollingerStatus.includes(stock.technical.bollingerStatus)) {
      return false;
    }

    // Volume Spike
    if (stock.technical.volumeSpike < filters.volumeSpikeMin) {
      return false;
    }

    // ADX
    if (stock.technical.adx < filters.adxMin) {
      return false;
    }

    // 52-Week High Proximity
    if (stock.technical.highProximity > filters.week52HighProximity) {
      return false;
    }

    // Supertrend Signal
    if (filters.supertrendSignal.length > 0 && !filters.supertrendSignal.includes(stock.technical.supertrendSignal)) {
      return false;
    }

    // === FUNDAMENTAL FILTERS ===
    
    if (stock.fundamental.pe > filters.peMax && filters.peMax < 999) {
      return false;
    }

    if (stock.fundamental.pb > filters.pbMax && filters.pbMax < 999) {
      return false;
    }

    if (stock.fundamental.roe < filters.roeMin) {
      return false;
    }

    if (stock.fundamental.roce < filters.roceMin) {
      return false;
    }

    if (stock.fundamental.debtToEquity > filters.debtToEquityMax && filters.debtToEquityMax < 999) {
      return false;
    }

    if (stock.fundamental.revenueGrowthYoY < filters.revenueGrowthMin) {
      return false;
    }

    if (stock.fundamental.patGrowthYoY < filters.patGrowthMin) {
      return false;
    }

    if (stock.fundamental.promoterHolding < filters.promoterHoldingMin) {
      return false;
    }

    if (stock.fundamental.promoterPledge > filters.promoterPledgeMax) {
      return false;
    }

    if (stock.fundamental.dividendYield < filters.dividendYieldMin) {
      return false;
    }

    // === MACRO FILTERS ===
    
    if (stock.macro.fiiNetBuySell < filters.fiiNetMin && filters.fiiNetMin > -9999) {
      return false;
    }

    if (stock.macro.diiNetBuySell < filters.diiNetMin && filters.diiNetMin > -9999) {
      return false;
    }

    if (stock.macro.indiaVix > filters.vixMax && filters.vixMax < 999) {
      return false;
    }

    if (filters.repoRateSensitivity.length > 0 && !filters.repoRateSensitivity.includes(stock.macro.repoRateSensitivity)) {
      return false;
    }

    if (filters.usdInrImpact.length > 0 && !filters.usdInrImpact.includes(stock.macro.usdInrImpact)) {
      return false;
    }

    if (filters.crudeOilImpact.length > 0 && !filters.crudeOilImpact.includes(stock.macro.crudeOilImpact)) {
      return false;
    }

    // === MICRO FILTERS ===
    
    if (stock.micro.sectorRelativeStrength < filters.sectorRelativeStrengthMin) {
      return false;
    }

    if (stock.micro.managementScore < filters.managementScoreMin) {
      return false;
    }

    if (stock.micro.earningsSurprises < filters.earningsSurprisesMin) {
      return false;
    }

    // === SENTIMENT FILTERS ===
    
    if (stock.sentiment.optionsPCR < filters.pcrMin) {
      return false;
    }

    if (filters.foiBuildup.length > 0 && !filters.foiBuildup.includes(stock.sentiment.foiBuildup)) {
      return false;
    }

    if (filters.newsSentiment.length > 0 && !filters.newsSentiment.includes(stock.sentiment.newsSentiment)) {
      return false;
    }

    if (stock.sentiment.analystBuy < filters.analystBuyMin) {
      return false;
    }

    if (filters.insiderActivity.length > 0 && !filters.insiderActivity.includes(stock.sentiment.insiderActivity)) {
      return false;
    }

    return true;
  });
};

export const getDefaultFilters = (): FilterState => ({
  // Technical - No filters applied
  priceVsEMA: [],
  rsiRange: { min: 0, max: 100 },
  macdSignal: [],
  bollingerStatus: [],
  volumeSpikeMin: 0,
  adxMin: 0,
  week52HighProximity: 100,
  supertrendSignal: [],
  
  // Fundamental - No filters applied
  peMin: 0,
  peMax: 999,
  pbMax: 999,
  roeMin: 0,
  roceMin: 0,
  debtToEquityMax: 999,
  revenueGrowthMin: -999,
  patGrowthMin: -999,
  promoterHoldingMin: 0,
  promoterPledgeMax: 100,
  dividendYieldMin: 0,
  freeCashFlow: [],
  
  // Macro - No filters applied
  fiiNetMin: -9999,
  diiNetMin: -9999,
  vixMax: 999,
  repoRateSensitivity: [],
  usdInrImpact: [],
  crudeOilImpact: [],
  gstTrendImpact: [],
  
  // Micro - No filters applied
  sectorRelativeStrength: 0,
  managementScoreMin: 0,
  earningsSurprisesMin: 0,
  
  // Sentiment - No filters applied
  pcrMin: 0,
  pcrMax: 5,
  foiBuildup: [],
  newsSentiment: [],
  newsSentimentFilter: [],
  analystBuyMin: 0,
  insiderActivity: [],
  
  // General
  sectors: [],
  priceRange: { min: 0, max: 99999 },
  marketCapRange: [],
  analystConsensus: [],
});

// Preset filter configurations
export const getPresetFilters = (preset: 'momentum' | 'value' | 'fno' | 'fii'): FilterState => {
  const base = getDefaultFilters();
  
  switch (preset) {
    case 'momentum':
      // Momentum Picks - Strong uptrend with volume
      return {
        ...base,
        priceVsEMA: ['above-all'],
        rsiRange: { min: 50, max: 80 },
        macdSignal: ['bullish'],
        volumeSpikeMin: 1.5,
        adxMin: 25,
        supertrendSignal: ['buy'],
        roeMin: 15,
        week52HighProximity: 20,
        sectorRelativeStrength: 1.0,
      };
      
    case 'value':
      // Value Buys - Undervalued with strong fundamentals
      return {
        ...base,
        peMax: 20,
        pbMax: 3,
        roeMin: 15,
        roceMin: 18,
        debtToEquityMax: 1.0,
        dividendYieldMin: 1.5,
        promoterHoldingMin: 30,
        revenueGrowthMin: 10,
        patGrowthMin: 10,
        managementScoreMin: 8,
      };
      
    case 'fno':
      // F&O Favorites - High liquidity with strong options activity
      return {
        ...base,
        volumeSpikeMin: 1.5,
        pcrMin: 1.0,
        pcrMax: 2.0,
        foiBuildup: ['long'],
        adxMin: 20,
        rsiRange: { min: 40, max: 70 },
        supertrendSignal: ['buy'],
        analystBuyMin: 50,
      };
      
    case 'fii':
      // FII Darlings - Institutional buying interest
      return {
        ...base,
        fiiNetMin: 100,
        roeMin: 15,
        peMax: 35,
        promoterHoldingMin: 20,
        sectorRelativeStrength: 1.0,
        managementScoreMin: 7,
        analystBuyMin: 60,
        insiderActivity: ['buying', 'neutral'],
      };
      
    default:
      return base;
  }
};
