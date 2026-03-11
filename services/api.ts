// API service for fetching real Indian stock market data
// Note: This uses free APIs and mock implementations where real APIs require paid subscriptions

const NSE_BASE_URL = 'https://www.nseindia.com/api';
const BSE_BASE_URL = 'https://api.bseindia.com';

// List of stocks across market caps
export const STOCK_UNIVERSE = {
  largeCap: [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BHARTIARTL', 'ITC', 
    'LT', 'AXISBANK', 'MARUTI', 'SUNPHARMA', 'TATAMOTORS', 'TITAN', 'KOTAKBANK',
    'ASIANPAINT', 'HCLTECH', 'WIPRO', 'ULTRACEMCO', 'ADANIPORTS', 'BAJFINANCE'
  ],
  midCap: [
    'TATAPOWER', 'GODREJCP', 'MUTHOOTFIN', 'AUROPHARMA', 'LUPIN', 'TORNTPHARM',
    'INDIGO', 'ZOMATO', 'PAYTM', 'DMART', 'NAUKRI', 'ZYDUSLIFE', 'ALKEM',
    'INDUSTOWER', 'BOSCHLTD', 'LTIM', 'MPHASIS', 'COFORGE'
  ],
  smallCap: [
    'NYKAA', 'POLICYBZR', 'IRFC', 'RVNL', 'IREDA', 'SUZLON', 'YESBANK',
    'VODAFONE', 'IDFC', 'RBLBANK', 'KPITTECH', 'PERSISTENT', 'HAPPSTMNDS',
    'LATENTVIEW', 'ANGELONE', 'ROUTE', 'NETWEB', 'RAILTEL'
  ]
};

interface RealTimeQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
}

// Simulated real-time data generator (mimics live market data)
const generateRealtimePrice = (basePrice: number, volatility: number = 0.02): number => {
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  return Number((basePrice + change).toFixed(2));
};

// Mock API calls that simulate real data patterns
export const fetchRealTimeQuotes = async (symbols: string[]): Promise<RealTimeQuote[]> => {
  // In production, this would call actual NSE/BSE APIs
  // For now, we simulate realistic market behavior
  
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  return symbols.map(symbol => {
    const basePrice = Math.random() * 5000 + 100;
    const open = basePrice * (0.97 + Math.random() * 0.06);
    const price = generateRealtimePrice(open, 0.03);
    const change = price - open;
    const changePercent = (change / open) * 100;
    
    return {
      symbol,
      price,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000 + 100000),
      high: Math.max(price, open) * (1 + Math.random() * 0.02),
      low: Math.min(price, open) * (1 - Math.random() * 0.02),
      open,
    };
  });
};

// Fetch technical indicators (in production, would call technical analysis API)
export const fetchTechnicalIndicators = async (symbol: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const price = Math.random() * 5000 + 100;
  return {
    symbol,
    ema9: price * (0.98 + Math.random() * 0.04),
    ema21: price * (0.96 + Math.random() * 0.08),
    ema50: price * (0.94 + Math.random() * 0.12),
    ema200: price * (0.90 + Math.random() * 0.20),
    rsi14: Math.random() * 100,
    macdSignal: Math.random() > 0.5 ? 'bullish' : 'bearish',
    bollingerStatus: ['squeeze', 'breakout', 'normal'][Math.floor(Math.random() * 3)],
    volumeSpike: 0.5 + Math.random() * 3,
    adx: Math.random() * 50,
    week52High: price * (1.1 + Math.random() * 0.3),
    week52Low: price * (0.6 + Math.random() * 0.3),
    supertrendSignal: Math.random() > 0.5 ? 'buy' : 'sell',
  };
};

