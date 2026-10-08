<div align="center">

```text
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║                    ██████╗██╗   ██╗██████╗ ███████╗                  ║
║                   ██╔════╝██║   ██║██╔══██╗██╔══════╝                 ║
║                   ██║     ██║   ██║██████╔╝█████╗                    ║
║                   ██║     ██║   ██║██╔══██╗██╔══╝                    ║
║                   ╚██████╗╚██████╔╝██║  ██║███████╗                  ║
║                    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝                  ║
║                                                                      ║
║             C L I M A T E   &   U T I L I T Y   R I S K             ║
║                           E N G I N E                                ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

### `> KNOW YOUR WATER RUNWAY BEFORE YOU RUN OUT.`

**Predict → Understand → Decide → Act**

<br>

![Environmental Intelligence](https://img.shields.io/badge/ENVIRONMENTAL-INTELLIGENCE-0f172a?style=for-the-badge)
![Water Risk](https://img.shields.io/badge/WATER-RISK-0f172a?style=for-the-badge)
![Local AI](https://img.shields.io/badge/AI-LOCAL%20%2F%20OFFLINE-0f172a?style=for-the-badge)
![AWS](https://img.shields.io/badge/AWS-READY-0f172a?style=for-the-badge)

<br>

`STATUS: ONLINE` • `ENGINE: ACTIVE` • `AI: CONNECTED` • `WEATHER: LIVE`

</div>

---

# `01` // THE PROBLEM

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         WATER STRESS                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Most water management is REACTIVE.                                 │
│                                                                     │
│       Tank level drops                                              │
│              ↓                                                      │
│       Shortage gets noticed                                         │
│              ↓                                                      │
│       Emergency tanker                                              │
│              ↓                                                      │
│       Too late                                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

A tank being **62% full** does not tell the complete story.

What matters is:

```text
CURRENT SUPPLY
      +
CONSUMPTION BEHAVIOR
      +
UPCOMING WEATHER
      ↓
HOW MANY DAYS OF WATER REMAIN?
```

A household, apartment, campus, or facility needs to know **before the shortage happens**, not after.

---

# `02` // THE SOLUTION

## CURE turns raw utility data into an actionable decision.

```text
       ┌─────────────┐
       │ TANK LEVEL  │
       └──────┬──────┘
              │
       ┌──────▼──────┐
       │ CONSUMPTION │
       └──────┬──────┘
              │
       ┌──────▼──────┐
       │   WEATHER   │
       └──────┬──────┘
              │
              ▼
      ┌─────────────────┐
      │   CURE ENGINE   │
      └────────┬────────┘
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
     DEMAND  RUNWAY    RISK
       │       │        │
       └───────┼────────┘
               ▼
        ACTIONABLE ADVICE
```

CURE — **Climate & Utility Risk Engine** — estimates how long the current water supply can last by combining:

* 💧 Available water
* 📊 Historical consumption
* 🌡️ Upcoming heat conditions
* 📈 Projected daily demand
* ⏳ Water runway
* ⚠️ Risk classification
* 🤖 Local AI explanation

---

# `03` // WHY CURE?

```text
╭───────────────────────┬────────────────────────────────────────────╮
│ Traditional approach  │ CURE                                       │
├───────────────────────┼────────────────────────────────────────────┤
│ Check tank level      │ Check future water runway                 │
│ React to shortage     │ Predict shortage risk                     │
│ Static consumption    │ Consumption intelligence                  │
│ Ignore weather        │ Heat-aware demand projection               │
│ Manual interpretation │ AI-assisted explanation                    │
│ Emergency response    │ Earlier planning                           │
╰───────────────────────┴────────────────────────────────────────────╯
```

> **CURE doesn't simply tell you how much water you have.
> It tells you how long that water may last.**

---

# `04` // HOW IT WORKS

### `INPUT → INTELLIGENCE → DECISION`

```text
                         CURE PIPELINE
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        💧 WATER          📊 USAGE         🌤 WEATHER
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                    ┌────────────────────┐
                    │   DATA PROCESSING  │
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
                    │ CONSUMPTION ENGINE │
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
                    │    HEAT ENGINE     │
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
                    │     RISK ENGINE    │
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
                    │    WATER RUNWAY    │
                    └─────────┬──────────┘
                              ▼
                     ┌─────────────────┐
                     │   RISK LEVEL    │
                     └────────┬────────┘
                              ▼
                         🤖 LOCAL AI
                              │
                              ▼
                     ACTIONABLE ADVICE
