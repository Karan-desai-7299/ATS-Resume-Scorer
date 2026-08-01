import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, AlertCircle, AlertOctagon, Info } from 'lucide-react'

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low']

function getSeverityBadge(severity) {
  const level = (severity || '').toLowerCase()
  if (level === 'critical' || level === 'high') {
    return {
      icon: AlertOctagon,
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      label: 'Critical / High',
    }
  }
  if (level === 'medium') {
    return {
      icon: AlertCircle,
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      label: 'Medium',
    }
  }
  return {
    icon: Info,
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    label: 'Low',
  }
}

function IssueItem({ issue }) {
  const [expanded, setExpanded] = useState(false)
  const badge = getSeverityBadge(issue.severity_level)
  const Icon = badge.icon

  return (
    <div className={`rounded-xl border ${badge.borderColor} ${badge.bgColor} overflow-hidden transition-all`}>
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 flex items-center justify-between cursor-pointer hover:opacity-90"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${badge.textColor} shrink-0`} />
          <div>
            <h5 className="text-sm font-bold text-white">{issue.issue_title || 'Untitled Issue'}</h5>
            {issue.ats_impact && <p className="text-xs text-gray-400">{issue.ats_impact}</p>}
          </div>
        </div>
        <button className="text-gray-400 hover:text-white p-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="p-4 pt-0 border-t border-gray-800/60 space-y-3 text-xs text-gray-300">
          {issue.explanation && (
            <div>
              <strong className="text-white">What's happening:</strong> {issue.explanation}
            </div>
          )}
          {issue.where_it_appears && (
            <div>
              <strong className="text-white">Where it appears:</strong> {issue.where_it_appears}
            </div>
          )}
          {issue.how_to_fix && (
            <div>
              <strong className="text-white">How to fix:</strong> {issue.how_to_fix}
            </div>
          )}
          {issue.action_items && issue.action_items.length > 0 && (
            <div>
              <strong className="text-white">Action items:</strong>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                {issue.action_items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {issue.example_improvement && (
            <div>
              <strong className="text-white">Example improvement:</strong>
              <pre className="mt-1.5 p-3 rounded-lg bg-gray-950 border border-gray-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                {issue.example_improvement}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DetailedFeedback({ analysis }) {
  const issues = analysis?.detailed_feedback || []
  if (!issues || issues.length === 0) return null

  const grouped = { critical: [], high: [], medium: [], low: [] }
  issues.forEach((issue) => {
    const level = (issue.severity_level || 'low').toLowerCase()
    if (grouped[level]) {
      grouped[level].push(issue)
    } else {
      grouped.low.push(issue)
    }
  })

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" /> 🔍 Detailed Feedback
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {issues.length} issue(s) flagged — grouped by severity. Click any item to expand fix recommendations.
        </p>
      </div>

      <div className="space-y-6">
        {SEVERITY_ORDER.map((level) => {
          const items = grouped[level]
          if (!items || items.length === 0) return null

          return (
            <div key={level} className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {level} ({items.length})
              </h4>
              <div className="space-y-2">
                {items.map((issue, idx) => (
                  <IssueItem key={idx} issue={issue} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
