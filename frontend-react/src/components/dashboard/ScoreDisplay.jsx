import React, { useEffect, useRef, useState } from 'react'

export function getScoreColor(score) {
  if (score >= 85) return { text: '#34d399', bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.25)', stroke: '#34d399', label: 'Excellent' }
  if (score >= 70) return { text: '#a3e635', bg: 'rgba(163,230,53,0.10)',  border: 'rgba(163,230,53,0.25)',  stroke: '#a3e635', label: 'Good'      }
  if (score >= 55) return { text: '#fbbf24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.25)',  stroke: '#fbbf24', label: 'Average'    }
  return            { text: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', stroke: '#f87171', label: 'Needs Work' }
}

export function getScoreEmoji(score) {
  if (score >= 90) return '🌟'
  if (score >= 80) return '✅'
  if (score >= 70) return '👍'
  if (score >= 55) return '⚠️'
  return '🔴'
}

// Separate the ring into its own element — keeps text outside SVG
function ScoreRing({ score, color }) {
  const r = 54
  const circ = 2 * Math.PI * r        // ≈ 339.3
  const offset = circ - (circ * Math.min(score, 100)) / 100
  const circleRef = useRef(null)

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    el.style.strokeDashoffset = String(circ)   // start at 0 fill
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
      el.style.strokeDashoffset = String(offset)
    })
  }, [score])   // eslint-disable-line

  return (
    <svg
      viewBox="0 0 120 120"
      width="148"
      height="148"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
      {/* Progress */}
      <circle
        ref={circleRef}
        cx="60" cy="60" r={r}
        fill="none"
        stroke={color.stroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ}
        transform="rotate(-90 60 60)"
        filter="url(#glow)"
      />
    </svg>
  )
}

const BARS = [
  { label: 'Format',   key: 'formatting',        max: 20 },
  { label: 'Keywords', key: 'keywords',           max: 25 },
  { label: 'Content',  key: 'content',            max: 25 },
  { label: 'Skills',   key: 'skill_validation',   max: 15 },
  { label: 'ATS',      key: 'ats_compatibility',  max: 15 },
]

export default function ScoreDisplay({ analysis }) {
  const score  = Number(analysis?.ATS_score ?? analysis?.ats_score ?? 0)
  const interp = analysis?.interpretation || ''
  const color  = getScoreColor(score)
  const emoji  = getScoreEmoji(score)
  const cs     = analysis?.component_scores || {}

  return (
    <div className="space-y-5">
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight text-center">
        📊 Analysis Results
      </h2>

      {/* ── Gauge + Bars row ── */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">

        {/* Gauge — ring + overlay text stacked via relative wrapper */}
        <div className="relative shrink-0" style={{ width: 148, height: 148 }}>
          <ScoreRing score={score} color={color} />

          {/* Center text — absolute inside the same 148×148 box */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
            style={{ padding: '20px' }}   /* keep text inside the ring */
          >
            <span
              className="text-4xl font-extrabold leading-none tabular-nums"
              style={{ color: color.text }}
            >
              {Math.round(score)}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-0.5">/100</span>
            <span
              className="text-[10px] font-bold uppercase tracking-widest mt-1 leading-tight"
              style={{ color: color.text }}
            >
              {color.label}
            </span>
          </div>
        </div>

        {/* Bars — fill remaining width */}
        <div className="flex-1 w-full space-y-3">
          {BARS.map(({ label, key, max }) => {
            const val = Number(cs[key] || 0)
            const pct = Math.min((val / max) * 100, 100)
            const barColor =
              pct >= 80 ? '#34d399' :
              pct >= 60 ? '#a3e635' :
              pct >= 40 ? '#fbbf24' : '#f87171'

            return (
              <div key={key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-300">{label}</span>
                  <span className="font-bold tabular-nums" style={{ color: barColor }}>
                    {Math.round(val)}<span className="text-gray-600 font-normal text-[11px]">/{max}</span>
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-bar-inner"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: barColor,
                      boxShadow: `0 0 6px ${barColor}50`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Score badge row */}
      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border"
          style={{ color: color.text, borderColor: color.border, backgroundColor: color.bg }}
        >
          {emoji} {color.label} ATS Score — {Math.round(score)}/100
        </div>
      </div>

      {/* Interpretation */}
      {interp && (
        <div
          className="p-3 sm:p-4 rounded-xl text-xs sm:text-sm text-gray-200 font-medium leading-relaxed text-center border"
          style={{ backgroundColor: color.bg, borderColor: color.border }}
        >
          💡 {interp}
        </div>
      )}
    </div>
  )
}