```

### Processing sequence

**01 → Calculate available water**

```text
available water
    =
tank capacity × tank level %
```

**02 → Analyze consumption**

Historical daily usage is averaged to estimate normal demand.

**03 → Analyze heat**

Upcoming temperature conditions can increase projected water demand.

**04 → Project demand**

```text
projected demand
    =
average consumption × heat adjustment
```

**05 → Calculate runway**

```text
water runway
    =
available water ÷ projected daily consumption
```

**06 → Classify risk**

```text
RUNWAY < 2 DAYS       → HIGH
RUNWAY < 4 DAYS       → WATCH
RUNWAY ≥ 4 DAYS       → LOW
```

These thresholds are the current MVP decision rules.

---

# `05` // LIVE EXAMPLE

```text
$ cure analyze

Loading water data................. OK
Loading consumption history........ OK
Loading weather forecast........... OK
Running heat analysis.............. OK
Running risk engine................ OK
Connecting local AI................ OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    WATER ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tank capacity              50,000 L
Current level                   62%
Available water             31,000 L

Average consumption       7,528.57 L/day
Projected consumption     7,528.57 L/day

Maximum temperature            30.8 °C
Heat adjustment                    0%
Consumption trend             STABLE

Water runway                  4.12 days

RISK LEVEL                       LOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATION
> Current water supply appears stable.
```

---

# `06` // HEAT-AWARE INTELLIGENCE

Heat changes water demand.

CURE therefore does not treat:

```text
7,500 L/day
```

as a permanently fixed number.

Instead:

```text
NORMAL CONDITIONS
        │
        ▼
BASE CONSUMPTION
        │
        ├──── 32°C+  → +5%
        │
        ├──── 35°C+  → +10%
        │
        └──── 38°C+  → +15%
        │
        ▼
PROJECTED DEMAND
```

### Current MVP heat model

| Condition           | Adjustment | Status   |
| ------------------- | ---------: | -------- |
| `< 32°C`            |         0% | NORMAL   |
| `32–34.9°C`         |        +5% | MODERATE |
| `35–37.9°C`         |       +10% | ELEVATED |
| `≥ 38°C` or warning |       +15% | HIGH     |

> These are **MVP heuristics**, not scientific constants.

---

# `07` // CONSUMPTION INTELLIGENCE

CURE analyzes historical daily consumption instead of relying only on today's tank level.

```text
CONSUMPTION HISTORY

Day 1   ███████████████████  7,200 L
Day 2   ████████████████████ 7,400 L
Day 3   ████████████████████ 7,500 L
Day 4   █████████████████████ 7,800 L
Day 5   █████████████████████ 7,900 L
Day 6   ████████████████████ 7,600 L
Day 7   ████████████████████ 7,900 L
                         ───────────────► TIME
```

CURE identifies the consumption trend as:

```text
INCREASING
DECREASING
STABLE
UNKNOWN
```

This gives the risk engine another signal beyond current tank level.

---

# `08` // RISK ENGINE

The decision layer converts all signals into one understandable result.

```text
                 ┌───────────────────────┐
                 │   AVAILABLE WATER     │
                 └───────────┬───────────┘
                             │
                 ┌───────────▼───────────┐
                 │ PROJECTED CONSUMPTION │
                 └───────────┬───────────┘
                             │
                 ┌───────────▼───────────┐
                 │    WATER RUNWAY       │
                 └───────────┬───────────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
             < 2 days     < 4 days      ≥ 4 days
                │            │            │
                ▼            ▼            ▼
              HIGH         WATCH         LOW
