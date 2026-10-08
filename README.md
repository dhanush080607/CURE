<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=250&color=0:020617,35:083344,70:0891b2,100:06b6d4&text=🌍%20CURE&fontSize=75&fontColor=ffffff&fontAlignY=38&desc=Climate%20%26%20Utility%20Risk%20Engine&descAlignY=62&descSize=22&animation=fadeIn" width="100%"/>

<br>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=20&duration=2800&pause=700&color=22D3EE&center=true&vCenter=true&width=850&lines=Predict+water+shortages+before+they+become+emergencies.;Turn+climate+signals+into+action.;Know+your+water+runway+before+you+run+out.;Climate+intelligence+for+real-world+utilities." alt="CURE"/>

<br><br>

<img src="https://img.shields.io/badge/🌱_Environmental_Intelligence-06b6d4?style=for-the-badge"/>
<img src="https://img.shields.io/badge/⚡_Hackathon_2026-0891b2?style=for-the-badge"/>
<img src="https://img.shields.io/badge/🤖_Local_AI-0e7490?style=for-the-badge"/>
<img src="https://img.shields.io/github/last-commit/dhanush080607/CURE?style=for-the-badge&color=06b6d4"/>

<br><br>

### 💧 **Know your water runway before you run out.**

</div>

---

<div align="center">

```text
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              C L I M A T E   →   I N T E L L I G E N C E   ║
║                                                              ║
║        WATER  •  CONSUMPTION  •  HEAT  •  WEATHER           ║
║                          ↓                                   ║
║                     CURE ENGINE                              ║
║                          ↓                                   ║
║                  RISK  →  ACTION                             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

</div>

# 🌱 The Problem

<div align="center">

### Water shortages rarely happen without warning.

</div>

A tank may look reasonably full today, but increasing consumption and upcoming heat can significantly reduce how long that supply will last.

The real question isn't:

> **"How much water do we have?"**

It's:

> ### 💧 **"How long will our current water supply last under current conditions?"**

Without this visibility, people often react only after the shortage becomes urgent — resulting in emergency tanker bookings, unnecessary costs, and avoidable disruption.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=06b6d4" width="80%"/>

### ⚠️ FROM REACTIVE → PROACTIVE

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=16&duration=2500&pause=700&color=67E8F9&center=true&vCenter=true&width=700&lines=Don't+wait+for+the+tank+to+run+dry.;Predict.+Prepare.+Act." />

</div>

---

# 💡 The Solution

<div align="center">

# Meet **CURE**

### **Climate & Utility Risk Engine**

</div>

CURE is a lightweight environmental intelligence system that estimates **water runway** — the number of days a current water supply can last based on:

* 💧 Current tank capacity
* 📊 Current tank level
* 📈 Recent consumption history
* 🌡️ Upcoming temperature conditions
* 🔥 Heat-driven demand adjustment

<div align="center">

### 🚦 CURE converts these signals into three simple operational states

<br>

|     Risk     | Meaning                                 |
| :----------: | :-------------------------------------- |
|  🟢 **LOW**  | Current water supply appears stable     |
| 🟡 **WATCH** | Tanker planning should be reviewed soon |
|  🔴 **HIGH** | Tanker planning is urgent               |

</div>

Instead of simply showing data, CURE answers the operational question:

> ### 🎯 **"What should we do next?"**

---

# ⚡ Why CURE?

## Traditional monitoring

```text
                         ┌───────────────┐
                         │   Tank Level  │
                         └───────┬───────┘
                                 ↓
                         ┌───────────────┐
                         │ "62% remaining"│
                         └───────┬───────┘
                                 ↓
                         Human interpretation
                                 ↓
                         Manual calculations
                                 ↓
                         Late decision
                                 ↓
                              ⚠️ TOO LATE
```

## CURE

```text
                💧 Tank Level
                     +
                📈 Consumption
                     +
                🌡️ Weather
                     │
                     ▼
             ┌───────────────┐
             │  RISK ENGINE  │
             └───────┬───────┘
                     ↓
               ⏳ WATER RUNWAY
                     ↓
            ┌────────┼────────┐
            ↓        ↓        ↓
          🟢 LOW   🟡 WATCH   🔴 HIGH
            ↓        ↓        ↓
            └────────┼────────┘
                     ↓
             🎯 ACTIONABLE
             RECOMMENDATION
