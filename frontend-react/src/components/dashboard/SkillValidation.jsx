import React, { useState } from 'react'
import { Award, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

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
      <div className="glass-card p-6 rounded-2xl space-y-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" /> ✅ Skill Validation
        </h3>
        <p className="text-xs text-gray-400">No skills detected on the resume.</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-400" /> ✅ Skill Validation
      </h3>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
          <div className="text-2xl font-bold text-white">{total}</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Skills</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
          <div className="text-2xl font-bold text-emerald-400">{validated.length}</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Validated</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
          <div className="text-2xl font-bold text-indigo-400">{Math.round(pct)}%</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Validation %</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Validated Skills Drawer */}
      {validated.length > 0 && (
        <div className="border border-emerald-500/20 rounded-xl bg-emerald-950/20 overflow-hidden">
          <button
            onClick={() => setShowValidated(!showValidated)}
            className="w-full flex items-center justify-between p-4 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/20 transition-colors"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Validated Skills ({validated.length})
            </span>
            {showValidated ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showValidated && (
            <div className="p-4 pt-0 space-y-2 border-t border-emerald-500/20">
              {validated.map((entry, idx) => {
                const skill = entry.skill || '?'
                const projects = entry.projects || []
                const similarity = entry.similarity
                const projectText = projects.length > 0 ? projects.slice(0, 3).join(', ') : 'experience section'
                const simText = typeof similarity === 'number' ? ` (${Math.round(similarity * 100)}% match)` : ''

                return (
                  <div key={idx} className="text-xs text-gray-200 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <div>
                      <strong className="text-white">{skill}</strong>
                      <span className="text-emerald-400 font-medium">{simText}</span> — demonstrated in: {projectText}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Unvalidated Skills Drawer */}
      {unvalidated.length > 0 && (
        <div className="border border-amber-500/20 rounded-xl bg-amber-950/20 overflow-hidden">
          <button
            onClick={() => setShowUnvalidated(!showUnvalidated)}
            className="w-full flex items-center justify-between p-4 text-xs font-semibold text-amber-300 hover:bg-amber-900/20 transition-colors"
          >
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Unvalidated Skills ({unvalidated.length})
            </span>
            {showUnvalidated ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showUnvalidated && (
            <div className="p-4 pt-0 space-y-2 border-t border-amber-500/20">
              <p className="text-[11px] text-gray-400 mb-2">
                These skills are listed on your resume but are not tied to a project or experience bullet point.
              </p>
              <div className="flex flex-wrap gap-2">
                {unvalidated.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    ❌ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
