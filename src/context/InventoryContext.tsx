import React, { createContext, useContext, useEffect, useState } from "react";
import { products as initialProducts, type Product } from "@/data/products";
import { fetchProductsFromAPI, upsertProductsToAPI, deleteProductsFromAPI } from "@/lib/api";

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (slug: string) => void;
  deleteMultipleProducts: (slugs: string[]) => void;
  updateStock: (slug: string, newStock: number) => void;
  resetInventory: () => void;
  lowStockItemsCount: number;
  totalStockValue: number;
}

const STORAGE_KEY = "lscollections_inventory_v3";

const seedStock = (items: Product[]): Product[] => {
  return items.map((item, idx) => ({
    ...item,
    stock: item.stock ?? (item.badge === "sold-out" ? 0 : 12 - (idx % 7)),
  }));
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved inventory", e);
        }
      }
    }
    return seedStock(initialProducts);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Sync with MongoDB API
  useEffect(() => {
    const fetchFromMongoDB = async () => {
      try {
        const data = await fetchProductsFromAPI();
        if (Array.isArray(data) && data.length > 0) {
          const savedLocal = localStorage.getItem(STORAGE_KEY);
          const localProducts: Product[] = savedLocal ? JSON.parse(savedLocal) : [];

          const mapped: Product[] = data.map((row: any) => {
            const localP = localProducts.find(lp => lp.slug === row.id);
            const extraData = row.size_images || {};
            return {
              slug: row.id,
              name: row.name,
              category: row.category,
              subcategory: extraData._subcategory || localP?.subcategory || undefined,
              price: Number(row.price),
              originalPrice: row.original_price ? Number(row.original_price) : undefined,
              image: row.image,
              images: extraData._images || localP?.images || [],
              hiddenViews: extraData._hiddenViews || localP?.hiddenViews || [false, false, false, false],
              description: row.description || "",
              subtitle: extraData._subtitle || localP?.subtitle || undefined,
              brand: extraData._brand || localP?.brand || undefined,
              specifications: extraData._specifications || localP?.specifications || undefined,
              policies: extraData._policies || localP?.policies || undefined,
              badge: extraData._badge || localP?.badge || undefined,
              festivalOffer: extraData._festivalOffer || localP?.festivalOffer || undefined,
              itemCode: extraData._itemCode || localP?.itemCode || undefined,
              purchasePrice: extraData._purchasePrice !== undefined && extraData._purchasePrice !== null ? Number(extraData._purchasePrice) : (localP?.purchasePrice || undefined),
              wishlistCount: extraData._wishlistCount || localP?.wishlistCount || 0,
              bestseller: row.is_bestseller || false,
              stock: extraData._stock !== undefined ? Number(extraData._stock) : (localP?.stock ?? (row.in_stock ? 10 : 0)),
              colors: row.colors || [],
              sizes: row.sizes || [],
              sizeImages: extraData._realSizeImages || row.size_images || {},
              sizeStock: extraData._sizeStock || {},
              sizeQuantity: extraData._sizeQuantity || {},
            };
          });

          setProducts(mapped);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        } else if (Array.isArray(data) && data.length === 0) {
          // MongoDB is online but empty, seed it with initial items!
          console.info("[InventoryContext] Database is empty, seeding defaults...");
          const dbItems = products.map(formatProductForDB);
          await upsertProductsToAPI(dbItems);
        }
      } catch (err) {
        console.warn("Using local cache fallback for inventory:", err);
      }
    };

    fetchFromMongoDB();
    const interval = setInterval(fetchFromMongoDB, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatProductForDB = (p: Product) => ({
    id: p.slug || p.itemCode || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${Date.now()}`),
    name: p.name,
    category: p.category,
    price: p.price,
    original_price: p.originalPrice || null,
    image: p.image,
    description: p.description || "",
    is_bestseller: p.bestseller || false,
    in_stock: (p.stock ?? 1) > 0,
    colors: (p.colors || []).map(c => typeof c === 'string' ? c : c.name),
    sizes: p.sizes || [],
    size_images: {
      _realSizeImages: p.sizeImages || {},
      _sizeStock: p.sizeStock || {},
      _sizeQuantity: p.sizeQuantity || {},
      _images: p.images || [],
      _hiddenViews: p.hiddenViews || [false, false, false, false],
      _subcategory: p.subcategory || null,
      _subtitle: p.subtitle || null,
      _brand: p.brand || null,
      _specifications: p.specifications || null,
      _policies: p.policies || null,
      _badge: p.badge || null,
      _festivalOffer: p.festivalOffer || null,
      _itemCode: p.itemCode || null,
      _purchasePrice: p.purchasePrice !== undefined ? p.purchasePrice : null,
      _stock: p.stock !== undefined ? p.stock : 10,
      _wishlistCount: p.wishlistCount || 0,
    },
  });

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    upsertProductsToAPI([formatProductForDB(newProduct)]).catch((error) => {
      console.warn("MongoDB add sync failed:", error);
    });
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.slug === updated.slug ? updated : p))
    );
    upsertProductsToAPI([formatProductForDB(updated)]).catch((error) => {
      console.warn("MongoDB update sync failed:", error);
    });
  };

  const deleteProduct = (slug: string) => {
    setProducts((prev) => prev.filter((p) => p.slug !== slug));
    deleteProductsFromAPI([slug]).catch((error) => {
      console.warn("MongoDB delete sync failed:", error);
    });
  };

  const deleteMultipleProducts = (slugs: string[]) => {
    setProducts((prev) => prev.filter((p) => !slugs.includes(p.slug)));
    deleteProductsFromAPI(slugs).catch((error) => {
      console.warn("MongoDB bulk delete sync failed:", error);
    });
  };

  const updateStock = (slug: string, newStock: number) => {
    const validatedStock = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const badge = validatedStock === 0 ? "sold-out" : p.badge === "sold-out" ? undefined : p.badge;
          const updated = { ...p, stock: validatedStock, badge };
          upsertProductsToAPI([formatProductForDB(updated)]).catch((err) => {
            console.warn("MongoDB stock update error:", err);
          });
          return updated;
        }
        return p;
      })
    );
  };

  const resetInventory = async () => {
    const seeded = seedStock(initialProducts);
    setProducts(seeded);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    try {
      const dbItems = seeded.map(formatProductForDB);
      await upsertProductsToAPI(dbItems);
    } catch (err) {
      console.error("Error during MongoDB reset:", err);
    }
  };

  const lowStockItemsCount = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5).length;
  const totalStockValue = products.reduce((acc, p) => acc + p.price * (p.stock ?? 0), 0);

  return (
    <InventoryContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteMultipleProducts,
        updateStock,
        resetInventory,
        lowStockItemsCount,
        totalStockValue,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
