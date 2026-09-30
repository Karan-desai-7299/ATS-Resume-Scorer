import React from 'react'
import { Layout, KeyRound, FileCheck, Award, ShieldCheck, CheckCircle2 } from 'lucide-react'

const COMPONENTS = [
  { label: 'Formatting & Layout', key: 'formatting', maxScore: 20, icon: Layout, desc: 'Headers, fonts, tables, margins & single-column structure' },
  { label: 'Keywords & Skill Density', key: 'keywords', maxScore: 25, icon: KeyRound, desc: 'ATS keyword extraction frequency and technical term density' },
  { label: 'Content Quality & Impact', key: 'content', maxScore: 25, icon: FileCheck, desc: 'Quantifiable achievements, metrics, and action verbs' },
  { label: 'Skill Validation in Experience', key: 'skill_validation', maxScore: 15, icon: Award, desc: 'Correlating listed skills with bullet points & work context' },
  { label: 'ATS System Compatibility', key: 'ats_compatibility', maxScore: 15, icon: ShieldCheck, desc: 'File readability, contact information and privacy rating' },
]

export default function ScoreBreakdown({ analysis }) {
  const componentScores = analysis?.component_scores || {}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-400" /> Five Core ATS Pillars
          </h3>
          <p className="text-xs text-gray-400">Detailed points breakdown across standard scoring criteria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMPONENTS.map((item) => {
          const Icon = item.icon
          const value = Number(componentScores[item.key] || 0)
          const pct = item.maxScore ? Math.min(Math.max((value / item.maxScore) * 100, 0), 100) : 0
          
          const status = pct >= 80 ? 'Strong' : pct >= 60 ? 'Moderate' : 'Needs Work'
          const statusColor = pct >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : pct >= 60 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
          const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'

          return (
            <div key={item.key} className="glass-card p-5 rounded-2xl space-y-3 border border-gray-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">{item.label}</span>
                    <span className="text-[11px] text-gray-400">{item.desc}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-white tabular-nums">
                    {Math.round(value)} <span className="text-xs text-gray-400 font-normal">/ {item.maxScore}</span>
                  </span>
                  <span className={`block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor} text-center`}>
                    {status}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
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
