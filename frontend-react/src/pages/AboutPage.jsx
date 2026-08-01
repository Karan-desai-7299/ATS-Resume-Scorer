import React from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink, Mail, Code2, Brain, Database,
  Globe, Award, BookOpen, Sparkles, Target, ArrowRight, Star
} from 'lucide-react'

const SKILLS = {
  'Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS'],
  'Frontend': ['React.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'HTML5'],
  'Backend': ['FastAPI', 'Python', 'REST APIs', 'Node.js'],
  'AI / ML': ['Groq LLaMA 3.3', 'spaCy NLP', 'SentenceTransformers', 'OpenAI API', 'Scikit-learn'],
  'Database': ['Supabase', 'PostgreSQL', 'MySQL', 'SQLite'],
  'DevOps & Tools': ['Git', 'Docker', 'VS Code', 'Jupyter Notebook', 'Postman'],
}

const PROJECTS = [
  {
    name: 'ATS Resume Scorer',
    description: 'Full-stack AI resume intelligence platform. FastAPI + React + Groq LLaMA 3.3 + spaCy NLP + SentenceTransformers with Supabase auth, PDF export, AI bullet optimizer, and AI resume coach chat.',
    tags: ['FastAPI', 'React', 'Groq AI', 'spaCy', 'Supabase'],
    accent: 'indigo',
    icon: Target,
  },
  {
    name: 'AI Bullet Point Rewriter',
    description: 'Real-time Groq-powered resume bullet rewriter generating 3 variations (impact-metric, technical, executive) with instant 1-click clipboard copy.',
    tags: ['Groq LLaMA 3.3', 'React', 'FastAPI'],
    accent: 'purple',
    icon: Sparkles,
  },
  {
    name: 'Resume AI Coach Chat',
    description: 'Context-aware AI career coach answering questions about your ATS analysis in real-time using Groq LLaMA 3.3 with full analysis context injection.',
    tags: ['LLM', 'React', 'FastAPI', 'NLP'],
    accent: 'pink',
    icon: Brain,
  },
]

const accentClasses = {
  indigo: { bg: 'bg-indigo-600/15', border: 'border-indigo-500/30', text: 'text-indigo-400', tag: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/20' },
  purple: { bg: 'bg-purple-600/15', border: 'border-purple-500/30', text: 'text-purple-400', tag: 'bg-purple-950/60 text-purple-300 border-purple-500/20' },
  pink:   { bg: 'bg-pink-600/15',   border: 'border-pink-500/30',   text: 'text-pink-400',   tag: 'bg-pink-950/60 text-pink-300 border-pink-500/20' },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

export default function AboutPage() {
  return (
    <div className="space-y-16 py-6 px-4 max-w-4xl mx-auto">

      {/* ─── HERO CARD ─── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden glass-panel rounded-3xl p-8 sm:p-12 border border-indigo-500/25 text-center"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Avatar */}
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-2xl shadow-indigo-600/30 border-4 border-gray-900">
              K
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-gray-900 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Karansinh Desai</h1>
            <p className="text-indigo-400 font-semibold mt-1 text-sm">Full Stack Developer · AI Enthusiast · FastAPI + React</p>
          </div>

          <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Passionate full-stack developer building intelligent, user-first applications with modern AI and web technologies.
            Creator of this ATS Resume Scorer — a full-stack AI platform that helps job seekers optimize their resumes using
            Groq LLM, spaCy NLP, and SentenceTransformers.
          </p>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://www.linkedin.com/in/karansinh-desai-a249a0289/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" /> LinkedIn Profile
            </a>
            <a
              href="mailto:karansinhdesai91@gmail.com"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all"
            >
              <Mail className="w-4 h-4 text-indigo-400" /> Contact Me
            </a>
          </div>
        </div>
      </motion.section>

      {/* ─── ABOUT / STORY ─── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" /> About Me
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Code2, title: 'Builder by Nature', color: 'text-indigo-400',
              desc: 'I love turning ideas into real, working products. From API design to pixel-perfect UI — I enjoy the full stack of building software.',
            },
            {
              icon: Brain, title: 'AI / ML Explorer', color: 'text-purple-400',
              desc: 'Fascinated by LLMs, NLP, and intelligent systems. I integrate Groq, spaCy, and SentenceTransformers to build practical AI features.',
            },
            {
              icon: Globe, title: 'Web Technology', color: 'text-emerald-400',
              desc: 'React, FastAPI, Supabase, and Tailwind CSS are my daily tools. I focus on clean architecture, fast APIs, and beautiful UIs.',
            },
            {
              icon: Star, title: 'Problem Solver', color: 'text-amber-400',
              desc: 'The ATS Resume Scorer started as a personal problem — now it\'s a full AI product. I turn real challenges into polished solutions.',
            },
          ].map(({ icon: Icon, title, color, desc }) => (
            <div key={title} className="glass-card p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${color}`} />
                <h3 className="text-sm font-bold text-white">{title}</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-400" /> Skills & Technologies
        </h2>
        <motion.div
          variants={container} initial="hidden"
          whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {Object.entries(SKILLS).map(([category, skills]) => (
            <motion.div key={category} variants={item} className="glass-card p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{category}</h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(skill => (
                  <span key={skill} className="px-2 py-0.5 text-[11px] font-semibold text-gray-200 bg-gray-800 border border-gray-700 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── PROJECTS ─── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-pink-400" /> Featured Projects
        </h2>
        <motion.div
          variants={container} initial="hidden"
          whileInView="visible" viewport={{ once: true }}
          className="space-y-4"
        >
          {PROJECTS.map((project) => {
            const a = accentClasses[project.accent]
            const Icon = project.icon
            return (
              <motion.div key={project.name} variants={item}
                className={`glass-card p-6 rounded-2xl border ${a.border} space-y-3`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${a.bg} border ${a.border} shrink-0`}>
                    <Icon className={`w-5 h-5 ${a.text}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{project.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{project.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(tag => (
                    <span key={tag} className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border rounded-full ${a.tag}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* ─── CONTACT CTA ─── */}
      <section className="glass-panel rounded-3xl p-8 border border-blue-500/25 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-white">Let's Connect!</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Open to collaborations, freelance projects, and full-time roles. Reach out on LinkedIn or by email.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="https://www.linkedin.com/in/karansinh-desai-a249a0289/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:scale-105"
          >
            <ExternalLink className="w-4 h-4" /> Connect on LinkedIn <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  )
}
