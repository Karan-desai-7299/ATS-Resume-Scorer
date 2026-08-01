import React from 'react'
import { Zap } from 'lucide-react'

const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 }

export default function ActionItems({ analysis }) {
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
      items.push({ level: 'medium', source: 'General', action: sugg })
    })
  }

  items.sort((a, b) => (SEVERITY_RANK[a.level] ?? 99) - (SEVERITY_RANK[b.level] ?? 99))

  if (items.length === 0) return null

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> ⚡ Priority Action Items
        </h3>
        <p className="text-xs text-gray-400 mt-1">Concrete steps to improve your score, sorted by urgency.</p>
      </div>

      <ul className="space-y-2 text-xs text-gray-200">
        {items.map((item, idx) => {
          const icon =
            item.level === 'critical' ? '🔴' : item.level === 'high' ? '🟠' : item.level === 'medium' ? '🟡' : '🟢'
          return (
            <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-gray-900/40 border border-gray-800">
              <span className="shrink-0">{icon}</span>
              <div>
                <strong className="text-white">[{item.source}]</strong> {item.action}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
