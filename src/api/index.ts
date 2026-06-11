import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 依要求帶入面試者名稱
http.interceptors.request.use((config) => {
  config.headers['interviewerName'] = import.meta.env.VITE_INTERVIEWER_NAME
  return config
})

// 統一將錯誤回應轉成 Error 物件往上拋
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string =
      error.response?.data?.message ?? error.message ?? 'Unknown error'
    return Promise.reject(new Error(message))
  },
)

export default http
