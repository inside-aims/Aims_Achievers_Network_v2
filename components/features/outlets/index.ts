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

// Sample Data
export const mockVendors: Outlet[] = [
  {
    id: '1',
    name: 'Prestige Craft Co.',
    tagline: 'Masterpieces That Define Excellence',
    description: 'Award-winning artisans crafting bespoke recognition pieces for Fortune 500 companies and prestigious institutions across Africa',
    location: 'De Bernabue',
    rating: 4.98,
    reviews: 847,
    completedOrders: 3420,
    specialties: ['Crystal Awards', 'Luxury Trophies', 'Custom Sculptures', 'LED Integration'],
    phone: '+233241234567',
    whatsapp: '+233241234567',
    website: 'https://prestigecraft.gh',
    portfolioImages: [
      'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200',
      'https://images.unsplash.com/photo-1586995950615-89d3dbcf3a27?w=1200',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200'
    ],
    featured: true,
    responseTime: '2 hours',
    yearsExperience: 18,
    clientSatisfaction: 99,
    verified: true,
  },
  {
    id: '2',
    name: 'Artisan Legacy',
    tagline: 'Heritage Meets Innovation',
    description: 'Third-generation craftsmen blending traditional techniques with cutting-edge design technology',
    location: 'Koforidua, Adweso Market',
    rating: 4.95,
    reviews: 624,
    completedOrders: 2890,
    specialties: ['Wooden Masterpieces', 'Bronze Casting', 'Heritage Plaques', 'Gold Leafing'],
    phone: '+233249876543',
    whatsapp: '+233249876543',
    portfolioImages: [
      'https://images.unsplash.com/photo-1606390488566-4f27735d8db7?w=1200',
      'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=1200',
      'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200'
    ],
    featured: true,
    responseTime: '3 hours',
    yearsExperience: 25,
    clientSatisfaction: 98,
    verified: false
  },
  {
    id: '3',
    name: 'Victory Forge',
    tagline: 'Champions Choose Excellence',
    description: 'Elite trophy makers serving international sports federations and corporate giants',
    location: 'Poly Junction',
    rating: 4.92,
    reviews: 531,
    completedOrders: 4100,
    specialties: ['Championship Trophies', 'Medals', '3D Crystal', 'Rapid Production'],
    phone: '+233245557890',
    whatsapp: '+233245557890',
    website: 'https://victoryforge.gh',
    portfolioImages: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200',
      'https://images.unsplash.com/photo-1606767143821-485faa994a7b?w=1200',
      'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200'
    ],
    featured: false,
    responseTime: '4 hours',
    yearsExperience: 12,
    clientSatisfaction: 97,
    verified: true
  }
];