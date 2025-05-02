export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  available: boolean;
  image: string;
  description: string;
}

export interface CartItem {
  car: Car;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
}

export interface Booking {
  id: number;
  userId: number;
  car: Car;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}