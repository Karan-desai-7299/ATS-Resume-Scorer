import React from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink, Mail, Code2, Brain, Database,
  Globe, Award, BookOpen, Sparkles, Target, ArrowRight, Star, Cpu, ShieldCheck
} from 'lucide-react'

const SKILLS = {
  'Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML5/CSS3'],
  'Frontend': ['React.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'REST APIs'],
  'Backend': ['FastAPI', 'Python', 'Node.js', 'Microservices Architecture'],
  'AI / ML': ['Groq High-Speed LLMs', 'spaCy NLP', 'RapidFuzz Semantic Engine', 'Prompt Engineering'],
  'Database & Cloud': ['Supabase', 'PostgreSQL', 'Vercel Serverless', 'Git / GitHub'],
}

const PROJECTS = [
  {
    name: 'ATS Resume Scorer Pro',
    description: 'Enterprise-grade AI resume intelligence platform built with FastAPI, React, Groq LLMs, spaCy NLP, and Supabase authentication. Features multi-format parsing, keyword gap extraction, PDF report generation, and AI bullet optimization.',
    tags: ['FastAPI', 'React', 'Groq AI', 'spaCy', 'Supabase'],
    accent: 'indigo',
    icon: Target,
  },
  {
    name: 'AI Resume Bullet Optimizer',
    description: 'Real-time Groq-powered bullet point transformation engine generating 3 ATS-optimized variations (metric-driven, technical stack, executive business value) with 1-click clipboard integration.',
    tags: ['Groq LLM', 'React', 'FastAPI'],
    accent: 'purple',
    icon: Sparkles,
  },
  {
    name: 'Interactive Resume AI Coach',
    description: 'Context-aware AI career advisory chat answering candidate inquiries about their specific ATS score breakdown, formatting gaps, and missing keywords in real-time.',
    tags: ['LLM Agent', 'React', 'FastAPI', 'NLP'],
    accent: 'pink',
    icon: Brain,
  },
]

const accentClasses = {
  indigo: { bg: 'bg-indigo-600/15', border: 'border-indigo-500/30', text: 'text-indigo-400', tag: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/20' },
  purple: { bg: 'bg-purple-600/15', border: 'border-purple-500/30', text: 'text-purple-400', tag: 'bg-purple-950/60 text-purple-300 border-purple-500/20' },
  pink:   { bg: 'bg-pink-600/15',   border: 'border-pink-500/30',   text: 'text-pink-400',   tag: 'bg-pink-950/60 text-pink-300 border-pink-500/20' },
}

export default function AboutPage() {
  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto px-4 sm:px-6">

      {/* Hero Creator Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-1 shrink-0 shadow-xl shadow-indigo-600/30">
            <div className="w-full h-full rounded-[22px] bg-[#090d16] flex items-center justify-center text-white text-3xl font-extrabold">
              K
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Creator & Developer
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Available for Roles
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Karansinh Desai
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl font-medium">
              Full Stack & AI Developer specializing in modern React applications, scalable FastAPI backends, and high-performance LLM pipelines. Passionate about architecting intuitive user experiences powered by cutting-edge artificial intelligence.
            </p>

            {/* Social Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/karansinh-desai/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/25"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Connect on LinkedIn
              </a>

              <a
                href="https://karansinh-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-indigo-200 bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/40 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Explore Portfolio
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Skills Matrix */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-400" /> Technical Competencies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(SKILLS).map(([cat, list]) => (
            <div key={cat} className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2.5">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{cat}</h3>
              <div className="flex flex-wrap gap-1.5">
                {list.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-[11px] font-semibold text-gray-200 bg-gray-900 border border-gray-700/60 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlighted Architecture Projects */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" /> System Architecture & Innovation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROJECTS.map((proj) => {
            const Icon = proj.icon
            const cls = accentClasses[proj.accent]
            return (
              <div key={proj.name} className="glass-card p-6 rounded-3xl border border-gray-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${cls.bg} ${cls.border} ${cls.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{proj.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{proj.description}</p>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-800/80">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${cls.tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
