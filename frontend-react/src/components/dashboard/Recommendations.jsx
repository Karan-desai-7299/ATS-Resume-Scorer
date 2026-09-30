import React from 'react'
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react'

export default function Recommendations({ analysis }) {
  const suggestions = analysis?.suggestions || []
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4 border border-indigo-500/25">
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Strategic AI Recommendations</h3>
            <p className="text-xs text-gray-400">Targeted advice to maximize recruiter callbacks and ATS ranking</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          {suggestions.length} Action Items
        </span>
      </div>

      <ul className="space-y-2.5 text-xs text-gray-200">
        {suggestions.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-900/50 border border-gray-800">
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
