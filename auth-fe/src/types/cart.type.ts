export interface CartAuthor {
  id: number;
  name: string;
}

export interface CartCategory {
  id: number;
  name: string;
}

export interface CartBook {
  id: number;
  title: string;
  description: string;
  price: string;
  discount_percentage: string;
  stock_quantity: number;
  featured: boolean;
  cover_image_url: string;
  sample_page_urls: string[];
  authors: CartAuthor[];
  categories: CartCategory[];
  sync_status: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  quantity: number;
  book: CartBook;
}

export interface UpdateCartRequest {
  book_id: number;
  quantity: number;
}

export interface RemoveFromCartRequest {
  book_id: number;
}