import sqlite3
import os

def init_db(db_path="data/expenses.db"):
    # Ensure data directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    
    cur.executescript("""
    PRAGMA foreign_keys=ON;
    
    CREATE TABLE IF NOT EXISTS categories(
      id INTEGER PRIMARY KEY, 
      name TEXT UNIQUE, 
      parent TEXT
    );
    
    CREATE TABLE IF NOT EXISTS transactions(
      id INTEGER PRIMARY KEY,
      tx_date TEXT,           -- ISO date
      description TEXT,
      amount REAL,            -- negative=expense, positive=income
      currency TEXT DEFAULT 'USD',
      account TEXT,           -- e.g., 'Bank', 'Cash'
      category_id INTEGER,    -- FK to categories
      raw_source TEXT,
      tags TEXT,
      UNIQUE(tx_date, description, amount, account),
      FOREIGN KEY(category_id) REFERENCES categories(id)
    );
    
    CREATE TABLE IF NOT EXISTS budgets(
      id INTEGER PRIMARY KEY,
      month TEXT,             -- '2025-11'
      category_name TEXT,
      limit_amount REAL
    );
    """)
    
    # Initialize some categories if empty
    cur.execute("SELECT COUNT(*) FROM categories")
    if cur.fetchone()[0] == 0:
        base_categories = [
            ('Groceries', 'Needs'),
            ('Rent', 'Needs'),
            ('Utilities', 'Needs'),
            ('Transport', 'Needs'),
            ('Dining Out', 'Wants'),
            ('Entertainment', 'Wants'),
            ('Shopping', 'Wants'),
            ('Income', 'Income'),
            ('Savings', 'Investment'),
            ('Miscellaneous', 'Other')
        ]
        cur.executemany("INSERT INTO categories(name, parent) VALUES(?, ?)", base_categories)
        
    con.commit()
    con.close()
    print(f"Database initialized at {db_path}")

if __name__ == "__main__":
    init_db()
