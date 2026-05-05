# 💼 Interview Preparation: Personal Expense Tracker

## 1. Project Explanation (The "Elevator Pitch")
"I built a Personal Expense Tracker that solves the fragmentation of financial data. It ingests inconsistent CSV exports from banks, standardizes them into a normalized SQLite database, and uses a rule-based engine (with AI expansion) to categorize spending. The final output is an interactive React dashboard that visualizes liquidity, savings rates, and category-wise allocation, helping users identify 'leaks' in their budget."

## 2. Technical Challenges & Solutions
- **Problem**: Inconsistent CSV formats across banks.
- **Solution**: Developed an ingestion pipeline in Python using Pandas that maps arbitrary columns to a standard schema before persistence.
- **Problem**: Categorizing thousands of vague text descriptions.
- **Solution**: Implemented a two-tier approach: RegEx keyword matching for high-confidence patterns and a Gemini AI fallback for ambiguous merchants.

## 3. Q&A
**Q: Why use SQLite instead of a JSON file?**
A: SQLite provides ACID compliance, structured querying (SQL), and scalability for years of data without mounting the entire dataset into memory.

**Q: How do you handle duplicate transactions?**
A: I use a composite UNIQUE constraint in SQLite (date, description, amount, account) to 'INSERT OR IGNORE' duplicates during re-ingestion.

**Q: What would you scale if you had 1 million users?**
A: I would shift the backend to a microservices architecture using FastAPI, move the DB to PostgreSQL with horizontal scaling, and implement background processing workers (Celery/Redis) for transaction-heavy ingestions.

**Q: Explain your project's data flow.**
A: Raw Data (CSV) -> Ingestion Service (Python/Pandas) -> Normalized Database (SQLite) -> Analytics Layer (Pandas GroupBy) -> API Gateway (Express) -> UI Dashboard (React/Recharts).
