import logging
import httpx
import json
import os
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional, Dict

logger = logging.getLogger('ats_resume_scorer')

from backend.core.config import SUPABASE_URL, SUPABASE_KEY

LOCAL_HISTORY_FILE = Path(__file__).parent / "local_history.json"

def _load_local_history() -> List[Dict]:
    if not LOCAL_HISTORY_FILE.exists():
        return []
    try:
        with open(LOCAL_HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.warning(f"Could not load local history: {e}")
        return []

def _save_local_history(data: List[Dict]):
    try:
        with open(LOCAL_HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
    except Exception as e:
        logger.warning(f"Could not save local history: {e}")

def _get_headers():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

async def save_analysis(user_id: str, filename: str, analysis_result: Dict) -> Optional[str]:
    """
    Save analysis to Supabase DB (primary single source of truth).
    Falls back to local JSON file ONLY if Supabase is unreachable.
    Returns the canonical single ID of the saved analysis.
    """
    headers = _get_headers()

    def _json_default(o):
        if hasattr(o, 'model_dump'):
            return o.model_dump()
        return str(o)

    serializable_result = json.loads(json.dumps(analysis_result, default=_json_default))
    created_at = datetime.now(timezone.utc).isoformat()
    ats_score = serializable_result.get("ats_score", serializable_result.get("ATS_score", 0))

    db_doc = {
        "user_id": user_id,
        "filename": filename,
        "ats_score": ats_score,
        "keyword_match": serializable_result.get("keyword_match", 0),
        "missing_keywords": serializable_result.get("missing_keywords", []),
        "created_at": created_at,
        "analysis_result": serializable_result,
    }

    # 1. Primary path: Save to Supabase REST API
    if headers and SUPABASE_URL:
        url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, headers=headers, json=db_doc)
                if response.status_code in (200, 201):
                    res_json = response.json()
                    if res_json and isinstance(res_json, list) and len(res_json) > 0:
                        canonical_id = str(res_json[0].get("id"))
                        logger.info(f"Saved analysis to Supabase DB for user {user_id}: canonical_id={canonical_id}")
                        return canonical_id
                else:
                    logger.error(f"Supabase REST insert failed (HTTP {response.status_code}): {response.text}")
        except Exception as exc:
            logger.error(f"Supabase REST connection error during save: {exc}")

    # 2. Backup fallback path: Save to local JSON store ONLY if Supabase write failed / unreachable
    fallback_id = f"hist_{int(datetime.now().timestamp() * 1000)}"
    fallback_doc = {**db_doc, "id": fallback_id}
    local_data = _load_local_history()
    local_data.insert(0, fallback_doc)
    _save_local_history(local_data)
    logger.warning(f"Saved analysis to local JSON fallback for user {user_id}: fallback_id={fallback_id}")

    return fallback_id

async def get_user_history(user_id: str) -> List[Dict]:
    """
    Fetch analysis history for user_id.
    Supabase DB is the primary source of truth. Deduplicates by ID.
    """
    results_map: Dict[str, Dict] = {}

    # 1. Primary: Fetch from Supabase DB
    headers = _get_headers()
    if headers and SUPABASE_URL:
        url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    url,
                    headers=headers,
                    params={
                        "user_id": f"eq.{user_id}",
                        "order": "created_at.desc"
                    }
                )
                if response.status_code == 200:
                    docs = response.json()
                    for doc in docs:
                        entry_id = str(doc.get("id"))
                        results_map[entry_id] = {
                            "id": entry_id,
                            "filename": doc.get("filename", "resume"),
                            "resume_name": doc.get("filename", "resume"),
                            "job_title": "Software Engineer",
                            "ats_score": doc.get("ats_score", 0),
                            "keyword_match": doc.get("keyword_match", 0),
                            "missing_keywords": doc.get("missing_keywords", []),
                            "date": doc.get("created_at", ""),
                            "created_at": doc.get("created_at", ""),
                            "analysis_result": doc.get("analysis_result", {}),
                        }
                else:
                    logger.error(f"Supabase REST history fetch failed (HTTP {response.status_code}): {response.text}")
        except Exception as exc:
            logger.error(f"Supabase REST connection error during history fetch: {exc}")

    # 2. Local fallback items merge (only if not already in Supabase results_map)
    local_entries = _load_local_history()
    for doc in local_entries:
        if doc.get("user_id") == user_id:
            entry_id = str(doc.get("id"))
            if entry_id not in results_map:
                results_map[entry_id] = {
                    "id": entry_id,
                    "filename": doc.get("filename", "resume"),
                    "resume_name": doc.get("filename", "resume"),
                    "job_title": "Software Engineer",
                    "ats_score": doc.get("ats_score", 0),
                    "keyword_match": doc.get("keyword_match", 0),
                    "missing_keywords": doc.get("missing_keywords", []),
                    "date": doc.get("created_at", ""),
                    "created_at": doc.get("created_at", ""),
                    "analysis_result": doc.get("analysis_result", {}),
                }

    history_list = list(results_map.values())
    history_list.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)
    return history_list

async def delete_analysis(analysis_id: str, user_id: str) -> bool:
    """
    Delete analysis record from Supabase (primary) and local store (if present).
    """
    deleted_db = False
    headers = _get_headers()

    if headers and SUPABASE_URL:
        url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.delete(
                    url,
                    headers=headers,
                    params={
                        "id": f"eq.{analysis_id}",
                        "user_id": f"eq.{user_id}"
                    }
                )
                if response.status_code in (200, 204):
                    deleted_db = True
        except Exception as exc:
            logger.error(f"Supabase REST delete error: {exc}")

    # Also clean from local JSON file if present
    local_entries = _load_local_history()
    filtered = [doc for doc in local_entries if not (str(doc.get("id")) == str(analysis_id) and doc.get("user_id") == user_id)]
    deleted_local = len(filtered) < len(local_entries)
    if deleted_local:
        _save_local_history(filtered)

    return deleted_db or deleted_local
