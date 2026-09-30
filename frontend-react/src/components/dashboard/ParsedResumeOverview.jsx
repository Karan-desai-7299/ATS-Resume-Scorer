import React, { useState } from 'react'
import { User, Mail, Phone, Briefcase, GraduationCap, Code, ChevronDown, ChevronUp, ExternalLink, Globe, Sparkles } from 'lucide-react'

export default function ParsedResumeOverview({ analysis }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const parsed = analysis?.parsed_resume || analysis?.resume_parsed || {}
  const name = parsed.name || 'Candidate'
  const email = parsed.email
  const phone = parsed.phone
  const linkedin = parsed.linkedin
  const github = parsed.github
  const summary = parsed.professional_summary
  const skills = parsed.skills || []
  const experience = parsed.experience || []
  const education = parsed.education || []

  if (!parsed || Object.keys(parsed).length === 0) return null

  return (
    <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-4">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Parsed Candidate Profile</h3>
            <p className="text-xs text-gray-400">Structured data extracted by Groq AI & NLP entity parser</p>
          </div>
        </div>
        <button type="button" className="text-gray-400 hover:text-white p-1">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-5 pt-3 border-t border-gray-800/80">
          
          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
            {name && <span className="font-extrabold text-white text-sm tracking-wide">{name}</span>}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-indigo-400 hover:underline">
                <Mail className="w-3.5 h-3.5" /> {email}
              </a>
            )}
            {phone && (
              <span className="flex items-center gap-1.5 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> {phone}
              </span>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:underline">
                <Globe className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-purple-400 hover:underline">
                <Code className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Professional Summary</h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/40 p-3.5 rounded-2xl border border-gray-800/80">
                {summary}
              </p>
            </div>
          )}

          {/* Extracted Skills Cloud */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Extracted Skills & Competencies ({skills.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-[11px] font-semibold text-indigo-300 bg-indigo-950/40 border border-indigo-500/25 rounded-lg"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Timeline */}
          {experience.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Work Experience ({experience.length} Roles)
              </h4>
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-gray-900/50 border border-gray-800 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{exp.job_title || 'Software Role'}</span>
                      <span className="text-[11px] text-indigo-400 font-medium">
                        {exp.company || 'Company'} &bull; {exp.duration_months ? `${Math.round(exp.duration_months / 12 * 10) / 10} yrs` : 'Current'}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Education</h4>
              <div className="flex flex-wrap gap-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="px-3 py-2 rounded-xl bg-gray-900/40 border border-gray-800 text-xs text-gray-300 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span><strong>{edu.degree || 'Degree'}</strong> - {edu.institution || 'University'} {edu.year ? `(${edu.year})` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
