import csv
import sqlite3
import os
import random

def generate_synthetic_data(output_path="data/synthetic_expenses.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    categories = ["Groceries", "Dining Out", "Transport", "Rent", "Utilities", "Shopping", "Entertainment"]
    descriptions = {
        "Groceries": ["Walmart", "Kroger", "Whole Foods", "Trader Joe's"],
        "Dining Out": ["Starbucks", "McDonalds", "Chipotle", "Local Pizza"],
        "Transport": ["Uber", "Gas Station", "Metro Ticket", "Bus Pass"],
        "Rent": ["Apartment Rent"],
        "Utilities": ["Electric Bill", "Water Bill", "Internet", "Phone Bill"],
        "Shopping": ["Amazon", "Nike", "Target", "H&M"],
        "Entertainment": ["Netflix", "Movie Theater", "Spotify", "Bowling"]
    }
    
    headers = ["Date", "Description", "Amount", "Account"]
    data = []
    
    # Generate data for the last 3 months
    for month in [3, 4, 5]:
        # Income
        data.append(["2026-0{}-01".format(month), "Monthly Salary", 3000.0, "Checking"])
        
        # Expenses
        for _ in range(20):
            cat = random.choice(categories)
            desc = random.choice(descriptions[cat])
            day = random.randint(1, 28)
            amt = round(random.uniform(5, 150), 2)
            if cat == "Rent": amt = 1200.0
            
            data.append(["2026-0{}-{:02d}".format(month, day), desc, -amt, "Checking"])
            
    with open(output_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(data)
        
    print(f"Synthetic data generated at {output_path}")
    return output_path

def ingest_csv(csv_path, account="Default", db_path="data/expenses.db"):
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    
    count = 0
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            tx_date = row['Date']
            description = row['Description'].strip()
            amount = float(row['Amount'])
            
            cur.execute("""
            INSERT OR IGNORE INTO transactions (tx_date, description, amount, account, raw_source)
            VALUES (?, ?, ?, ?, ?)
            """, (tx_date, description, amount, account, csv_path))
            if cur.rowcount > 0:
                count += 1
    
    con.commit()
    con.close()
    print(f"Ingested {count} new transactions from {csv_path}")

if __name__ == "__main__":
    path = generate_synthetic_data()
    ingest_csv(path, account="Main Checking")
