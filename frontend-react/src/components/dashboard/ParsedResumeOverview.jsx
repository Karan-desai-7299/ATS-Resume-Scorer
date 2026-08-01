import React, { useState } from 'react'
import { User, Mail, Phone, Briefcase, GraduationCap, Code, ChevronDown, ChevronUp, ExternalLink, Globe } from 'lucide-react'

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
    <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">👤 Candidate Resume Snapshot</h3>
            <p className="text-xs text-gray-400">Structured data extracted by Groq LLM & NLP Parser</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white p-1">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-5 pt-2 border-t border-gray-800/80">
          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
            {name && <span className="font-bold text-white text-sm">{name}</span>}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1 text-indigo-400 hover:underline">
                <Mail className="w-3.5 h-3.5" /> {email}
              </a>
            )}
            {phone && (
              <span className="flex items-center gap-1 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> {phone}
              </span>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                <Globe className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-400 hover:underline">
                <Code className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            )}
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Professional Summary</h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-gray-950/40 p-3 rounded-xl border border-gray-800/80">
                {summary}
              </p>
            </div>
          )}

          {/* Extracted Skills Badges */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4 text-indigo-400" /> Extracted Skills ({skills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Education Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Experience List */}
            {experience.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-400" /> Work Experience
                </h4>
                <div className="space-y-2">
                  {experience.map((exp, i) => (
                    <div key={i} className="p-3 rounded-xl bg-gray-900/40 border border-gray-800 text-xs space-y-1">
                      <div className="font-bold text-white">{exp.job_title || 'Role'}</div>
                      <div className="text-indigo-400 text-[11px]">{exp.company || 'Company'}</div>
                      {(exp.start_date || exp.end_date) && (
                        <div className="text-gray-500 text-[10px]">
                          {exp.start_date} - {exp.end_date || 'Present'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education List */}
            {education.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-400" /> Education
                </h4>
                <div className="space-y-2">
                  {education.map((edu, i) => (
                    <div key={i} className="p-3 rounded-xl bg-gray-900/40 border border-gray-800 text-xs space-y-1">
                      <div className="font-bold text-white">{edu.degree || 'Degree'}</div>
                      <div className="text-emerald-400 text-[11px]">{edu.institution || 'Institution'}</div>
                      {edu.year && <div className="text-gray-500 text-[10px]">{edu.year}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
