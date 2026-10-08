# 🌍 CURE — Climate & Utility Risk Engine

<p align="center">

<img src="https://img.shields.io/badge/CURE-Climate%20%26%20Utility%20Risk%20Engine-00D9FF?style=for-the-badge&logo=leaf&logoColor=white" />

<img src="https://img.shields.io/badge/Environmental%20Hacks-2026-111827?style=for-the-badge&logo=amazonaws&logoColor=white" />

<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111827" />

<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />

<img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white" />

</p>

<p align="center">
  <strong>Predict water shortages before they become emergencies.</strong>
</p>

<p align="center">
  CURE transforms tank levels, consumption behavior, and upcoming heat conditions into a simple, actionable water-risk signal.
</p>

<p align="center">
  <a href="#-the-problem">Problem</a> •
  <a href="#-the-solution">Solution</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-setup">Setup</a> •
  <a href="#-contributors">Contributors</a>
</p>

---

# 🌱 The Problem

Water shortages rarely happen without warning.

A tank may look reasonably full today, but increasing consumption and upcoming heat can significantly reduce how long that supply will last.

The real question isn't:

> **"How much water do we have?"**

It's:

> **"How long will our current water supply last under current conditions?"**

Without this visibility, people often react only after the shortage becomes urgent — resulting in emergency tanker bookings, unnecessary costs, and avoidable disruption.

---

# 💡 The Solution

## Meet **CURE**

**Climate & Utility Risk Engine**

CURE is a lightweight environmental intelligence system that estimates **water runway** — the number of days a current water supply can last based on:

* 💧 Current tank capacity
* 📊 Current tank level
* 📈 Recent consumption history
* 🌡️ Upcoming temperature conditions
* 🔥 Heat-driven demand adjustment

CURE converts these signals into three simple operational states:

| Risk         | Meaning                                 |
| ------------ | --------------------------------------- |
| 🟢 **LOW**   | Current water supply appears stable     |
| 🟡 **WATCH** | Tanker planning should be reviewed soon |
| 🔴 **HIGH**  | Tanker planning is urgent               |

Instead of simply showing data, CURE answers the operational question:

> **"What should we do next?"**

---

# ⚡ Why CURE?

### Traditional monitoring

```text
Tank Level
    ↓
"62% remaining"
    ↓
Human interpretation
    ↓
Manual calculations
    ↓
Late decision
```

### CURE

```text
Tank Level
     +
Consumption History
     +
Weather Forecast
     ↓
Risk Engine
     ↓
Water Runway
     ↓
LOW / WATCH / HIGH
     ↓
Actionable Recommendation
```

**CURE turns raw utility data into a decision.**

---

# 🧠 How It Works

CURE follows a deterministic decision pipeline.

## 1️⃣ Calculate Available Water

The system converts the current tank percentage into actual liters.

```text
Available Water
=
Tank Capacity × Tank Level %
```

---

## 2️⃣ Analyze Consumption

CURE calculates average daily consumption from recent usage history.

It also identifies the consumption trend:

```text
INCREASING
DECREASING
STABLE
UNKNOWN
```

---

## 3️⃣ Account for Heat

Upcoming temperature conditions are evaluated.

Higher temperatures increase projected demand using an **illustrative MVP heuristic**.

```text
Projected Demand
=
Average Consumption
×
(1 + Heat Adjustment)
```

> The heat adjustment is an MVP heuristic, not a scientific prediction model.

---

## 4️⃣ Calculate Water Runway

The core metric is:

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

CURE converts the runway into an operational risk level:

```text
                 WATER RUNWAY
                      │
        ┌─────────────┼─────────────┐
        │             │             │
      < 2 days     2 – <4 days     ≥ 4 days
        │             │             │
        ▼             ▼             ▼
     🔴 HIGH       🟡 WATCH       🟢 LOW
        │             │             │
        ▼             ▼             ▼
 Plan tanker      Review tanker   Current supply
 immediately       planning soon    appears stable
```

---

## 6️⃣ Explain the Result

A local AI layer explains the calculated result in natural language.

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

