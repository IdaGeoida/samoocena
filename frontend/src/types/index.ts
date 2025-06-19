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
}

export interface Category {
  id: number
  name: string
}
