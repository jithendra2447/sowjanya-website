import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Heart, User, ChevronDown, Search, ArrowRight, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useInventory } from "@/context/InventoryContext";
import { usePageCms } from "@/hooks/usePageCms";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Header() {
  const { items, totalItems, updateQuantity, removeItem, subtotal } = useCart();
  const { count: wishCount } = useWishlist();
  const { products } = useInventory();
  const { pageCms } = usePageCms();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const cartDrawerRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const announcement = pageCms.announcement || {};

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchFocused(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCartDrawerOpen(false);
    setShowSearchModal(false);
  }, [pathname]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (cartDrawerRef.current && !cartDrawerRef.current.contains(event.target as Node)) {
        const toggleBtn = document.getElementById("cart-toggle-btn");
        const bottomCartBtn = document.getElementById("bottom-cart-btn");
        if (toggleBtn?.contains(event.target as Node) || bottomCartBtn?.contains(event.target as Node)) return;
        setCartDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSearchProducts = searchQuery.trim()
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase().trim();
          return (
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.itemCode && p.itemCode.toLowerCase().includes(q))
          );
        })
        .slice(0, 6)
    : [];

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-stone-200/80 shadow-xs")}>
        
        {/* Top Announcement Bar (Half Height on Mobile) */}
        {announcement.showAnnouncement !== false && (
          <div className="bg-brand-dark text-brand-pastel-pink text-[9px] sm:text-xs py-0.5 sm:py-2 px-3 sm:px-4 text-center border-b border-stone-100/10 font-medium leading-tight">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
              <span className="hidden sm:inline-block font-extrabold uppercase bg-brand-pastel-pink text-brand-dark px-2 py-0.5 rounded-full text-[9px]">
                {announcement.badgeText || "OFFER"}
              </span>
              <p className="truncate flex-1">{announcement.announcementText1 || "Free Shipping across India on all orders!"}</p>
              <a 
                href={buildWhatsAppUrl("Hello, I need help ordering.")} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold hover:underline shrink-0 text-[9px] sm:text-xs"
              >
                {announcement.assistancePhone || "+91 86398 76898"}
              </a>
            </div>
          </div>
        )}

        {/* Navbar (Compact Padding on Mobile) */}
        <div className="flex items-center justify-between px-3 sm:px-8 py-2 sm:py-3.5 max-w-[1600px] mx-auto">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 pr-4">
            <span className="text-xl font-extrabold tracking-tight text-brand-dark transition-transform group-hover:scale-105 font-serif">
              LS Collections
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-700">
            <Link to="/shop?category=Sarees" className={cn("hover:text-brand-dark transition-colors", pathname.includes("Sarees") && "text-brand-dark")}>
              Sarees
            </Link>
            <Link to="/shop?category=Jewellery" className={cn("hover:text-brand-dark transition-colors", pathname.includes("Jewellery") && "text-brand-dark")}>
              Jewellery
            </Link>
            <Link to="/shop?category=Scoops" className={cn("hover:text-brand-dark transition-colors", pathname.includes("Scoops") && "text-brand-dark")}>
              Scoops
            </Link>
            <Link to="/shop" className={cn("hover:text-brand-dark transition-colors", pathname === "/shop" && "text-brand-dark")}>
              Shop All
            </Link>
            <Link to="/about" className={cn("hover:text-brand-dark transition-colors", pathname === "/about" && "text-brand-dark")}>
              About
            </Link>
            <Link to="/contact" className={cn("hover:text-brand-dark transition-colors", pathname === "/contact" && "text-brand-dark")}>
              Contact
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            
            {/* Search Input Bar (Desktop) */}
            <div ref={searchContainerRef} className="relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search sarees, jewellery..."
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 py-1.5 bg-stone-100 text-stone-900 text-xs rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink focus:bg-white w-48 sm:w-60 transition-all"
                />
              </form>

              {/* Desktop Live Search Dropdown */}
              {searchFocused && searchQuery.trim() && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-stone-200 shadow-2xl rounded-2xl overflow-hidden z-50 text-left">
                  <div className="p-3 bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-500">
                    SEARCH RESULTS ({filteredSearchProducts.length})
                  </div>
                  {filteredSearchProducts.length > 0 ? (
                    <div className="divide-y divide-stone-100 max-h-[300px] overflow-y-auto">
                      {filteredSearchProducts.map((p) => (
                        <Link
                          key={p.slug}
                          to={`/product/${p.slug}`}
                          onClick={() => setSearchFocused(false)}
                          className="p-3 flex items-center gap-3 hover:bg-stone-50 transition-colors"
                        >
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate">{p.name}</p>
                            <p className="text-[10px] text-stone-500">{p.category} • ₹{p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-stone-400">No products found.</div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Action Icons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/wishlist" className="relative p-1 text-stone-600 hover:text-brand-dark transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                    {wishCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="p-1 text-stone-600 hover:text-brand-dark transition-colors" aria-label="Profile">
                <User className="w-5 h-5" />
              </Link>
              <button 
                id="cart-toggle-btn"
                onClick={() => setCartDrawerOpen(!cartDrawerOpen)} 
                className="relative p-1 text-stone-600 hover:text-brand-dark transition-colors cursor-pointer" 
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-dark text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Header Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              <button 
                onClick={() => setShowSearchModal(true)} 
                className="p-1 text-stone-700" 
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setMobileOpen(!mobileOpen)} 
                className="p-1 text-stone-700" 
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Search Overlay Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-10 px-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-4 shadow-2xl relative animate-in slide-in-from-top-4 duration-300">
              <button 
                onClick={() => setShowSearchModal(false)}
                className="absolute right-4 top-4 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-bold text-stone-900 mb-3 text-left">Search LS Collections</h3>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search sarees, jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-100 text-stone-900 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink focus:bg-white"
                />
              </form>

              {searchQuery.trim() && (
                <div className="mt-3 max-h-[60vh] overflow-y-auto divide-y divide-stone-50 text-left">
                  {filteredSearchProducts.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/product/${p.slug}`}
                      onClick={() => setShowSearchModal(false)}
                      className="py-2.5 flex items-center gap-3 hover:bg-stone-50"
                    >
                      <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-lg border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-stone-500">₹{p.price}</p>
                      </div>
                    </Link>
                  ))}
                  {filteredSearchProducts.length === 0 && (
                    <p className="text-xs text-stone-400 text-center py-4">No results found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Expanded Navigation Panel */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-stone-200 bg-white px-5 py-6 space-y-4 text-left shadow-lg animate-in slide-in-from-top-2">
            <Link to="/shop?category=Sarees" className="block text-base font-bold text-stone-900 border-b border-stone-50 pb-2">
              Sarees Collection
            </Link>
            <Link to="/shop?category=Jewellery" className="block text-base font-bold text-stone-900 border-b border-stone-50 pb-2">
              Jewellery Collection
            </Link>
            <Link to="/shop?category=Scoops" className="block text-base font-bold text-stone-900 border-b border-stone-50 pb-2">
              Scoops & Accents
            </Link>
            <Link to="/shop" className="block text-base font-bold text-stone-700">
              Shop All
            </Link>
            <Link to="/about" className="block text-base font-bold text-stone-700">
              Our Story
            </Link>
            <Link to="/contact" className="block text-base font-bold text-stone-700">
              Contact Store
            </Link>
          </nav>
        )}

        {/* Infinite Scrolling Promo Banner */}
        <div className="w-full bg-[#F8BBD0] text-[#4A0E17] py-5 overflow-hidden border-t border-[#4A0E17]/10 shadow-xs">
          <div className="relative w-full flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-xs sm:text-sm font-bold uppercase tracking-widest">
              <span>Use Code <strong className="font-extrabold bg-[#4A0E17] text-white px-2.5 py-0.5 rounded-md">FESTIVE10</strong> for 10% OFF at Checkout!</span>
              <span>FREE EXPRESS SHIPPING ACROSS INDIA ON ALL ORDERS!</span>
              <span>WhatsApp Support Enabled: Order Directly via WhatsApp Chat!</span>
              <span>Handcrafted Pure Handloom Sarees & Premium Temple Jewellery!</span>
              {/* Duplicate the items for smooth infinite loop transition */}
              <span>Use Code <strong className="font-extrabold bg-[#4A0E17] text-white px-2.5 py-0.5 rounded-md">FESTIVE10</strong> for 10% OFF at Checkout!</span>
              <span>FREE EXPRESS SHIPPING ACROSS INDIA ON ALL ORDERS!</span>
              <span>WhatsApp Support Enabled: Order Directly via WhatsApp Chat!</span>
              <span>Handcrafted Pure Handloom Sarees & Premium Temple Jewellery!</span>
            </div>
          </div>
        </div>

      </header>

      {/* Floating Bottom Navigation Bar (Mobile View - Mockup screen 2 footer) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-lg md:hidden flex justify-around items-center py-2 pb-5 px-3">
        <Link to="/" className={cn("flex flex-col items-center gap-0.5 text-stone-500", pathname === "/" && "text-brand-dark")}>
          <span className={cn("px-4 py-1.5 rounded-full flex items-center justify-center font-bold text-xs gap-1.5 transition-all", pathname === "/" ? "bg-[#120e17] text-white" : "")}>
            Home
          </span>
        </Link>
        <button 
          onClick={() => setShowSearchModal(true)} 
          className="flex flex-col items-center p-2 text-stone-500 hover:text-brand-dark"
        >
          <Search className="w-5.5 h-5.5" />
        </button>
        <Link to="/wishlist" className={cn("relative p-2 text-stone-500 hover:text-brand-dark", pathname === "/wishlist" && "text-brand-dark")}>
          <Heart className="w-5.5 h-5.5" />
          {wishCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {wishCount}
            </span>
          )}
        </Link>
        <button 
          id="bottom-cart-btn"
          onClick={() => setCartDrawerOpen(true)}
          className="relative p-2 text-stone-500 hover:text-brand-dark cursor-pointer"
        >
          <ShoppingCart className="w-5.5 h-5.5" />
          {totalItems > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-brand-dark text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>
        <Link to="/profile" className={cn("p-2 text-stone-500 hover:text-brand-dark", pathname === "/profile" && "text-brand-dark")}>
          <User className="w-5.5 h-5.5" />
        </Link>
      </div>

      {/* Slide-over Cart Drawer (Interactive Cart Drawer - Neumorphic Style) */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs">
          
          {/* Backdrop click closer */}
          <div className="absolute inset-0" onClick={() => setCartDrawerOpen(false)} />

          {/* Drawer Panel */}
          <div 
            ref={cartDrawerRef}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300 border-l border-stone-200 text-left"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-dark" />
                <h2 className="text-base font-extrabold text-stone-900 uppercase tracking-wider">Your Shopping Bag</h2>
              </div>
              <button 
                onClick={() => setCartDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.slug} className="flex gap-4 p-3 rounded-2xl bg-stone-50/70 border border-stone-100 shadow-2xs">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                        {item.itemCode && <p className="text-[10px] text-stone-400 font-medium">Code: {item.itemCode}</p>}
                      </div>
                      
                      {/* Quantity & Price controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 rounded-full bg-white border border-stone-200 p-1">
                          <button 
                            onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3 text-stone-500" />
                          </button>
                          <span className="text-xs font-bold px-1 text-stone-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3 text-stone-500" />
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-stone-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Your Bag is Empty</h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-[200px] mx-auto">Add sarees and jewelry to start your collection.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setCartDrawerOpen(false);
                      navigate("/shop");
                    }}
                    className="px-6 py-2.5 bg-brand-dark hover:bg-[#2d1c3d] text-white text-xs font-extrabold rounded-full uppercase tracking-wider transition-colors shadow-md"
                  >
                    Shop Collection
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-500">Subtotal</span>
                  <span className="font-extrabold text-stone-900 text-base">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[10px] text-stone-400 font-medium leading-relaxed">Shipping and taxes are calculated at checkout. Orders can be completed securely via UPI/Card or WhatsApp COD.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold rounded-full uppercase tracking-wider text-center transition-colors"
                  >
                    View Bag
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="py-3 bg-[#120e17] hover:bg-[#2d1c3d] text-white text-xs font-extrabold rounded-full uppercase tracking-wider text-center transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </>
  );
}
