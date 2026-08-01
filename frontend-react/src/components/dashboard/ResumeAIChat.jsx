import React, { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Sparkles, MessageCircle, RefreshCw, Lightbulb, X } from 'lucide-react'
import { apiService } from '../../services/apiService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const PRESET_QUESTIONS = [
  '🔑 Which keywords should I add to improve my score?',
  '📝 How can I improve my formatting score?',
  '💼 What are the 3 most critical changes I should make?',
  '🛠️ How do I validate my unvalidated skills?',
  '📈 What score range would get me past most ATS systems?',
  '✍️ How should I rewrite my professional summary?',
]

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
        isUser
          ? 'bg-indigo-600 border-indigo-500 text-white'
          : 'bg-purple-900/80 border-purple-500/40 text-purple-300'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-medium whitespace-pre-wrap ${
        isUser
          ? 'bg-indigo-600/90 text-white rounded-tr-sm'
          : 'bg-gray-800/80 text-gray-200 rounded-tl-sm border border-gray-700/60'
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
        content: `👋 Hi! I'm your AI Resume Coach powered by Groq LLaMA 3.3.\n\nI have your full ATS analysis loaded — ask me anything about your resume, your score, or how to improve it!\n\nTry one of the quick questions below or type your own.`,
      }])
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  const handleSend = async (questionOverride) => {
    if (!user) { toast.error('Sign in to use the AI Coach.'); return }
    const question = (questionOverride || input).trim()
    if (!question || isLoading) return

    setInput('')
    const userMsg = { role: 'user', content: question }
    const loadingMsg = { role: 'assistant', content: '', loading: true }

    setMessages(prev => [...prev, userMsg, loadingMsg])
    setIsLoading(true)

    try {
      const { answer } = await apiService.askResumeAI(question, analysis || {})
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: answer }
        return updated
      })
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: '⚠️ Sorry, I couldn\'t get an answer right now. Please try again.',
        }
        return updated
      })
      toast.error('AI Coach request failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleReset = () => setMessages([])

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="glass-card p-5 rounded-2xl border border-purple-500/25 flex items-center justify-between gap-4 cursor-pointer hover:border-purple-500/50 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">🤖 Ask AI Resume Coach</p>
            <p className="text-xs text-gray-400">Get instant Groq-powered answers about your resume and how to improve it</p>
          </div>
        </div>
        <div className="shrink-0 px-3 py-1.5 text-xs font-bold text-purple-300 bg-purple-600/15 border border-purple-500/25 rounded-xl">
          Open Chat →
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-2xl border border-purple-500/30 flex flex-col overflow-hidden shadow-2xl shadow-purple-900/20" style={{ height: '520px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Resume Coach</h4>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold">Groq LLaMA 3.3 · Live</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleReset} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Preset Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 shrink-0">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" /> Quick Questions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_QUESTIONS.slice(0, 4).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-2.5 py-1 text-[10px] font-medium text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-500/20 rounded-lg transition-colors text-left disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 shrink-0 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isLoading}
            placeholder="Ask anything about your resume..."
            className="flex-1 px-3 py-2.5 text-xs rounded-xl glass-input placeholder-gray-600"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25"
          >
            {isLoading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
        <p className="text-[9px] text-gray-600 mt-1.5 text-center">Powered by Groq LLaMA 3.3 70B · Press Enter to send</p>
      </div>
    </div>
  )
}
