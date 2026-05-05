import os
import sys
from python_logic.models import init_db
from python_logic.ingest import generate_synthetic_data, ingest_csv
from python_logic.categorize import run_categorization
from python_logic.analyze import get_analytics_json

def full_pipeline():
    print("--- Starting Personal Expense Tracker Pipeline ---")
    
    # 1. Setup Database
    print("Step 1: Initializing SQLite database...")
    init_db()
    
    # 2. Data Ingestion
    print("\nStep 2: Generating and ingesting synthetic transaction data...")
    csv_path = generate_synthetic_data()
    ingest_csv(csv_path, account="Primary Bank")
    
    # 3. Categorization
    print("\nStep 3: Running AI-powered categorization rules...")
    run_categorization()
    
    # 4. Analysis
    print("\nStep 4: Generating financial insights...")
    insights = get_analytics_json()
    
    print("\nSuccess! System is fully populated.")
    print("--------------------------------------------------")

if __name__ == "__main__":
    full_pipeline()
    print("Dashboard data is ready. You can now run the web interface.")
