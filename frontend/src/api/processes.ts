import axios from 'axios'
import { Process } from '../types'

const api = axios.create({ baseURL: '/api' })

export const getProcesses = async (): Promise<Process[]> => {
  const res = await api.get<Process[]>('/processes/')
  return res.data
}

export default api
