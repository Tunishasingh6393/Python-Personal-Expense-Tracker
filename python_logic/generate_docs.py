import os

def create_readme():
    content = """# 📊 Personal Expense Tracker with Data Visualization

## 🌟 Project Overview
A professional-grade personal finance tool built with Python (Backend/Analysis) and React (Frontend UI). This project demonstrates full-stack engineering, data cleaning, and automated insights generation.

## 🛠 Tech Stack
- **Languages:** Python (Pandas, SQLite), TypeScript (React)
- **Visualization:** Recharts, Matplotlib (for static reports)
- **API:** Express.js (Node.js)
- **AI:** Gemini Flash (Categorization enhancement)

## 📁 Folder Structure
- `python_logic/`: Core Python modules for data processing.
- `src/`: React frontend and dashboard logic.
- `data/`: SQLite database and raw CSV imports.
- `reports/`: Generated monthly insights.

## 🚀 Key Features
1. **CSV Ingestion**: Handles inconsistent banking formats via normalization.
2. **AI Categorization**: Rule-based and AI-powered transaction labeling.
3. **Interactive Dashboard**: Real-time trend analysis and budgeting metrics.
4. **Export Engine**: Generates professional PDF/CSV financial summaries.

## 📈 Learning Outcomes
- Data normalization techniques.
- Relational database schema design for finance.
- Bridging Python's analytical power with modern Web UIs.

---
*Created for portfolio demonstration.*
"""
    with open("README.md", "w") as f:
        f.write(content)

if __name__ == "__main__":
    create_readme()
