export type Category = {
    id: number
    name: string
    description: string | null
    parent: Category | null
    children: Category[]
    created_at: string
    updated_at: string
  }