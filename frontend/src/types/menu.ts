export interface Menu {
  id: number;
  name: string;
  price: string;
  description?: string;
  restaurant_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMenuRequest {
  name: string;
  price: string;
  restaurant_id: string;
}

export interface UpdateMenuRequest {
  name: string;
  price: string;
  restaurant_id: string;
}