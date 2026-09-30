import React, { useState } from 'react'
import { Award, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Check, Layers } from 'lucide-react'

export default function SkillValidation({ analysis }) {
  const details = analysis?.skill_validation_details || {}
  const validated = details?.validated || []
  const unvalidated = details?.unvalidated || []
  const total = details?.total ?? (validated.length + unvalidated.length)
  const pct = details?.validation_pct ?? 0.0

  const [showValidated, setShowValidated] = useState(false)
  const [showUnvalidated, setShowUnvalidated] = useState(false)

  if (total === 0) {
    return (
      <div className="glass-card p-6 rounded-3xl space-y-2 border border-gray-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" /> Skill Evidence Validation
        </h3>
        <p className="text-xs text-gray-400">No standalone skills detected to validate.</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-6 border border-gray-800">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Skill Evidence Validation</h3>
            <p className="text-xs text-gray-400">Verifying if listed skills have matching context in work bullets</p>
          </div>
        </div>

        <span className="text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full">
          {Math.round(pct)}% Contextual Rate
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3.5 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">{total}</div>
          <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Total Listed</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 tabular-nums">{validated.length}</div>
          <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Proven in Exp</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 tabular-nums">{Math.round(pct)}%</div>
          <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Validation Rate</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Validated Skills Drawer */}
      {validated.length > 0 && (
        <div className="border border-emerald-500/25 rounded-2xl bg-emerald-950/20 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowValidated(!showValidated)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-emerald-900/20 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Skills Proven in Work Experience ({validated.length})</span>
            </div>
            {showValidated ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-emerald-400" />}
          </button>
          {showValidated && (
            <div className="p-3.5 pt-0 flex flex-wrap gap-1.5 border-t border-emerald-500/20 mt-1">
              {validated.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-emerald-400" /> {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Unvalidated Skills Drawer */}
      {unvalidated.length > 0 && (
        <div className="border border-amber-500/25 rounded-2xl bg-amber-950/20 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowUnvalidated(!showUnvalidated)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-amber-900/20 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Skills Listed Only (Missing Context in Experience) ({unvalidated.length})</span>
            </div>
            {showUnvalidated ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
          </button>
          {showUnvalidated && (
            <div className="p-3.5 pt-0 flex flex-wrap gap-1.5 border-t border-amber-500/20 mt-1">
              {unvalidated.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[11px] font-medium text-amber-200 bg-amber-950/40 border border-amber-500/30 rounded-lg"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
