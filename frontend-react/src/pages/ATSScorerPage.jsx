import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileUp, FileText, Download, Sparkles, AlertCircle, 
  RefreshCw, Wand2, BarChart3, Target, CheckCircle2, 
  Upload, X, ArrowRight, ShieldCheck, ChevronRight, Check
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../services/apiService'
import ResultsDashboard from '../components/dashboard/ResultsDashboard'
import AIBulletOptimizer from '../components/dashboard/AIBulletOptimizer'
import AuthModal from '../components/auth/AuthModal'
import toast from 'react-hot-toast'

const TAB_ANALYZE = 'analyze'
const TAB_BULLET  = 'bullet'

const SAMPLE_JOB_DESCRIPTION = `Job Title: Full Stack Software Engineer
Location: Remote / Hybrid
Experience: 2+ years

Key Responsibilities:
- Build and maintain modern web applications using React, TypeScript, and Tailwind CSS.
- Architect high-performance backend microservices using Python, FastAPI, and PostgreSQL.
- Integrate AI/LLM pipelines (OpenAI, Groq, or HuggingFace) to power intelligent features.
- Design RESTful APIs, optimize database queries, and implement CI/CD deployment pipelines.
- Collaborate with product and design teams to deliver intuitive, responsive user experiences.

Required Skills & Qualifications:
- Proficiency in Python, JavaScript/TypeScript, React.js, and FastAPI or Node.js.
- Strong understanding of SQL databases (PostgreSQL/MySQL) and RESTful API architecture.
- Experience with Git version control, Docker containers, and cloud deployment (Vercel, AWS).
- Knowledge of machine learning concepts, NLP, or LLM integrations is a strong plus.
- Excellent problem-solving, collaboration, and verbal communication skills.`

