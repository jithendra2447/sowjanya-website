import React, { createContext, useContext, useState, useEffect } from "react";

export interface WishlistItem {
  slug: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (slug: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lsc_wishlist");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("lsc_wishlist", JSON.stringify(items));
  }, [items]);

  const toggle = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.slug === item.slug);
      if (exists) {
        return prev.filter((i) => i.slug !== item.slug);
      }
      return [...prev, item];
    });
  };

  const has = (slug: string) => items.some((i) => i.slug === slug);
  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggle, has, count }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
