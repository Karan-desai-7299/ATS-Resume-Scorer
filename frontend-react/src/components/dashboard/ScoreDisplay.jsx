import React, { useEffect, useRef } from 'react'
import { Award, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react'

export function getScoreColor(score) {
  if (score >= 85) return { 
    text: '#10b981', 
    bg: 'rgba(16, 185, 129, 0.12)', 
    border: 'rgba(16, 185, 129, 0.3)', 
    stroke: '#10b981', 
    label: 'Top Tier &bull; High ATS Pass Rate',
    badge: 'Excellent' 
  }
  if (score >= 70) return { 
    text: '#22c55e', 
    bg: 'rgba(34, 197, 94, 0.12)', 
    border: 'rgba(34, 197, 94, 0.3)', 
    stroke: '#22c55e', 
    label: 'Strong &bull; Good ATS Pass Rate',
    badge: 'Good' 
  }
  if (score >= 55) return { 
    text: '#f59e0b', 
    bg: 'rgba(245, 158, 11, 0.12)', 
    border: 'rgba(245, 158, 11, 0.3)', 
    stroke: '#f59e0b', 
    label: 'Moderate &bull; Needs Keyword Tuning',
    badge: 'Average' 
  }
  return { 
    text: '#f43f5e', 
    bg: 'rgba(244, 63, 94, 0.12)', 
    border: 'rgba(244, 63, 94, 0.3)', 
    stroke: '#f43f5e', 
    label: 'Attention Needed &bull; High Risk of Rejection',
    badge: 'Needs Work' 
  }
}

export function getScoreEmoji(score) {
  if (score >= 85) return '⭐'
  if (score >= 70) return '✅'
  if (score >= 55) return '⚡'
  return '⚠️'
}

function ScoreRing({ score, color }) {
  const r = 54
  const circ = 2 * Math.PI * r // ~339.3
  const offset = circ - (circ * Math.min(Math.max(score, 0), 100)) / 100
  const circleRef = useRef(null)

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    el.style.strokeDashoffset = String(circ)
    const t = setTimeout(() => {
      el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
      el.style.strokeDashoffset = String(offset)
    }, 50)
    return () => clearTimeout(t)
  }, [score, offset, circ])

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-36 h-36 sm:w-44 sm:h-44 shrink-0">
        <circle 
          cx="60" 
          cy="60" 
          r={r} 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.08)" 
          strokeWidth="10" 
        />
        <circle
          ref={circleRef}
          cx="60" 
          cy="60" 
          r={r}
          fill="none"
          stroke={color.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          transform="rotate(-90 60 60)"
          style={{ filter: `drop-shadow(0 0 8px ${color.stroke}40)` }}
        />
      </svg>
      {/* Centered Score Number */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {Math.round(score)}
        </span>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest -mt-1">
          out of 100
        </span>
      </div>
    </div>
  )
}

export default function ScoreDisplay({ analysis }) {
  if (!analysis) return null

  const score = Math.round(Number(analysis.ATS_score ?? analysis.ats_score ?? 0))
  const color = getScoreColor(score)
  const interpretation = analysis.interpretation || 'Comprehensive ATS Evaluation'
  const components = analysis.component_scores || {}

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800/80 shadow-xl space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Executive ATS Performance</h2>
            <p className="text-xs text-gray-400">Overall compatibility rating for Fortune 500 ATS screening algorithms</p>
          </div>
        </div>

        <span 
          className="px-3.5 py-1.5 rounded-full text-xs font-bold border"
          style={{ color: color.text, backgroundColor: color.bg, borderColor: color.border }}
        >
          {color.badge} &bull; {score}/100
        </span>
      </div>

      {/* Main Score & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Left: Animated Score Gauge */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <ScoreRing score={score} color={color} />
          <p className="text-xs font-medium" style={{ color: color.text }}>
            {color.label.replace('&bull;', '•')}
          </p>
        </div>

        {/* Right 2 cols: Interpretation & Quick Pillars */}
        <div className="md:col-span-2 space-y-5">
          <div>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Evaluation Verdict</span>
            <p className="text-sm sm:text-base text-gray-200 font-medium leading-relaxed mt-1">
              {interpretation}
            </p>
          </div>

          {/* Component Mini Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Formatting', val: components.formatting, max: 20 },
              { label: 'Keywords', val: components.keywords, max: 25 },
              { label: 'Content', val: components.content, max: 25 },
              { label: 'Skills Validated', val: components.skill_validation, max: 15 },
              { label: 'Compatibility', val: components.ats_compatibility, max: 15 },
            ].map((c) => (
              <div key={c.label} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
                <span className="text-[11px] text-gray-400 block truncate">{c.label}</span>
                <span className="text-sm font-bold text-white mt-0.5 block tabular-nums">
                  {Math.round(c.val || 0)} <span className="text-xs text-gray-500 font-normal">/ {c.max}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tested against modern parsers (Workday, Greenhouse, Lever, Taleo)</span>
          </div>
        </div>

      </div>

    </div>
  )
}
