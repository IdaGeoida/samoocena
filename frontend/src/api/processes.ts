import axios from 'axios'
import { Process } from '../types'

const api = axios.create({ baseURL: '/api' })

export const getProcesses = async (categories?: number[]): Promise<Process[]> => {
  const params = categories && categories.length ? { category_id: categories.join(',') } : {}
  const res = await api.get<Process[]>('/processes/', { params })
  return res.data
}

export default api
