import axiosClient from '../api/axiosClient'

export const apiService = {
  // Health check
  checkHealth: async () => {
    const response = await axiosClient.get('/health')
    return response.data
  },

  // Post resume for analysis
  analyzeResume: async (file, jobDescription = '') => {
    const formData = new FormData()
    formData.append('resume', file)
    if (jobDescription) {
      formData.append('job_description', jobDescription)
    }

    const response = await axiosClient.post('/analyze-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 180000, // 3 minutes timeout for NLP + Groq analysis
    })
    return response.data
  },

  // Get user history
  getHistory: async () => {
    const response = await axiosClient.get('/history')
    return response.data
  },

  // Delete history entry
  deleteHistory: async (analysisId) => {
    const response = await axiosClient.delete(`/history/${analysisId}`)
    return response.data
  },

  // Generate PDF from analysis payload
  generatePdf: async (analysisData) => {
    const response = await axiosClient.post('/generate-pdf', analysisData, {
      responseType: 'blob',
      timeout: 60000,
    })
    return response.data
  },

  // Generate PDF for historical entry
  getHistoryPdf: async (analysisId) => {
    const response = await axiosClient.get(`/history/${analysisId}/pdf`, {
      responseType: 'blob',
      timeout: 60000,
    })
    return response.data
  },

  // AI Bullet Point Optimizer
  optimizeBullet: async (bulletText, targetRole = '') => {
    const response = await axiosClient.post('/optimize-bullet', {
      bullet: bulletText,
      target_role: targetRole,
    })
    return response.data
  },

  // AI Resume Coach Chat
  askResumeAI: async (question, analysisContext = {}) => {
    const response = await axiosClient.post('/ask-resume-ai', {
      question,
      analysis_context: analysisContext,
    })
    return response.data
  },
}

