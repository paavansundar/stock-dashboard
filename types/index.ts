// Type definitions for the 5-dimension Indian stock screener

export interface Stock {
  // Basic Info
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  
  // 1. Technical Indicators
  technical: {
    ema9: number;
    ema21: number;
    ema50: number;
    ema200: number;
    rsi14: number;
    macdSignal: 'bullish' | 'bearish' | 'neutral';
    bollingerStatus: 'squeeze' | 'breakout' | 'normal';
    volumeSpike: number; // multiplier vs 20-day avg
    adx: number;
    week52High: number;
    week52Low: number;
    highProximity: number; // % distance from 52-week high
    lowProximity: number; // % distance from 52-week low
    supertrendSignal: 'buy' | 'sell' | 'neutral';
  };
  
  // 2. Fundamental Metrics
  fundamental: {
    pe: number;
    pb: number;
    evEbitda: number;
    roe: number;
    roce: number;
    debtToEquity: number;
    revenueGrowthYoY: number;
    revenueGrowthQoQ: number;
    patGrowthYoY: number;
    patGrowthQoQ: number;
    promoterHolding: number;
    promoterPledge: number;
    freeCashFlow: number; // in Crores
    dividendYield: number;
    sectorMedianPE: number;
  };
  
  // 3. Macro Filters
  macro: {
    fiiNetBuySell: number; // in Crores (last month)
    diiNetBuySell: number; // in Crores (last month)
    indiaVix: number; // market-wide, but stock-level exposure
    repoRateSensitivity: 'high' | 'medium' | 'low';
    usdInrImpact: 'positive' | 'negative' | 'neutral'; // for exporters/importers
    crudeOilImpact: 'positive' | 'negative' | 'neutral';
    gstTrendImpact: 'positive' | 'neutral' | 'negative';
    economicIndicatorScore: number; // composite score 0-100
  };
  
  // 4. Micro / Sector Specific
  micro: {
    sectorRelativeStrength: number; // vs NIFTY 50
    blockDealsLastWeek: number;
    bulkDealsLastWeek: number;
    managementScore: number; // 0-10
    earningsSurprises: number; // last 4 quarters (positive count)
    orderBookToCap: number; // for capital goods, infra
    capacityUtilization: number; // percentage
  };
  
  // 5. Sentiment & Trend
  sentiment: {
    optionsPCR: number; // Put-Call Ratio
    foiBuildup: 'long' | 'short' | 'unwinding-long' | 'unwinding-short' | 'neutral';
    newsSentiment: 'positive' | 'neutral' | 'negative';
    newsSentimentScore: number; // 0-100
    socialMediaBuzzRank: number; // 1-100
    analystBuy: number; // percentage
    analystHold: number;
    analystSell: number;
    insiderActivity: 'buying' | 'selling' | 'neutral';
    shortInterest: number; // percentage of float
  };
}

export interface FilterState {
  // Technical Filters
  priceVsEMA: ('above-all' | 'below-all' | 'above-200' | 'above-50' | '9-21-cross' | 'below-50' | 'any')[];
  rsiRange: { min: number; max: number };
  macdSignal: ('bullish' | 'bearish' | 'neutral')[];
  bollingerStatus?: ('squeeze' | 'breakout' | 'normal')[];
  volumeSpikeMin: number;
  adxMin: number;
  week52HighProximity?: number; // within X% of 52-week high
  fiftyTwoWeekRange?: { min: number; max: number };
  supertrendSignal?: ('buy' | 'sell' | 'neutral')[];
  
  // Fundamental Filters
  peMin?: number;
  peMax: number;
  pbMax?: number;
  roeMin: number;
  roceMin: number;
  debtToEquityMax: number;
  revenueGrowthMin?: number;
  patGrowthMin?: number;
  promoterHoldingMin?: number;
  promoterPledgeMax?: number;
  dividendYieldMin?: number;
  fcfPositive?: boolean;
  marketCapCategory?: ('large' | 'mid' | 'small')[];
  
  // Macro Filters
  fiiNetMin: number;
  diiNetMin?: number;
  vixMax?: number;
  vixRange?: { min: number; max: number };
  fiiFlowDirection?: 'positive' | 'negative' | 'any';
  repoRateSensitivity?: ('high' | 'medium' | 'low')[];
  usdInrImpact?: ('positive' | 'negative' | 'neutral')[];
  crudeOilImpact?: ('positive' | 'negative' | 'neutral')[];
  
  // Micro Filters
  sectorRelativeStrengthMin?: number;
  managementScoreMin?: number;
  earningsSurprisesMin?: number;
  
  // Sentiment Filters
  pcrMin: number;
  pcrMax: number;
  foiBuildup?: ('long' | 'short' | 'unwinding-long' | 'unwinding-short' | 'neutral')[];
  foiBuildupType?: ('long' | 'short' | 'neutral' | 'long-unwinding' | 'short-covering')[];
  newsSentiment?: ('positive' | 'neutral' | 'negative')[];
  newsSentimentFilter?: ('positive' | 'neutral' | 'negative')[];
  analystBuyMin: number;
  insiderActivity?: boolean;
  
  // General
  sectors: string[];
  priceRange?: { min: number; max: number };
}

