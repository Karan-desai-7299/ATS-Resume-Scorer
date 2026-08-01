import React from 'react'
import ScoreDisplay from './ScoreDisplay'
import ScoreBreakdown from './ScoreBreakdown'
import StrengthsIssues from './StrengthsIssues'
import SkillValidation from './SkillValidation'
import JDComparison from './JDComparison'
import DetailedFeedback from './DetailedFeedback'
import ActionItems from './ActionItems'
import Recommendations from './Recommendations'
import ParsedResumeOverview from './ParsedResumeOverview'
import ResumeAIChat from './ResumeAIChat'

export default function ResultsDashboard({ analysis }) {
  if (!analysis) return null

  const jdComparison = analysis.jd_comparison || analysis.jd_match_analysis

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Score + mini breakdown */}
      <ScoreDisplay analysis={analysis} />
      <hr className="border-gray-800/80" />

      {/* Parsed resume overview (candidate details) */}
      <ParsedResumeOverview analysis={analysis} />
      <hr className="border-gray-800/80" />

      {/* Detailed score breakdown bars */}
      <ScoreBreakdown analysis={analysis} />
      <hr className="border-gray-800/80" />

      {/* Strengths & Critical Issues */}
      <StrengthsIssues analysis={analysis} />
      <hr className="border-gray-800/80" />

      {/* Skill Validation */}
      <SkillValidation analysis={analysis} />
      <hr className="border-gray-800/80" />

      {/* JD Comparison (only when JD was provided) */}
      {jdComparison && (
        <>
          <JDComparison jdComparison={jdComparison} />
          <hr className="border-gray-800/80" />
        </>
      )}

      {/* Detailed AI Feedback */}
      <DetailedFeedback analysis={analysis} />
      <hr className="border-gray-800/80" />

      {/* Action Items */}
      <ActionItems analysis={analysis} />
      <hr className="border-gray-800/80" />

      {/* Recommendations */}
      <Recommendations analysis={analysis} />
      <hr className="border-gray-800/80" />

      {/* AI Resume Coach Chat */}
      <ResumeAIChat analysis={analysis} />
    </div>
  )
}
