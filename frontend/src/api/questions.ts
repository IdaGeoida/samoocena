import axios from 'axios'
import { Question } from '../types'

const api = axios.create({ baseURL: '/api' })

export const getQuestions = async (categories?: number[]): Promise<Question[]> => {
  const params = categories && categories.length ? { category_id: categories.join(',') } : {}
  const res = await api.get<Question[]>('/questions/', { params })
  return res.data
}

export default api