```

<div align="center">

### **CURE turns raw utility data into a decision.**

</div>

---

# 🧠 How It Works

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=17&duration=2200&pause=500&color=22D3EE&center=true&vCenter=true&width=650&lines=Measure+→+Analyze+→+Adjust+→+Project+→+Decide+→+Explain" />

</div>

CURE follows a deterministic decision pipeline.

---

## 1️⃣ Calculate Available Water

The system converts the current tank percentage into actual liters.

```text
┌─────────────────────────────────────┐
│         AVAILABLE WATER             │
├─────────────────────────────────────┤
│                                     │
│  Tank Capacity × Tank Level %       │
│                                     │
└─────────────────────────────────────┘
```

```text
Available Water
=
Tank Capacity × Tank Level %
```

---

## 2️⃣ Analyze Consumption

CURE calculates average daily consumption from recent usage history.

It also identifies the consumption trend:

<div align="center">

```text
       📈 INCREASING
             │
             ▼
       Higher demand

       📉 DECREASING
             │
             ▼
        Lower demand

       ━━━ STABLE ━━━
             │
             ▼
       Normal pattern

       ⚪ UNKNOWN
             │
             ▼
      Not enough data
```

</div>

---

## 3️⃣ Account for Heat

Upcoming temperature conditions are evaluated.

Higher temperatures increase projected demand using an **illustrative MVP heuristic**.

```text
                🌡️ TEMPERATURE
                       │
                       ▼
                HEAT CONDITION
                       │
                       ▼
               HEAT ADJUSTMENT
                       │
                       ▼
              PROJECTED DEMAND
```

```text
Projected Demand
=
Average Consumption
×
(1 + Heat Adjustment)
```

> ⚠️ The heat adjustment is an MVP heuristic, not a scientific prediction model.

---

## 4️⃣ Calculate Water Runway

<div align="center">

### ⏳ The core metric

```text
╔══════════════════════════════════╗
║                                  ║
║       AVAILABLE WATER            ║
║              ÷                   ║
║    PROJECTED DAILY CONSUMPTION   ║
║              ↓                   ║
║       ⏳ WATER RUNWAY             ║
║                                  ║
╚══════════════════════════════════╝
```

</div>

```text
Water Runway
=
Available Water
÷
Projected Daily Consumption
```

This estimates how many days the available supply can last under the current projection.

---

## 5️⃣ Determine Risk

<div align="center">

```text
                       ⏳ WATER RUNWAY
                              │
              ┌───────────────┼───────────────┐
              │               │               │
          < 2 DAYS        2 – <4 DAYS       ≥ 4 DAYS
              │               │               │
              ▼               ▼               ▼
          🔴 HIGH          🟡 WATCH          🟢 LOW
              │               │               │
              ▼               ▼               ▼
       PLAN TANKER       REVIEW TANKER     CURRENT SUPPLY
       IMMEDIATELY         PLANNING SOON     APPEARS STABLE
```

</div>

---

## 6️⃣ Explain the Result

A local AI layer explains the calculated result in natural language.

<div align="center">

```text
       ┌─────────────────────────┐
       │    DETERMINISTIC        │
       │      RISK ENGINE         │
       └────────────┬────────────┘
                    │
                    ▼
             CALCULATED RESULT
                    │
                    ▼
       ┌─────────────────────────┐
       │       CURE AI            │
       │    LOCAL EXPLANATION     │
       └────────────┬────────────┘
                    │
                    ▼
            HUMAN-READABLE
               DECISION
```

</div>

The **deterministic risk engine remains the source of truth**.

The AI layer is responsible for:

* Explaining the result
* Communicating the risk reason
* Communicating the recommendation
* Summarizing consumption trends

It does **not** replace the underlying risk calculation.

---

# 📊 Example

Consider:

<div align="center">

```text
╭────────────────────────────────────────────╮
│             CURE INPUT SNAPSHOT             │
├────────────────────────────────────────────┤
│                                            │
│  Tank Capacity          50,000 L           │
│  Current Level               62%           │
│  Available Water         31,000 L          │
│                                            │
│  Average Consumption   7,528.57 L/day      │
│  Temperature                30.8°C          │
│  Heat Adjustment               0%           │
│                                            │
│  Projected Consumption 7,528.57 L/day      │
│                                            │
│  ⏳ Water Runway             4.12 days      │
│                                            │
╰────────────────────────────────────────────╯
```

### RESULT

# 🟢 LOW

**Water runway is 4.12 days based on current projected consumption.**

### Recommendation

> **Current water supply appears stable.**

</div>

The same system can react to lower tank levels or higher projected demand and move into **WATCH** or **HIGH**.

---

# 🔥 Heat-Aware Intelligence

CURE doesn't look at tank levels in isolation.

The system also considers upcoming maximum temperature.

<div align="center">

```text
       🌡️ WEATHER
            │
            ▼
      MAX TEMPERATURE
            │
            ▼
      🔥 HEAT STATUS
            │
            ▼
     DEMAND ADJUSTMENT
            │
            ▼
    PROJECTED CONSUMPTION
            │
            ▼
       ⏳ RUNWAY
