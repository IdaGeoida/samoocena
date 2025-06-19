import axios from 'axios'
import { Subcategory } from '../types'

const api = axios.create({ baseURL: '/api' })

export const getSubcategories = async (categoryIds?: number[]): Promise<Subcategory[]> => {
  const params = categoryIds && categoryIds.length ? { category_id: categoryIds.join(',') } : {}
  const res = await api.get<Subcategory[]>('/subcategories/', { params })
  return res.data
}

export default api