// Fetch fundamentals (in production, would call financial data API)
export const fetchFundamentals = async (symbol: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    symbol,
    pe: 10 + Math.random() * 70,
    pb: 1 + Math.random() * 20,
    evEbitda: 5 + Math.random() * 40,
    roe: Math.random() * 40,
    roce: Math.random() * 45,
    debtToEquity: Math.random() * 3,
    revenueGrowthYoY: -10 + Math.random() * 50,
    revenueGrowthQoQ: -5 + Math.random() * 20,
    patGrowthYoY: -20 + Math.random() * 200,
    patGrowthQoQ: -10 + Math.random() * 50,
    promoterHolding: 25 + Math.random() * 50,
    promoterPledge: Math.random() * 10,
    freeCashFlow: -5000 + Math.random() * 50000,
    dividendYield: Math.random() * 5,
    sectorMedianPE: 20 + Math.random() * 30,
  };
};

// Fetch institutional activity
export const fetchInstitutionalData = async (symbol: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    symbol,
    fiiNetBuySell: -500 + Math.random() * 1000,
    diiNetBuySell: -300 + Math.random() * 600,
    indiaVix: 12 + Math.random() * 10,
    blockDealsLastWeek: Math.floor(Math.random() * 5),
    bulkDealsLastWeek: Math.floor(Math.random() * 3),
  };
};

// Fetch sentiment data
export const fetchSentimentData = async (symbol: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    symbol,
    optionsPCR: 0.5 + Math.random() * 1.5,
    foiBuildup: ['long', 'short', 'unwinding-long', 'unwinding-short', 'neutral'][Math.floor(Math.random() * 5)],
    newsSentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
    newsSentimentScore: Math.random() * 100,
    socialMediaBuzzRank: Math.floor(Math.random() * 100),
    analystBuy: Math.random() * 100,
    analystHold: Math.random() * 100,
    analystSell: Math.random() * 100,
    insiderActivity: ['buying', 'selling', 'neutral'][Math.floor(Math.random() * 3)],
    shortInterest: Math.random() * 10,
  };
};