```

### Decision output

```text
HIGH
└── Plan a tanker immediately.

WATCH
└── Review tanker planning soon.

LOW
└── Current water supply appears stable.
```

---

# `09` // ARCHITECTURE

```text
                         ┌─────────────────────┐
                         │      FRONTEND       │
                         │  React + Tailwind   │
                         │      Recharts       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      FASTAPI        │
                         │      REST API       │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐        ┌─────────────┐       ┌──────────────┐
      │ Water API   │        │ Weather API │       │   AI API     │
      └──────┬──────┘        └──────┬──────┘       └──────┬───────┘
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐        ┌─────────────┐       ┌──────────────┐
      │ Risk Engine │        │ Open-Meteo  │       │    Ollama    │
      └──────┬──────┘        └─────────────┘       │ llama3.2:3b  │
             │                                      └──────────────┘
             ▼
      ┌────────────────────┐
      │ Consumption Engine │
      └─────────┬──────────┘
                │
                ▼
      ┌────────────────────┐
      │    Heat Engine     │
      └────────────────────┘
```

---

# `10` // END-TO-END FLOW

```text
USER
 │
 ▼
Enter tank + consumption data
 │
 ▼
React Dashboard
 │
 ▼
POST /water/risk
 │
 ├──────────────► Open-Meteo
 │                     │
 │                     ▼
 │              Weather forecast
 │
 ▼
Consumption Engine
 │
 ▼
Heat Engine
 │
 ▼
Risk Engine
 │
 ├── Available water
 ├── Average usage
 ├── Projected demand
 ├── Consumption trend
 ├── Heat adjustment
 └── Water runway
 │
 ▼
Risk Classification
 │
 ▼
Ollama Local AI
 │
 ▼
AI Explanation
 │
 ▼
Dashboard
```

---

# `11` // DASHBOARD

The CURE dashboard provides a live operational view of the current water situation.

```text
┌──────────────────────────────────────────────────────────────┐
│ CURE                                      SYSTEM: ONLINE     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  WATER RUNWAY              RISK LEVEL        HEAT            │
│                                                              │
│     4.12 days                 LOW           NORMAL           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Available Water       31,000 L                              │
│  Daily Consumption      7,528 L                              │
│  Projected Demand       7,528 L                              │
│  Consumption Trend       STABLE                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│              CONSUMPTION HISTORY                             │
│                                                              │
│       ╭────╮                                                 │
│   ╭───╯    ╰──╮                                             │
│───╯           ╰────────────────                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

The dashboard includes:

* Live risk snapshot
* Water runway
* Available water
* Consumption analysis
* Consumption trend
* Heat status
* Weather forecast
* Heat adjustment
* Risk reason
* Recommendation
* AI explanation
* 7-day consumption visualization
* System status

---

# `12` // TESTED SCENARIOS

CURE has been tested against multiple operational conditions.

| Scenario          | Available Water |    Runway | Risk  | Result |
| ----------------- | --------------: | --------: | ----- | ------ |
| Normal            |        31,000 L | 4.12 days | LOW   | ✅ PASS |
| Low supply        |        12,000 L | 1.59 days | HIGH  | ✅ PASS |
| Moderate shortage |        22,500 L | 2.99 days | WATCH | ✅ PASS |
| Heat conditions   |        22,500 L | 2.72 days | WATCH | ✅ PASS |
| Zero consumption  |        25,000 L |       N/A | WATCH | ✅ PASS |

### Zero-consumption protection

When consumption is zero:

```text
Projected consumption = 0

Water runway = NULL

Risk = WATCH

Reason:
Risk cannot be fully assessed because consumption
data shows zero usage.
```

CURE does **not** incorrectly report this as infinite or zero days of supply.

---

# `13` // INPUT VALIDATION

The API validates incoming data before processing.

```text
Tank capacity
    └── Must be > 0

Tank level
    └── Must be between 0 and 100%

Consumption history
    └── At least one value required

Consumption values
    └── Cannot be negative

Latitude
    └── -90 → 90

Longitude
    └── -180 → 180
```

