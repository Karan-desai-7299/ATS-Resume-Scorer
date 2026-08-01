import React, { useState } from 'react'
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

export default function StrengthsIssues({ analysis }) {
  const strengths = analysis?.strengths || []
  const critical = analysis?.critical_issues || []
  const summary = analysis?.issues_summary || []
  const [showSummary, setShowSummary] = useState(false)

  const extraSummary = summary.filter((s) => !critical.includes(s))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths Card */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border-emerald-500/20">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" /> 💪 Strengths
        </h3>
        {strengths.length === 0 ? (
          <p className="text-xs text-gray-400">Keep improving your resume to unlock strengths!</p>
        ) : (
          <ul className="space-y-2 text-xs text-gray-200">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Critical Issues Card */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border-rose-500/20">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" /> 🚨 Critical Issues
        </h3>

        {critical.length === 0 && summary.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
            ✅ No Critical Issues Found! Your resume format looks great.
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-rose-300 font-medium">
              These issues should be addressed first for better ATS performance:
            </p>
            <ul className="space-y-2 text-xs text-gray-200">
              {critical.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {extraSummary.length > 0 && (
              <div className="pt-2 border-t border-gray-800">
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <span>📋 Additional Flagged Items ({extraSummary.length})</span>
                  {showSummary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showSummary && (
                  <ul className="mt-2 space-y-1.5 text-xs text-gray-400 pl-3">
                    {extraSummary.map((item, idx) => (
                      <li key={idx} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
