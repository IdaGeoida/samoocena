export enum Applicability {
  MZ = 'MZ',
  WP = 'WP',
  NZ = 'NZ'
}

export interface Process {
  id: number
  name: string
  category_id: number
  applicability: Applicability
}
