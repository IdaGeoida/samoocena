export interface Process {
  id: number
  name: string
  category_id: number
}

export interface Question {
  id: number
  description: string
  detail?: string
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

export interface AssessmentCreate {
  employees_range: string
  volunteers_range: string
  results: number[]
}

export interface Assessment extends AssessmentCreate {
  id: number
  created_at: string
}
