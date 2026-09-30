import React, { useState } from 'react'
import { Zap, AlertCircle, AlertTriangle, Info, CheckSquare, Square } from 'lucide-react'

const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 }

export default function ActionItems({ analysis }) {
  const [completed, setCompleted] = useState({})

  const items = []
  const feedback = analysis?.detailed_feedback || []
  
  feedback.forEach((issue) => {
    const level = (issue.severity_level || 'low').toLowerCase()
    const title = issue.issue_title || ''
    const actions = issue.action_items || []
    actions.forEach((action) => {
      items.push({ level, source: title, action })
    })
  })

  if (items.length === 0) {
    const suggestions = analysis?.suggestions || []
    suggestions.forEach((sugg) => {
      items.push({ level: 'medium', source: 'General ATS Best Practice', action: sugg })
    })
  }

  items.sort((a, b) => (SEVERITY_RANK[a.level] ?? 99) - (SEVERITY_RANK[b.level] ?? 99))

  if (items.length === 0) return null

  const toggleCheck = (idx) => {
    setCompleted(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const getBadgeStyle = (level) => {
    switch (level) {
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/25'
      case 'high':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25'
      case 'medium':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/25'
    }
  }

  return (
    <div className="glass-card p-6 rounded-3xl space-y-4 border border-gray-800">
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Prioritized Action Checklist</h3>
            <p className="text-xs text-gray-400">Concrete steps to elevate your ATS score, ranked by priority</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-gray-400">
          {Object.values(completed).filter(Boolean).length} / {items.length} completed
        </span>
      </div>

      <ul className="space-y-2.5 text-xs text-gray-200">
        {items.map((item, idx) => {
          const isDone = !!completed[idx]
          return (
            <li
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                isDone
                  ? 'bg-gray-900/20 border-gray-800/40 opacity-60'
                  : 'bg-gray-900/50 hover:bg-gray-900/80 border-gray-800'
              }`}
            >
              <button type="button" className="mt-0.5 text-indigo-400 shrink-0">
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4 text-gray-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getBadgeStyle(item.level)}`}>
                    {item.level}
                  </span>
                  <span className="text-[11px] font-bold text-gray-300">
                    {item.source}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {item.action}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
