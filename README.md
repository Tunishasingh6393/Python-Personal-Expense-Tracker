# 📊 Personal Expense Tracker with AI-Powered Insights

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive professional-grade personal finance dashboard that transforms raw transaction data into actionable financial intelligence using automated parsing, AI-driven categorization, and interactive data visualization.

---

## 🏗️ Project Structure

Below is the industry-standard organization for this project, designed for scalability and collaborative development.

```text
Personal-Expense-Tracker-Visualization/
│
├── data/               # 📂 Raw Input & Database
│                       # Contains original CSV exports and the centralized SQLite database.
│
├── notebooks/          # 📓 Research & Exploration
│                       # Jupyter Notebooks used for data prototyping and algorithm testing.
│
├── src/                # 💻 Frontend Application
│                       # The React/TypeScript dashboard source code and UI components.
│
├── outputs/            # 📤 Commercial Exports
│                       # Cleaned data exports and standardized CSV outputs for external tools.
│
├── images/             # 🖼️ Asset Library
│                       # Screenshots, UI mockups, and architectural diagrams.
│
├── reports/            # 📄 Financial Summaries
│                       # Generated monthly PDF/Text insights and budget performance reports.
│
├── docs/               # 📚 Documentation & Career
│                       # Technical specs, System Design, and Interview Prep materials.
│
├── README.md           # 🏠 Main Documentation
│
├── requirements.txt    # ⚙️ Python Dependencies
│
├── .gitignore          # 🚫 Git Exclusions
│
└── main.py             # 🚀 Master Controller
                        # The single entry point to run the entire data pipeline.
```

---

## 🔑 Key Features & Workflow

### 1. Unified Data Ingestion
The system uses a robust ingestion engine to handle "Dirty Data" from various banking sources. 
- **Workflow**: `Raw CSV` ➔ `Standardization` ➔ `Duplicate Detection` ➔ `SQLite Storage`.

### 2. Intelligent Categorization
Beyond simple keyword matching, the tracker identifies spending patterns.
- **AI Integration**: Uses pattern recognition to label vague descriptions like "AMZN MKTP" as "Shopping" automatically.

### 3. Professional Analytics
Powered by Pandas, the analysis engine calculates:
- **Liquidity Trends**: Weekly and monthly cash flow.
- **Allocation Donut**: Visual breakdown of needs vs. wants.
- **Savings Velocity**: Real-time calculation of your savings rate.

---

## 🚀 How to Get Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### Quick Start
1. **Prepare Environment**:
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. **Populate Data**:
   Run the master script to initialize the system and generate demo data:
   ```bash
   python main.py
   ```

3. **Launch Dashboard**:
   ```bash
   npm run dev
   ```

---

## 💼 Industry Relevance
This project is built to mirror real-world Fintech applications. It demonstrates expertise in:
- **ETL Processes**: Moving and transforming data at scale.
- **Database Normalization**: Designing structured schemas.
- **Data Storytelling**: Mapping complex metrics to intuitive UI components.

---
*This project is part of a Professional Development Portfolio.*
