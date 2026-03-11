// Scoring engine for composite stock evaluation
import { Stock } from '../types';

export interface StockScore {
  technical: number;
  fundamental: number;
  macro: number;
  micro: number;
  sentiment: number;
  overall: number;
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
}

export const calculateStockScore = (stock: Stock): StockScore => {
  // Technical Score (25 points)
  let technical = 0;
  
  // RSI (5 points) - optimal range 40-60
  if (stock.technical.rsi14 >= 40 && stock.technical.rsi14 <= 60) technical += 5;
  else if (stock.technical.rsi14 >= 30 && stock.technical.rsi14 <= 70) technical += 3;
  else technical += 1;
  
  // Price vs EMAs (5 points)
  const aboveEMAs = [
    stock.price > stock.technical.ema9,
    stock.price > stock.technical.ema21,
    stock.price > stock.technical.ema50,
    stock.price > stock.technical.ema200
  ].filter(Boolean).length;
  technical += (aboveEMAs / 4) * 5;
  
  // MACD (5 points)
  if (stock.technical.macdSignal === 'bullish') technical += 5;
  else if (stock.technical.macdSignal === 'neutral') technical += 2;
  
  // Supertrend (5 points)
  if (stock.technical.supertrendSignal === 'buy') technical += 5;
  else if (stock.technical.supertrendSignal === 'neutral') technical += 2;
  
  // Volume & ADX (5 points)
  if (stock.technical.volumeSpike > 2 && stock.technical.adx > 25) technical += 5;
  else if (stock.technical.volumeSpike > 1.5 || stock.technical.adx > 20) technical += 3;
  else technical += 1;
  
  // Fundamental Score (25 points)
  let fundamental = 0;
  
  // ROE (7 points)
  if (stock.fundamental.roe > 20) fundamental += 7;
  else if (stock.fundamental.roe > 15) fundamental += 5;
  else if (stock.fundamental.roe > 10) fundamental += 3;
  else fundamental += 1;
  
  // P/E relative to sector (6 points)
  const peRatio = stock.fundamental.pe / stock.fundamental.sectorMedianPE;
  if (peRatio < 0.8) fundamental += 6;
  else if (peRatio < 1.0) fundamental += 4;
  else if (peRatio < 1.2) fundamental += 2;
  
  // Debt/Equity (4 points)
  if (stock.fundamental.debtToEquity < 0.5) fundamental += 4;
  else if (stock.fundamental.debtToEquity < 1.0) fundamental += 3;
  else if (stock.fundamental.debtToEquity < 2.0) fundamental += 1;
  
  // Growth (5 points)
  const avgGrowth = (stock.fundamental.revenueGrowthYoY + stock.fundamental.patGrowthYoY) / 2;
  if (avgGrowth > 20) fundamental += 5;
  else if (avgGrowth > 10) fundamental += 3;
  else if (avgGrowth > 0) fundamental += 1;
  
  // FCF (3 points)
  if (stock.fundamental.freeCashFlow > 10000) fundamental += 3;
  else if (stock.fundamental.freeCashFlow > 0) fundamental += 2;
  
  // Macro Score (20 points)
  let macro = 0;
  
  // FII/DII Flow (8 points)
  const totalInstitutional = stock.macro.fiiNetBuySell + stock.macro.diiNetBuySell;
  if (totalInstitutional > 300) macro += 8;
  else if (totalInstitutional > 100) macro += 6;
  else if (totalInstitutional > 0) macro += 3;
  else if (totalInstitutional > -100) macro += 1;
  
  // VIX (6 points)
  if (stock.macro.indiaVix < 15) macro += 6;
  else if (stock.macro.indiaVix < 20) macro += 4;
  else macro += 1;
  
  // Economic Score (6 points)
  if (stock.macro.economicIndicatorScore > 75) macro += 6;
  else if (stock.macro.economicIndicatorScore > 60) macro += 4;
  else if (stock.macro.economicIndicatorScore > 50) macro += 2;
  
  // Micro Score (15 points)
  let micro = 0;
  
  // Relative Strength (6 points)
  if (stock.micro.sectorRelativeStrength > 1.2) micro += 6;
  else if (stock.micro.sectorRelativeStrength > 1.0) micro += 4;
  else if (stock.micro.sectorRelativeStrength > 0.9) micro += 2;
  
  // Management (5 points)
  if (stock.micro.managementScore > 8.5) micro += 5;
  else if (stock.micro.managementScore > 7.5) micro += 3;
  else if (stock.micro.managementScore > 6.5) micro += 2;
  
  // Earnings Surprises (4 points)
  micro += Math.min(stock.micro.earningsSurprises, 4);
  
  // Sentiment Score (15 points)
  let sentiment = 0;
  
  // PCR (5 points)
  if (stock.sentiment.optionsPCR > 1.2) sentiment += 5;
  else if (stock.sentiment.optionsPCR > 1.0) sentiment += 3;
  else if (stock.sentiment.optionsPCR > 0.8) sentiment += 2;
  
  // F&O Buildup (4 points)
  if (stock.sentiment.foiBuildup === 'long') sentiment += 4;
  else if (stock.sentiment.foiBuildup === 'neutral') sentiment += 2;
  
  // Analyst Rating (4 points)
  if (stock.sentiment.analystBuy > 70) sentiment += 4;
  else if (stock.sentiment.analystBuy > 50) sentiment += 3;
  else if (stock.sentiment.analystBuy > 30) sentiment += 1;
  
  // News Sentiment (2 points)
  if (stock.sentiment.newsSentiment === 'positive') sentiment += 2;
  else if (stock.sentiment.newsSentiment === 'neutral') sentiment += 1;
  
  // Calculate overall score
  const overall = technical + fundamental + macro + micro + sentiment;
  
  // Determine rating
  let rating: StockScore['rating'];
  if (overall >= 80) rating = 'Strong Buy';
  else if (overall >= 70) rating = 'Buy';
  else if (overall >= 50) rating = 'Neutral';
  else if (overall >= 40) rating = 'Sell';
  else rating = 'Strong Sell';
  
  return {
    technical,
    fundamental,
    macro,
    micro,
    sentiment,
    overall,
    rating
  };
};

export const getScoreColor = (score: number): string => {
  if (score >= 70) return '#00ff41'; // Strong Buy - Green
  if (score >= 50) return '#F0B429'; // Neutral - Gold
  return '#ff4136'; // Avoid - Red
};

export const getRatingColor = (rating: StockScore['rating']): string => {
  switch (rating) {
    case 'Strong Buy': return '#00ff41';
    case 'Buy': return '#39ff14';
    case 'Neutral': return '#F0B429';
    case 'Sell': return '#ff8800';
    case 'Strong Sell': return '#ff4136';
  }
};
