import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Target, BarChart3, ShieldCheck, Sparkles, UploadCloud, Cpu,
  CheckCircle2, ArrowRight, Zap, FileText, Award, Wand2,
  Brain, TrendingUp, Lock, Star, Users, Download
} from 'lucide-react'

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const StatBadge = ({ value, label, color }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
    <div className="text-[11px] text-gray-400 font-medium">{label}</div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, description, items, accent }) => (
  <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl flex flex-col gap-4">
    <div className={`p-3 rounded-xl w-fit border ${accent.bg} ${accent.border}`}>
      <Icon className={`w-6 h-6 ${accent.text}`} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
    {items && (
      <ul className="space-y-1.5 mt-auto">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {item}
          </li>
        ))}
      </ul>
    )}
  </motion.div>
)

export default function LandingPage() {
  const [scoreDemo, setScoreDemo] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const target = 82
      const step = setInterval(() => {
        current += 2
        if (current >= target) { setScoreDemo(target); clearInterval(step) }
        else setScoreDemo(current)
      }, 20)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-20 py-6 px-4 max-w-6xl mx-auto">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-8 sm:p-14 border border-indigo-500/25 shadow-2xl">
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-indigo-900/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Text Column */}
          <div className="text-center lg:text-left space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Groq LLaMA 3.3 · spaCy NLP · SentenceTransformers
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Get Your Resume
              <br />
              <span className="gradient-text">ATS-Ready in Seconds</span>
            </h1>

            <p className="text-base text-gray-300 leading-relaxed">
              Upload your resume and receive an instant, AI-powered ATS analysis across 5 dimensions — with specific, actionable fixes to dramatically boost your interview callback rate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                to="/scorer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-600/30 hover:scale-[1.02] group"
              >
                🚀 Analyze My Resume Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/resources"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-gray-200 hover:text-white bg-gray-800/60 hover:bg-gray-700 border border-gray-700 rounded-2xl transition-all"
              >
                <FileText className="w-4 h-4 text-purple-400" /> ATS Tips & Resources
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> Privacy First</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Supabase Secured</span>
              <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Free to use</span>
            </div>
          </div>

          {/* Score Demo Widget */}
          <div className="shrink-0">
            <div className="relative w-64 h-64 mx-auto">
              {/* Outer ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#1f2937" strokeWidth="10" />
                <circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * scoreDemo) / 100}
                  style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Inner content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-extrabold text-white tabular-nums">{scoreDemo}</div>
                <div className="text-sm font-semibold text-indigo-400 mt-1">/ 100</div>
                <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">ATS Score</div>
                <div className="mt-2 px-2.5 py-1 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                  ⚠ Good — Improvable
                </div>
              </div>
            </div>
            <p className="text-center text-[11px] text-gray-500 mt-3">Live demo score animation</p>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="glass-panel rounded-2xl p-6 sm:p-10 border border-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-x divide-gray-800/0 sm:divide-x sm:divide-gray-800">
          <StatBadge value="5" label="Scoring Dimensions" color="text-indigo-400" />
          <StatBadge value="LLM" label="Groq LLaMA 3.3 70B" color="text-purple-400" />
          <StatBadge value="NLP" label="spaCy + Transformers" color="text-emerald-400" />
          <StatBadge value="PDF" label="Auto-Generated Reports" color="text-amber-400" />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">✨ Everything You Need</h2>
          <p className="text-sm text-gray-400">A complete AI resume intelligence platform — not just a score</p>
        </div>

        <motion.div
          variants={containerVariants} initial="hidden"
          whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <FeatureCard
            icon={BarChart3} title="5-Dimension ATS Score"
            description="Your resume is scored across formatting, keywords, content quality, skill validation, and ATS compatibility — each with sub-scores and explanations."
            accent={{ bg: 'bg-indigo-600/20', border: 'border-indigo-500/30', text: 'text-indigo-400' }}
            items={['Formatting & Layout (20pts)', 'Keywords & Skills (25pts)', 'Content Quality (25pts)', 'Skill Validation (15pts)', 'ATS Compatibility (15pts)']}
          />
          <FeatureCard
            icon={Brain} title="Groq LLM + NLP Parsing"
            description="Structured resume and job description data is extracted in real-time using Groq LLaMA 3.3 70B + spaCy NLP pipeline for precise analysis."
            accent={{ bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-400' }}
            items={['Groq LLaMA 3.3 70B extraction', 'spaCy NER entity recognition', 'SentenceTransformer embeddings', 'Fuzzy keyword matching', 'Semantic similarity scoring']}
          />
          <FeatureCard
            icon={Wand2} title="AI Bullet Optimizer"
            description="Paste any weak bullet point and get 3 high-impact, ATS-optimized versions — metric-driven, technical, and executive-focused."
            accent={{ bg: 'bg-pink-600/20', border: 'border-pink-500/30', text: 'text-pink-400' }}
            items={['3 rewritten bullet variations', 'Impact & metric-driven version', 'Technical & skills-dense version', 'Executive & outcome-focused version', '1-click copy to clipboard']}
          />
          <FeatureCard
            icon={TrendingUp} title="JD Gap Analysis"
            description="Compare your resume against any job description to see keyword overlap, missing skills, and semantic similarity score."
            accent={{ bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400' }}
            items={['Match % vs. job description', 'Matched keyword list', 'Missing high-value keywords', 'Skills gap detection', 'Semantic similarity (cosine)']}
          />
          <FeatureCard
            icon={Download} title="PDF Report & Export"
            description="Generate a full, formatted PDF analysis report in one click — including all sections, scores, feedback, and action items."
            accent={{ bg: 'bg-amber-600/20', border: 'border-amber-500/30', text: 'text-amber-400' }}
            items={['Full ReportLab PDF generation', 'Score breakdown table', 'Key strengths list', 'Detailed issue cards', 'Plain text .txt summary export']}
          />
          <FeatureCard
            icon={Award} title="Skill Validation Engine"
            description="Cross-references listed skills against your experience and project descriptions to detect unsubstantiated claims that ATS and recruiters flag."
            accent={{ bg: 'bg-sky-600/20', border: 'border-sky-500/30', text: 'text-sky-400' }}
            items={['Validated vs. unvalidated skills', 'Evidence found in experience', 'Percentage validation score', 'Specific fix recommendations', 'Prioritized action items']}
          />
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">⚡ How It Works</h2>
          <p className="text-sm text-gray-400">From upload to actionable results in under 30 seconds</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { step: '01', icon: UploadCloud, title: 'Upload Your Resume', desc: 'Upload your PDF, DOC, or DOCX resume file. Optionally paste a job description for JD comparison mode.', color: 'text-indigo-400' },
            { step: '02', icon: Cpu, title: 'AI Pipeline Analyzes', desc: 'Groq LLaMA 3.3 + spaCy NLP + SentenceTransformers run a comprehensive multi-pass analysis of your resume.', color: 'text-purple-400' },
            { step: '03', icon: Target, title: 'Get Actionable Report', desc: 'Receive a full scored report with specific fixes, skill gaps, keyword matches, and downloadable PDF — ready to act on.', color: 'text-emerald-400' },
          ].map(({ step, icon: Icon, title, desc, color }) => (
            <div key={step} className="glass-card p-6 rounded-2xl relative overflow-hidden text-center space-y-3">
              <div className="absolute top-3 right-4 text-6xl font-extrabold text-gray-800/60 select-none">{step}</div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-gray-900 border border-gray-800`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-10 sm:p-14 text-center border border-indigo-500/25 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5 max-w-xl mx-auto">
          <div className="text-4xl">🎯</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Beat the ATS?
          </h2>
          <p className="text-sm text-gray-300">
            Join professionals who use this tool to improve their resumes and land more interviews.
          </p>
          <Link
            to="/scorer"
            className="inline-flex items-center gap-2.5 px-10 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] group"
          >
            <Sparkles className="w-5 h-5" /> Analyze My Resume Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  )
}
