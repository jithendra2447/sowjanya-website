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

  return (
    <div className="group flex flex-col justify-between bg-white p-2 sm:p-3 rounded-[4px] border border-stone-200/80 shadow-xs transition-all duration-300 hover:-translate-y-1 relative overflow-hidden h-full">
      
      {/* Product Image Frame */}
      <div className="relative w-full aspect-[4/3] rounded-[4px] overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
        <Link to={`/product/${product.slug}`} className="w-full h-full block">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Heart Overlay */}
        <button
          onClick={onHeart}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 w-8 h-8 rounded-[4px] bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-md active:scale-90 transition-all z-10 cursor-pointer border border-stone-100"
        >
          <Heart className={cn("w-4 h-4 transition-colors", saved ? "fill-red-500 text-red-500" : "text-stone-500")} />
        </button>

        {/* Shop Button Overlay at Bottom Right */}
        {!isSoldOut && (
          <button
            onClick={onAddToCart}
            disabled={isAdding}
            className={cn(
              "absolute bottom-2 right-2 px-3 py-1.5 rounded-[4px] bg-[#4A0E17] text-white flex items-center gap-1.5 text-[10px] font-bold uppercase shadow-md active:scale-95 transition-all z-10 cursor-pointer hover:bg-[#380A11]"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdding ? "Adding..." : "Shop"}</span>
          </button>
        )}

        {isSoldOut && (
          <span className="absolute top-2 left-2 text-[9px] font-extrabold tracking-wider bg-stone-900 text-white uppercase px-2 py-0.5 rounded-[4px]">
            Sold Out
          </span>
        )}
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-1 justify-between pt-3 px-1">
        
        {/* Category & Title */}
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block text-left">
            {product.category}
          </span>
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 text-left line-clamp-1 mt-0.5 hover:text-brand-dark transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Star Rating Row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-50">
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-extrabold text-stone-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-[#fffde7] px-2 py-0.5 rounded-full border border-yellow-200">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold text-stone-700">4.5</span>
          </div>
        </div>

      </div>

    </div>
  );
}