```

</div>

### Current MVP heat logic

|  Temperature / Condition | Heat Status | Demand Adjustment |
| :----------------------: | :---------: | :---------------: |
|         `< 32°C`         |  🟢 NORMAL  |        `0%`       |
|        `32–<35°C`        | 🟡 MODERATE |        `5%`       |
|        `35–<38°C`        | 🟠 ELEVATED |       `10%`       |
| `≥ 38°C or heat warning` |   🔴 HIGH   |       `15%`       |

> These values are **illustrative MVP heuristics** used to demonstrate climate-aware demand adjustment.

They are intentionally not presented as scientific constants.

---

# 📈 Consumption Intelligence

CURE analyzes recent daily consumption rather than relying only on the current tank level.

<div align="center">

```text
DAY 1   ███████████████
DAY 2   █████████████████
DAY 3   ████████████████
DAY 4   ██████████████████
DAY 5   ███████████████
DAY 6   █████████████████
DAY 7   ████████████████
```

</div>

The system classifies the recent pattern as:

<div align="center">

### 🟥 INCREASING    🟩 DECREASING    🟦 STABLE    ⚪ UNKNOWN

</div>

This gives the user additional context when interpreting the projected runway.

---

# 🏗️ Architecture

<div align="center">

```text
                         ┌──────────────────────┐
                         │       CURE UI        │
                         │   React + Vite       │
                         │  Tailwind + Recharts │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI API     │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
      │ Consumption   │     │  Heat Engine  │     │    Weather    │
      │    Engine     │     │               │     │    Service    │
      └───────┬───────┘     └───────┬───────┘     └───────┬───────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ▼
                         ┌──────────────────────┐
                         │     RISK ENGINE      │
                         │                      │
                         │  Water Runway        │
                         │  Risk Level          │
                         │  Risk Reason         │
                         │  Recommendation      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       CURE AI        │
                         │    Local Ollama      │
                         │  Explanation Layer   │
                         └──────────────────────┘
```

</div>

---

# 🔄 End-to-End Flow

<div align="center">

```text
        👤 USER
           │
           ▼
   Utility Data Input
           │
           ▼
   💧 Tank + Consumption
           │
           ▼
      ☁️ Weather
           │
           ▼
   📈 Consumption Analysis
           │
           ▼
      🔥 Heat Adjustment
           │
           ▼
   📊 Projected Demand
           │
           ▼
      ⏳ Water Runway
           │
           ▼
      🚦 Risk Level
           │
           ▼
      🎯 Recommendation
           │
           ▼
        🤖 CURE AI
           │
           ▼
    🖥️ Dashboard
```

</div>

---

# 🖥️ Dashboard

<div align="center">

### ONE SCREEN.

### ONE DECISION.

### COMPLETE WATER CONTEXT.

</div>

The CURE dashboard provides a single operational view containing:

### 💧 Water Availability

Current available water in liters.

### ⏳ Water Runway

Estimated number of days remaining.

### 🚦 Risk Level

LOW / WATCH / HIGH.

### 📈 Consumption Analysis

Recent water usage and trend.

### 🌡️ Heat Intelligence

Temperature forecast and demand adjustment.

### ☁️ Weather Forecast

Upcoming temperature conditions.

### 🤖 CURE AI

Natural-language explanation of the calculated result.

### 📋 Risk Reason

The exact deterministic reason behind the assigned risk level.

### 🎯 Recommendation

The action suggested by the system.

---

# 🧪 Tested Scenarios

CURE has been tested across multiple operational scenarios.

<div align="center">

| Scenario           |  Water Runway |     Risk     |
| :----------------- | ------------: | :----------: |
| Normal supply      | **4.12 days** |  🟢 **LOW**  |
| Reduced supply     | **2.99 days** | 🟡 **WATCH** |
| Critical supply    | **1.59 days** |  🔴 **HIGH** |
| High-heat scenario | **2.72 days** | 🟡 **WATCH** |

</div>

### Zero-consumption edge case

When consumption history contains zero usage, CURE does not pretend that the supply will last indefinitely.

```text
┌────────────────────────────────────────────┐
│                 ⚠️ WATCH                   │
├────────────────────────────────────────────┤
│                                            │
│ Risk cannot be fully assessed because      │
│ consumption data shows zero usage.         │
│                                            │
│ Recommendation:                            │
│ Verify consumption data before making      │
│ a tanker decision.                         │
│                                            │
└────────────────────────────────────────────┘
```

---

# 🛡️ Input Validation

CURE validates user input before processing.

Protected inputs include:

* Tank capacity
* Tank level percentage
* Consumption history
* Latitude
* Longitude

Invalid examples such as:

```text
❌ Tank capacity < 0
❌ Tank level > 100%
❌ Negative consumption
❌ Latitude outside -90 to 90
❌ Longitude outside -180 to 180
```

are rejected by the API.

---

# 🤖 Local AI Architecture

CURE uses a local Ollama model for the natural-language explanation layer.

<div align="center">

```text
                         RISK ENGINE
                              │
                              │
                     STRUCTURED RESULT
                              │
                              ▼
                    ┌─────────────────┐
                    │    CURE AI      │
                    │  EXPLANATION     │
                    │     LAYER        │
                    └────────┬────────┘
                             │
                             ▼
                    🧠 llama3.2:3b
                             │
                             ▼
                    HUMAN EXPLANATION
