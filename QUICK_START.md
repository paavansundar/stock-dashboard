# Quick Start Guide - Advanced Institutional Scanner

## Accessing the Scanner

### Step 1: Start the Application
```bash
npm run dev
```
The app will open at `http://localhost:5173` (or next available port)

### Step 2: Navigate to Institutional Scanner
Look for the top navigation bar with two buttons:
```
┌────────────────────────────────────────┐
│  INDIAN STOCK SCREENER                 │
│  ┌────────┐  ┌────────────────┐       │
│  │ BASIC  │  │ INSTITUTIONAL  │       │ 
│  └────────┘  └────────────────┘       │
└────────────────────────────────────────┘
```

Click the **INSTITUTIONAL** button (gold accent styling)

### Step 3: You'll See This Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TOP BAR: NIFTY 50 | INDIA VIX | FII FLOW | Stats | Refresh Button     │
├──────────────┬──────────────────────────────────────────────────────────┤
│              │                                                           │
│  SIDEBAR     │         RESULTS TABLE                                    │
│  FILTERS     │                                                           │
│              │  SYMBOL  CMP  CHANGE%  P/E  ROE  RSI  MACD  SCORE        │
│ ┌──────────┐│  ────────────────────────────────────────────────────── │
│ │TECHNICAL││  RELIANCE ₹2,450 +1.2%  22  18%  52   [▲]  ████ 75       │
│ │  [▼]     ││  TCS      ₹3,650 -0.5%  28  42%  48   [─]  ███  68       │
│ └──────────┘│  INFY     ₹1,550 +0.8%  25  32%  55   [▲]  ████ 72       │
│              │  ...                                                      │
│ ┌──────────┐│                                                           │
│ │FUNDAMEN- ││                                                           │
│ │TAL [▼]   ││                                                           │
│ └──────────┘│                                                           │
│              │                                                           │
│ ┌──────────┐│                                                           │
│ │MACRO [▲] ││                                                           │
│ └──────────┘│                                                           │
│              │                                                           │
│ ┌──────────┐│                                                           │
│ │SENTIMENT ││                                                           │
│ │  [▼]     ││                                                           │
│ └──────────┘│                                                           │
│              │                                                           │
│ [RESET ALL] │                                                           │
│   FILTERS    │                                                           │
└──────────────┴───────────────────────────────────────────────────────────┘
│ FOOTER: SHOWING 15 STOCKS • COMPOSITE SCORING FORMULA                   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Key Features to Try

### 1. Filter Stocks
Click any section header to expand/collapse:
- **TECHNICAL ANALYSIS** - Set RSI, EMA, MACD criteria
- **FUNDAMENTAL METRICS** - Filter by P/E, ROE, Debt/Equity
- **MACRO INDICATORS** - FII flows, VIX levels
- **SENTIMENT ANALYSIS** - PCR, analyst ratings, insider activity

### 2. View Scores
Each stock gets a **composite score (0-100)** shown as:
- Animated horizontal bar
- Numeric value
- Color coding:
  - 🟢 Green (>70): Strong buy
  - 🟡 Gold (50-70): Neutral
  - 🔴 Red (<50): Avoid

### 3. Sort Results
Click any column header to sort:
- **SYMBOL** - Alphabetical
- **CMP** - Price
- **CHANGE%** - Daily performance
- **ROE/P/E/RSI** - Individual metrics
- **SCORE** - Composite ranking (default)

### 4. Monitor Market
Top bar shows live data:
- NIFTY 50 with % change
- India VIX with status (CALM/NEUTRAL/FEAR)
- FII Flow (NET BUY/SELL)
- Qualified stocks count
- Average score

### 5. Refresh Data
Click the **REFRESH** button to update all data (auto-refreshes every 30s)

## Example: Finding Quality Momentum Stocks

1. Expand **TECHNICAL ANALYSIS**
   - Set RSI Range: 40-70
   - Select MACD: ✓ Bullish
   - Select Supertrend: ✓ Buy
   - Set Volume Spike Min: 1.5

2. Expand **FUNDAMENTAL METRICS**
   - Set ROE Min: 15%
   - Set P/E Max: 35
   - Set Debt/Equity Max: 1.0
   - Check ✓ FCF Positive

3. Expand **MACRO INDICATORS**
   - Select FII Flow: Positive
   - Set FII Net Min: 50 Cr

4. Expand **SENTIMENT ANALYSIS**
   - Set PCR Min: 1.0
   - Set Analyst Buy Min: 60%

5. **Results**: Table shows only stocks meeting ALL criteria, sorted by composite score

## Score Interpretation

| Score | Rating | Color | Meaning |
|-------|--------|-------|---------|
| 80-100 | Strong Buy | Bright Green | Exceptional across all dimensions |
| 70-79 | Buy | Green | Strong fundamentals + technicals |
| 50-69 | Neutral | Gold | Mixed signals, selective approach |
| 40-49 | Sell | Orange | Weak in multiple dimensions |
| 0-39 | Strong Sell | Red | Avoid - poor across metrics |

## Tips

✅ **DO:**
- Start with broader filters, then narrow down
- Sort by SCORE for best opportunities
- Check PCR + FII Flow for sentiment validation
- Use ROE + Debt/Equity for quality checks

❌ **DON'T:**
- Set too many filters at once (may return 0 results)
- Ignore the composite score - it's multi-dimensional
- Rely solely on technical OR fundamental alone
- Forget to refresh data periodically

## Switching Back to Basic View

Click the **BASIC** button in top navigation to return to the original tabbed interface with market summary cards and sector heatmap.

---

**Pro Tip**: The INSTITUTIONAL scanner is designed for serious traders who want multi-factor analysis with quantitative scoring. The BASIC view is better for exploration and visualization.
