export interface Process {
  id: number
  name: string
  category_id: number
}

export interface Question {
  id: number
  description: string
  category_id: number
  subcategory_id: number
  details?: string
}

export interface Subcategory {
  id: number
  category_id: number
  name: string
  description?: string
}

export interface Category {
  id: number
  name: string
}
