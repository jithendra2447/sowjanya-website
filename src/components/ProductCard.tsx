import { Link } from "react-router-dom";
import { useState } from "react";
import type { Product } from "@/data/products";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const saved = has(product.slug);

  const onHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
  };

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      itemCode: product.itemCode,
      baseSlug: product.slug
    });
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAdding(false), 500);
  };

  const isSoldOut = product.stock === 0;

  // Calculate savings and discount percentage
  const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
  const savings = originalPrice - product.price;
  const discountPercent = Math.round((savings / originalPrice) * 100);

  return (
    <div className="group flex flex-col justify-between bg-white rounded-[4px] border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden h-full text-left">
      
      <div>
        {/* Top Product Image Container (Compact Picture Height Aspect 4/3) */}
        <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden shrink-0">
          <Link to={`/product/${product.slug}`} className="w-full h-full block">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* Sold Out Tag Overlay */}
          {isSoldOut && (
            <span className="absolute top-2 left-2 text-[9px] font-extrabold tracking-wider bg-stone-950 text-white uppercase px-2 py-1 rounded-[4px] z-10 shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2.5 pb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A0E17]" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
        </div>

        {/* Two Buttons: WISHLIST and ADD TO CART */}
        <div className="px-3 grid grid-cols-2 gap-2">
          {/* 1. Wishlist Button */}
          <button
            onClick={onHeart}
            className={cn(
              "w-full border rounded-[4px] py-2 flex items-center justify-center gap-1.5 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-95",
              saved 
                ? "bg-[#fdf0f5] border-[#F8BBD0] text-[#4A0E17]" 
                : "bg-white border-[#F8BBD0] text-[#4A0E17] hover:bg-[#fdf0f5]"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5 transition-transform duration-300", saved ? "fill-[#4A0E17] text-[#4A0E17]" : "text-[#4A0E17]")} />
            <span>{saved ? "SAVED" : "WISHLIST"}</span>
          </button>

          {/* 2. Cart Button */}
          <button
            onClick={onAddToCart}
            disabled={isAdding || isSoldOut}
            className={cn(
              "w-full border rounded-[4px] py-2 flex items-center justify-center gap-1.5 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-md hover:scale-[1.02] active:scale-95",
              isSoldOut
                ? "bg-stone-200 border-stone-300 text-stone-500 cursor-not-allowed"
                : "bg-[#4A0E17] border-[#4A0E17] text-white hover:bg-[#6b1422] hover:border-[#6b1422]"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white transition-transform duration-300" />
            <span>{isAdding ? "ADDED" : isSoldOut ? "SOLD OUT" : "ADD TO CART"}</span>
          </button>
        </div>

        {/* Product Details Section */}
        <div className="p-3 space-y-1">
          {/* Product Name */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 hover:text-[#4A0E17] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Sizes Line */}
          <p className="text-xs text-stone-500 font-medium">
            Category: <span className="text-stone-700 font-semibold">{product.category}</span>
          </p>

          {/* Price Line: Rs. Format + Strikethrough + Discount Tag */}
          <div className="flex flex-wrap items-baseline gap-1.5 pt-1">
            <span className="text-sm sm:text-base font-extrabold text-stone-950">
              Rs. {product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-stone-400 font-normal line-through">
              Rs. {originalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-bold text-orange-500">
              ({discountPercent}% OFF)
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