```text
Tank Capacity          50,000 L
Current Level               62%
Available Water         31,000 L

Average Consumption   7,528.57 L/day
Temperature                30.8°C
Heat Adjustment               0%

Projected Consumption 7,528.57 L/day

Water Runway               4.12 days
```

CURE produces:

```text
🟢 LOW

Water runway is 4.12 days
based on current projected consumption.

Recommendation:
Current water supply appears stable.
```

The same system can react to lower tank levels or higher projected demand and move into **WATCH** or **HIGH**.

---

# 🔥 Heat-Aware Intelligence

CURE doesn't look at tank levels in isolation.

The system also considers upcoming maximum temperature.

Current MVP heat logic:

| Temperature / Condition | Heat Status | Demand Adjustment |
| ----------------------- | ----------- | ----------------: |
| < 32°C                  | NORMAL      |                0% |
| 32–<35°C                | MODERATE    |                5% |
| 35–<38°C                | ELEVATED    |               10% |
| ≥ 38°C or heat warning  | HIGH        |               15% |

These values are **illustrative MVP heuristics** used to demonstrate climate-aware demand adjustment.

They are intentionally not presented as scientific constants.

---

# 📈 Consumption Intelligence

CURE analyzes recent daily consumption rather than relying only on the current tank level.

Example:

```text
Day 1  ███████████████
Day 2  █████████████████
Day 3  ████████████████
Day 4  ██████████████████
Day 5  ███████████████
Day 6  █████████████████
Day 7  ████████████████
```

The system classifies the recent pattern as:

* 🟥 **INCREASING**
* 🟩 **DECREASING**
* 🟦 **STABLE**
* ⚪ **UNKNOWN**

This gives the user additional context when interpreting the projected runway.

---

# 🏗️ Architecture

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
                         │     Risk Engine      │
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

---

# 🔄 End-to-End Flow

```text
User enters utility data
          │
          ▼
Tank + Consumption + Location
          │
          ▼
Weather Forecast
          │
          ▼
Consumption Analysis
          │
          ▼
Heat Adjustment
          │
          ▼
Projected Daily Consumption
          │
          ▼
Water Runway
          │
          ▼
Risk Classification
          │
          ▼
Recommendation
          │
          ▼
AI Explanation
          │
          ▼
Interactive Dashboard
```

---

# 🖥️ Dashboard

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

| Scenario           |  Water Runway | Risk     |
| ------------------ | ------------: | -------- |
| Normal supply      | **4.12 days** | 🟢 LOW   |
| Reduced supply     | **2.99 days** | 🟡 WATCH |
| Critical supply    | **1.59 days** | 🔴 HIGH  |
| High-heat scenario | **2.72 days** | 🟡 WATCH |

### Zero-consumption edge case

When consumption history contains zero usage, CURE does not pretend that the supply will last indefinitely.

Instead:

```text
Risk: WATCH

Reason:
Risk cannot be fully assessed because consumption
data shows zero usage.

Recommendation:
Verify consumption data before making a tanker decision.
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
Tank capacity < 0
Tank level > 100%
Negative consumption
Latitude outside -90 to 90
Longitude outside -180 to 180
```

are rejected by the API.

---

# 🤖 Local AI Architecture

CURE uses a local Ollama model for the natural-language explanation layer.

```text
                    Risk Engine
                         │
                         │ Structured result
                         ▼
                 ┌───────────────┐
                 │ CURE AI Layer │
                 └───────┬───────┘
                         │
                         ▼
                 Ollama / llama3.2:3b
                         │
                         ▼
                Human-readable explanation
```

The design intentionally separates:

```text
CALCULATION ≠ GENERATION
```

The risk engine determines the result.

The AI explains the result.

This prevents the language model from becoming the authority for the environmental calculation.

---

# 🛠️ Technology Stack

## Frontend

* ⚛️ React
* ⚡ Vite
* 🎨 Tailwind CSS
* 📊 Recharts

## Backend

* 🐍 Python
* 🚀 FastAPI
* 🛡️ Pydantic
* 🌐 HTTPX

## Intelligence

