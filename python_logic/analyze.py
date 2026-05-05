import sqlite3
import json
import os

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_analytics_json(db_path="data/expenses.db"):
    if not os.path.exists(db_path):
        return json.dumps({"error": "Database not initialized"})
        
    con = sqlite3.connect(db_path)
    con.row_factory = dict_factory
    cur = con.cursor()
    
    # Check if data exists
    cur.execute("SELECT COUNT(*) as count FROM transactions")
    if cur.fetchone()['count'] == 0:
        con.close()
        return json.dumps({"error": "No data available"})

    # KPIs
    cur.execute("SELECT SUM(amount) as total FROM transactions WHERE amount < 0")
    total_spend = abs(cur.fetchone()['total'] or 0)
    
    cur.execute("SELECT SUM(amount) as total FROM transactions WHERE amount > 0")
    total_income = cur.fetchone()['total'] or 0
    
    savings = total_income - total_spend
    savings_rate = (savings / total_income * 100) if total_income > 0 else 0

    # Monthly Trends (Combined)
    # strftime('%Y-%m', tx_date) works for ISO dates
    cur.execute("""
        SELECT strftime('%Y-%m', tx_date) as month, SUM(amount) as amount
        FROM transactions 
        GROUP BY month 
        ORDER BY month ASC
    """)
    monthly_trend = cur.fetchall()

    # Monthly Spend Only
    cur.execute("""
        SELECT strftime('%Y-%m', tx_date) as month, ABS(SUM(amount)) as amount
        FROM transactions 
        WHERE amount < 0
        GROUP BY month 
        ORDER BY month ASC
    """)
    monthly_spend = cur.fetchall()

    # Category Distribution
    cur.execute("""
        SELECT c.name as category, ABS(SUM(t.amount)) as amount
        FROM transactions t
        JOIN categories c ON c.id = t.category_id
        WHERE t.amount < 0
        GROUP BY c.name
        ORDER BY amount DESC
    """)
    category_dist = cur.fetchall()

    # Recent Transactions
    cur.execute("""
        SELECT t.tx_date, t.description, t.amount, t.account, c.name as category
        FROM transactions t
        LEFT JOIN categories c ON c.id = t.category_id
        ORDER BY t.tx_date DESC, t.id DESC
        LIMIT 10
    """)
    recent_transactions = cur.fetchall()

    con.close()

    result = {
        "kpis": {
            "total_spend": float(total_spend),
            "total_income": float(total_income),
            "savings": float(savings),
            "savings_rate": float(savings_rate)
        },
        "monthly_trend": monthly_trend,
        "monthly_spend": monthly_spend,
        "category_dist": category_dist,
        "recent_transactions": recent_transactions
    }
    
    return json.dumps(result, indent=2)

if __name__ == "__main__":
    print(get_analytics_json())
