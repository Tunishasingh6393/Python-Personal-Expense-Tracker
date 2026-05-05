import sqlite3
import re

KEYWORDS = {
    "Groceries": [r"walmart", r"kroger", r"foods", r"trader", r"grocery", r"market"],
    "Dining Out": [r"starbucks", r"mcdonalds", r"chipotle", r"pizza", r"restaurant", r"cafe"],
    "Transport": [r"uber", r"gas", r"metro", r"bus", r"transport", r"fuel"],
    "Rent": [r"rent", r"apartment", r"housing"],
    "Utilities": [r"electric", r"water", r"internet", r"wifi", r"phone", r"bill"],
    "Shopping": [r"amazon", r"nike", r"target", r"h&m", r"shopping", r"retail"],
    "Entertainment": [r"netflix", r"movie", r"spotify", r"bowling", r"cinema", r"game"],
    "Income": [r"salary", r"deposit", r"paycheck", r"refund"]
}

def classify_description(description):
    desc = description.lower()
    for category, patterns in KEYWORDS.items():
        if any(re.search(p, desc) for p in patterns):
            return category
    return "Miscellaneous"

def run_categorization(db_path="data/expenses.db"):
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    
    # Get transactions without a category
    cur.execute("SELECT id, description, amount FROM transactions WHERE category_id IS NULL")
    uncategorized = cur.fetchall()
    
    if not uncategorized:
        print("No uncategorized transactions found.")
        con.close()
        return

    # Get category map
    cur.execute("SELECT id, name FROM categories")
    categories = cur.fetchall()
    name_to_id = {name: cat_id for cat_id, name in categories}
    
    count = 0
    for row in uncategorized:
        row_id, description, amount = row
        # Override for positive amounts
        if amount > 0:
            cat_name = "Income"
        else:
            cat_name = classify_description(description)
            
        cat_id = name_to_id.get(cat_name, name_to_id.get("Miscellaneous"))
        cur.execute("UPDATE transactions SET category_id = ? WHERE id = ?", (cat_id, row_id))
        count += 1
        
    con.commit()
    con.close()
    print(f"Categorized {count} transactions.")

if __name__ == "__main__":
    run_categorization()
