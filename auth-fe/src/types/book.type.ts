export type Book = {
    id: number
    slug: string
    title: string
    description: string | null
    price: number
    cost_price: number
    discount_percentage: number
    stock_quantity: number
    featured: boolean
    cover_image_url: string | null
    sample_page_urls: string[]
    authors: { id: number; name: string }[]   // can adjust shape
    categories: { id: number; name: string }[] // can adjust shape
    sync_status: string
    created_at: string
    updated_at: string
  }
  