export default function ATSScorerPage() {
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState(TAB_ANALYZE)
  const [analysisMode, setAnalysisMode] = useState('General ATS Score') // 'General ATS Score' | 'Job Description Comparison'
  const [resumeFile, setResumeFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [jdMethod, setJdMethod] = useState('Paste Text') // 'Paste Text' | 'Upload .txt'
  const [jdText, setJdText] = useState('')
  const [jdFile, setJdFile] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  // Animated loading step labels
  const loadingSteps = [
    { title: 'Extracting text and layout structure', desc: 'Validating PDF/DOCX readability and headers' },
    { title: 'AI Entity & Skills Extraction', desc: 'Identifying work history, tools, and technical competencies' },
    { title: 'Evaluating ATS Formatting & Layout', desc: 'Checking font compatibility, tables, and contact info' },
    { title: 'Semantic Keyword & Gap Analysis', desc: 'Matching resume against high-demand industry skills' },
    { title: 'Synthesizing Final Scoring Report', desc: 'Generating prioritized recommendations and insights' },
  ]

  useEffect(() => {
    let interval
    if (isLoading) {
      setLoadingStep(0)
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const validateAndSetFile = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { 
      toast.error('Resume must be under 5 MB.')
      return 
    }
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'doc', 'docx'].includes(ext)) { 
      toast.error('Unsupported format. Please upload PDF, DOC, or DOCX.')
      return 
    }
    setResumeFile(file)
    toast.success(`Loaded resume: ${file.name}`)
  }

  const handleResumeChange = (e) => {
    validateAndSetFile(e.target.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleJdFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.txt')) { 
      toast.error('JD file must be .txt format.')
      return 
    }
    try {
      const text = await file.text()
      setJdText(text)
      setJdFile(file)
      toast.success(`Loaded Job Description: ${file.name}`)
    } catch { 
      toast.error('Failed to read JD file.') 
    }
  }

  const handleLoadSampleJd = () => {
    setJdText(SAMPLE_JOB_DESCRIPTION)
    setAnalysisMode('Job Description Comparison')
    toast.success('Loaded sample Software Engineer job description!')
  }

  const handleAnalyze = async () => {
    if (!user) { 
      setIsAuthOpen(true)
      toast.error('Please sign in or create a free account to analyze your resume.')
      return 
    }
    if (!resumeFile) { 
      toast.error('Please upload your resume file.')
      return 
    }
    if (analysisMode === 'Job Description Comparison' && !jdText.trim()) {
      toast.error('Please enter a job description to perform comparison.')
      return
    }

    setIsLoading(true)
    setAnalysisResult(null)

    try {
      const result = await apiService.analyzeResume(
        resumeFile, 
        analysisMode === 'Job Description Comparison' ? jdText.trim() : ''
      )
      setAnalysisResult(result)
      toast.success('Analysis complete! Review your comprehensive report below.')
    } catch (err) {
      console.error('Analysis error:', err)
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Analysis pipeline failed.'
      toast.error(errorMsg)
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
      toast.success('PDF report successfully downloaded!')
    } catch (err) {
      console.error('PDF error:', err)
      toast.error('PDF generation failed. You can export as text summary instead.')
    } finally {
      setIsPdfLoading(false)
    }
  }

  const handleDownloadTxt = () => {
    if (!analysisResult) return
    const score = analysisResult.ATS_score ?? analysisResult.ats_score ?? 0
    const lines = [
      `============================================================`,
      `          ATS RESUME SCORER PRO - AUDIT REPORT              `,
      `============================================================`,
      `Generated: ${new Date().toLocaleString()}`,
      `Overall ATS Score: ${Math.round(score)}/100 (${analysisResult.interpretation || 'Evaluated'})`,
      ``,
      `--- COMPONENT BREAKDOWN ---`,
      `Formatting & Structure:   ${Math.round(analysisResult.component_scores?.formatting || 0)} / 20`,
      `Keywords & Skill Density: ${Math.round(analysisResult.component_scores?.keywords || 0)} / 25`,
      `Content & Bullet Quality: ${Math.round(analysisResult.component_scores?.content || 0)} / 25`,
      `Skill Experience Evidence:${Math.round(analysisResult.component_scores?.skill_validation || 0)} / 15`,
      `ATS System Compatibility: ${Math.round(analysisResult.component_scores?.ats_compatibility || 0)} / 15`,
      ``,
      `--- IDENTIFIED STRENGTHS ---`,
      ...(analysisResult.strengths || []).map(s => `  [+] ${s}`),
      ``,
      `--- CRITICAL ISSUES TO FIX ---`,
      ...(analysisResult.critical_issues || []).map(c => `  [!] ${c}`),
      ``,
      `--- STRATEGIC SUGGESTIONS ---`,
      ...(analysisResult.suggestions || []).map(s => `  [>] ${s}`),
      ``,
      `============================================================`,
      `Built with Groq AI, spaCy NLP, and FastAPI.`,
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'ats_audit_summary.txt')
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.success('Summary downloaded as text file!')
  }

  const handleReset = () => {
    setResumeFile(null)
    setJdText('')
    setJdFile(null)
    setAnalysisResult(null)
    setAnalysisMode('General ATS Score')
  }

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto px-4 sm:px-6">

      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Resume Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Analyze & Optimize Your <span className="gradient-text">ATS Resume Score</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          Instantly evaluate formatting, keyword relevance, skill validation, and job description alignment with high-speed AI analysis.
        </p>

        {/* Tab Switcher: ATS Scanner vs AI Bullet Optimizer */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-gray-900/90 border border-gray-800 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveTab(TAB_ANALYZE)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === TAB_ANALYZE 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Full ATS Scanner</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(TAB_BULLET)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === TAB_BULLET 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>AI Bullet Optimizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL ATS SCANNER                                                    */}
      {/* ========================================================================= */}
      {activeTab === TAB_ANALYZE && (
        <div className="space-y-8">

          {/* Mode Selector Pill */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-gray-800">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Analysis Strategy</p>
              <p className="text-xs text-gray-400">Choose between a general resume audit or role-specific keyword matching</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-950/80 p-1 rounded-xl border border-gray-800 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setAnalysisMode('General ATS Score')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  analysisMode === 'General ATS Score'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                General ATS Audit
              </button>
              <button
                type="button"
                onClick={() => setAnalysisMode('Job Description Comparison')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  analysisMode === 'Job Description Comparison'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Target JD Match
              </button>
            </div>
          </div>

          {/* Upload & JD Input Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: Resume Upload Card */}
            <div className="glass-card p-6 rounded-3xl border border-gray-800/80 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Upload Resume</h3>
                    <p className="text-xs text-gray-400">PDF, DOCX, or DOC formats supported</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 bg-gray-800/60 px-2.5 py-1 rounded-lg border border-gray-700/50">
                  Max 5 MB
                </span>
              </div>

              {/* Drag & Drop Area */}
              {!resumeFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all text-center cursor-pointer ${
                    isDragging
                      ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                      : 'border-gray-700/80 hover:border-indigo-500/50 bg-gray-900/30 hover:bg-gray-900/60'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">
                    Click to browse or drag & drop resume
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Optimized for single & multi-page technical resumes
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
                    <span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700/60 text-gray-300">.PDF</span>
                    <span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700/60 text-gray-300">.DOCX</span>
                    <span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700/60 text-gray-300">.DOC</span>
                  </div>
                </div>
              ) : (
                /* File Loaded State */
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{resumeFile.name}</p>
                      <p className="text-[11px] text-gray-400">
                        {(resumeFile.size / 1024).toFixed(1)} KB &bull; Ready for audit
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Job Description Card */}
            <div className="glass-card p-6 rounded-3xl border border-gray-800/80 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Target Job Description</h3>
                    <p className="text-xs text-gray-400">
                      {analysisMode === 'Job Description Comparison' 
                        ? 'Required for keyword alignment match' 
                        : 'Optional — provides bonus JD alignment analysis'}
                    </p>
                  </div>
                </div>

                {/* Quick 1-click sample JD */}
                <button
                  type="button"
                  onClick={handleLoadSampleJd}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 px-2.5 py-1 rounded-lg transition-all"
                >
                  Load Sample JD
                </button>
              </div>

              {/* JD Input Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setJdMethod('Paste Text')}
                      className={`font-semibold pb-0.5 border-b-2 transition-all ${
                        jdMethod === 'Paste Text' 
                          ? 'border-indigo-500 text-white' 
                          : 'border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      Paste Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setJdMethod('Upload .txt')}
                      className={`font-semibold pb-0.5 border-b-2 transition-all ${
                        jdMethod === 'Upload .txt' 
                          ? 'border-indigo-500 text-white' 
                          : 'border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      Upload .txt
                    </button>
                  </div>
                  <span>{jdText.length} characters</span>
                </div>

                {jdMethod === 'Paste Text' ? (
                  <textarea
                    rows={6}
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste job description text here (requirements, tech stack, responsibilities)..."
                    className="w-full rounded-2xl glass-input p-3.5 text-xs text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 resize-none font-normal leading-relaxed"
                  />
                ) : (
                  <div className="p-6 border border-dashed border-gray-700 rounded-2xl text-center">
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleJdFileChange}
                      className="hidden"
                      id="jd-file-upload"
                    />
                    <label htmlFor="jd-file-upload" className="cursor-pointer space-y-2 inline-block">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 mx-auto flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-white">Click to upload .txt job description</p>
                      {jdFile && <p className="text-[11px] text-emerald-400">{jdFile.name}</p>}
                    </label>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Action CTA Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-indigo-500/30 shadow-xl">
            <div className="flex items-center gap-3 text-xs text-gray-300 text-center sm:text-left">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">
                  {analysisMode === 'Job Description Comparison' ? 'Role-Targeted Match Engine' : 'Comprehensive ATS Audit'}
                </p>
                <p className="text-[11px] text-gray-400">
                  Evaluates 5 scoring pillars with Groq AI entity detection & semantic alignment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {analysisResult && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-2xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-xs font-semibold text-gray-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" /> Reset
                </button>
              )}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || !resumeFile}
                className={`btn-primary-glow flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  isLoading || !resumeFile ? 'opacity-60 cursor-not-allowed saturate-50' : 'cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Groq AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Resume Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Animated Loading Card */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="glass-panel p-8 rounded-3xl border border-indigo-500/30 space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 animate-pulse">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Running ATS Resume Audit Pipeline</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Groq LLM and NLP pipelines are parsing your document and computing ATS compatibility.
                  </p>
                </div>

                {/* Step Indicators */}
                <div className="max-w-xl mx-auto space-y-3">
                  {loadingSteps.map((step, idx) => {
                    const isDone = idx < loadingStep
                    const isCurrent = idx === loadingStep
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : isCurrent
                              ? 'bg-indigo-950/30 border-indigo-500/40 text-white shadow-sm'
                              : 'bg-gray-900/20 border-gray-800/40 text-gray-500'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                          ) : (
                            <span className="text-[11px] text-gray-500">{idx + 1}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate">{step.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{step.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          {analysisResult && (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* Action Bar for PDF/TXT Export */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-card border border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Full Analysis Report Generated</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isPdfLoading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/40 transition-all shadow-sm"
                  >
                    {isPdfLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    Download PDF Report
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
                  >
                    Export TXT Summary
                  </button>
                </div>
              </div>

              {/* Main Results Dashboard */}
              <ResultsDashboard analysis={analysisResult} />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AI BULLET OPTIMIZER                                                */}
      {/* ========================================================================= */}
      {activeTab === TAB_BULLET && (
        <div className="animate-in fade-in duration-200">
          <AIBulletOptimizer />
        </div>
      )}

      {/* Auth Modal Trigger */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialTab="signin"
        />
      )}

    </div>
  )
}
