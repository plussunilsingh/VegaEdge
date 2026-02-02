# Project: Vega Market Edge - Advanced Options Greeks Analytics

**Role**: Senior Lead Software Architect (25+ Years Experience)
**Domain**: Fintech / High-Frequency Trading Analytics

## 1. Executive Summary

We are building "Vega Market Edge," a high-performance analytics platform tracking real-time Option Chain Greeks from Upstox. The core value proposition is **precision data visualization**: filtering out market noise to show the true momentum of "Smart Money" via aggregated Greek metrics.

## 2. Critical Business Logic (The "Sweet Spot" Algorithm)

**This is the most important component of the application.**

### A. Data Filtration Strategy

- **Target Selection**: We perform analysis on ALL option contracts (Calls & Puts) regardless of delta value.
- **Comprehensive Coverage**: All strikes are included to provide complete market visibility.

### B. Aggregation Logic

- **Summation**: For every time interval, calculate the sum of individual Greek values (Vega, Gamma, Delta, Theta) for all qualifying contracts.
  - `Total_Vega = Sum(Call_Vega) + Sum(Put_Vega)` within range.
  - `Total_Gamma = Sum(Call_Gamma) + Sum(Put_Gamma)` within range.

### C. Time-Series Resolution

- **High-Frequency Polling**: Backend must calculate values every **5 seconds** to capture volatility.
- **Storage & Display Resolution**:
  - Do NOT flood the DB/UI with 5-second ticks.
  - **Aggregate to 1-Minute Candles**: The 5-second data is processed to create a final 1-minute snapshot.
  - **Persistence**: Save only the 1-minute aggregated snapshot to PostgreSQL.

### D. Visualization Requirements (The "Change" Graph)

- **Core Metric**: Users need to see the **rate of change**, not just absolute numbers.
- **Graph Logic**:
  1.  **Minute-over-Minute Change**: Plot `(Current Minute Value) - (Previous Minute Value)`.
  2.  **Cumulative Change from Open**: Plot `(Current Minute Value) - (9:15 AM Base Value)`.
- **UI Output**: A dynamic, scrolling line/area chart showing the velocity of Greeks (e.g., "Vega is accelerating").

---

## 3. Backend Architecture (Python, FastAPI, SQLAlchemy)

**Constraint**: Infrastructure is Free Tier (Render: 512MB RAM, 1 vCPU). Efficiency is paramount.

### A. Automated Authentication System

- **Problem**: Manual token generation is unsustainable.
- **Solution**: Implement a robust "Self-Healing" Token Manager.
  1.  **Daily Refresh**: Job runs at 8:55 AM IST using Selenium/Headless Browser + TOTP generation to fetch new Upstox Auth Token.
  2.  **Persistence**: Save Token to DB + In-Memory Cache.
  3.  **Failover**: If 401 Unauthorized occurs, trigger auto-regeneration immediately.

### B. "Smart Caching" & Performance (Handling 1000 Users)

- **Challenge**: 1000 users hitting DB every minute will crash a free-tier server.
- **Architecture**:
  - **Read-Through Cache**:
    - `GET /market/data`: Check In-Memory Cache (Python Dict/LRU).
    - If `(Current_Time - Cache_Time) < 2 minutes`: Return Cache.
    - Else: Fetch DB, Update Cache, Return Data.
  - **Write Strategy**: The separate Cron Job writes to DB and updates the Cache. User endpoints primarily read from Cache.

### C. Job Scheduling

- **Cron Job**: Runs every 1 minute (aligned to clock).
- **Task**:
  1.  Fetch Option Chain.
  2.  Process all strikes (no delta filtering).
  3.  Compute Aggregates.
  4.  Save to DB.
  5.  Hot-swap the Cache.

### D. API Security & Standards

- **Health Checks**: `/health` endpoint (No Auth) for uptime monitoring.
- **Error Handling**: Global Exception Handlers. Log full stack traces for backend errors; return clean JSON errors to UI.
- **Parameterization**: Endpoints must accept dynamic params (`date`, `instrument_key`, `delta_min`, `delta_max`) to future-proof the logic.

---

## 4. Frontend Architecture (React + Vite)

**Goal**: "Premium", "Instagram-like" flow. Dark mode, smooth animations, high responsiveness.

### A. UI/UX Standards

- **Aesthetics**: Glassmorphism, tailored HSL color palettes (Neon Greens/Reds for financial data).
- **Responsiveness**: Mobile-First design. Graphs must be touch-friendly.

### B. Visualization

- **Charts**: Use `Recharts` or similar for high-performance time-series rendering.
- **Data Handling**: Clean tables for raw numbers; rich graphs for trends.

### C. Performance

- **Load Handling**: heavily cache static assets. Use `SWR` or `React Query` with sensible stale-time (e.g., 30 seconds) to prevent over-fetching.

---

## 5. Quality Assurance Checklist

### UI/Frontend

- [ ] **Responsiveness**: Verify layout on iPhone SE, Pixel, iPad, 13" & 15" Laptops.
- [ ] **Performance**: Ensure Lighthouse Score > 90. No janky animations.
- [ ] **Accessibility**: ARIA labels on charts and buttons.
- [ ] **Feedback**: Loading skeletons while fetching data.

### Backend/Infrastructure

- [ ] **Scalability**: Verify memory usage stays < 400MB under load.
- [ ] **Resilience**: Test Token Regeneration during active trading hours.
- [ ] **Accuracy**: Manually verify "Sum of Deltas" matches Upstox values.
- [ ] **Security**: Ensure API Key/Secrets are ENV variables, never hardcoded.
