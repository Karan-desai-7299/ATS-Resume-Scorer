import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  History, FileText, Trash2, Download, ChevronDown, ChevronUp, 
  AlertCircle, ArrowRight, BarChart2, TrendingUp, TrendingDown, Minus, CheckCircle2, Sparkles, RefreshCw
} from 'lucide-react'
import { apiService } from '../services/apiService'
import { getScoreColor, getScoreEmoji } from '../components/dashboard/ScoreDisplay'
import toast from 'react-hot-toast'

function ScoreTrend({ scores }) {
  if (!scores || scores.length < 2) return null
  const latest = scores[0]
  const previous = scores[1]
  const diff = Math.round(latest - previous)
  if (diff > 0) return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
      <TrendingUp className="w-3 h-3" /> +{diff} pts
    </span>
  )
  if (diff < 0) return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
      <TrendingDown className="w-3 h-3" /> {diff} pts
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-800/40 px-2 py-0.5 rounded-full border border-gray-700/40">
      <Minus className="w-3 h-3" /> 0
    </span>
  )
}

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const data = await apiService.getHistory()
      setHistory(data || [])
    } catch (err) {
      toast.error(err.message || 'Could not load analysis history.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { 
    fetchHistory() 
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume analysis record?')) return
    setDeletingId(id)
    try {
      await apiService.deleteHistoryItem(id)
      setHistory(prev => prev.filter(item => item.id !== id))
      toast.success('Record successfully removed.')
    } catch (err) {
      toast.error('Failed to delete history item.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownloadPdf = async (id, filename, analysis) => {
    setDownloadingId(id)
    try {
      const blobData = await apiService.generatePdf(analysis)
      const pdfBlob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${filename.replace(/\.[^/.]+$/, '')}_ats_report.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('PDF report downloaded!')
    } catch (err) {
      toast.error('Failed to generate PDF.')
    } finally {
      setDownloadingId(null)
    }
  }

  const scoreTrend = history.map(h => Number(h.ats_score || 0))

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-2 border border-indigo-500/20">
            <History className="w-3.5 h-3.5" /> Track Progress
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resume Audit History
          </h1>
          <p className="text-xs text-gray-400 mt-1">Review past scores, keyword adjustments, and track your improvements over time.</p>
        </div>

        <Link
          to="/scorer"
          className="btn-primary-glow flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          <Sparkles className="w-3.5 h-3.5" /> New Analysis
        </Link>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-2xl glass-card animate-shimmer border border-gray-800" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl border border-gray-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Previous Audits Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Upload your resume on the ATS Scorer page to run your first evaluation and access it here anytime.
          </p>
          <Link
            to="/scorer"
            className="btn-primary-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold"
          >
            Go to ATS Scorer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry, idx) => {
            const filename = entry.filename || entry.resume_name || 'Resume Document'
            const atsScore = Number(entry.ats_score || 0)
            const createdAt = entry.created_at || entry.date || ''
            const analysis = entry.analysis_result || {}
            const cs = analysis.component_scores || {}
            const jdComp = analysis.jd_comparison || analysis.jd_match_analysis
            const isExpanded = expandedId === entry.id
            const color = getScoreColor(atsScore)
            const emoji = getScoreEmoji(atsScore)

            return (
              <div
                key={entry.id || idx}
                className={`glass-card rounded-2xl overflow-hidden transition-all border ${
                  isExpanded ? 'border-indigo-500/40' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-800/20 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-indigo-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{filename}</h4>
                      <p className="text-[11px] text-gray-400">
                        {createdAt ? new Date(createdAt).toLocaleString() : 'Audited recently'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3">
                    {idx < scoreTrend.length - 1 && (
                      <ScoreTrend scores={[scoreTrend[idx], scoreTrend[idx + 1]]} />
                    )}
                    <div
                      className="px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}
                    >
                      <span>{emoji}</span>
                      <span className="tabular-nums">{Math.round(atsScore)}/100</span>
                    </div>
                    <button type="button" className="text-gray-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-gray-800/80 bg-gray-950/40 space-y-4">
                    
                    {/* Component Score Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {[
                        { label: 'Formatting', val: cs.formatting, max: 20 },
                        { label: 'Keywords', val: cs.keywords, max: 25 },
                        { label: 'Content', val: cs.content, max: 25 },
                        { label: 'Skill Valid.', val: cs.skill_validation, max: 15 },
                        { label: 'ATS Compat.', val: cs.ats_compatibility, max: 15 },
                      ].map(({ label, val, max }) => {
                        const pct = Math.round(((val || 0) / max) * 100)
                        return (
                          <div key={label} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-1">
                            <div className="text-[11px] text-gray-400 font-medium">{label}</div>
                            <div className="text-sm font-bold text-white tabular-nums">
                              {Math.round(val || 0)} <span className="text-gray-500 text-[11px] font-normal">/{max}</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* JD Match indicator */}
                    {jdComp && (
                      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-xs">
                        <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                          <BarChart2 className="w-4 h-4" /> Role Description Match
                        </span>
                        <span className="text-indigo-400 font-extrabold">{Math.round(jdComp.match_percentage || 0)}%</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800/60">
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(entry.id, filename, analysis)}
                        disabled={downloadingId === entry.id}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm disabled:opacity-50"
                      >
                        {downloadingId === entry.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        Download PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 rounded-xl transition-all disabled:opacity-50"
                      >
                        {deletingId === entry.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        Delete
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
