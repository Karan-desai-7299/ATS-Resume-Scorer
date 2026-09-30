import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Target, BarChart3, ShieldCheck, Sparkles, UploadCloud, Cpu,
  CheckCircle2, ArrowRight, Zap, FileText, Award, Wand2,
  Brain, TrendingUp, Lock, Star, Users, Download
} from 'lucide-react'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const StatBadge = ({ value, label, color }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`text-2xl sm:text-3xl font-extrabold ${color} tabular-nums`}>{value}</div>
    <div className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">{label}</div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, description, items, accent }) => (
  <motion.div variants={itemVariants} className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between border border-gray-800 space-y-4">
    <div className="space-y-3">
      <div className={`p-3 rounded-2xl w-fit border ${accent.bg} ${accent.border}`}>
        <Icon className={`w-6 h-6 ${accent.text}`} />
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">{title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
    {items && (
      <ul className="space-y-2 pt-2 border-t border-gray-800/80">
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
      const target = 86
      const step = setInterval(() => {
        current += 2
        if (current >= target) { 
          setScoreDemo(target)
          clearInterval(step) 
        } else {
          setScoreDemo(current)
        }
      }, 25)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-20 py-4 max-w-6xl mx-auto px-4 sm:px-6">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-8 sm:p-14 border border-indigo-500/25 shadow-2xl">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left 7 cols: Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Automated Resume Auditing</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Know Your Resume’s <span className="gradient-text">True ATS Score</span> Before Applying
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Over 75% of resumes are filtered out before reaching a human recruiter. Evaluate your formatting, keyword match, and bullet impact with high-speed Groq AI and NLP diagnostics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/scorer"
                className="btn-primary-glow flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold w-full sm:w-auto shadow-xl"
              >
                <Sparkles className="w-4 h-4" /> Analyze Resume Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/resources"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-900/60 hover:bg-gray-800 border border-gray-800 w-full sm:w-auto transition-colors"
              >
                Read Optimization Guide
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No signup required to test
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant PDF download
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free & Private
              </span>
            </div>
          </div>

          {/* Right 5 cols: Live Demo Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/30 w-full max-w-sm text-center space-y-4 shadow-2xl relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Simulated ATS Benchmark</p>
                <div className="text-5xl font-extrabold text-white mt-1 tabular-nums">
                  {scoreDemo}<span className="text-2xl text-gray-500 font-normal">/100</span>
                </div>
              </div>

              <div className="space-y-2 text-left pt-2 border-t border-gray-800">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Formatting & Structure</span>
                  <span className="text-emerald-400 font-bold">19/20</span>
                </div>
                <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div className="w-[95%] h-full bg-emerald-500 rounded-full" />
                </div>

                <div className="flex justify-between text-xs text-gray-300 pt-1">
                  <span>Keywords & Skill Density</span>
                  <span className="text-indigo-400 font-bold">23/25</span>
                </div>
                <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-indigo-500 rounded-full" />
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Pass Rate (Top 10%)
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS BENCHMARK */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-x divide-gray-800/0 sm:divide-x sm:divide-gray-800">
          <StatBadge value="5 Pillars" label="Scoring Criteria" color="text-indigo-400" />
          <StatBadge value="Groq LLM" label="High-Speed AI" color="text-purple-400" />
          <StatBadge value="spaCy NLP" label="Syntax & Entities" color="text-emerald-400" />
          <StatBadge value="One Click" label="PDF Report Export" color="text-amber-400" />
        </div>
      </section>

      {/* CORE PLATFORM FEATURES */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive Resume Intelligence Engine
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Everything you need to transform your resume into an ATS-friendly, high-converting document.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <FeatureCard
            icon={BarChart3}
            title="5-Dimension ATS Evaluation"
            description="Evaluates your resume across formatting, keywords, content impact, skill validation, and compatibility with clear point deductions."
            accent={{ bg: 'bg-indigo-600/20', border: 'border-indigo-500/30', text: 'text-indigo-400' }}
            items={['Formatting & Layout (20pts)', 'Keywords & Skill Density (25pts)', 'Content Quality & Impact (25pts)', 'Skill Validation (15pts)', 'ATS Compatibility (15pts)']}
          />
          <FeatureCard
            icon={Brain}
            title="Groq AI + NLP Entity Parser"
            description="Extracts candidate contact details, work timeline, competencies, and achievements with high accuracy using Groq LLMs."
            accent={{ bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-400' }}
            items={['Dynamic active model discovery', 'spaCy NLP entity recognition', 'RapidFuzz semantic matching', 'Fuzzy keyword comparison']}
          />
          <FeatureCard
            icon={Wand2}
            title="AI Resume Bullet Rewriter"
            description="Transforms passive or weak bullet points into 3 high-impact variations tailored to modern hiring expectations."
            accent={{ bg: 'bg-pink-600/20', border: 'border-pink-500/30', text: 'text-pink-400' }}
            items={['Metric & impact-driven version', 'Technical stack version', 'Executive business value version', '1-click copy to clipboard']}
          />
          <FeatureCard
            icon={TrendingUp}
            title="Job Description Gap Analysis"
            description="Paste any target job description to pinpoint missing skills, matched keywords, and overall semantic alignment percentage."
            accent={{ bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400' }}
            items={['Keyword match percentage', 'Matched keywords tag cloud', 'Missing high-value keywords', 'Skills gap detection']}
          />
          <FeatureCard
            icon={Download}
            title="Downloadable PDF Report"
            description="Export your full audit report to a professional PDF document with detailed feedback and action items ready to print or save."
            accent={{ bg: 'bg-amber-600/20', border: 'border-amber-500/30', text: 'text-amber-400' }}
            items={['ReportLab PDF generation', 'Full score breakdown table', 'Key strengths list', 'Plain text summary export']}
          />
          <FeatureCard
            icon={Award}
            title="Skill Evidence Validation"
            description="Cross-references listed skills against your actual job responsibilities to detect unsubstantiated buzzwords that recruiters flag."
            accent={{ bg: 'bg-sky-600/20', border: 'border-sky-500/30', text: 'text-sky-400' }}
            items={['Proven vs. listed skills', 'Contextual evidence detection', 'Validation percentage rate', 'Specific bullet fix tips']}
          />
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">How It Works</h2>
          <p className="text-xs sm:text-sm text-gray-400">Three simple steps to maximize your interview callback rate</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', icon: UploadCloud, title: 'Upload Resume', desc: 'Upload your PDF, DOC, or DOCX document. Optionally paste a job description for role matching.', color: 'text-indigo-400' },
            { step: '02', icon: Cpu, title: 'AI Pipeline Evaluates', desc: 'Groq LLMs and spaCy NLP analyze formatting, extract keywords, and calculate compatibility.', color: 'text-purple-400' },
            { step: '03', icon: Target, title: 'Apply Action Items', desc: 'Review your score, add missing keywords, optimize bullets, and download your full PDF audit.', color: 'text-emerald-400' },
          ].map(({ step, icon: Icon, title, desc, color }) => (
            <div key={step} className="glass-card p-6 sm:p-7 rounded-3xl relative overflow-hidden text-center space-y-3 border border-gray-800">
              <div className="absolute top-2 right-4 text-5xl font-extrabold text-gray-800/40 select-none">{step}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-gray-900 border border-gray-800 shadow-inner">
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-10 sm:p-14 text-center border border-indigo-500/30 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Pass Modern ATS Filters?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Upload your resume now to uncover hidden formatting errors, keyword gaps, and actionable fixes.
          </p>
          <Link
            to="/scorer"
            className="btn-primary-glow inline-flex items-center gap-2.5 px-8 py-4 text-sm font-bold rounded-2xl shadow-xl shadow-indigo-600/30"
          >
            <Sparkles className="w-4 h-4" /> Start Free Resume Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
