import axios from 'axios'
import { Category } from '../types'

const api = axios.create({ baseURL: '/api' })

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>('/categories/')
  return res.data
}

export default api
