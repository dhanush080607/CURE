<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:020617,50:0e7490,100:06b6d4&height=220&section=header&text=CURE&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Climate%20%26%20Utility%20Risk%20Engine&descAlignY=60&descSize=22" width="100%"/>

<br/>

<a href="https://github.com/dhanush080607/CURE">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=22&duration=2800&pause=900&color=22D3EE&center=true&vCenter=true&width=800&lines=Predict+water+shortages+before+they+become+emergencies.;Turn+climate+signals+into+actionable+decisions.;Measure+the+water+runway.;Think+ahead.+Act+before+the+shortage." alt="Typing SVG"/>
</a>

<br/>

<p>
  <img src="https://img.shields.io/badge/🌍_Environmental_Hacks-2026-06b6d4?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=111827"/>
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/Ollama-Local_AI-black?style=for-the-badge"/>
</p>

<p>
  <img src="https://img.shields.io/github/stars/dhanush080607/CURE?style=flat-square&color=22d3ee"/>
  <img src="https://img.shields.io/github/forks/dhanush080607/CURE?style=flat-square&color=06b6d4"/>
  <img src="https://img.shields.io/github/last-commit/dhanush080607/CURE?style=flat-square&color=14b8a6"/>
  <img src="https://img.shields.io/github/license/dhanush080607/CURE?style=flat-square&color=0ea5e9"/>
</p>

<br/>

> **💧 Know your water runway before you run out.**

</div>

---

<div align="center">

## 🌊 THE IDEA

### What if a water tank could tell you when it will become a problem?

</div>

CURE — **Climate & Utility Risk Engine** — combines:

```text
💧 Tank Level
       +
📈 Consumption History
       +
🌡️ Heat Conditions
       +
☁️ Weather Forecast
       ↓
┌──────────────────────────────┐
│       CURE RISK ENGINE       │
└──────────────┬───────────────┘
               ↓
        WATER RUNWAY
               ↓
     ┌─────────┼─────────┐
     ↓         ↓         ↓
   🟢 LOW   🟡 WATCH   🔴 HIGH
     ↓         ↓         ↓
   Stable    Monitor    Act
```

Instead of asking:

> **"How much water is left?"**

CURE asks:

> **"How long will our current water supply last?"**

---

<div align="center">

## ⚡ CURE IN 30 SECONDS

<table>
<tr>
<td align="center">💧<br/><b>MEASURE</b><br/><sub>Current supply</sub></td>
<td>→</td>
<td align="center">📈<br/><b>ANALYZE</b><br/><sub>Consumption</sub></td>
<td>→</td>
<td align="center">🌡️<br/><b>ADJUST</b><br/><sub>Heat impact</sub></td>
<td>→</td>
<td align="center">⏳<br/><b>PROJECT</b><br/><sub>Water runway</sub></td>
<td>→</td>
<td align="center">🚦<br/><b>ACT</b><br/><sub>Risk + action</sub></td>
</tr>
</table>

</div>

---

# 🧠 How CURE Thinks

### 01 — 💧 Available Water

```text
Available Water
      =
Tank Capacity × Current Tank Level
```

Example:

```text
50,000 L × 62%
        ↓
31,000 L available
```

---

### 02 — 📈 Consumption Intelligence

CURE analyzes recent daily usage.

```text
                    CONSUMPTION
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      INCREASING       STABLE       DECREASING
          │              │              │
          ▼              ▼              ▼
       Higher          Normal         Lower
       demand          pattern        demand
```

---

### 03 — 🌡️ Climate Adjustment

Upcoming heat conditions influence projected demand.

|  Condition |    Status   | Adjustment |
| :--------: | :---------: | :--------: |
|  `< 32°C`  |  🟢 NORMAL  |    `0%`    |
| `32–<35°C` | 🟡 MODERATE |    `5%`    |
| `35–<38°C` | 🟠 ELEVATED |    `10%`   |
|  `≥ 38°C`  |   🔴 HIGH   |    `15%`   |

> These are **illustrative MVP heuristics**, not scientific constants.

---

### 04 — ⏳ Water Runway

The heart of CURE:

```text
                    AVAILABLE WATER
                           │
                           ▼
                    ┌─────────────┐
                    │             │
                    │    ÷        │
                    │             │
                    └──────┬──────┘
                           │
                           ▼
                 PROJECTED DAILY USE
                           │
                           ▼
                    ⏳ WATER RUNWAY
```

**Water runway = estimated days of supply remaining.**

---

# 🚦 The CURE Risk Signal

<div align="center">

### 🟢 LOW

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       CURRENT SUPPLY
          APPEARS STABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 🟡 WATCH

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        MONITOR & REVIEW
       TANKER PLANNING SOON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 🔴 HIGH

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ACTION REQUIRED
     PLAN TANKER IMMEDIATELY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

</div>

---

# 🔥 Climate-Aware Water Intelligence

CURE doesn't treat water availability as a static number.