Invalid data is rejected before entering the risk engine.

---

# `14` // LOCAL AI ARCHITECTURE

CURE uses local AI through **Ollama**.

```text
                    ┌──────────────────────┐
                    │     CURE RISK DATA   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    STRICT PROMPT     │
                    │                      │
                    │ Use ONLY given data  │
                    │ No invented values   │
                    │ No changed risk      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       OLLAMA         │
                    │     llama3.2:3b      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    AI EXPLANATION    │
                    └──────────────────────┘
```

### Why local AI?

```text
NO CLOUD AI DEPENDENCY
        │
        ├── Privacy
        ├── Offline capability
        ├── Lower external dependency
        └── Reproducible local development
```

The AI does **not** calculate the risk itself.

The deterministic CURE risk engine calculates the result first.

The AI explains the result.

```text
RISK ENGINE
     ↓
SOURCE OF TRUTH
     ↓
LOCAL AI
     ↓
EXPLANATION
```

---

# `15` // TECHNOLOGY STACK

```text
┌─────────────────────────────────────────────────────────────┐
│                        CURE STACK                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ FRONTEND                                                    │
│   React                                                    │
│   Vite                                                     │
│   Tailwind CSS                                             │
│   Recharts                                                 │
│                                                             │
│ BACKEND                                                     │
│   Python                                                    │
│   FastAPI                                                   │
│   Pydantic                                                  │
│                                                             │
│ INTELLIGENCE                                                │
│   Ollama                                                    │
│   llama3.2:3b                                               │
│   Deterministic Risk Engine                                 │
│                                                             │
│ WEATHER                                                     │
│   Open-Meteo                                                │
│                                                             │
│ DATA                                                        │
│   SQLite / local persistence                                │
│                                                             │
│ DEVELOPMENT                                                  │
│   Git                                                       │
│   GitHub                                                    │
│   Docker                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# `16` // AWS & OPEN-SOURCE APPROACH

CURE is designed around an AWS/open-source-friendly architecture.

```text
                     CURE
                      │
        ┌─────────────┴─────────────┐
        │                           │
   OPEN SOURCE                    AWS
        │                           │
        ▼                           ▼
  Ollama                       AWS-ready
  FastAPI                      deployment
  React                        architecture
  Open-Meteo
  Strands Agents*
```

The project follows the hackathon's requirement by building around open-source technologies and an architecture that can be deployed on AWS.

### AWS / open-source technologies considered

* AWS
* Strands Agents SDK
* Docker
* FastAPI
* React
* Ollama
* Open-Meteo

> `*` Strands Agents is part of the project architecture/experimentation; the current working local AI path uses the Ollama Python client.

---

# `17` // PROJECT STRUCTURE

```text
CURE/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai.py
│   │   │   ├── consumption.py
│   │   │   ├── heat.py
│   │   │   ├── water.py
│   │   │   └── weather.py
│   │   │
│   │   ├── ai/
│   │   │   └── agent.py
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
├── data/
│
├── docs/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── ml/
│
├── .gitignore
└── README.md
```

---

# `18` // GETTING STARTED

## Backend

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate

# Start API
uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Health check:

```text
GET /health
```

Expected:

```json
{
  "status": "healthy"
}
```

---

## Local AI

Make sure Ollama is running.

```bash
ollama run llama3.2:3b
```

CURE communicates with the local Ollama service.

```text
CURE Backend
      │
      ▼
localhost:11434
      │
      ▼
llama3.2:3b
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# `19` // DEMO FLOW

For the 3-minute hackathon demo:

```text
00:00 ───── PROBLEM
           "Water shortages are usually detected too late."

00:30 ───── INPUT
           Enter tank capacity
           Enter current level
           Enter consumption history

01:00 ───── LIVE ANALYSIS
           Fetch weather
           Calculate heat impact
           Calculate projected demand

01:30 ───── RISK
           Show water runway
           Show LOW / WATCH / HIGH

02:00 ───── AI
           Ask CURE why the risk exists
           Show local AI explanation

02:30 ───── IMPACT
           Show how early prediction
           supports tanker planning

03:00 ───── CLOSE
           "Know your water runway
            before you run out."
```

