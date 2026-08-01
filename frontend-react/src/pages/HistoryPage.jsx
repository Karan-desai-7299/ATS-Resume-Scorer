import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  History, FileText, Trash2, Download, ChevronDown, ChevronUp, 
  AlertCircle, ArrowRight, BarChart2, TrendingUp, TrendingDown, Minus
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
    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
      <TrendingUp className="w-3.5 h-3.5" /> +{diff}
    </span>
  )
  if (diff < 0) return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
      <TrendingDown className="w-3.5 h-3.5" /> {diff}
    </span>
  )
  return <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><Minus className="w-3.5 h-3.5" /> 0</span>
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

  useEffect(() => { fetchHistory() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scan from your history?')) return
    setDeletingId(id)
    try {
      await apiService.deleteHistory(id)
      setHistory(prev => prev.filter(item => String(item.id) !== String(id)))
      toast.success('Entry deleted.')
    } catch {
      toast.error('Failed to delete entry.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownloadPdf = async (id, filename, analysisResult) => {
    setDownloadingId(id)
    try {
      let blobData
      try {
        blobData = await apiService.getHistoryPdf(id)
      } catch {
        if (analysisResult && Object.keys(analysisResult).length > 0) {
          blobData = await apiService.generatePdf(analysisResult)
        } else { throw new Error('No analysis data available') }
      }
      const pdfBlob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ats_report_${filename || 'scan'}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error('Failed to download PDF.')
    } finally {
      setDownloadingId(null)
    }
  }

  // Compute trend from sorted history scores
  const scoreTrend = history.map(h => Number(h.ats_score || 0))

  // Stats
  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + Number(h.ats_score || 0), 0) / history.length)
    : 0
  const bestScore = history.length > 0 ? Math.max(...history.map(h => Number(h.ats_score || 0))) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-400">Loading analysis history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <History className="w-7 h-7 text-indigo-400" /> Analysis History
          </h1>
          <p className="text-xs text-gray-400 mt-1">All past ATS scans saved to your account.</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-indigo-400">
          {history.length} {history.length === 1 ? 'Scan' : 'Scans'}
        </div>
      </div>

      {/* Quick Stats Row */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="glass-card p-4 rounded-2xl text-center border border-gray-800">
            <div className="text-2xl font-extrabold text-white">{history.length}</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">Total Scans</div>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center border border-gray-800">
            <div className="text-2xl font-extrabold text-white">{avgScore}</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">Avg. Score</div>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center border border-indigo-500/20 col-span-2 sm:col-span-1">
            <div className="text-2xl font-extrabold text-indigo-400">{bestScore}</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">Best Score</div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl space-y-5 border border-indigo-500/20">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">No Analyses Saved Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Upload your resume on the ATS Scorer page to run your first analysis and view it here.
          </p>
          <Link
            to="/scorer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
          >
            🎯 Go to ATS Scorer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry, idx) => {
            const filename = entry.filename || entry.resume_name || 'resume'
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
                className={`glass-card rounded-2xl overflow-hidden transition-all border ${isExpanded ? 'border-indigo-500/30 neon-border' : 'border-gray-800 hover:border-gray-700'}`}
              >
                {/* Row Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-800/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-indigo-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{filename}</h4>
                      <p className="text-[11px] text-gray-500">
                        {createdAt ? new Date(createdAt).toLocaleString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3">
                    {idx < scoreTrend.length - 1 && (
                      <ScoreTrend scores={[scoreTrend[idx], scoreTrend[idx + 1]]} />
                    )}
                    <div
                      className="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                      style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}
                    >
                      {emoji} {Math.round(atsScore)}/100
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors p-0.5">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-gray-800/80 bg-gray-950/30 space-y-4 animate-fade-in">
                    {/* Component scores */}
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
                          <div key={label} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-1.5">
                            <div className="text-[11px] text-gray-400 font-medium">{label}</div>
                            <div className="text-sm font-bold text-white">{Math.round(val || 0)}<span className="text-gray-600 text-[11px] font-normal">/{max}</span></div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-indigo-500 progress-bar-inner"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {jdComp && (
                      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-xs">
                        <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                          <BarChart2 className="w-3.5 h-3.5" /> JD Match
                        </span>
                        <span className="text-indigo-400 font-bold">{Math.round(jdComp.match_percentage || 0)}%</span>
                      </div>
                    )}

                    {/* Strengths preview */}
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Top Strengths</p>
                        {analysis.strengths.slice(0, 2).map((s, i) => (
                          <p key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-px">✓</span> {s}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleDownloadPdf(entry.id, filename, analysis)}
                        disabled={downloadingId === entry.id}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                      >
                        {downloadingId === entry.id
                          ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <Download className="w-3.5 h-3.5" />
                        }
                        PDF Report
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 rounded-xl transition-all disabled:opacity-50"
                      >
                        {deletingId === entry.id
                          ? <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-white rounded-full animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
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