```text
                 WEATHER
                    │
                    ▼
              MAX TEMPERATURE
                    │
                    ▼
             HEAT CONDITIONS
                    │
                    ▼
          DEMAND ADJUSTMENT
                    │
                    ▼
        PROJECTED DAILY DEMAND
                    │
                    ▼
             WATER RUNWAY
```

That means the same tank level can produce a different projected runway when environmental conditions change.

---

# 📊 A Real CURE Scenario

<div align="center">

```text
╭──────────────────────────────────────────────╮
│              CURE RISK SNAPSHOT              │
├──────────────────────────────────────────────┤
│                                              │
│   TANK CAPACITY              50,000 L        │
│   CURRENT LEVEL                  62%         │
│   AVAILABLE WATER            31,000 L        │
│                                              │
│   AVG. DAILY USE          7,528.57 L/day     │
│   TEMPERATURE                 30.8°C         │
│   HEAT ADJUSTMENT                0%          │
│                                              │
│   WATER RUNWAY                4.12 DAYS      │
│                                              │
│                  🟢 LOW                      │
│                                              │
╰──────────────────────────────────────────────╯
```

</div>

### System decision

> **Water runway is 4.12 days based on current projected consumption.**

### Recommendation

> **Current water supply appears stable.**

---

# 🧩 Architecture

<div align="center">

```text
                         ┌───────────────────┐
                         │    CURE WEB APP   │
                         │ React + Vite      │
                         │ Tailwind + Charts │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    FASTAPI API    │
                         └─────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
      ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
      │ Consumption  │     │ Heat Engine  │     │   Weather    │
      │   Engine     │     │              │     │   Service    │
      └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  ▼
                       ┌─────────────────────┐
                       │     RISK ENGINE     │
                       │                     │
                       │  Water Runway       │
                       │  Risk Level         │
                       │  Risk Reason        │
                       │  Recommendation     │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │      CURE AI        │
                       │  Ollama / Local LLM │
                       └─────────────────────┘
```

</div>

---

# 🤖 AI — But With Guardrails

CURE separates **calculation** from **explanation**.

```text
              REAL DATA
                  │
                  ▼
        ┌───────────────────┐
        │ DETERMINISTIC     │
        │ RISK ENGINE       │
        └─────────┬─────────┘
                  │
                  │ authoritative result
                  ▼
        ┌───────────────────┐
        │    CURE AI        │
        │                   │
        │ Explain           │
        │ Summarize         │
        │ Communicate       │
        └─────────┬─────────┘
                  │
                  ▼
          HUMAN-READABLE
            DECISION
```

### The rule:

```text
CALCULATION ≠ GENERATION
```

The risk engine decides.

The AI explains.

This keeps the environmental calculation deterministic while still giving users a natural-language interface.

---

# 🌐 Weather Intelligence

CURE retrieves forecast information through **Open-Meteo**.

```text
Location
   │
   ▼
Open-Meteo
   │
   ▼
Temperature Forecast
   │
   ▼
Heat Engine
   │
   ▼
Projected Water Demand
```

No weather value is manually hardcoded into the live forecast flow.

---

# 🛠️ Tech Stack

<div align="center">

|        Layer       | Technology                  |
| :----------------: | :-------------------------- |
|     🎨 Frontend    | React + Vite + Tailwind CSS |
|  📊 Visualization  | Recharts                    |
|      ⚡ Backend     | FastAPI                     |
|     🐍 Language    | Python                      |
|        🧠 AI       | Ollama + llama3.2:3b        |
|     🌦️ Weather    | Open-Meteo                  |
|   🛡️ Validation   | Pydantic                    |
|       🌐 HTTP      | HTTPX                       |
| 🔧 Version Control | Git + GitHub                |

</div>

---

# 🧪 Tested & Verified

CURE has been tested across different operational conditions.

<div align="center">

| Scenario        |        Runway |  Result  |
| :-------------- | ------------: | :------: |
| Normal supply   | **4.12 days** |  🟢 LOW  |
| Reduced supply  | **2.99 days** | 🟡 WATCH |
| Critical supply | **1.59 days** |  🔴 HIGH |
| High heat       | **2.72 days** | 🟡 WATCH |

</div>

### Input validation

```text
✓ Negative tank capacity rejected
✓ Tank level > 100% rejected
✓ Negative consumption rejected
✓ Invalid latitude rejected
✓ Invalid longitude rejected
✓ Zero-consumption edge case handled
```

---

# 🖥️ Product Flow

```text
        👤 USER
          │
          ▼
   ┌───────────────┐
   │ Enter Tank    │
   │ Conditions    │
   └───────┬───────┘
           ▼
   ┌───────────────┐
   │ Add Recent    │
   │ Consumption   │
   └───────┬───────┘
           ▼
   ┌───────────────┐
   │ Fetch Weather │
   └───────┬───────┘
           ▼
   ┌───────────────┐
   │ Run Risk      │
   │ Engine        │
   └───────┬───────┘
           ▼
   ┌───────────────┐
   │ Water Runway  │
   └───────┬───────┘
           ▼
      🚦 RISK LEVEL
           │
      ┌────┼────┐
      ▼    ▼    ▼
      🟢   🟡   🔴
      │    │    │
      └────┼────┘
           ▼
      🤖 CURE AI
           │
           ▼
     ACTIONABLE
      DECISION
```

