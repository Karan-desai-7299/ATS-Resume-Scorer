import React from 'react'

const COMPONENTS = [
  { label: 'Formatting', key: 'formatting', maxScore: 20, icon: '📝' },
  { label: 'Keywords & Skills', key: 'keywords', maxScore: 25, icon: '🔑' },
  { label: 'Content Quality', key: 'content', maxScore: 25, icon: '📄' },
  { label: 'Skill Validation', key: 'skill_validation', maxScore: 15, icon: '✅' },
  { label: 'ATS Compatibility', key: 'ats_compatibility', maxScore: 15, icon: '🤖' },
]

export default function ScoreBreakdown({ analysis }) {
  const componentScores = analysis?.component_scores || {}

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        📈 Score Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMPONENTS.map((item) => {
          const value = Number(componentScores[item.key] || 0)
          const pct = item.maxScore ? Math.min(Math.max((value / item.maxScore) * 100, 0), 100) : 0
          const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'

          return (
            <div key={item.key} className="glass-card p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-200">
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span> {item.label}
                </span>
                <span className="text-indigo-400 font-bold">
                  {Math.round(value)} / {item.maxScore}
                </span>
              </div>

              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
