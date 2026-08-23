import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useInventory } from "@/context/InventoryContext";
import ProductCard from "@/components/ProductCard";
import { Filter, SlidersHorizontal, Grid, Search, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Shop() {
  const { products } = useInventory();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [category, setCategory] = useState<string>("All");
  const [searchVal, setSearchVal] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Sync state with SearchParams URL
  useEffect(() => {
    const cat = searchParams.get("category");
    const search = searchParams.get("search");
    const pMin = searchParams.get("minPrice");
    const pMax = searchParams.get("maxPrice");

    if (cat) setCategory(cat);
    else setCategory("All");

    if (search) setSearchVal(search);
    else setSearchVal("");

    if (pMin) setMinPrice(pMin);
    else setMinPrice("");

    if (pMax) setMaxPrice(pMax);
    else setMaxPrice("");
  }, [searchParams]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    updateParam("category", newCat === "All" ? "" : newCat);
  };

  const handleClearAll = () => {
    setSearchParams({});
    setCategory("All");
    setSearchVal("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  };

  // Filter computation
  const filteredProducts = products.filter((p) => {
    // Category match
    if (category !== "All" && p.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    // Search match
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase().trim();
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesCat = p.category.toLowerCase().includes(q);
      const matchesDesc = p.description.toLowerCase().includes(q);
      const matchesCode = p.itemCode ? p.itemCode.toLowerCase().includes(q) : false;
      if (!matchesName && !matchesCat && !matchesDesc && !matchesCode) {
        return false;
      }
    }
    // Price match
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;

    return true;
  });

  // Sort computation
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0; // Default sorting (newest first based on array layout)
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f5]/50 via-white to-[#fdf0f5]/30 pb-24 pt-16 md:pt-20 text-left">
      <div className="max-w-[1440px] mx-auto px-4">
        




        {/* Subcategories Banner Section */}
        {(category === "All" || category === "Sarees") && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#4A0E17] flex items-center gap-2">
                <span>SAREE COLLECTIONS</span>
                <div className="h-0.5 bg-[#4A0E17]/20 w-16 sm:w-28 rounded-full hidden sm:block" />
              </h3>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                12 Categories
              </span>
            </div>
            
            <div className="grid grid-rows-2 grid-flow-col auto-cols-[140px] sm:auto-cols-[175px] md:auto-cols-[210px] lg:auto-cols-[230px] overflow-x-auto gap-3 sm:gap-3.5 pb-3 scrollbar-none snap-x">
              {[
                { name: "Kanjeevaram", img: "/saree-studio-hero.jpg", search: "Kanjeevaram" },
                { name: "Banarasi", img: "/saree-studio-card-2.jpg", search: "Banarasi" },
                { name: "Soft Silk", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=cover", search: "Soft Silk" },
                { name: "Organza", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=cover", search: "Organza" },
                { name: "Chanderi", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=400&auto=format&fit=cover", search: "Chanderi" },
                { name: "Bridal Zari", img: "/saree-studio-hero.jpg", search: "Bridal" },
                { name: "Partywear", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=cover", search: "Partywear" },
                { name: "Tussar Silk", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=400&auto=format&fit=cover", search: "Tussar" },
                { name: "Mysore Silk", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=cover", search: "Mysore" },
                { name: "Linen Cotton", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=400&auto=format&fit=cover", search: "Linen" },
                { name: "Georgette", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=cover", search: "Georgette" },
                { name: "Paithani", img: "/saree-studio-card-2.jpg", search: "Paithani" }
              ].map((subCat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleCategoryChange("Sarees");
                    updateParam("search", subCat.search);
                  }}
                  className="group relative overflow-hidden rounded-[4px] border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-end text-left cursor-pointer w-full h-36 sm:h-44 md:h-48 snap-start"
                >
                  {/* Full-bleed picture filling the ENTIRE box */}
                  <img 
                    src={subCat.img} 
                    alt={subCat.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* Gradient shadow overlay for crystal-clear readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Text content rendered ON TOP of the picture */}
                  <div className="relative z-10 p-2.5 sm:p-3">
                    <span className="inline-block px-2 py-0.5 rounded-[4px] bg-black/40 backdrop-blur-md border border-[#F8BBD0]/50 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#F8BBD0] mb-1 shadow-2xs">
                      SAREE EDIT
                    </span>
                    <span className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide block leading-tight drop-shadow-xs">
                      {subCat.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Low-Height Sleek Separation Banner (Signature Pink Shade) */}
        <div className="mb-6 bg-gradient-to-r from-[#fdf0f5] via-[#fce4ec] to-[#fdf0f5] text-[#4A0E17] px-4 sm:px-6 py-2.5 rounded-[4px] border border-[#F8BBD0] shadow-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-serif font-extrabold tracking-wider uppercase text-[#4A0E17]">
              EXPLORE ALL HANDPICKED SAREE CATALOGUE
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-[#6b1422]">
            <span>100% Authentic Handloom Silk</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Express WhatsApp Ordering</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 bg-white p-6 rounded-[24px] border border-[#F8BBD0]/60 shadow-xs space-y-6 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8BBD0]/40">
              <span className="text-xs font-black uppercase tracking-widest text-[#4A0E17] flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#4A0E17]" /> Filters
              </span>
              <button onClick={handleClearAll} className="text-[10px] font-bold text-stone-500 hover:text-[#4A0E17] uppercase tracking-wider">
                Clear All
              </button>
            </div>

            {/* Price filter input */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">Price Band (₹)</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); updateParam("minPrice", e.target.value); }}
                  className="w-full bg-[#fdf0f5]/50 border border-[#F8BBD0]/60 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] text-stone-900"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); updateParam("maxPrice", e.target.value); }}
                  className="w-full bg-[#fdf0f5]/50 border border-[#F8BBD0]/60 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] text-stone-900"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "< 2k", max: "2000" },
                  { label: "2k - 5k", min: "2000", max: "5000" },
                  { label: "5k - 8k", min: "5000", max: "8000" },
                  { label: "> 8k", min: "8000" }
                ].map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMinPrice(range.min || "");
                      setMaxPrice(range.max || "");
                      updateParam("minPrice", range.min || "");
                      updateParam("maxPrice", range.max || "");
                    }}
                    className="text-[10px] font-bold px-2.5 py-1 bg-[#fdf0f5] hover:bg-[#4A0E17] hover:text-white text-[#4A0E17] rounded-full border border-[#F8BBD0]/60 transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-3 pt-3 border-t border-[#F8BBD0]/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#fdf0f5]/50 border border-[#F8BBD0]/60 rounded-xl px-3 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0]"
              >
                <option value="default">Newest Uploads</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A-Z</option>
              </select>
            </div>
          </aside>

          {/* Main Grid Section */}
          <div className="flex-1 w-full space-y-4">
            
            {/* Mobile filter bar */}
            <div className="lg:hidden bg-white p-3 rounded-2xl border border-[#F8BBD0]/60 shadow-xs flex items-center justify-between">
              <button 
                onClick={() => setShowFiltersMobile(true)}
                className="flex items-center gap-1.5 bg-[#fdf0f5] border border-[#F8BBD0] px-4 py-2 rounded-xl text-xs font-bold text-[#4A0E17]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#fdf0f5]/60 border border-[#F8BBD0]/60 rounded-xl px-3 py-2 text-xs text-stone-800"
              >
                <option value="default">Newest Uploads</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A-Z</option>
              </select>
            </div>

            {/* Products grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {sortedProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-b from-white to-[#fdf0f5]/40 p-12 rounded-[28px] border border-[#F8BBD0]/60 shadow-xs text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#fdf0f5] flex items-center justify-center border border-[#F8BBD0]/60">
                  <Grid className="w-6 h-6 text-[#4A0E17]" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#4A0E17] tracking-wide">No Products Found</h3>
                  <p className="text-xs font-medium text-stone-500 mt-1 max-w-[280px] mx-auto">Try clearing your filters or checking back later for fresh updates.</p>
                </div>
                <button onClick={handleClearAll} className="px-6 py-2.5 bg-[#4A0E17] hover:bg-[#380A11] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Modal Panel */}
      {showFiltersMobile && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setShowFiltersMobile(false)} />
          <div className="relative w-80 h-full bg-white p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F8BBD0]/40">
                <span className="text-xs font-black uppercase tracking-widest text-[#4A0E17] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </span>
                <button 
                  onClick={() => setShowFiltersMobile(false)}
                  className="w-7 h-7 rounded-full bg-[#fdf0f5] flex items-center justify-center text-[#4A0E17]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price filter input */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">Price Band (₹)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); updateParam("minPrice", e.target.value); }}
                    className="w-full bg-[#fdf0f5]/50 border border-[#F8BBD0]/60 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); updateParam("maxPrice", e.target.value); }}
                    className="w-full bg-[#fdf0f5]/50 border border-[#F8BBD0]/60 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#F8BBD0]/40 pt-4">
              <button 
                onClick={() => { handleClearAll(); setShowFiltersMobile(false); }}
                className="py-2.5 bg-[#fdf0f5] text-[#4A0E17] text-xs font-bold rounded-full uppercase tracking-wider text-center border border-[#F8BBD0]"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowFiltersMobile(false)}
                className="py-2.5 bg-[#4A0E17] text-white text-xs font-bold rounded-full uppercase tracking-wider text-center shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
