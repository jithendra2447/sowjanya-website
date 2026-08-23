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

export const products: Product[] = [];
