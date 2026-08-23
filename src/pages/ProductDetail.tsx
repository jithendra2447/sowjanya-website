import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useInventory } from "@/context/InventoryContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingBag, Heart, Star, ChevronRight, MessageCircle, Truck, ShieldCheck, HeartCrack, ChevronLeft } from "lucide-react";
import { buildWhatsAppUrl, buildOrderMessage } from "@/lib/whatsapp";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products } = useInventory();
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();

  const product = products.find((p) => p.slug === slug);

  // States
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <HeartCrack className="w-12 h-12 text-stone-300 mb-4" />
        <h2 className="text-lg font-bold text-stone-800 uppercase tracking-wider">Product Not Found</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-[280px]">The product you are trying to view is either unavailable or has been archived.</p>
        <Link to="/shop" className="mt-5 px-6 py-2.5 bg-brand-dark text-white text-xs font-extrabold uppercase rounded-full shadow-md">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isSaved = has(product.slug);
  const isSoldOut = product.stock === 0;

  // Image collection
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const handleWishlistToggle = () => {
    toggle({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast.success(isSaved ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      itemCode: product.itemCode,
      baseSlug: product.slug,
      quantity
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyOnWhatsApp = () => {
    // Generate pre-filled order details
    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const orderMsg = buildOrderMessage(
      orderId,
      [{ ...product, quantity, baseSlug: product.slug }],
      product.price * quantity,
      { name: "Interested Customer", phone: "", address: "" }
    );
    const link = buildWhatsAppUrl(orderMsg);
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 pt-28 md:pt-36 text-left">
      <div className="max-w-[1440px] mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-semibold mb-6 px-1.5">
          <Link to="/" className="hover:text-brand-dark">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-brand-dark">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="bg-white rounded-[32px] neuo-flat border border-white p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            
            {/* Primary Display Frame */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shadow-inner group">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              {isSoldOut && (
                <span className="absolute top-4 left-4 bg-stone-900 text-white uppercase text-xs font-extrabold tracking-wider px-3 py-1 rounded-md shadow-lg">
                  Sold Out
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all",
                      activeImage === img ? "border-brand-dark" : "border-stone-200 hover:border-brand-pastel-pink"
                    )}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Actions Column */}
          <div className="flex flex-col justify-between space-y-6">
            
            {/* Description Card Header */}
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-brand-pastel-pink/20 text-brand-dark px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                {product.itemCode && (
                  <span className="text-[10px] font-bold text-stone-400">
                    CODE: {product.itemCode}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-950 mt-3 leading-tight">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-xs sm:text-sm font-semibold text-stone-400 mt-1">{product.subtitle}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5 bg-[#fffde7] px-2 py-0.5 rounded-full border border-yellow-200">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-stone-700">4.5</span>
                </div>
                <span className="text-xs text-stone-400 font-medium">(28 Customer Reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-extrabold text-stone-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-stone-400 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
                      ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Product description short */}
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mt-4">
                {product.description}
              </p>
            </div>

            {/* Custom selectors (Colors and Sizes) */}
            <div className="space-y-4 border-t border-stone-100 pt-4 text-xs font-bold">
              {/* Color swatch toggles */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-stone-400 uppercase tracking-wider block text-left">Color: {selectedColor}</span>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { setSelectedColor(c.name); setActiveImage(c.image); }}
                        className={cn(
                          "px-3 py-1.5 rounded-full border cursor-pointer hover:border-brand-dark transition-all",
                          selectedColor === c.name ? "border-brand-dark bg-[#120e17] text-white" : "border-stone-200 text-stone-700 bg-stone-50"
                        )}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size toggles */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-stone-400 uppercase tracking-wider block text-left">Size: {selectedSize}</span>
                  <div className="flex gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border cursor-pointer hover:border-brand-dark transition-all",
                          selectedSize === sz ? "border-brand-dark bg-[#120e17] text-white" : "border-stone-200 text-stone-700 bg-stone-50"
                        )}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selectors */}
              {!isSoldOut && (
                <div className="space-y-2">
                  <span className="text-stone-400 uppercase tracking-wider block text-left">Quantity</span>
                  <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-full w-28 p-1">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-6 h-6 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer">
                      -
                    </button>
                    <span className="flex-1 text-center font-extrabold text-stone-800">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock ?? 10, q + 1))} className="w-6 h-6 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer">
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action CTAs */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex gap-3">
                
                {/* Buy on WhatsApp Primary Button */}
                <button
                  onClick={handleBuyOnWhatsApp}
                  className="flex-1 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-full shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-5 h-5" fill="currentColor" />
                  <span>Buy via WhatsApp</span>
                </button>

                {/* Add to Bag Secondary Button */}
                {!isSoldOut && (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-[#120e17] hover:bg-[#2d1c3d] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-full shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-4.5 h-4.5" />
                    <span>Add to Bag</span>
                  </button>
                )}

                {/* Wishlist button */}
                <button
                  onClick={handleWishlistToggle}
                  className={cn(
                    "w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer",
                    isSaved ? "bg-red-50 text-red-500 border-red-200" : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-400"
                  )}
                  aria-label="Add to wishlist"
                >
                  <Heart className={cn("w-5 h-5", isSaved && "fill-red-500")} />
                </button>
              </div>

              {/* Shipping info lines */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 text-[10px] sm:text-xs font-bold text-stone-500">
                <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-stone-400" /> Free Shipping in India</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-stone-400" /> Handloom Quality Guaranteed</span>
              </div>
            </div>

            {/* Detailed Specs Tab */}
            <div className="pt-6 border-t border-stone-100">
              <div className="flex gap-4 border-b border-stone-100 text-xs font-extrabold uppercase tracking-wider pb-1 mb-4">
                <button
                  onClick={() => setActiveTab("details")}
                  className={cn("pb-2 transition-all cursor-pointer", activeTab === "details" ? "border-b-2 border-brand-dark text-stone-900" : "text-stone-400")}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={cn("pb-2 transition-all cursor-pointer", activeTab === "shipping" ? "border-b-2 border-brand-dark text-stone-900" : "text-stone-400")}
                >
                  Shipping & Return
                </button>
              </div>

              {activeTab === "details" ? (
                <div className="space-y-2 text-xs font-semibold text-stone-500">
                  {product.specifications ? (
                    <table className="w-full divide-y divide-stone-100">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key} className="py-2 flex justify-between border-b border-stone-50 last:border-0">
                            <td className="text-stone-400 font-bold uppercase tracking-wider py-1.5">{key}</td>
                            <td className="text-stone-900 py-1.5 text-right">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="leading-relaxed">This item is crafted from premium materials. Blouse pieces are included in sarees. Clean with care to maintain the fabric and metal brilliance.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5 text-xs text-stone-500 font-medium leading-relaxed">
                  <p>• We dispatch orders within 24-48 hours. Delivery takes 3-7 business days across India.</p>
                  <p>• Due to handloom weaves and photography, minor color or thread variations may occur.</p>
                  <p>• Returns accepted within 7 days of delivery only in case of transit damages or wrong items shipped. A package opening video is mandatory for claims.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Reviews Showcase component */}
        <section className="bg-white rounded-[32px] neuo-flat border border-white p-6 sm:p-8 mt-8 text-left">
          <h3 className="text-base font-extrabold text-brand-dark uppercase tracking-wider mb-6 pb-2 border-b border-stone-100">Customer Feedback</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-stone-900">Sowjanya Reddy</h4>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                </div>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-medium">"Extremely satisfied with the Kanjivaram saree. The maroon color is exactly as shown in the picture, and the gold zari border feels highly premium. Delivery was very fast too."</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-stone-900">Ananya P.</h4>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                </div>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-medium">"Ordered the temple necklace set. Plating finish matches 22k gold perfectly and the weight is very comfortable to wear. WhatsApp tracking support was super prompt."</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
