import os
import json 
import logging
from typing import Dict

from groq import Groq

logger=logging.getLogger('ats_resume_scorer')


GROQ_MODEL='llama-3.3-70b-versatile'

_client=None

def _get_client()->Groq:
    global _client
    if _client is None:
        api_key=os.getenv('GROQ_API_KEY')

        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable not set")
        _client=Groq(api_key=api_key)
    return _client

RESUME_SYSTEM_PROMPT = (
    "You are a resume parser. Extract information from the resume "
    "and return ONLY a valid JSON object. No explanation, no markdown."
)

RESUME_USER_PROMPT = """Extract the following from this resume and return as JSON:
{{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "linkedin": "LinkedIn URL if present, otherwise null",
  "github": "GitHub URL if present, otherwise null",
  "professional_summary": "the full text of the Summary, Profile, About Me, Objective, or Professional Summary section at the top of the resume. Copy the ENTIRE paragraph exactly as written. If no such section exists, return an empty string.",
  "skills": ["list", "of", "skills"],
  "experience": [
    {{
      "job_title": "",
      "company": "",
      "start_date": "",
      "end_date": "",
      "duration_months": 0,
      "description": ""
    }}
  ],
  "education": [
    {{
      "degree": "",
      "institution": "",
      "year": ""
    }}
  ],
  "certifications": ["list of certifications"],
  "projects": [
    {{
      "title": "project name",
      "description": "what the project does and how it was built",
      "technologies": ["tech", "used"]
    }}
  ],
  "action_verbs": ["strong action verbs used in bullet points, e.g. developed, implemented, designed"],
  "keywords": ["important keywords and phrases from the resume for ATS matching"]
}}

Important instructions:
- For duration_months, calculate the number of months between start_date and end_date. If end_date is "Present" or "Current", calculate from start_date to now.
- For skills, extract ALL technical and soft skills mentioned anywhere in the resume.
- For action_verbs, find verbs that start bullet points or describe achievements.
- For keywords, extract noun phrases and technical terms relevant to ATS matching.
- Return ONLY valid JSON. No markdown code fences, no explanation.

Resume Text:
{raw_text}"""

def _call_groq(client:Groq, system_prompt:str, user_prompt:str)->str:

    response=client.chat.completions.create(
        model=GROQ_MODEL, 
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ],
        temperature=0.0,
        max_tokens=4096
    )

    return response.choices[0].message.content.strip()

def _try_parse_json(text: str) -> dict | None:

    # Strip markdown code fences if present
    cleaned = text.strip()
    if cleaned.startswith("```"):

        # Remove opening fence (```json or ```)
        first_newline = cleaned.index("\n") if "\n" in cleaned else len(cleaned)
        cleaned = cleaned[first_newline + 1:]
        # Remove closing fence
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None
    
def parse_resume(raw_text: str)->Dict:

    client=_get_client()
    prompt=RESUME_USER_PROMPT.format(raw_text=raw_text)
    raw_response=_call_groq(client, RESUME_SYSTEM_PROMPT, prompt)
    result=_try_parse_json(raw_response)

    if result is None:
        return _validate_resume_result(result)
    

    logger.warning("Groq resume parse: first attempt returned invalid JSON, retrying...")
    strict_prompt = (
        "Your previous response was not valid JSON. "
        "Return ONLY the raw JSON object, no markdown, no explanation, no code fences.\n\n"
        + prompt
    )
    raw_response = _call_groq(client, RESUME_SYSTEM_PROMPT, strict_prompt)
    result = _try_parse_json(raw_response)
    if result is not None:
        return _validate_resume_result(result)

    raise ValueError(
        f"Groq returned unparseable response after retry. Raw response:\n{raw_response[:500]}"
    )
    
JD_SYSTEM_PROMPT = (
    "You are a job description parser. Extract information and "
    "return ONLY a valid JSON object. No explanation, no markdown."
)

JD_USER_PROMPT = """Extract the following from this job description and return as JSON:
{{
  "job_title": "",
  "required_skills": ["list of must-have skills"],
  "preferred_skills": ["list of nice-to-have skills"],
  "experience_required": "",
  "education_required": "",
  "key_responsibilities": ["list of responsibilities"],
  "keywords": ["important keywords and phrases for ATS matching"]
}}

Important instructions:
- required_skills: skills explicitly stated as required or must-have.
- preferred_skills: skills stated as preferred, nice-to-have, or bonus.
- keywords: extract ALL important terms an ATS system would match against,
  including skills, technologies, certifications, and domain terms.
- Return ONLY valid JSON. No markdown code fences, no explanation.

Job Description Text:
{raw_text}"""

def parse_job_description(raw_text: str) -> Dict:
    client = _get_client()
    prompt = JD_USER_PROMPT.format(raw_text=raw_text)

    raw_response = _call_groq(client, JD_SYSTEM_PROMPT, prompt)
    result = _try_parse_json(raw_response)
    if result is not None:
        return _validate_jd_result(result)

    logger.warning("Groq JD parse: first attempt returned invalid JSON, retrying...")
    strict_prompt = (
        "Your previous response was not valid JSON. "
        "Return ONLY the raw JSON object, no markdown, no explanation, no code fences.\n\n"
        + prompt
    )
    raw_response = _call_groq(client, JD_SYSTEM_PROMPT, strict_prompt)
    result = _try_parse_json(raw_response)
    if result is not None:
        return _validate_jd_result(result)

    raise ValueError(
        f"Groq returned unparseable response after retry. Raw response:\n{raw_response[:500]}"
    )

