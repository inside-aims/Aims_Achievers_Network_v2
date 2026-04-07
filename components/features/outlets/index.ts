export interface Outlet {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  rating: number;
  reviews: number;
  completedOrders: number;
  specialties: string[];
  phone: string;
  whatsapp: string;
  website?: string;
  portfolioImages: string[];
  featured: boolean;
  responseTime: string;
  yearsExperience: number;
  clientSatisfaction: number;
  verified: boolean;
}