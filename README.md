# Indian Stock Screener - 5-Dimension Analysis

A production-grade React stock screener for Indian markets (NSE/BSE) with comprehensive 5-dimension screening capabilities. Dark terminal aesthetic inspired by Bloomberg. **Now with two powerful screening modes: Basic and Institutional Grade!**

## 🎯 Features

### **NEW: Dual Screening Modes**
- **Basic Screener**: Tabbed interface with 5-dimension analysis and visual components
- **Institutional Scanner**: Premium Bloomberg-style interface with:
  - Collapsible sidebar filters
  - Composite scoring engine (0-100)
  - Real-time market ticker (NIFTY 50, India VIX, FII Flow)
  - Color-coded ratings (Strong Buy/Buy/Neutral/Sell/Strong Sell)
  - Animated score bars
  - Enhanced professional aesthetics

### **Real-Time Data & Expanded Universe**
- **Data Source Toggle**: Switch between simulated and real-time data
- **Market Cap Filter**: Filter by Large Cap, Mid Cap, Small Cap (or any combination)
- **56 Total Stocks**: 20 Large Cap NIFTY 50 stocks + 18 Mid Cap + 18 Small Cap
- **Auto-Refresh**: Real-time data updates every 30 seconds
- **Manual Refresh**: On-demand data refresh with loading indicator

### 5-Dimension Screening Framework

#### 1. 🔬 Technical Screener
- Price vs EMA (9, 21, 50, 200)
- RSI (14) with oversold/overbought detection
- MACD crossover signals (bullish/bearish)
- Bollinger Band squeeze/breakout detection
- Volume spike analysis (vs 20-day average)
- ADX trend strength indicator
- 52-week high/low proximity
- Supertrend buy/sell signals

#### 2. 📊 Fundamental Screener
- P/E ratio vs sector median
- P/B and EV/EBITDA ratios
- ROE & ROCE performance metrics
- Debt-to-Equity analysis
- Revenue & PAT growth (YoY, QoQ)
- Promoter holding & pledge percentage
- Free Cash Flow analysis
- Dividend yield

#### 3. 🌍 Macro Filters
- FII/DII net buy/sell activity (₹ Crores)
- India VIX exposure (fear gauge)
- Repo rate sensitivity analysis
- USD/INR impact assessment
- Crude oil price correlation
- Economic indicator composite score

#### 4. 🏭 Micro / Sector Filters
- Sector relative strength vs NIFTY 50
- Block & bulk deal tracking
- Management quality score (0-10)
- Earnings surprise history (last 4 quarters)
- Order book to market cap ratio
- Capacity utilization metrics

#### 5. 🧠 Sentiment & Trend Analysis
- Options PCR (Put-Call Ratio) - bullish above 1.2
- F&O Open Interest buildup analysis
- News sentiment scoring (Positive/Negative/Neutral)
- Social media buzz ranking
- Analyst ratings consensus (Buy/Hold/Sell %)
- Insider buying/selling activity
- Short interest tracking

### 🎯 Institutional Scanner - Composite Scoring Engine

The Institutional Scanner includes a sophisticated **0-100 composite scoring system** that evaluates stocks across all 5 dimensions:

#### Score Breakdown
- **Technical (25 points)**: RSI positioning, EMA alignment, MACD signals, Volume spikes, Supertrend
- **Fundamental (25 points)**: ROE, P/E ratio, Growth rates, Debt levels, Free Cash Flow
- **Macro (20 points)**: FII/DII flows, India VIX level, Economic indicators
- **Micro (15 points)**: Sector relative strength, Management quality, Earnings surprises
- **Sentiment (15 points)**: PCR ratio, F&O buildup, Analyst consensus, News sentiment

#### Rating System
- **>80**: Strong Buy (Dark Green)
- **70-80**: Buy (Green)
- **50-70**: Neutral (Gold)
- **40-50**: Sell (Orange)
- **<40**: Strong Sell (Red)

Each stock gets a composite score displayed as an animated bar with color-coding for instant visual feedback.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📊 Stock Universe

### Large Cap (20 Stocks)
RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK, BHARTIARTL, ITC, LT, AXISBANK, MARUTI, SUNPHARMA, TATAMOTORS, TITAN, KOTAKBANK, ASIANPAINT, HCLTECH, WIPRO, ULTRACEMCO, ADANIPORTS, BAJFINANCE

### Mid Cap (18 Stocks)
TATAPOWER, GODREJCP, MUTHOOTFIN, AUROPHARMA, LUPIN, TORNTPHARM, INDIGO, ZOMATO, PAYTM, DMART, NAUKRI, ZYDUSLIFE, ALKEM, INDUSTOWER, BOSCHLTD, LTIM, MPHASIS, COFORGE

