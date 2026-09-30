import React, { useState } from 'react'
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react'

export default function StrengthsIssues({ analysis }) {
  const strengths = analysis?.strengths || []
  const critical = analysis?.critical_issues || []
  const summary = analysis?.issues_summary || []
  const [showSummary, setShowSummary] = useState(false)

  const extraSummary = summary.filter((s) => !critical.includes(s))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Strengths Card */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-emerald-500/25">
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Key Strengths & Highlights</h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {strengths.length} Detected
          </span>
        </div>

        {strengths.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No standout strengths identified. Review the issues on the right to optimize.</p>
        ) : (
          <ul className="space-y-2.5 text-xs text-gray-200">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-900/40 border border-gray-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Critical Issues Card */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-rose-500/25">
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Critical Issues to Resolve</h3>
          </div>
          <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            {critical.length} Flagged
          </span>
        </div>

        {critical.length === 0 && summary.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero critical formatting or layout blockers found! Your document structure looks solid.</span>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-rose-300/90 font-medium">
              These factors significantly impact automatic parser pass rates:
            </p>
            <ul className="space-y-2.5 text-xs text-gray-200">
              {critical.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-900/40 border border-gray-800/60">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {extraSummary.length > 0 && (
              <div className="pt-2 border-t border-gray-800/80">
                <button
                  type="button"
                  onClick={() => setShowSummary(!showSummary)}
                  className="flex items-center justify-between w-full p-2 rounded-xl bg-gray-900/50 hover:bg-gray-800 text-xs text-indigo-400 font-semibold transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Additional Advisory Notes ({extraSummary.length})
                  </span>
                  {showSummary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showSummary && (
                  <ul className="mt-2 space-y-1.5 text-xs text-gray-400 pl-3 pt-1">
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
