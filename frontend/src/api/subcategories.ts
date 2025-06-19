import axios from 'axios'
import { Subcategory } from '../types'

const api = axios.create({ baseURL: '/api' })

export const getSubcategories = async (categories?: number[]): Promise<Subcategory[]> => {
  const params = categories && categories.length ? { category_id: categories.join(',') } : {}
  const res = await api.get<Subcategory[]>('/subcategories/', { params })
  return res.data
}

export default api