### Small Cap (18 Stocks)
NYKAA, POLICYBZR, IRFC, RVNL, IREDA, SUZLON, YESBANK, VODAFONE, IDFC, RBLBANK, KPITTECH, PERSISTENT, HAPPSTMNDS, LATENTVIEW, ANGELONE, ROUTE, NETWEB, RAILTEL

## 🔄 Data Sources

### Simulated Data
- Uses mock data generator for instant testing
- Perfect for learning and strategy development
- No API dependencies

### Real-Time Data
- Fetches live market data (simulated with realistic patterns)
- Auto-refreshes every 30 seconds
- Manual refresh available
- Ready to integrate with actual NSE/BSE APIs

## 🎨 UI Features

- **Data Source Toggle**: Seamlessly switch between simulated and real-time data
- **Market Cap Selector**: Multi-select filter for Large/Mid/Small cap stocks
- **Real-Time Updates**: Auto-refresh with timestamp display
- **Loading States**: Visual feedback during data fetching
- **Dark Bloomberg-Inspired Theme**: Professional terminal aesthetic
- **Real-time Filtering**: Instant results across all 5 dimensions
- **Market Summary Cards**: Key metrics at a glance
- **Sector Heatmap**: Visual sector performance analysis (30+ sectors)
- **Responsive Table**: Sortable columns with color-coded indicators
- **Sticky Filters**: Always accessible sidebar panel
- **Quick Reset**: One-click filter reset

## 🔧 Technology Stack

- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Lucide React** for icons
- **Pure CSS** for styling (no external UI libraries)
- **Custom Hooks** for state management and real-time data
- **Modular API Service** ready for real NSE/BSE integration

## 🔌 API Integration

The app includes a modular API service (`src/services/api.ts`) that's ready to integrate with real market data providers:

- **NSE API**: Ready for National Stock Exchange integration
- **BSE API**: Bombay Stock Exchange support
- **Technical Indicators**: Modular endpoints for TA data
## 🎯 Use Cases

- **Day Trading**: Technical signals for intraday opportunities across all market caps
- **Value Investing**: Fundamental analysis for long-term picks
- **Macro Trading**: Economic indicator-based strategies
- **Sentiment Trading**: Options and insider activity tracking
- **Sector Rotation**: Relative strength and sector performance
- **Small Cap Discovery**: Identify emerging opportunities in small caps
- **Mid Cap Growth**: Find quality mid-cap growth stocks
- **Multi-Cap Strategy**: Build diversified portfolios across market caps

Optimized for desktop trading terminals with:
- 2-column layout (filters + main content)
- Sticky sidebar for easy filter access
- Horizontal scrolling for wide tables
- Custom scrollbars matching terminal theme

## 🎯 Use Cases

- **Day Trading**: Technical signals for intraday opportunities
- **Value Investing**: Fundamental analysis for long-term picks
- **Macro Trading**: Economic indicator-based strategies
- **Sentiment Trading**: Options and insider activity tracking
- **Sector Rotation**: Relative strength and sector performance

## 📈 Filter Examples

### Bullish Momentum Screen
- Price above all EMAs
- RSI between 50-70
- MACD: Bullish
- Supertrend: Buy
- PCR > 1.2

### Quality Value Screen
- P/E < 25
- ROE > 15%
- ROCE > 20%
### Small Cap High Growth Screen
- Market Cap: Small Cap only
- Revenue Growth > 30%
- PAT Growth > 40%
- ROE > 15%
- Analyst Buy > 50%
- News Sentiment: Positive

### Cross Market Cap Value Screen
## 🔒 Disclaimer

This application uses **simulated data patterns based on real market behavior**. The "Real-Time" mode generates realistic data for demonstration purposes. For actual trading:
- Integrate with licensed market data providers
- Ensure compliance with SEBI regulations
- Always conduct thorough research
- Consult with financial advisors

## 🚀 Roadmap

- [ ] Integration with actual NSE/BSE WebSocket feeds
- [ ] Historical backtesting module
- [ ] Custom screening strategy builder
- [ ] Export screener results to CSV/Excel
- [ ] Watchlist management
- [ ] Price alerts and notifications
- [ ] Portfolio tracking integration
- [ ] Multi-timeframe analysis
- Debt-to-Equity < 0.5
- Dividend Yield > 2%

## 🔒 Disclaimerises >= 3
- News Sentiment: Positive

## 🔒 Disclaimer

This application uses **mock data for educational purposes only**. Not intended for actual trading decisions. Always conduct thorough research and consult with financial advisors before making investment decisions.

## 📝 License

MIT License - Feel free to use for educational and commercial purposes.

---

**Built with ❤️ for Indian Stock Market Traders**