---

# ☁️ AWS & Open-Source Philosophy

CURE follows a **local-first architecture**.

The core environmental intelligence does not depend on a paid cloud account.

The architecture is intentionally modular so infrastructure can evolve independently from the risk engine.

### Design principle

> **Portable intelligence. Modular infrastructure. Practical environmental impact.**

The project also explores the AWS/open-source ecosystem as part of its hackathon architecture and future deployment direction.

---

# 🚀 Run CURE Locally

## 1. Clone

```bash
git clone https://github.com/dhanush080607/CURE.git
cd CURE
```

## 2. Start Ollama

```bash
ollama pull llama3.2:3b
ollama run llama3.2:3b
```

## 3. Backend

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

## 4. Frontend

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

---

# 📁 Repository

```text
CURE/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── risk/
│   │   ├── services/
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

# 🌍 Why It Matters

Water scarcity is not only about the amount of water available.

It is also about:

```text
WHEN
  ↓
WILL
  ↓
THE
  ↓
WATER
  ↓
RUN
  ↓
OUT?
```

CURE tries to answer that question **before** the shortage happens.

Potential applications:

```text
🏠 Homes
   ↓
🏢 Apartments
   ↓
🏫 Schools
   ↓
🏥 Hospitals
   ↓
🏭 Facilities
   ↓
🏙️ Communities
```

---

# 🔮 Roadmap

### 🟢 Current

* [x] Water runway
* [x] Consumption analysis
* [x] Trend detection
* [x] Heat adjustment
* [x] Weather integration
* [x] Risk classification
* [x] Risk reason
* [x] Recommendations
* [x] Local AI explanation
* [x] Interactive dashboard
* [x] Input validation

### 🟡 Next

* [ ] Historical forecasting
* [ ] Smarter demand prediction
* [ ] Tanker requirement estimation
* [ ] Persistent database
* [ ] Multi-tank monitoring
* [ ] Automated alerts

### 🔵 Future

* [ ] IoT tank sensors
* [ ] Real-time monitoring
* [ ] Community water intelligence
* [ ] Water conservation recommendations
* [ ] Municipal dashboards

---

# 🏆 Built For

<div align="center">

<img src="https://img.shields.io/badge/WeMakeDevs-AWS%20Environmental%20Hacks%202026-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"/>

<br/><br/>

### 🌱 Environmental Intelligence

**Turning climate signals into practical utility decisions.**

</div>

---

# 👥 Contributors

<div align="center">

<a href="https://github.com/dhanush080607">
<img src="https://github.com/dhanush080607.png" width="110px" style="border-radius:50%" alt="Dhanush"/>
</a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://github.com/KCDharshan9">
<img src="https://github.com/KCDharshan9.png" width="110px" style="border-radius:50%" alt="KCDharshan9"/>
</a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://github.com/FaheedBasha123">
<img src="https://github.com/FaheedBasha123.png" width="110px" style="border-radius:50%" alt="FaheedBasha123"/>
</a>

<br/>

<strong>Dhanush</strong>
  •   <strong>KCDharshan9</strong>
  •   <strong>FaheedBasha123</strong>

<br/><br/>

<a href="https://github.com/dhanush080607">
<img src="https://img.shields.io/badge/Dhanush-Project%20Lead-06b6d4?style=for-the-badge&logo=github"/>
</a>

<a href="https://github.com/KCDharshan9">
<img src="https://img.shields.io/badge/KCDharshan9-Contributor-0ea5e9?style=for-the-badge&logo=github"/>
</a>

<a href="https://github.com/FaheedBasha123">
<img src="https://img.shields.io/badge/FaheedBasha123-Contributor-14b8a6?style=for-the-badge&logo=github"/>
</a>

</div>

---

# 📈 GitHub Activity

<div align="center">

<a href="https://github.com/dhanush080607/CURE">
<img src="https://github-readme-stats.vercel.app/api?username=dhanush080607&repo=CURE&show_icons=true&theme=tokyonight&hide_border=true&bg_color=020617&title_color=22d3ee&icon_color=06b6d4&text_color=cbd5e1" height="170"/>
</a>

<a href="https://github.com/dhanush080607/CURE">
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=dhanush080607&layout=compact&theme=tokyonight&hide_border=true&bg_color=020617&title_color=22d3ee&text_color=cbd5e1" height="170"/>
</a>

</div>

---

# 💫 The Vision

<div align="center">

```text
          DATA
            │
            ▼
        INTELLIGENCE
            │
            ▼
         DECISION
            │
            ▼
          ACTION
            │
            ▼
       🌍 IMPACT
```

### CURE is not just another dashboard.

### It's a step toward utilities that can **think ahead**.

<br/>

## 💧 Predict earlier.

## 🌡️ Understand climate.

## 📊 Use resources smarter.

## 🌍 Act before the shortage.

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06b6d4,50:0e7490,100:020617&height=140&section=footer&animation=fadeIn" width="100%"/>

</div>
