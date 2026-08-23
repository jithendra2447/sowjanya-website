import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function Wishlist() {
  const { items, toggle } = useWishlist();

  const handleRemove = (item: any) => {
    toggle(item);
    toast.success("Product removed from wishlist");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 pt-28 md:pt-36 text-left">
      <div className="max-w-[1440px] mx-auto px-4">
        
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase tracking-wide mb-6">
          Your Saved Items
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {items.map((item) => (
              <div 
                key={item.slug}
                className="group flex flex-col justify-between bg-white p-2 sm:p-3 rounded-[24px] neuo-flat transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-stone-50 border shrink-0">
                  <Link to={`/product/${item.slug}`} className="w-full h-full block">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <button
                    onClick={() => handleRemove(item)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-md text-stone-500 hover:text-red-500 active:scale-90 transition-all z-10 cursor-pointer"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col flex-1 justify-between pt-3 px-1">
                  <div>
                    <Link to={`/product/${item.slug}`} className="block">
                      <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 text-left line-clamp-1 mt-0.5 hover:text-brand-dark transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-50">
                    <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>

                    <Link
                      to={`/product/${item.slug}`}
                      className="px-3.5 py-1.5 rounded-full bg-[#120e17] text-white flex items-center gap-1.5 text-[9px] font-extrabold uppercase shadow-md hover:bg-[#2d1c3d]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>View Detail</span>
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-[32px] neuo-flat border border-white text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 shadow-inner">
              <Heart className="w-7 h-7 text-stone-300" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Wishlist is empty</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-[280px] mx-auto font-medium">Flag items you love and they will show up here.</p>
            </div>
            <Link to="/shop" className="px-6 py-2.5 bg-brand-dark text-white text-xs font-extrabold uppercase rounded-full shadow-md">
              Start Exploring
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
