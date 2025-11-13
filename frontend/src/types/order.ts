export interface Order {
  id: number;
  menu_item: string;
  total_price: string;
  status: 'pending' | 'paid' | 'delivered';
  user_id?: number;
  restaurant_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrderRequest {
  menu_item: string;
  total_price: string;
  status: 'pending' | 'paid' | 'delivered';
  user_id?: number;
  restaurant_id?: number;
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'paid' | 'delivered';
}