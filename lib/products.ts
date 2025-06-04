export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  inStock: number
  badge?: "new" | "bestseller" | "lowstock"
  isPopular?: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  timestamp: string
  status: "pending" | "ready" | "completed"
}

export const categories = [
  "Pain Relief",
  "Vitamins & Supplements",
  "Cold & Flu",
  "Digestive Health",
  "First Aid",
  "Allergy Relief",
]

export const products: Product[] = [
  // Pain Relief
  {
    id: "1",
    name: "Ibuprofen 200mg",
    category: "Pain Relief",
    price: 8.99,
    description: "Fast-acting pain relief for headaches, muscle aches, and fever",
    image: "/placeholder.svg?height=200&width=200&text=Ibuprofen",
    inStock: 50,
    badge: "bestseller",
    isPopular: true,
  },
  {
    id: "2",
    name: "Acetaminophen 500mg",
    category: "Pain Relief",
    price: 7.49,
    description: "Gentle pain relief and fever reducer",
    image: "/placeholder.svg?height=200&width=200&text=Acetaminophen",
    inStock: 45,
    badge: "bestseller",
  },
  {
    id: "3",
    name: "Aspirin 325mg",
    category: "Pain Relief",
    price: 6.99,
    description: "Classic pain relief with anti-inflammatory properties",
    image: "/placeholder.svg?height=200&width=200&text=Aspirin",
    inStock: 5,
    badge: "lowstock",
  },
  {
    id: "4",
    name: "Naproxen 220mg",
    category: "Pain Relief",
    price: 9.99,
    description: "Long-lasting pain relief for arthritis and muscle pain",
    image: "/placeholder.svg?height=200&width=200&text=Naproxen",
    inStock: 25,
  },

  // Vitamins & Supplements
  {
    id: "5",
    name: "Vitamin D3 1000 IU",
    category: "Vitamins & Supplements",
    price: 12.99,
    description: "Essential vitamin for bone health and immune support",
    image: "/placeholder.svg?height=200&width=200&text=Vitamin+D3",
    inStock: 60,
  },
  {
    id: "6",
    name: "Multivitamin Daily",
    category: "Vitamins & Supplements",
    price: 15.99,
    description: "Complete daily nutrition with essential vitamins and minerals",
    image: "/placeholder.svg?height=200&width=200&text=Multivitamin",
    inStock: 40,
  },
  {
    id: "7",
    name: "Vitamin C 1000mg",
    category: "Vitamins & Supplements",
    price: 11.49,
    description: "Immune system support with antioxidant properties",
    image: "/placeholder.svg?height=200&width=200&text=Vitamin+C",
    inStock: 55,
  },
  {
    id: "8",
    name: "Omega-3 Fish Oil",
    category: "Vitamins & Supplements",
    price: 18.99,
    description: "Heart and brain health support with EPA and DHA",
    image: "/placeholder.svg?height=200&width=200&text=Omega+3",
    inStock: 35,
  },

  // Cold & Flu
  {
    id: "9",
    name: "DayQuil Cold & Flu",
    category: "Cold & Flu",
    price: 13.99,
    description: "Daytime relief for cold and flu symptoms",
    image: "/placeholder.svg?height=200&width=200&text=DayQuil",
    inStock: 20,
  },
  {
    id: "10",
    name: "NyQuil Nighttime Relief",
    category: "Cold & Flu",
    price: 13.99,
    description: "Nighttime cold and flu relief for better sleep",
    image: "/placeholder.svg?height=200&width=200&text=NyQuil",
    inStock: 18,
  },
  {
    id: "11",
    name: "Throat Lozenges",
    category: "Cold & Flu",
    price: 5.99,
    description: "Soothing relief for sore throat and cough",
    image: "/placeholder.svg?height=200&width=200&text=Lozenges",
    inStock: 75,
  },
  {
    id: "12",
    name: "Cough Syrup",
    category: "Cold & Flu",
    price: 9.49,
    description: "Effective cough suppressant for dry cough",
    image: "/placeholder.svg?height=200&width=200&text=Cough+Syrup",
    inStock: 22,
  },

  // Digestive Health
  {
    id: "13",
    name: "Antacid Tablets",
    category: "Digestive Health",
    price: 6.49,
    description: "Fast relief from heartburn and acid indigestion",
    image: "/placeholder.svg?height=200&width=200&text=Antacid",
    inStock: 40,
  },
  {
    id: "14",
    name: "Probiotics Daily",
    category: "Digestive Health",
    price: 24.99,
    description: "Support digestive health with beneficial bacteria",
    image: "/placeholder.svg?height=200&width=200&text=Probiotics",
    inStock: 28,
  },
  {
    id: "15",
    name: "Anti-Diarrheal",
    category: "Digestive Health",
    price: 8.99,
    description: "Fast-acting relief for diarrhea symptoms",
    image: "/placeholder.svg?height=200&width=200&text=Anti+Diarrheal",
    inStock: 15,
  },
  {
    id: "16",
    name: "Fiber Supplement",
    category: "Digestive Health",
    price: 16.99,
    description: "Daily fiber for digestive regularity",
    image: "/placeholder.svg?height=200&width=200&text=Fiber",
    inStock: 32,
  },

  // First Aid
  {
    id: "17",
    name: "Adhesive Bandages",
    category: "First Aid",
    price: 4.99,
    description: "Assorted sizes for minor cuts and scrapes",
    image: "/placeholder.svg?height=200&width=200&text=Bandages",
    inStock: 100,
  },
  {
    id: "18",
    name: "Antiseptic Cream",
    category: "First Aid",
    price: 7.99,
    description: "Prevents infection in minor cuts and burns",
    image: "/placeholder.svg?height=200&width=200&text=Antiseptic",
    inStock: 45,
  },
  {
    id: "19",
    name: "Hydrogen Peroxide",
    category: "First Aid",
    price: 3.99,
    description: "Wound cleaning and disinfection",
    image: "/placeholder.svg?height=200&width=200&text=Peroxide",
    inStock: 60,
  },

  // Allergy Relief
  {
    id: "20",
    name: "Antihistamine 24hr",
    category: "Allergy Relief",
    price: 14.99,
    description: "24-hour allergy relief for seasonal allergies",
    image: "/placeholder.svg?height=200&width=200&text=Antihistamine",
    inStock: 35,
  },
  {
    id: "21",
    name: "Nasal Spray",
    category: "Allergy Relief",
    price: 11.99,
    description: "Fast-acting nasal congestion relief",
    image: "/placeholder.svg?height=200&width=200&text=Nasal+Spray",
    inStock: 28,
  },
]
