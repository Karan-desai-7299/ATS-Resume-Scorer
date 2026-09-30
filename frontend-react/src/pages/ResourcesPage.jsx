import React, { useState } from 'react'
import { BookOpen, CheckCircle2, XCircle, Code, Briefcase, Palette, FileSpreadsheet, Sparkles, Check, X } from 'lucide-react'

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('tech')

  const dos = [
    'Use standard section headings (Work Experience, Education, Skills, Projects)',
    'Include relevant keywords extracted directly from the target job description',
    'Adopt a clean, machine-parseable single-column layout structure',
    'List technical, programming, and soft skills explicitly in a dedicated section',
    'Quantify achievements with metrics, percentages, revenue impact, and velocity',
    'Use modern, readable web-safe fonts (Inter, Roboto, Arial, Calibri, Helvetica)',
    'Save and export as standard text-layer PDF or DOCX format',
  ]

  const donts = [
    'Avoid complex multi-column grids, tables, and sidebars that scramble parser order',
    'Do not put contact info, email, or links inside document headers or footers',
    'Never insert images, headshots, raster graphics, or skill level progress bars',
    'Avoid non-standard custom section titles like "My Journey" or "What I Do"',
    'Do not keyword-stuff hidden or white text (modern ATS flags and rejects this)',
    'Avoid submitting file formats like JPEG, PNG, or scanned non-searchable PDFs',
  ]

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ATS Best Practices & Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Master the Science of <span className="gradient-text">ATS Optimization</span>
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Learn how automated recruitment screening engines parse, score, and rank resumes so you can land more interviews.
        </p>
      </div>

      {/* Do's and Don'ts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">ATS Blueprint Rules</h2>
          <span className="text-xs text-gray-400">Essential formatting guidelines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Do's */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-emerald-500/25">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-800">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-emerald-400">What to Do (Best Practices)</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-900/40 border border-gray-800/60">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-rose-500/25">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-800">
              <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-rose-400">What to Avoid (Common Pitfalls)</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-900/40 border border-gray-800/60">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* High-Impact Keyword Reference */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-5">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> High-Impact Keyword Reference by Domain
          </h3>
          <p className="text-xs text-gray-400">Top ATS search terms recruiters use to filter candidate pools</p>
        </div>

        {/* Industry Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-gray-900/80 border border-gray-800 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('tech')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tech' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Technology & Eng
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'business' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Business & Ops
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('creative')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'creative' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Product & Design
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 text-xs text-gray-300">
          {activeTab === 'tech' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong className="text-indigo-400 block mb-1">Languages:</strong>
                <p className="text-gray-300">Python, TypeScript, JavaScript, Go, Java, C++, SQL, Rust</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">Frameworks:</strong>
                <p className="text-gray-300">React, Next.js, FastAPI, Node.js, Express, Django, Spring Boot</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">Cloud & Infrastructure:</strong>
                <p className="text-gray-300">AWS (S3, Lambda, EC2), Docker, Kubernetes, CI/CD, Terraform</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">Architecture & Data:</strong>
                <p className="text-gray-300">Microservices, RESTful APIs, PostgreSQL, Redis, MongoDB, GraphQL</p>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong className="text-indigo-400 block mb-1">Management:</strong>
                <p className="text-gray-300">Agile, Scrum, PMP, Cross-functional Leadership, OKRs, Stakeholder Management</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">Finance & Analytics:</strong>
                <p className="text-gray-300">Financial Modeling, Budgeting, ROI Optimization, Tableau, Power BI</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">Strategy:</strong>
                <p className="text-gray-300">Go-to-Market (GTM), Market Research, Customer Acquisition, KPI Tracking</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">Operations:</strong>
                <p className="text-gray-300">Process Automation, Vendor Management, Operational Excellence, SLA Compliance</p>
              </div>
            </div>
          )}

          {activeTab === 'creative' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong className="text-indigo-400 block mb-1">Design Systems & Prototyping:</strong>
                <p className="text-gray-300">Figma, Adobe XD, Design Tokens, Component Libraries, Sketch</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">UX Research & Strategy:</strong>
                <p className="text-gray-300">User Testing, Wireframing, Information Architecture, Heuristic Evaluation</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">Visual & Brand:</strong>
                <p className="text-gray-300">Typography, Brand Identity, Motion Graphics, Responsive Web Design</p>
              </div>
              <div>
                <strong className="text-indigo-400 block mb-1">Accessibility & Handoff:</strong>
                <p className="text-gray-300">WCAG 2.1 AA Compliance, Developer Handoff, Usability Metrics, A/B Testing</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
