import asyncio
import httpx
import sys
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT_DIR))

from backend.core.config import SUPABASE_URL, SUPABASE_KEY

async def test_supabase():
    print("=== Supabase Connection Test ===")
    print(f"Project Root: {ROOT_DIR}")
    print(f"SUPABASE_URL: {SUPABASE_URL or 'NOT SET'}")
    print(f"SUPABASE_KEY set: {bool(SUPABASE_KEY)} (Length: {len(SUPABASE_KEY) if SUPABASE_KEY else 0})")
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: SUPABASE_URL or SUPABASE_KEY is missing!")
        return

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    test_user_id = "00000000-0000-0000-0000-000000000000"

    print("\n--- 1. Testing INSERT into 'analyses' table ---")
    test_doc = {
        "user_id": test_user_id,
        "filename": "test_resume.pdf",
        "ats_score": 85.0,
        "keyword_match": 80.0,
        "missing_keywords": ["python", "docker"],
        "analysis_result": {"test": "data"},
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            res = await client.post(url, headers=headers, json=test_doc)
            print(f"INSERT Status Code: {res.status_code}")
            print(f"INSERT Response Body: {res.text}")
            
            inserted_id = None
            if res.status_code in (200, 201):
                res_data = res.json()
                if isinstance(res_data, list) and len(res_data) > 0:
                    inserted_id = res_data[0].get("id")
                    print(f"Successfully inserted test record! Generated ID: {inserted_id}")
            else:
                print("INSERT failed! Inspect status code and response body above.")
        except Exception as e:
            print(f"INSERT Exception: {e}")

        print("\n--- 2. Testing SELECT from 'analyses' table ---")
        try:
            res = await client.get(url, headers=headers, params={"user_id": f"eq.{test_user_id}"})
            print(f"SELECT Status Code: {res.status_code}")
            print(f"SELECT Response Body: {res.text}")
        except Exception as e:
            print(f"SELECT Exception: {e}")

        if inserted_id:
            print(f"\n--- 3. Cleaning up test record (ID: {inserted_id}) ---")
            try:
                res = await client.delete(url, headers=headers, params={"id": f"eq.{inserted_id}"})
                print(f"DELETE Status Code: {res.status_code}")
            except Exception as e:
                print(f"DELETE Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_supabase())