```

### The architecture intentionally separates

```text
╔══════════════════════════════════════╗
║                                      ║
║       CALCULATION ≠ GENERATION      ║
║                                      ║
╚══════════════════════════════════════╝
```

</div>

The risk engine determines the result.

The AI explains the result.

This prevents the language model from becoming the authority for the environmental calculation.

---

# 🛠️ Technology Stack

<div align="center">

| Layer           | Technologies                                   |
| :-------------- | :--------------------------------------------- |
| 🎨 Frontend     | React • Vite • Tailwind CSS • Recharts         |
| ⚡ Backend       | Python • FastAPI • Pydantic • HTTPX            |
| 🧠 Intelligence | Risk Engine • Consumption Engine • Heat Engine |
| 🤖 AI           | Ollama • llama3.2:3b                           |
| ☁️ Weather      | Open-Meteo                                     |
| 🔧 Development  | Git • GitHub • PowerShell                      |

</div>

---

# ☁️ AWS & Open-Source Approach

CURE follows a **local-first architecture** so the core environmental intelligence can be developed and demonstrated without depending on a paid cloud account.

The system is modular and designed so cloud infrastructure can be introduced without changing the core risk calculation.

<div align="center">

```text
┌─────────────────────────────────────────┐
│                                         │
│     🌍 PORTABLE ENVIRONMENTAL AI        │
│                                         │
│       Modular • Testable • Local        │
│                                         │
└─────────────────────────────────────────┘
```

</div>

The key principle is:

> **Environmental intelligence should remain portable, testable, and independent of a single infrastructure provider.**

---

# 📁 Project Structure

<details>
<summary><b>📂 Click to expand repository structure</b></summary>

```text
CURE/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── agent.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── api/
│   │   │   ├── ai.py
│   │   │   ├── consumption.py
│   │   │   ├── heat.py
│   │   │   ├── water.py
│   │   │   └── weather.py
│   │   │
│   │   ├── risk/
│   │   │   ├── consumption_engine.py
│   │   │   ├── heat_engine.py
│   │   │   └── risk_engine.py
│   │   │
│   │   ├── services/
│   │   │   └── weather_service.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── data/
├── docs/
├── ml/
├── .gitignore
└── README.md
```

</details>

---

# 🚀 Getting Started

<details>
<summary><b>⚙️ Installation & Setup</b></summary>

## Prerequisites

* Python 3.14+
* Node.js
* npm
* Ollama

### 1. Clone

```bash
git clone https://github.com/dhanush080607/CURE.git
cd CURE
```

### 2. Start Ollama

```bash
ollama pull llama3.2:3b
ollama run llama3.2:3b
```

### 3. Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### 4. Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

</details>

---

# 🎬 Demo Flow

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=17&duration=2300&pause=600&color=22D3EE&center=true&vCenter=true&width=650&lines=Enter+data.;Fetch+weather.;Calculate+runway.;Classify+risk.;Take+action." />

</div>

### 01 — Enter current tank conditions

```text
Capacity: 50,000 L
Tank level: 62%
```

### 02 — Provide recent consumption

```text
7 days of daily consumption
```

### 03 — Fetch weather

CURE retrieves upcoming temperature conditions.

### 04 — Calculate

```text
Available Water
Average Consumption
Heat Adjustment
Projected Consumption
Water Runway
Risk Level
```

### 05 — Decide

```text
🟢 LOW
🟡 WATCH
🔴 HIGH
```

### 06 — Explain

CURE AI provides a concise natural-language explanation.

### 07 — Change the scenario

Lower the tank level or introduce higher heat conditions.

The dashboard immediately demonstrates how the risk changes.

---

# 🌍 Environmental Impact

<div align="center">

```text
                 BETTER DATA
                      │
                      ▼
              BETTER PREDICTION
                      │
                      ▼
             BETTER PREPARATION
                      │
                      ▼
              LESS EMERGENCY
                      │
                      ▼
                 🌍 IMPACT
