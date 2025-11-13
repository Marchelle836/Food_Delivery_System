export interface Restaurant {
  id: number;
  name: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRestaurantRequest {
  name: string;
  address: string;
}

export interface UpdateRestaurantRequest {
  name: string;
  address: string;
}