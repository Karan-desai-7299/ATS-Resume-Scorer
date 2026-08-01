import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileUp, FileText, Download, Sparkles, AlertCircle, 
  RefreshCw, Wand2, BarChart2, Target, CheckCircle2 
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../services/apiService'
import ResultsDashboard from '../components/dashboard/ResultsDashboard'
import AIBulletOptimizer from '../components/dashboard/AIBulletOptimizer'
import AuthModal from '../components/auth/AuthModal'
import toast from 'react-hot-toast'

const TAB_ANALYZE = 'analyze'
const TAB_BULLET  = 'bullet'

export default function ATSScorerPage() {
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState(TAB_ANALYZE)
  const [analysisMode, setAnalysisMode] = useState('General ATS Score')
  const [resumeFile, setResumeFile] = useState(null)
  const [jdMethod, setJdMethod] = useState('Paste Text')
  const [jdText, setJdText] = useState('')
  const [jdFile, setJdFile] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  // Animated loading steps
  const loadingSteps = [
    '📄 Parsing resume document...',
    '🤖 Groq LLaMA 3.3 extracting structured data...',
    '🧠 spaCy NLP analyzing content quality...',
    '📊 SentenceTransformer computing embeddings...',
    '⚡ ATS scoring engine calculating results...',
    '✅ Finalizing analysis report...',
  ]

  useEffect(() => {
    let interval
    if (isLoading) {
      setLoadingStep(0)
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleResumeChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Resume must be under 5 MB.'); return }
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'doc', 'docx'].includes(ext)) { toast.error('Unsupported format. Use PDF, DOC, or DOCX.'); return }
    setResumeFile(file)
    toast.success(`✅ Loaded: ${file.name}`)
  }

  const handleJdFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.txt')) { toast.error('JD file must be .txt format.'); return }
    try {
      const text = await file.text()
      setJdText(text)
      setJdFile(file)
      toast.success(`Loaded JD: ${file.name}`)
    } catch { toast.error('Failed to read JD file.') }
  }

  const handleAnalyze = async () => {
    if (!user) { setIsAuthOpen(true); toast.error('Sign in to analyze your resume.'); return }
    if (!resumeFile) { toast.error('Please upload a resume.'); return }
    if (analysisMode === 'Job Description Comparison' && !jdText.trim()) {
      toast.error('Please provide a job description.'); return
    }
    setIsLoading(true)
    setAnalysisResult(null)
    try {
      const result = await apiService.analyzeResume(resumeFile, analysisMode === 'Job Description Comparison' ? jdText.trim() : '')
      setAnalysisResult(result)
      toast.success('🎉 Analysis complete! Review your results below.')
    } catch (err) {
      console.error('Analysis error:', err)
      toast.error(err.response?.data?.detail || err.message || 'Analysis failed. Check server logs.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!analysisResult) return
    setIsPdfLoading(true)
    try {
      const blobData = await apiService.generatePdf(analysisResult)
      const pdfBlob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ats_report_${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('📑 PDF report downloaded!')
    } catch (err) {
      console.error('PDF error:', err)
      toast.error('PDF generation failed. Try again.')
    } finally {
      setIsPdfLoading(false)
    }
  }

  const handleDownloadTxt = () => {
    if (!analysisResult) return
    const score = analysisResult.ATS_score ?? analysisResult.ats_score ?? 0
    const lines = [
      `=== ATS RESUME SCORER — FULL REPORT ===`,
      `Generated: ${new Date().toLocaleString()}`,
      `Overall Score: ${Math.round(score)}/100 — ${analysisResult.interpretation || ''}`,
      ``,
      `--- COMPONENT SCORES ---`,
      `Formatting:       ${Math.round(analysisResult.component_scores?.formatting || 0)}/20`,
      `Keywords:         ${Math.round(analysisResult.component_scores?.keywords || 0)}/25`,
      `Content Quality:  ${Math.round(analysisResult.component_scores?.content || 0)}/25`,
      `Skill Validation: ${Math.round(analysisResult.component_scores?.skill_validation || 0)}/15`,
      `ATS Compatibility:${Math.round(analysisResult.component_scores?.ats_compatibility || 0)}/15`,
      ``,
      `--- STRENGTHS ---`,
      ...(analysisResult.strengths || []).map(s => `  + ${s}`),
      ``,
      `--- CRITICAL ISSUES ---`,
      ...(analysisResult.critical_issues || []).map(c => `  ! ${c}`),
      ``,
      `--- SUGGESTIONS ---`,
      ...(analysisResult.suggestions || []).map(s => `  > ${s}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'ats_summary.txt')
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.success('📄 Summary downloaded!')
  }

  const handleReset = () => {
    setResumeFile(null)
    setJdText('')
    setJdFile(null)
    setAnalysisResult(null)
    setAnalysisMode('General ATS Score')
  }

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto px-4">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Resume Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          🎯 ATS Resume <span className="gradient-text">Scorer</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Upload your resume for a comprehensive ATS audit — or optimize your bullet points with Groq AI.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-900/80 border border-gray-800 max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab(TAB_ANALYZE)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === TAB_ANALYZE ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" /> ATS Scanner
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_BULLET)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === TAB_BULLET ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" /> Bullet AI
        </button>
      </div>

      {/* ========================== TAB: ATS SCANNER ========================== */}
      {activeTab === TAB_ANALYZE && (
        <motion.div
          key="analyze"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Analysis Mode Toggle */}
          <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 max-w-lg mx-auto">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 text-center">
              Analysis Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900/80 rounded-xl border border-gray-800">
              {['General ATS Score', 'Job Description Comparison'].map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAnalysisMode(mode)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    analysisMode === mode ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {mode === 'General ATS Score' ? '📊 General ATS' : '📋 JD Comparison'}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Resume Upload */}
            <div className="glass-card p-6 rounded-2xl space-y-4 flex flex-col">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileUp className="w-5 h-5 text-indigo-400" /> Upload Resume
                <span className="ml-auto text-[10px] font-medium text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                  PDF · DOC · DOCX
                </span>
              </h3>
              <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700/80 hover:border-indigo-500 rounded-2xl cursor-pointer bg-gray-900/40 hover:bg-indigo-950/20 transition-all group flex-1">
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <FileUp className={`w-10 h-10 mb-2 transition-all ${resumeFile ? 'text-indigo-400 scale-110' : 'text-gray-600 group-hover:text-indigo-400 group-hover:scale-105'}`} />
                <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors text-center">
                  {resumeFile ? `✅ ${resumeFile.name}` : 'Click to browse or drag & drop'}
                </span>
                {resumeFile && (
                  <span className="text-[10px] text-gray-500 mt-1">{(resumeFile.size / 1024).toFixed(1)} KB</span>
                )}
              </label>
              {resumeFile && (
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                  <span className="text-indigo-300 font-semibold truncate">{resumeFile.name}</span>
                  <button
                    onClick={() => setResumeFile(null)}
                    className="text-gray-500 hover:text-rose-400 ml-2 shrink-0"
                  >✕</button>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="glass-card p-6 rounded-2xl space-y-4 flex flex-col">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" /> Job Description
                <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  analysisMode === 'Job Description Comparison'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {analysisMode === 'Job Description Comparison' ? 'Required' : 'Optional'}
                </span>
              </h3>

              {analysisMode === 'Job Description Comparison' ? (
                <div className="space-y-3 flex-1">
                  <div className="flex gap-3 text-xs border-b border-gray-800 pb-2">
                    {['Paste Text', 'Upload .txt File'].map(method => (
                      <label key={method} className="flex items-center gap-1.5 cursor-pointer text-gray-300 font-medium">
                        <input
                          type="radio" name="jd_method"
                          checked={jdMethod === method}
                          onChange={() => setJdMethod(method)}
                          className="text-indigo-600"
                        />
                        {method}
                      </label>
                    ))}
                  </div>

                  {jdMethod === 'Upload .txt File' ? (
                    <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700/80 hover:border-purple-500 rounded-2xl cursor-pointer bg-gray-900/40 transition-all group flex-1">
                      <input type="file" accept=".txt" onChange={handleJdFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <FileText className="w-8 h-8 text-gray-600 group-hover:text-purple-400 mb-2 transition-colors" />
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-white">
                        {jdFile ? `✅ ${jdFile.name}` : 'Upload .txt file'}
                      </span>
                    </label>
                  ) : (
                    <textarea
                      rows={5}
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Paste the job description here — requirements, responsibilities, and required skills..."
                      className="w-full p-3 text-xs rounded-xl glass-input placeholder-gray-600 resize-none flex-1"
                    />
                  )}

                  {jdText && (
                    <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300 font-semibold">
                      ✅ {jdText.length.toLocaleString()} characters loaded
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-gray-500 bg-gray-900/30 rounded-xl border border-gray-800 space-y-2">
                  <AlertCircle className="w-7 h-7 text-gray-700" />
                  <p className="max-w-[220px]">Switch to "JD Comparison" mode to evaluate keyword alignment against a specific role.</p>
                </div>
              )}
            </div>
          </div>

          {/* Analyze CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !resumeFile}
              className="w-full sm:w-auto min-w-[260px] flex items-center justify-center gap-2 py-4 px-8 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <><Sparkles className="w-5 h-5" /> 🚀 Analyze Resume</>
              )}
            </button>
            {analysisResult && (
              <button
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold text-gray-300 rounded-2xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> New Scan
              </button>
            )}
          </div>

          {/* Loading Panel */}
          {isLoading && (
            <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 space-y-6 text-center animate-fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 border-4 border-indigo-600/20 rounded-full absolute" />
                <div className="w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin absolute" />
                <Sparkles className="w-7 h-7 text-indigo-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Pipeline Running</h3>
                <p className="text-xs text-gray-400 mt-1 animate-fade-in">{loadingSteps[loadingStep]}</p>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {loadingSteps.map((step, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === loadingStep ? 'bg-indigo-500 scale-125' : i < loadingStep ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 max-w-sm mx-auto">
                {['Groq LLM', 'spaCy NLP', 'Transformers'].map(chip => (
                  <div key={chip} className="px-2 py-1 rounded-lg bg-gray-800/60 border border-gray-700 font-medium">{chip}</div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {analysisResult && (
            <div className="space-y-8 animate-fade-in">
              <ResultsDashboard analysis={analysisResult} />

              {/* Export Bar */}
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-indigo-400" /> 📥 Export Report
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isPdfLoading}
                    className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                  >
                    {isPdfLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                    📑 Generate & Download PDF
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all"
                  >
                    <FileText className="w-4 h-4 text-purple-400" /> 📄 Download Summary (.txt)
                  </button>
                </div>
              </div>

              {/* Prompt to try bullet optimizer */}
              <div className="glass-card p-5 rounded-2xl border border-purple-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">✨ Optimize Your Bullet Points</p>
                    <p className="text-xs text-gray-400">Use Groq AI to rewrite weak bullets into high-impact, ATS-optimized variations.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab(TAB_BULLET)}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-600/25"
                >
                  Open Bullet AI →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================== TAB: BULLET OPTIMIZER ========================== */}
      {activeTab === TAB_BULLET && (
        <motion.div
          key="bullet"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {!user && (
            <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-amber-300">You must be signed in to use the AI Bullet Optimizer.</span>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="ml-auto px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
          <AIBulletOptimizer />
        </motion.div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
