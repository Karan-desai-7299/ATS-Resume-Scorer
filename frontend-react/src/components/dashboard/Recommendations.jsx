import React from 'react'
import { Lightbulb } from 'lucide-react'

export default function Recommendations({ analysis }) {
  const suggestions = analysis?.suggestions || []
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-indigo-400" /> 💡 AI Recommendations
      </h3>

      <ul className="space-y-2 text-xs text-gray-200">
        {suggestions.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
