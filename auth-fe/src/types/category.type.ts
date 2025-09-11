export type Category = {
    id: number
    name: string
    description: string | null
    parent_id: number | null
    children: Category[]
    created_at?: string
    updated_at?: string
  }

export type NestedCategoriesResponse = {
  status: {
    code: number
    message: string
  }
  categories: Category[]
}