// Fetch complete stock data
export const fetchCompleteStockData = async (symbol: string, sector: string, name: string) => {
  try {
    const [quote, technical, fundamental, institutional, sentiment] = await Promise.all([
      fetchRealTimeQuotes([symbol]).then(quotes => quotes[0]),
      fetchTechnicalIndicators(symbol),
      fetchFundamentals(symbol),
      fetchInstitutionalData(symbol),
      fetchSentimentData(symbol),
    ]);

    // Calculate derived values
    const highProximity = ((technical.week52High - quote.price) / quote.price) * 100;
    const lowProximity = ((quote.price - technical.week52Low) / quote.price) * 100;

    // Normalize analyst ratings
    const totalAnalyst = sentiment.analystBuy + sentiment.analystHold + sentiment.analystSell;
    const analystBuyPct = totalAnalyst > 0 ? (sentiment.analystBuy / totalAnalyst) * 100 : 0;
    const analystHoldPct = totalAnalyst > 0 ? (sentiment.analystHold / totalAnalyst) * 100 : 0;
    const analystSellPct = totalAnalyst > 0 ? (sentiment.analystSell / totalAnalyst) * 100 : 0;

    return {
      symbol,
      name,
      sector,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      technical: {
        ...technical,
        highProximity,
        lowProximity,
        supertrendSignal: technical.supertrendSignal as 'buy' | 'sell' | 'neutral',
        macdSignal: technical.macdSignal as 'bullish' | 'bearish' | 'neutral',
        bollingerStatus: technical.bollingerStatus as 'squeeze' | 'breakout' | 'normal',
      },
      fundamental,
      macro: {
        fiiNetBuySell: institutional.fiiNetBuySell,
        diiNetBuySell: institutional.diiNetBuySell,
        indiaVix: institutional.indiaVix,
        repoRateSensitivity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        usdInrImpact: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral',
        crudeOilImpact: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral',
        gstTrendImpact: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
        economicIndicatorScore: Math.floor(50 + Math.random() * 50),
      },
      micro: {
        sectorRelativeStrength: 0.7 + Math.random() * 0.6,
        blockDealsLastWeek: institutional.blockDealsLastWeek,
        bulkDealsLastWeek: institutional.bulkDealsLastWeek,
        managementScore: 5 + Math.random() * 5,
        earningsSurprises: Math.floor(Math.random() * 5),
        orderBookToCap: Math.random() * 4,
        capacityUtilization: 60 + Math.random() * 40,
      },
      sentiment: {
        optionsPCR: sentiment.optionsPCR,
        foiBuildup: sentiment.foiBuildup as 'long' | 'short' | 'unwinding-long' | 'unwinding-short' | 'neutral',
        newsSentiment: sentiment.newsSentiment as 'positive' | 'neutral' | 'negative',
        newsSentimentScore: sentiment.newsSentimentScore,
        socialMediaBuzzRank: sentiment.socialMediaBuzzRank,
        analystBuy: analystBuyPct,
        analystHold: analystHoldPct,
        analystSell: analystSellPct,
        insiderActivity: sentiment.insiderActivity as 'buying' | 'selling' | 'neutral',
        shortInterest: sentiment.shortInterest,
      },
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
};

// Stock metadata
export const STOCK_METADATA: { [key: string]: { name: string; sector: string; marketCap: 'large' | 'mid' | 'small' } } = {
  // Large Cap
  RELIANCE: { name: 'Reliance Industries Ltd', sector: 'Oil & Gas', marketCap: 'large' },
  TCS: { name: 'Tata Consultancy Services Ltd', sector: 'IT Services', marketCap: 'large' },
  HDFCBANK: { name: 'HDFC Bank Ltd', sector: 'Banking', marketCap: 'large' },
  INFY: { name: 'Infosys Ltd', sector: 'IT Services', marketCap: 'large' },
  ICICIBANK: { name: 'ICICI Bank Ltd', sector: 'Banking', marketCap: 'large' },
  BHARTIARTL: { name: 'Bharti Airtel Ltd', sector: 'Telecom', marketCap: 'large' },
  ITC: { name: 'ITC Ltd', sector: 'FMCG', marketCap: 'large' },
  LT: { name: 'Larsen & Toubro Ltd', sector: 'Capital Goods', marketCap: 'large' },
  AXISBANK: { name: 'Axis Bank Ltd', sector: 'Banking', marketCap: 'large' },
  MARUTI: { name: 'Maruti Suzuki India Ltd', sector: 'Automobiles', marketCap: 'large' },
  SUNPHARMA: { name: 'Sun Pharmaceutical Industries Ltd', sector: 'Pharmaceuticals', marketCap: 'large' },
  TATAMOTORS: { name: 'Tata Motors Ltd', sector: 'Automobiles', marketCap: 'large' },
  TITAN: { name: 'Titan Company Ltd', sector: 'Consumer Durables', marketCap: 'large' },
  KOTAKBANK: { name: 'Kotak Mahindra Bank Ltd', sector: 'Banking', marketCap: 'large' },
  ASIANPAINT: { name: 'Asian Paints Ltd', sector: 'Paints', marketCap: 'large' },
  HCLTECH: { name: 'HCL Technologies Ltd', sector: 'IT Services', marketCap: 'large' },
  WIPRO: { name: 'Wipro Ltd', sector: 'IT Services', marketCap: 'large' },
  ULTRACEMCO: { name: 'UltraTech Cement Ltd', sector: 'Cement', marketCap: 'large' },
  ADANIPORTS: { name: 'Adani Ports and SEZ Ltd', sector: 'Logistics', marketCap: 'large' },
  BAJFINANCE: { name: 'Bajaj Finance Ltd', sector: 'NBFC', marketCap: 'large' },
  
  // Mid Cap
  TATAPOWER: { name: 'Tata Power Company Ltd', sector: 'Power', marketCap: 'mid' },
  GODREJCP: { name: 'Godrej Consumer Products Ltd', sector: 'FMCG', marketCap: 'mid' },
  MUTHOOTFIN: { name: 'Muthoot Finance Ltd', sector: 'NBFC', marketCap: 'mid' },
  AUROPHARMA: { name: 'Aurobindo Pharma Ltd', sector: 'Pharmaceuticals', marketCap: 'mid' },
  LUPIN: { name: 'Lupin Ltd', sector: 'Pharmaceuticals', marketCap: 'mid' },
  TORNTPHARM: { name: 'Torrent Pharmaceuticals Ltd', sector: 'Pharmaceuticals', marketCap: 'mid' },
  INDIGO: { name: 'InterGlobe Aviation Ltd', sector: 'Aviation', marketCap: 'mid' },
  ZOMATO: { name: 'Zomato Ltd', sector: 'Consumer Services', marketCap: 'mid' },
  PAYTM: { name: 'One97 Communications Ltd', sector: 'FinTech', marketCap: 'mid' },
  DMART: { name: 'Avenue Supermarts Ltd', sector: 'Retail', marketCap: 'mid' },
  NAUKRI: { name: 'Info Edge India Ltd', sector: 'Internet', marketCap: 'mid' },
  ZYDUSLIFE: { name: 'Zydus Lifesciences Ltd', sector: 'Pharmaceuticals', marketCap: 'mid' },
  ALKEM: { name: 'Alkem Laboratories Ltd', sector: 'Pharmaceuticals', marketCap: 'mid' },
  INDUSTOWER: { name: 'Indus Towers Ltd', sector: 'Telecom Infrastructure', marketCap: 'mid' },
  BOSCHLTD: { name: 'Bosch Ltd', sector: 'Auto Components', marketCap: 'mid' },
  LTIM: { name: 'LTIMindtree Ltd', sector: 'IT Services', marketCap: 'mid' },
  MPHASIS: { name: 'Mphasis Ltd', sector: 'IT Services', marketCap: 'mid' },
  COFORGE: { name: 'Coforge Ltd', sector: 'IT Services', marketCap: 'mid' },
  
  // Small Cap
  NYKAA: { name: 'FSN E-Commerce Ventures Ltd', sector: 'E-Commerce', marketCap: 'small' },
  POLICYBZR: { name: 'PB Fintech Ltd', sector: 'InsurTech', marketCap: 'small' },
  IRFC: { name: 'Indian Railway Finance Corp Ltd', sector: 'Finance', marketCap: 'small' },
  RVNL: { name: 'Rail Vikas Nigam Ltd', sector: 'Infrastructure', marketCap: 'small' },
  IREDA: { name: 'Indian Renewable Energy Dev Agency Ltd', sector: 'Finance', marketCap: 'small' },
  SUZLON: { name: 'Suzlon Energy Ltd', sector: 'Renewable Energy', marketCap: 'small' },
  YESBANK: { name: 'Yes Bank Ltd', sector: 'Banking', marketCap: 'small' },
  VODAFONE: { name: 'Vodafone Idea Ltd', sector: 'Telecom', marketCap: 'small' },
  IDFC: { name: 'IDFC First Bank Ltd', sector: 'Banking', marketCap: 'small' },
  RBLBANK: { name: 'RBL Bank Ltd', sector: 'Banking', marketCap: 'small' },
  KPITTECH: { name: 'KPIT Technologies Ltd', sector: 'IT Services', marketCap: 'small' },
  PERSISTENT: { name: 'Persistent Systems Ltd', sector: 'IT Services', marketCap: 'small' },
  HAPPSTMNDS: { name: 'Happiest Minds Technologies Ltd', sector: 'IT Services', marketCap: 'small' },
  LATENTVIEW: { name: 'Latent View Analytics Ltd', sector: 'Data Analytics', marketCap: 'small' },
  ANGELONE: { name: 'Angel One Ltd', sector: 'Brokerage', marketCap: 'small' },
  ROUTE: { name: 'Route Mobile Ltd', sector: 'Telecom Services', marketCap: 'small' },
  NETWEB: { name: 'Netweb Technologies India Ltd', sector: 'IT Hardware', marketCap: 'small' },
  RAILTEL: { name: 'RailTel Corporation of India Ltd', sector: 'Telecom Infrastructure', marketCap: 'small' },
};

export const getAllSectors = (): string[] => {
  const sectors = new Set(Object.values(STOCK_METADATA).map(s => s.sector));
  return Array.from(sectors).sort();
};
