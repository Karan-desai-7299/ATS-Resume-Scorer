import React, { useState } from 'react'
import { BookOpen, CheckCircle, XCircle, Code, Briefcase, Palette, FileSpreadsheet } from 'lucide-react'

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('tech')

  return (
    <div className="space-y-10 py-2 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-400" /> Resources & Optimization Tips
        </h1>
        <p className="text-sm text-gray-400">Master the science of beating ATS parsers and landing callbacks.</p>
      </div>

      {/* Do's and Don'ts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">🎯 ATS Optimization Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Do's */}
          <div className="glass-card p-6 rounded-2xl space-y-4 border-emerald-500/20">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> ✅ Do's
            </h3>
            <ul className="space-y-2 text-xs text-gray-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Use standard section headings (Work Experience, Education, Skills)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Include relevant keywords extracted directly from the job description</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Use simple, clean single-column layout formatting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>List technical & soft skills explicitly in a dedicated section</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Quantify achievements with metrics, percentages, and numbers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Use standard web-safe fonts (Arial, Calibri, Helvetica, Inter)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Save and upload as machine-readable PDF or DOCX format</span>
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="glass-card p-6 rounded-2xl space-y-4 border-rose-500/20">
            <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> ❌ Don'ts
            </h3>
            <ul className="space-y-2 text-xs text-gray-200">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Avoid tables, text boxes, and complex multi-column grids</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Don't put critical contact info inside document headers/footers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Avoid images, icons, portfolio screenshots, and graphics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Don't use unusual custom script or decorative fonts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Avoid keyword stuffing white text or unnatural word lists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Avoid obscure acronyms without spelling out full names first</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Keywords Industry Explorer */}
      <div className="glass-card p-6 rounded-2xl space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">🔑 Common Industry Keywords</h2>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-900/80 rounded-xl border border-gray-800 max-w-md">
          <button
            onClick={() => setActiveTab('tech')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'tech' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code className="w-4 h-4" /> Tech
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'business' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Business
          </button>
          <button
            onClick={() => setActiveTab('creative')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'creative' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Palette className="w-4 h-4" /> Creative
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-300 space-y-3">
          {activeTab === 'tech' && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Software Development & IT:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <strong className="text-indigo-400">Languages:</strong> Python, Java, JavaScript, TypeScript, Go, C++
                </div>
                <div>
                  <strong className="text-indigo-400">Frameworks:</strong> React, Node.js, FastAPI, Django, Spring Boot
                </div>
                <div>
                  <strong className="text-indigo-400">Cloud & DevOps:</strong> AWS, Docker, Kubernetes, CI/CD, Git, Terraform
                </div>
                <div>
                  <strong className="text-indigo-400">Methodologies:</strong> Agile, Scrum, Microservices, REST APIs, TDD
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Business & Management:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <strong className="text-indigo-400">Management:</strong> Project Management, Stakeholder Management, PMP
                </div>
                <div>
                  <strong className="text-indigo-400">Finance:</strong> Budgeting, Forecasting, ROI Analysis, Financial Modeling
                </div>
                <div>
                  <strong className="text-indigo-400">Strategy:</strong> Strategic Planning, Market Research, KPI Tracking
                </div>
                <div>
                  <strong className="text-indigo-400">Operations:</strong> Process Optimization, Cross-functional Leadership
                </div>
              </div>
            </div>
          )}

          {activeTab === 'creative' && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Creative & Design:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <strong className="text-indigo-400">Design Tools:</strong> Figma, Adobe Creative Suite, Photoshop, Illustrator
                </div>
                <div>
                  <strong className="text-indigo-400">UI/UX:</strong> Wireframing, Prototyping, User Research, Design Systems
                </div>
                <div>
                  <strong className="text-indigo-400">Brand:</strong> Visual Identity, Brand Strategy, Design Guidelines
                </div>
                <div>
                  <strong className="text-indigo-400">Media:</strong> Motion Graphics, Video Editing, Responsive Design
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Templates Teaser */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">ATS-Friendly Resume Templates</h4>
            <p className="text-xs text-gray-400">Pre-formatted, machine-parseable templates designed to achieve 90+ ATS compatibility.</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-xl whitespace-nowrap">
          Included & Free
        </span>
      </div>
    </div>
  )
}
