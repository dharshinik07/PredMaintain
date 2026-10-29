<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=PredMaintain&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=Predict.%20Prevent.%20Protect.%20Industrial%20Machinery%20Intelligence.&descAlignY=58&descSize=17&animation=fadeIn" width="100%"/>

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Node.js%20%2F%20Express-5.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Domain](https://img.shields.io/badge/Domain-Industrial%20IoT%20%26%20CBM-7c4dff?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-00e676?style=for-the-badge)

<br/>

> **From raw sensor telemetry to precision maintenance intelligence — in under 200ms.**  
> PredMaintain 2.0 is an industrial condition-based maintenance (CBM) and telemetry intelligence platform that monitors machinery health, flags statistical process outliers, estimates degradation trajectories, and forecasts Remaining Useful Life (RUL) in real time.

<br/>

[![Explore Repo](https://img.shields.io/badge/⚡%20Explore%20Repo-7c4dff?style=for-the-badge&logoColor=white)](https://github.com/Madhan310301/PredMaintain)
[![Star on GitHub](https://img.shields.io/github/stars/Madhan310301/PredMaintain?style=for-the-badge&logo=github&color=ffbd2e)](https://github.com/Madhan310301/PredMaintain/stargazers)

</div>

---

## ⚡ System at a Glance

<div align="center">

| 🎯 Condition Reliability Index | 📉 Avoided Downtime (Simulated) | 🔍 Outlier Precision | ⏱️ Ingestion Freshness |
|:-:|:-:|:-:|:-:|
| **0 – 100 CI Scale** | **-20.4% Avoidance** | **|Z| > 2.0 Bounds** | **< 1.8 seconds** |

| 🏭 Machines Monitored | ⚙️ Subsystems Analyzed | 📡 Sensor Streams | 🔄 Telemetry Cycle |
|:-:|:-:|:-:|:-:|
| **8 Industrial Units** | **5 Plant Departments** | **6 Multi-axis Channels** | **Continuous Stream** |

</div>

---

## 🧠 The Problem We Solve

Industrial machinery represents enormous capital. Traditional maintenance is broken in two ways:

```
❌  REACTIVE  →  Machine breaks → Emergency repair → Massive downtime + cost
❌  SCHEDULED →  Replace parts by calendar → Wasteful, doesn't reflect actual health
✅  PREDICTIVE →  Monitor in real time → Act before failure → Targeted, cost-effective
```

PredMaintain uses a **multi-factor statistical process control and degradation modeling engine** to spot failure patterns invisible to human operators — giving maintenance teams time to act with surgical precision.

---

## ✨ Core Capabilities & Components

### 1. 🌐 Industrial Perspective Hero (`IndustrialPerspectiveHero.tsx`)
A non-trapping 3D perspective viewport driven by Framer Motion, mouse-tracking parallax, and live industrial asset cards (`MOTOR-104`, `PUMP-207`, `CNC-012`, `COMP-031`, `ROBOT-R7`, `CONV-C03`) linking directly to telemetry diagnostics.

### 2. 📊 Maintenance Analytics Bento (`MaintenanceAnalyticsBento.tsx`)
- **Module 1 — Downtime & Economics:** Dual INR (₹ Lakhs) and USD ($) economic modeling distinguishing simulated savings from recorded maintenance logs.
- **Module 2 — Real-Time Telemetry Stream:** Unit-consistent measurements for Vibration RMS (`mm/s`), Spindle Core Temp (`°C`), and Motor Load (`A`) with active threshold lines and SPC outlier flags.
- **Module 3 — Asset Risk Treemap:** Interactive asset grid grouped by plant department and condition (Nominal, Warning, Critical) with 24h / 7d / 30d filtering.
- **Module 4 — Subsystem Failure Risk Radar:** Radar visualization of failure modes (Bearing Wear, Thermal Overload, Hydraulic Bypass, Stator Harmonics, Belt Alignment).

### 3. ⚙️ PredMaintain Footer (`PredMaintainFooter.tsx`)
Oversized industrial wordmark (**PREDMAINT**) featuring animated SVG technical micro-illustrations (rotating drive gear, pulsing piezo vibration sensor, robot arm pivot, oscilloscope waveform, torque wrench, and conveyor drive).

### 4. 🔬 Model Validation & Explainability (`ModelMonitoring.tsx`)
SHAP-inspired feature attribution weights, precision/recall stability tracking, model lineage records, and industrial safety constraints.

---

## 📐 Diagnostic & Prognostic Methodology

### 1. Robust Anomaly Detection (Statistical Process Control)
For each sensor channel telemetry vector $X = \{x_1, x_2, \dots, x_n\}$, the engine computes the running arithmetic mean $\mu$ and sample standard deviation $\sigma$:

$$\mu = \frac{1}{n} \sum_{i=1}^{n} x_i, \quad \sigma = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (x_i - \mu)^2}$$

An outlier exception is flagged if the standardized score of recent observations satisfies:

$$|Z_t| = \left| \frac{x_t - \mu}{\sigma} \right| > 2.0$$

### 2. Sensor Drift & Trajectory Modeling
Sensor trends are estimated across a rolling 20-sample window using Ordinary Least Squares (OLS) regression:

$$\text{Slope } (\beta) = \frac{n \sum (t \cdot x_t) - \sum t \sum x_t}{n \sum t^2 - (\sum t)^2}$$

Normalized against the channel baseline mean, slopes with $\frac{\beta}{\mu} > 0.01$ indicate active degradation, whereas values with $\frac{\beta}{\mu} < -0.01$ indicate recovery or stabilization post-servicing.

### 3. Composite Condition Index (CI)
Asset health is modeled as a weighted aggregate across active sensor channels:

$$\text{CI} = \frac{\sum_{i=1}^{k} w_i \cdot S_i}{\sum_{i=1}^{k} w_i}$$

Where $w_i$ denotes channel importance weights (Temperature: 0.25, Vibration: 0.25, Current: 0.20, Pressure: 0.15, RPM: 0.10, Humidity: 0.05), and $S_i$ represents the normalized channel safety margin relative to manufacturer tolerance limits.

---

## 🏭 Monitored Assets & Factory Coverage

The platform ships preconfigured for 8 industrial assets distributed across 5 plant departments:

| Asset Name | Asset Type | Department | Primary Criticality | Max Limits |
|---|---|---|---|---|
| **CNC Milling Station Alpha** | CNC Mill | CNC Machining | High | 95°C, 4.5mm/s, 30A, 12000 RPM |
| **Hydraulic Press #2** | Stamping Press | Assembly | High | 85°C, 3.0mm/s, 45A, 250 PSI |
| **Robotic Welding Arm R-7** | Articulated Arm | Welding | High | 80°C, 2.5mm/s, 35A, 8000 RPM |
| **Conveyor Belt Line C** | Drive Conveyor | Packaging | Medium | 60°C, 2.0mm/s, 15A, 1800 RPM |
| **Industrial Compressor K-12** | Screw Compressor | Utilities | Medium | 105°C, 5.0mm/s, 55A, 180 PSI |
| **Precision Lathe L-3** | Turning Center | CNC Machining | Medium | 90°C, 3.5mm/s, 25A, 6000 RPM |
| **Centrifugal Pump P-5** | Fluid Pump | Utilities | Low | 75°C, 6.0mm/s, 20A, 200 PSI |
| **Arc Welder Station W-4** | Power Supply | Welding | Medium | 110°C, 1.5mm/s, 60A |

---

## 📂 Project Structure

```
PredMaintain/
│
├── client/
│   ├── public/                  # Static assets & favicon
│   └── src/
│       ├── components/
│       │   ├── industrial/      # MaintenanceAnalyticsBento & telemetry widgets
│       │   ├── landing/         # IndustrialPerspectiveHero & PredMaintainFooter
│       │   ├── layout/          # Industrial Header & Sidebar
│       │   └── ui/              # Radix UI primitives (shadcn-compatible)
│       ├── hooks/               # TanStack Query data hooks
│       ├── pages/
│       │   ├── LandingPage.tsx      # Public 10-section landing page
│       │   ├── Dashboard.tsx        # Operations Console + Analytics Bento
│       │   ├── Machines.tsx         # Asset Inventory
│       │   ├── MachineDetail.tsx    # Live telemetry & diagnostic report
│       │   ├── Analytics.tsx        # Reliability & cost charts
│       │   ├── Maintenance.tsx      # Work orders (CMMS)
│       │   ├── Alerts.tsx           # Telemetry exceptions & triage
│       │   ├── Reports.tsx          # Executive fleet reports
│       │   └── ModelMonitoring.tsx  # ML explainability & drift validation
│       └── App.tsx              # Application routing
│
├── server/
│   ├── index.ts                 # Express HTTP server
│   ├── routes.ts                # REST API endpoints & telemetry simulator
│   ├── mlEngine.ts              # Statistical Process Control & CBM diagnostics
│   └── storage.ts               # In-memory circular buffer store
│
├── shared/
│   ├── schema.ts                # TypeScript asset, sensor, and alert types
│   └── routes.ts                # Typed API contract definitions
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js >= 20.x
* npm >= 10.x

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Madhan310301/PredMaintain.git
cd PredMaintain

# 2. Install dependencies
npm install

# 3. Create .env configuration
PORT=5000
NODE_ENV=development
```

### Running Locally

```bash
# Launch development server (API + Vite frontend on port 5000)
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser:
* **Public Landing Page:** `http://localhost:5000/`
* **Operations Command Center:** `http://localhost:5000/dashboard`
* **ML Model Monitoring:** `http://localhost:5000/models`

### Production Build & Type Verification

```bash
# Type check TypeScript codebase
npm run check

# Create production build
npm run build
```

---

## 📊 Datasets & Reference Models

| Reference Dataset | Source | Purpose |
|---|---|---|
| **NASA C-MAPSS Turbofan** | NASA Prognostics Data Repository | Degradation run-to-failure & RUL baseline |
| **CWRU Bearing Fault Dataset** | Case Western Reserve University | Raceway and ball-element vibration harmonic modeling |
| **Continuous Plant Telemetry** | Simulated Ingestion Gateway (0.5 Hz) | Dynamic operational condition assessment |

---

<div align="center">

**Built with 🔧 by [Madhan Kumar T](https://github.com/Madhan310301)**  
**Built with 🔧 by [Dharshini K](https://github.com/dharshinik07)**
*B.Tech Computer Science Engineering · BIHER, Chennai*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=fadeIn" width="100%"/>

</div>