---

# `20` // ENVIRONMENTAL IMPACT

CURE is designed to support earlier and more informed water decisions.

```text
EARLIER SIGNAL
      ↓
BETTER PLANNING
      ↓
LESS EMERGENCY RESPONSE
      ↓
MORE RESPONSIBLE WATER MANAGEMENT
```

Potential applications include:

```text
🏠 Residential communities

🏢 Commercial buildings

🏫 Educational campuses

🏥 Institutions

🏭 Facilities

🌍 Community-scale utilities
```

CURE's purpose is not to replace water-management professionals.

It is to provide an additional **early-warning intelligence layer**.

---

# `21` // ROADMAP

```text
                    CURE EVOLUTION
                         │
                         ▼
              ┌─────────────────────┐
              │       v0.1           │
              │   MVP Risk Engine    │
              │        ✓ DONE        │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │       v0.2           │
              │ Better Weather       │
              │ Intelligence         │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │       v0.3           │
              │ Multi-Tank Support   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │       v0.4           │
              │ Historical Analytics │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │       v1.0           │
              │ Community Deployment │
              └─────────────────────┘
```

### Planned improvements

* [ ] Multi-location support
* [ ] Multiple tank management
* [ ] Historical risk analytics
* [ ] Better demand forecasting
* [ ] Rainfall intelligence
* [ ] Water refill prediction
* [ ] More environmental signals
* [ ] AWS deployment
* [ ] Mobile-friendly PWA
* [ ] Community-level dashboards

---

# `22` // HACKATHON

```text
╔══════════════════════════════════════════════════════════════╗
║                    ENVIRONMENTAL HACKS 2026                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  PROJECT       CURE                                          ║
║  FULL NAME     Climate & Utility Risk Engine                 ║
║                                                              ║
║  DOMAIN        WATER + CLIMATE                               ║
║  AI            LOCAL / OFFLINE                               ║
║  ENGINE        RISK + WEATHER + CONSUMPTION                  ║
║                                                              ║
║  CORE IDEA     Predict water shortage before it happens      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Built for

**WeMakeDevs × AWS Environmental Hacks**

Focus:

> Environmental intelligence through practical technology.

---

# `23` // THE CURE PHILOSOPHY

```text
                     DON'T WAIT
                        FOR
                     THE TANK
                       TO HIT
                        ZERO.

                         ↓

                  MEASURE EARLY

                         ↓

                  UNDERSTAND TRENDS

                         ↓

                  PREDICT RUNWAY

                         ↓

                   ACT EARLY
```

CURE follows one simple principle:

> **The best time to prepare for a water shortage is before the shortage begins.**

---

# `24` // CONTRIBUTORS

<div align="center">

### Built by developers who believe environmental problems deserve engineering solutions.

<br>

[![GitHub](https://img.shields.io/badge/GitHub-dhanush080607-111827?style=for-the-badge\&logo=github)](https://github.com/dhanush080607)

<br><br>

<img src="https://contrib.rocks/image?repo=dhanush080607/CURE" alt="Contributors"/>

</div>

---

# `25` // BUILDER

<div align="center">

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                         D H A N U S H                    │
│                                                          │
│              Building AI. One Project at a Time.        │
│                                                          │
│       AI • Data • Backend • Open Source • Systems       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### `> BUILD. TEST. MEASURE. IMPROVE.`

[GitHub](https://github.com/dhanush080607)

[Portfolio](https://dhanush-portfolio2.vercel.app/)

<br>

**CURE — Climate & Utility Risk Engine**

`Predict the risk. Understand the signal. Act before the shortage.`

<br>

![GitHub last commit](https://img.shields.io/github/last-commit/dhanush080607/CURE?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/dhanush080607/CURE?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/dhanush080607/CURE?style=flat-square)

</div>