* 🧠 Deterministic Risk Engine
* 📈 Consumption Analysis Engine
* 🌡️ Heat Adjustment Engine
* 🤖 Ollama
* 🧩 CURE AI Explanation Layer

## Weather

* ☁️ Open-Meteo API

## Development

* Git
* GitHub
* PowerShell
* Local-first architecture

---

# ☁️ AWS & Open-Source Approach

CURE follows a **local-first architecture** so the core environmental intelligence can be developed and demonstrated without depending on a paid cloud account.

The system is modular and designed so cloud infrastructure can be introduced without changing the core risk calculation.

The key principle is:

> **Environmental intelligence should remain portable, testable, and independent of a single infrastructure provider.**

---

# 📁 Project Structure

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

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Python 3.14+
* Node.js
* npm
* Ollama

---

## 1. Clone the Repository

```bash
git clone https://github.com/dhanush080607/CURE.git
cd CURE
```

---

## 2. Start Ollama

Install/pull the model:

```bash
ollama pull llama3.2:3b
```

Then:

```bash
ollama run llama3.2:3b
```

---

## 3. Start the Backend

```powershell
cd backend
```

Create the virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start FastAPI:

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 4. Start the Frontend

Open another terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start Vite:

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🎬 Demo Flow

A typical CURE demonstration can be completed in under three minutes:

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

The system calculates:

```text
Available Water
Average Consumption
Heat Adjustment
Projected Consumption
Water Runway
Risk Level
```

### 05 — Decide

CURE produces:

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

## Phase 1 — MVP

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

## Phase 2 — Intelligence

* [ ] Historical demand forecasting
* [ ] Smarter heat-demand modelling
* [ ] Tanker requirement estimation
* [ ] Persistent historical data
* [ ] Multi-tank support
* [ ] Automated alerts

## Phase 3 — Connected Utilities

* [ ] IoT tank sensors
* [ ] Real-time tank monitoring
* [ ] Community-level dashboards
* [ ] Water conservation recommendations
* [ ] Municipal utility integration

---

# 🏆 Hackathon

## WeMakeDevs × AWS — Environmental Hacks 2026

CURE was built for **Environmental Hacks 2026**, focusing on environmental intelligence and practical utility decision-making.

### Core idea

> **Don't wait for the tank to run dry. Know the runway.**

---

# 🤝 Contributors

CURE is built collaboratively by:

| Contributor        | Role                                                             |
| ------------------ | ---------------------------------------------------------------- |
| **Dhanush**        | Project Lead • Backend • Risk Engine • AI Integration • Frontend |
| **KCDharshan9**    | Contributor                                                      |
| **FaheedBasha123** | Contributor                                                      |

<p align="center">

<a href="https://github.com/dhanush080607">
  <img src="https://github.com/dhanush080607.png" width="90px" alt="Dhanush"/>
</a>
&nbsp;&nbsp;&nbsp;

<a href="https://github.com/KCDharshan9">
  <img src="https://github.com/KCDharshan9.png" width="90px" alt="KCDharshan9"/>
</a>
&nbsp;&nbsp;&nbsp;

<a href="https://github.com/FaheedBasha123">
  <img src="https://github.com/FaheedBasha123.png" width="90px" alt="FaheedBasha123"/>
</a>

</p>

<p align="center">

<a href="https://github.com/dhanush080607"><strong>Dhanush</strong></a>
  •   <a href="https://github.com/KCDharshan9"><strong>KCDharshan9</strong></a>
  •   <a href="https://github.com/FaheedBasha123"><strong>FaheedBasha123</strong></a>

</p>

---

# 👨‍💻 Builder

### Dhanush

Building AI-powered systems that solve practical problems.

**GitHub:** [@dhanush080607](https://github.com/dhanush080607)

---

<p align="center">

# 🌍 CURE

### Know your water runway before you run out.

**Climate Intelligence • Utility Awareness • Actionable Decisions**

<br/>

💧 + 🧠 + 🌡️ + 📊 = 🌍

</p>

---

<p align="center">
<strong>Built with purpose. Designed for impact.</strong>
</p>
