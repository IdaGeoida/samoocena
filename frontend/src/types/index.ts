export interface Question {
  id: number
  description: string
  detail?: string
  scale_min_text?: string
  scale_max_text?: string
  category_id: number
  subcategory_id: number
}

export interface Subcategory {
  id: number
  name: string
  description?: string
  category_id: number
}

export interface Category {
  id: number
  name: string
}

export interface CategoryGroup extends Category {
  ids: number[]
}

export interface Score {
  question: Question
  value: number
}

export interface AssessmentCreate {
  employees_range: string
  volunteers_range: string
  results: number[]
}

export interface Assessment extends AssessmentCreate {
  id: number
  created_at: string
}