```

</div>

CURE is built around one simple principle:

> **Better prediction → better preparation → less emergency response.**

Potential applications include:

```text
🏠 Households
      ↓
🏢 Apartment Communities
      ↓
🏫 Schools & Colleges
      ↓
🏥 Hospitals
      ↓
🏭 Facilities
      ↓
🏙️ Communities
```

Future versions could combine real-time sensor data with predictive models to provide continuous water-risk monitoring.

---

# 🔮 Roadmap

<div align="center">

### 🟢 PHASE 1 — MVP

</div>

* [x] Water runway calculation
* [x] Consumption analysis
* [x] Consumption trend detection
* [x] Heat adjustment
* [x] Weather integration
* [x] Risk classification
* [x] Risk explanation
* [x] Actionable recommendation
* [x] Local AI explanation
* [x] Interactive dashboard
* [x] Input validation
* [x] LOW / WATCH / HIGH testing

<div align="center">

### 🟡 PHASE 2 — INTELLIGENCE

</div>

* [ ] Historical demand forecasting
* [ ] Smarter heat-demand modelling
* [ ] Tanker requirement estimation
* [ ] Persistent historical data
* [ ] Multi-tank support
* [ ] Automated alerts

<div align="center">

### 🔵 PHASE 3 — CONNECTED UTILITIES

</div>

* [ ] IoT tank sensors
* [ ] Real-time tank monitoring
* [ ] Community-level dashboards
* [ ] Water conservation recommendations
* [ ] Municipal utility integration

---

# 🏆 Hackathon

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&height=100&color=0:020617,50:0891b2,100:06b6d4&text=ENVIRONMENTAL%20HACKS%202026&fontSize=28&fontColor=ffffff&animation=fadeIn"/>

### WeMakeDevs × AWS

<br>

### 🌱 Environmental Intelligence

**CURE turns climate and utility signals into practical decisions.**

</div>

---

# 🤝 Contributors

<div align="center">

<a href="https://github.com/dhanush080607">
<img src="https://github.com/dhanush080607.png" width="100px" alt="Dhanush"/>
</a>
&nbsp;&nbsp;&nbsp;
<a href="https://github.com/KCDharshan9">
<img src="https://github.com/KCDharshan9.png" width="100px" alt="KCDharshan9"/>
</a>
&nbsp;&nbsp;&nbsp;
<a href="https://github.com/FaheedBasha123">
<img src="https://github.com/FaheedBasha123.png" width="100px" alt="FaheedBasha123"/>
</a>

<br>

<b>Dhanush</b>
  •   <b>KCDharshan9</b>
  •   <b>FaheedBasha123</b>

<br><br>

<img src="https://contrib.rocks/image?repo=dhanush080607/CURE" alt="CURE contributors"/>

</div>

---

# 📊 Repository Pulse

<div align="center">

<a href="https://github.com/dhanush080607/CURE">
<img src="https://github-readme-stats.vercel.app/api/pin/?username=dhanush080607&repo=CURE&theme=tokyonight&hide_border=true&bg_color=020617&title_color=22d3ee&text_color=cbd5e1&icon_color=06b6d4" />
</a>

</div>

---

# 👨‍💻 Builder

<div align="center">

<a href="https://github.com/dhanush080607">

<img src="https://github.com/dhanush080607.png" width="120px" alt="Dhanush"/>

### Dhanush

</a>

**Building AI-powered systems that solve practical problems.**

<br>

<a href="https://github.com/dhanush080607">

<img src="https://img.shields.io/badge/GitHub-@dhanush080607-181717?style=for-the-badge&logo=github"/>

</a>

</div>

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=21&duration=3000&pause=800&color=22D3EE&center=true&vCenter=true&width=800&lines=Don't+wait+for+the+shortage.;Know+the+runway.;Predict+earlier.;Prepare+smarter.;Act+before+the+water+runs+out." />

<br><br>

# 💧 CURE

### Climate Intelligence • Utility Awareness • Actionable Decisions

<br>

**💧 + 🧠 + 🌡️ + 📊 = 🌍**

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&height=150&color=0:06b6d4,50:0891b2,100:020617&section=footer&animation=fadeIn" width="100%"/>

</div>
