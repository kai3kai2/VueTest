import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach required interviewer identity header on every request
http.interceptors.request.use((config) => {
  config.headers['interviewerName'] = import.meta.env.VITE_INTERVIEWER_NAME
  return config
})

// Normalise error responses
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string =
      error.response?.data?.message ?? error.message ?? 'Unknown error'
    return Promise.reject(new Error(message))
  },
)

export default http
