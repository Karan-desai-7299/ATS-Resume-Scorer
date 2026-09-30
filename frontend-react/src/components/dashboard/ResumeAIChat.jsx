import React, { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Sparkles, MessageCircle, RefreshCw, Lightbulb, X } from 'lucide-react'
import { apiService } from '../../services/apiService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const PRESET_QUESTIONS = [
  'Which keywords should I add to improve my ATS score?',
  'How can I improve my formatting score to 20/20?',
  'What are the 3 most critical changes I should make today?',
  'How do I validate my unvalidated skills in my work experience?',
  'What ATS score range is required to pass top company screens?',
  'How should I rewrite my professional summary for higher impact?',
]

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
        isUser
          ? 'bg-indigo-600 border-indigo-500 text-white'
          : 'bg-purple-900/80 border-purple-500/40 text-purple-300'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-normal whitespace-pre-wrap ${
        isUser
          ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
          : 'bg-gray-900/90 text-gray-200 rounded-tl-sm border border-gray-800 shadow-md'
      }`}>
        {msg.content}
        {msg.loading && (
          <span className="inline-flex gap-1 ml-2 align-middle">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ResumeAIChat({ analysis }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm your AI Resume Coach powered by Groq high-speed LLMs.\n\nI have your full ATS analysis loaded — ask me anything about your resume, missing keywords, or how to reach a 90+ score!\n\nClick any suggested question below or type your own.`,
      }])
    }
  }, [isOpen])

  const sendMessage = async (text) => {
    const question = (text || input).trim()
    if (!question || isLoading) return

    if (!user) {
      toast.error('Sign in to chat with the AI Resume Coach.')
      return
    }

    const userMsg = { role: 'user', content: question }
    const botLoading = { role: 'assistant', content: '', loading: true }
    setMessages(prev => [...prev, userMsg, botLoading])
    setInput('')
    setIsLoading(true)

    try {
      const answer = await apiService.askResumeAI(question, analysis)
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: answer },
      ])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Apologies, I encountered an issue generating a response. Please verify your connection and try again.' },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="glass-card rounded-3xl p-6 border border-purple-500/25 space-y-4">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Interactive AI Resume Coach
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                Groq AI
              </span>
            </h3>
            <p className="text-xs text-gray-400">Ask strategic questions about your score, bullet points, and optimization</p>
          </div>
        </div>

        <button
          type="button"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600/15 text-purple-300 hover:bg-purple-600/25 border border-purple-500/30 transition-colors"
        >
          {isOpen ? 'Minimize Chat' : 'Open Coach Chat'}
        </button>
      </div>

      {/* Chat Body */}
      {isOpen && (
        <div className="space-y-4 pt-3 border-t border-gray-800/80">
          
          {/* Messages window */}
          <div className="h-72 overflow-y-auto space-y-3 p-3 rounded-2xl bg-gray-950/60 border border-gray-800/80">
            {messages.map((m, idx) => (
              <ChatMessage key={idx} msg={m} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Suggested Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUESTIONS.slice(0, 4).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 text-[11px] text-gray-300 hover:text-white border border-gray-700/60 transition-colors text-left truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage() }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your resume analysis..."
              disabled={isLoading}
              className="flex-1 glass-input px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send
            </button>
          </form>

        </div>
      )}
    </div>
  )
}
