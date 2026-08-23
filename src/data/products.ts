export interface ProductColor {
  name: string;
  image: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  hiddenViews?: boolean[];
  description: string;
  subtitle?: string;
  brand?: string;
  specifications?: Record<string, string>;
  policies?: string[];
  badge?: string;
  festivalOffer?: {
    isActive: boolean;
    code: string;
    discountPercentage: number;
    endDate: string;
  };
  itemCode?: string;
  purchasePrice?: number;
  wishlistCount?: number;
  bestseller?: boolean;
  stock?: number;
  colors?: ProductColor[];
  sizes?: string[];
  sizeImages?: Record<string, string>;
  sizeStock?: Record<string, number>;
  sizeQuantity?: Record<string, number>;
}

export const products: Product[] = [
  // SAREES
  {
    slug: "royal-kanjeevaram-bridal-silk-saree",
    name: "Royal Kanjeevaram Gold Zari Bridal Silk Saree",
    category: "Sarees",
    subcategory: "Kanjeevaram Silk",
    price: 4999,
    originalPrice: 8499,
    image: "/saree-studio-hero.jpg",
    images: ["/saree-studio-hero.jpg", "/saree-studio-card-2.jpg"],
    description: "Handcrafted pure Kanjeevaram silk saree featuring intricate gold zari weave, traditional temple border, and rich pallu finish.",
    itemCode: "LSS-KANJEE-01",
    stock: 12,
    bestseller: true
  },
  {
    slug: "banarasi-pure-zari-weave-saree",
    name: "Pure Banarasi Crimson Red Zari Silk Saree",
    category: "Sarees",
    subcategory: "Banarasi Silk",
    price: 3899,
    originalPrice: 6299,
    image: "/saree-studio-card-2.jpg",
    images: ["/saree-studio-card-2.jpg", "/saree-studio-hero.jpg"],
    description: "Exquisite Banarasi crimson red silk saree with authentic antique zari brocade motifs and hand-woven pallu detail.",
    itemCode: "LSS-BANARASI-02",
    stock: 8,
    bestseller: true
  },
  {
    slug: "soft-silk-mysore-festive-saree",
    name: "Soft Mysore Silk Pastel Festive Saree",
    category: "Sarees",
    subcategory: "Soft Silk",
    price: 2499,
    originalPrice: 4199,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=cover",
    description: "Lightweight and breathable soft silk saree designed for effortless draping and full-day festive celebrations.",
    itemCode: "LSS-SOFTSILK-03",
    stock: 15,
    bestseller: false
  },
  {
    slug: "organza-sheer-designer-floral-saree",
    name: "Organza Sheer Floral Designer Saree",
    category: "Sarees",
    subcategory: "Organza",
    price: 2999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=cover",
    description: "Modern sheer organza saree with delicate hand-painted floral accents and silver scalloped border.",
    itemCode: "LSS-ORGANZA-04",
    stock: 10,
    bestseller: true
  },
  {
    slug: "chanderi-handloom-cotton-saree",
    name: "Chanderi Handloom Cotton Silk Saree",
    category: "Sarees",
    subcategory: "Chanderi",
    price: 1899,
    originalPrice: 3199,
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=cover",
    description: "Traditional Chanderi handloom cotton silk saree with delicate zari motifs and lightweight comfort.",
    itemCode: "LSS-CHANDERI-05",
    stock: 14,
    bestseller: false
  },

  // JEWELLERY
  {
    slug: "antique-temple-gold-choker-set",
    name: "Antique Matte Gold Finish Temple Choker Set",
    category: "Jewellery",
    subcategory: "Temple Jewellery",
    price: 1899,
    originalPrice: 3299,
    image: "/jewellery-studio-hero-2.jpg",
    images: ["/jewellery-studio-hero-2.jpg"],
    description: "Heirloom-inspired antique temple choker set with matching statement jhumkas and intricate divine motif detailing.",
    itemCode: "LSJ-TEMPLE-01",
    stock: 10,
    bestseller: true
  },
  {
    slug: "kundan-polki-royal-necklace-set",
    name: "Royal Kundan & Pearl Heritage Choker Set",
    category: "Jewellery",
    subcategory: "Kundan & Polki",
    price: 2299,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=cover",
    description: "Premium Kundan and cultured freshwater pearl necklace set paired with elegant drop earrings.",
    itemCode: "LSJ-KUNDAN-02",
    stock: 7,
    bestseller: true
  },
  {
    slug: "oxidised-silver-jhumka-earring-set",
    name: "Oxidised Silver Statement Jhumka Earring Set",
    category: "Jewellery",
    subcategory: "Earrings & Jhumkas",
    price: 899,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=cover",
    description: "Handcrafted oxidised silver dome jhumkas featuring delicate floral carving and light chime drops.",
    itemCode: "LSJ-SILVER-03",
    stock: 20,
    bestseller: false
  },

  // SCOOPS
  {
    slug: "pearl-accent-festive-scoop-set",
    name: "Pearl & Floral Accent Designer Scoop Combo",
    category: "Scoops",
    subcategory: "Pearl Scoops",
    price: 699,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=cover",
    description: "Curated pearl and floral accent scoop combo designed to enhance saree drape styling and gift hampers.",
    itemCode: "LSC-PEARL-01",
    stock: 18,
    bestseller: true
  },
  {
    slug: "large-festive-gift-scoop-pack",
    name: "Large Festive Handcrafted Scoop Gift Pack",
    category: "Scoops",
    subcategory: "Large Scoops",
    price: 999,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=800&auto=format&fit=cover",
    description: "Exclusive large festive scoop set containing handcrafted fabric accents, golden pin clips, and decorative ties.",
    itemCode: "LSC-LARGE-02",
    stock: 14,
    bestseller: true
  }
];
