import axios from 'axios'
import { AssessmentCreate, Assessment } from '../types'

const api = axios.create({ baseURL: '/api' })

export const createAssessment = async (data: AssessmentCreate): Promise<Assessment> => {
  const res = await api.post<Assessment>('/assessments/', data)
  return res.data
}

export const listAssessments = async (): Promise<Assessment[]> => {
  const res = await api.get<Assessment[]>('/assessments/')
  return res.data
}

export default api
