export interface PhotoProps {
  id: string
  url: string[];
  category: string;
  description: string;
  university: string;
  eventName: string;
  uploadDate: string
  photographer: string;
}

export const mockPhotos: PhotoProps[] = [
  {
    id: "1",
    url: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",],
    category: "Red Carpet",
    eventName: "Spring Gala 2024",
    university: "Tech University",
    uploadDate: "2024-03-15",
    photographer: "John Photography",
    description: "Guests arriving at the red carpet"
  },
  {
    id: "2",
    url: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop",],
    category: "Special Guest",
    eventName: "Spring Gala 2024",
    university: "Tech University",
    uploadDate: "2024-03-15",
    photographer: "John Photography",
    description: "VIP guests at the entrance"
  },
  {
    id: "3",
    url: ["https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=800&fit=crop",],
    category: "Award Winner",
    eventName: "Awards Night 2024",
    university: "Arts College",
    uploadDate: "2024-02-20",
    photographer: "Lens Studio",
    description: "Award winner on stage"
  },
  {
    id: "4",
    url: ["https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=800&fit=crop"],
    category: "Performance",
    eventName: "Awards Night 2024",
    university: "Arts College",
    uploadDate: "2024-02-20",
    photographer: "Lens Studio",
    description: "Live stage performance"
  }
];

export const events = ["All Events", "Spring Gala 2024", "Awards Night 2024"];
export const categories = ["All Categories", "Red Carpet", "Award Winner", "Performance", "Backstage", "Special Guest"];
export const universities = ["All Universities", "Tech University", "Arts College"];
