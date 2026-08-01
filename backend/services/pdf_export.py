import io
import logging
import re
import html

logger = logging.getLogger('ats_resume_scorer')

try:
    from weasyprint import HTML, CSS
    WEASYPRINT_INSTALLED = True
except (ImportError, OSError, Exception) as e:
    logger.warning(f"WeasyPrint unavailable: {e}. ReportLab will be used as PDF generator.")
    WEASYPRINT_INSTALLED = False


def _clean_text_for_pdf(text: str, escape_xml: bool = True) -> str:
    """Strip/replace non-latin1 characters and emojis, and XML-escape text for ReportLab Paragraphs."""
    if text is None:
        return ""
    if not isinstance(text, str):
        text = str(text)
    # Remove emojis and high unicode symbols
    text = re.sub(r'[\U00010000-\U0010ffff]', '', text)
    text = re.sub(r'[\u2600-\u27bf]', '', text)
    cleaned = text.encode('ascii', 'ignore').decode('ascii')
    if escape_xml:
        return html.escape(cleaned)
    return cleaned


def generate_pdf_with_reportlab(data: dict) -> bytes:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#4F46E5'),
        alignment=1, # Center
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#4B5563'),
        alignment=1,
        spaceAfter=15
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1E1B4B'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#374151')
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("ATS Resume Analysis Report", title_style))
    score = float(data.get('ATS_score', data.get('ats_score', 0)))
    interpretation = _clean_text_for_pdf(data.get('interpretation', ''))
    story.append(Paragraph(f"Overall ATS Score: <b>{score:.0f}/100</b> - {interpretation}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E5E7EB'), spaceAfter=12))

    # Component Scores Table
    story.append(Paragraph("Score Breakdown", heading_style))
    cs = data.get('component_scores', {})
    if hasattr(cs, 'model_dump'):
        cs = cs.model_dump()
    elif not isinstance(cs, dict):
        cs = getattr(cs, '__dict__', {})

    table_data = [
        [Paragraph("<b>Category</b>", body_style), Paragraph("<b>Score</b>", body_style), Paragraph("<b>Max Score</b>", body_style)]
    ]
    components = [
        ("Formatting & Layout", cs.get("formatting", 0), 20),
        ("Keywords & Skills", cs.get("keywords", 0), 25),
        ("Content Quality", cs.get("content", 0), 25),
        ("Skill Validation", cs.get("skill_validation", 0), 15),
        ("ATS Compatibility", cs.get("ats_compatibility", 0), 15),
    ]
    for label, val, max_val in components:
        table_data.append([
            Paragraph(_clean_text_for_pdf(label), body_style),
            Paragraph(f"{float(val):.0f}", body_style),
            Paragraph(str(max_val), body_style)
        ])

    t = Table(table_data, colWidths=[3.5*inch, 1.5*inch, 1.5*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EEF2FF')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#4F46E5')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # Strengths
    strengths = data.get('strengths', [])
    if strengths:
        story.append(Paragraph("Key Strengths", heading_style))
        for item in strengths:
            cleaned_item = _clean_text_for_pdf(item)
            story.append(Paragraph(f"* {cleaned_item}", body_style))
        story.append(Spacer(1, 8))

    # Critical Issues
    critical = data.get('critical_issues', [])
    if critical:
        story.append(Paragraph("Critical Issues to Fix", heading_style))
        for item in critical:
            cleaned_item = _clean_text_for_pdf(item)
            story.append(Paragraph(f"* {cleaned_item}", body_style))
        story.append(Spacer(1, 8))

    # Detailed Feedback
    feedback = data.get('detailed_feedback', [])
    if feedback:
        story.append(Paragraph("Detailed Feedback", heading_style))
        for issue in feedback:
            if hasattr(issue, 'model_dump'):
                issue = issue.model_dump()
            elif not isinstance(issue, dict):
                issue = getattr(issue, '__dict__', {})
            title = _clean_text_for_pdf(issue.get('issue_title', ''))
            impact = _clean_text_for_pdf(issue.get('ats_impact', ''))
            how_to_fix = _clean_text_for_pdf(issue.get('how_to_fix', ''))
            severity = _clean_text_for_pdf(issue.get('severity_level', 'info')).upper()
            story.append(Paragraph(f"<b>[{severity}] {title}</b> - <i>{impact}</i>", body_style))
            if how_to_fix:
                story.append(Paragraph(f"Fix: {how_to_fix}", body_style))
            story.append(Spacer(1, 4))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()


def generate_combined_pdf(html_docs: dict, data: dict = None) -> bytes:
    if WEASYPRINT_INSTALLED:
        try:
            documents = []
            for name, html_str in html_docs.items():
                doc = HTML(string=html_str).render()
                documents.append(doc)
            
            first_doc = documents[0]
            for other_doc in documents[1:]:
                for page in other_doc.pages:
                    first_doc.pages.append(page)
                    
            return first_doc.write_pdf()
        except Exception as exc:
            logger.warning(f"WeasyPrint rendering failed: {exc}. Falling back to ReportLab...")

    # Fallback to ReportLab if WeasyPrint fails or is unavailable
    if data is None:
        data = {}
    return generate_pdf_with_reportlab(data)