def optimize_bullet_point(draft_bullet: str, target_role: str = '') -> Dict:
    """Uses Groq LLM to rewrite any draft resume bullet into 3 high-impact, ATS-optimized variations."""
    client = _get_client()
    system_prompt = (
        "You are an expert resume writer and ATS optimization specialist. "
        "Transform draft bullet points into high-impact, quantifiable, action-oriented resume bullet points. "
        "Return ONLY valid JSON."
    )
    user_prompt = f"""Target Role: {target_role or 'Software Engineer'}
Draft Bullet Point: "{draft_bullet}"

Rewrite this draft bullet point into 3 distinct ATS-optimized versions:
1. "impact": Metric-driven version with strong action verbs and estimated percentages or outcome stats.
2. "technical": Skill-dense version highlighting tech stack, architecture, and engineering principles.
3. "executive": Leadership and outcome-focused version emphasizing business value and project scope.

Return as JSON:
{{
  "original": "{draft_bullet}",
  "impact_bullet": "string",
  "technical_bullet": "string",
  "executive_bullet": "string",
  "action_verb_used": "string",
  "improvement_tips": ["tip 1", "tip 2"]
}}
"""
    raw_response = _call_groq(client, system_prompt, user_prompt)
    parsed = _try_parse_json(raw_response)
    if parsed:
        return parsed
    
    # Simple fallback if JSON parsing fails
    return {
        "original": draft_bullet,
        "impact_bullet": f"Engineered solutions for {draft_bullet.lower()}, reducing processing latency by 35% and improving overall throughput.",
        "technical_bullet": f"Architected scalable infrastructure to support {draft_bullet.lower()} utilizing modern tech stacks and CI/CD pipelines.",
        "executive_bullet": f"Spearheaded initiatives for {draft_bullet.lower()}, driving operational excellence and cross-functional team alignment.",
        "action_verb_used": "Engineered / Spearheaded",
        "improvement_tips": ["Add specific percentage or dollar metrics", "Start bullet with a high-impact past-tense action verb"]
    }

def _validate_jd_result(result: dict) -> dict:
    defaults = {
        "job_title": "",
        "required_skills": [],
        "preferred_skills": [],
        "experience_required": "",
        "education_required": "",
        "key_responsibilities": [],
        "keywords": [],
    }

    for key, default in defaults.items():
        if key not in result or result[key] is None:
            result[key] = default
        if isinstance(default, list) and not isinstance(result[key], list):
            result[key] = default

    return result

def _validate_resume_result(result: dict) -> dict:
    defaults = {
        "name": "",
        "email": None,
        "phone": None,
        "linkedin": None,
        "github": None,
        "professional_summary": "",
        "skills": [],
        "experience": [],
        "education": [],
        "certifications": [],
        "projects": [],
        "action_verbs": [],
        "keywords": [],
    }
    for key, default in defaults.items():
        if key not in result or result[key] is None:
            result[key] = default
            
        if isinstance(default, list) and not isinstance(result[key], list):
            result[key] = default

    for exp in result.get("experience", []):
        if not isinstance(exp, dict):
            continue
        exp.setdefault("job_title", "")
        exp.setdefault("company", "")
        exp.setdefault("start_date", "")
        exp.setdefault("end_date", "")
        exp.setdefault("duration_months", 0)
        exp.setdefault("description", "")
        try:
            exp["duration_months"] = int(exp["duration_months"])
        except (ValueError, TypeError):
            exp["duration_months"] = 0

    for proj in result.get("projects", []):
        if not isinstance(proj, dict):
            continue
        proj.setdefault("title", "")
        proj.setdefault("description", "")
        proj.setdefault("technologies", [])

    return result


def ask_resume_question(question: str, analysis_context: dict) -> str:
    """
    Answer a user's question about their resume using Groq LLaMA 3.3.
    The analysis_context is a summary of the ATS analysis result.
    Returns a plain-text answer string.
    """
    client = _get_client()

    ats_score = analysis_context.get("ats_score") or analysis_context.get("ATS_score", 0)
    skills = analysis_context.get("skills", [])
    strengths = (analysis_context.get("issues_summary") or {}).get("strengths", [])
    critical_issues = (analysis_context.get("issues_summary") or {}).get("critical_issues", [])
    suggestions = (analysis_context.get("issues_summary") or {}).get("suggestions", [])
    cs = analysis_context.get("component_scores", {})
    interpretation = analysis_context.get("interpretation", "")

    context_summary = f"""
The user's resume has an ATS Score of {ats_score}/100 ({interpretation}).

Component Scores:
- Formatting & Layout: {cs.get('formatting', 'N/A')}/20
- Keywords & Skills: {cs.get('keywords', 'N/A')}/25
- Content Quality: {cs.get('content', 'N/A')}/25
- Skill Validation: {cs.get('skill_validation', 'N/A')}/15
- ATS Compatibility: {cs.get('ats_compatibility', 'N/A')}/15

Top Strengths: {', '.join(strengths[:4]) if strengths else 'None listed'}
Critical Issues: {', '.join(critical_issues[:4]) if critical_issues else 'None'}
Key Suggestions: {', '.join(suggestions[:4]) if suggestions else 'None listed'}
Detected Skills: {', '.join(skills[:15]) if skills else 'Not detected'}
""".strip()

    system_prompt = (
        "You are an expert ATS resume coach and career advisor. "
        "You have just analyzed the user's resume and have the full analysis context below. "
        "Answer the user's question concisely, specifically, and in a helpful and friendly tone. "
        "Keep your response under 200 words unless a detailed answer is truly needed. "
        "Use bullet points or numbered lists when listing multiple items. "
        "Always give actionable advice.\n\n"
        f"Resume Analysis Context:\n{context_summary}"
    )

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question},
            ],
            max_tokens=400,
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.error(f"ask_resume_question failed: {exc}")
        raise
