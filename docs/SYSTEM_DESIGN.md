# 🏗️ Solution Architecture: Personal Expense Tracker

## High-Level Diagram (Conceptual)
[ User ] <--> [ React Dashboard ] <--> [ Express API ] <--> [ Python Analytics Service ] <--> [ SQLite DB ]
                                                                       ^
                                                                       |
                                                                  [ CSV Data ]

## Component Breakdown

### 1. The Ingestion Tier (Python/Pandas)
- **Role**: ETL (Extract, Transform, Load).
- **Process**: Reads various CSV schemas, cleans whitespace, converts dates to ISO format, and ensures numeric consistency.
- **Why**: Python's `pandas` is the industry standard for tabular data manipulation.

### 2. The Storage Tier (SQLite)
- **Role**: Reliable Persistence.
- **Tables**: `transactions` (The big fact table), `categories` (Dimensions), `budgets` (Metadata).
- **Why**: SQLite is zero-config and file-based, making it perfect for personal apps while providing full SQL power.

### 3. The Backend API (Express.js)
- **Role**: Orchestration.
- **Functions**: Routes requests to Python scripts, serves the frontend assets, and manages environment variables.
- **Why**: Low-latency bridging and excellent ecosystem for web serving.

### 4. The Presentation Tier (React/TypeScript)
- **Role**: Visualization & Interaction.
- **Libraries**: `recharts` for SVG-based charts, `motion` for smooth transitions.
- **Why**: Component-based architecture allows for a modular, responsive dashboard that feels like a native app.

## Data Flow
1. User clicks "Initialize" or uploads CSV.
2. API spawns a Python child process.
3. Python script updates SQLite.
4. Python script runs `analyze.py` to generate a JSON summary.
5. API returns JSON to React.
6. React state updates, triggering chart animations.
