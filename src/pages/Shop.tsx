import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useInventory } from "@/context/InventoryContext";
import ProductCard from "@/components/ProductCard";
import { Filter, SlidersHorizontal, Grid, Search, X } from "lucide-react";
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
    <div className="min-h-screen bg-[#f0f2f5] pb-20 pt-28 md:pt-36 text-left">
      <div className="max-w-[1440px] mx-auto px-4">
        
        {/* Page Header Banner */}
        <div className="bg-white p-6 rounded-[32px] neuo-flat border border-white mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase tracking-wide">
                {category === "All" ? "Catalog Showcase" : `${category} Collection`}
              </h1>
              <p className="text-xs text-stone-400 font-medium mt-1">
                Explore our handpicked collection of premium sarees, gold matte temple jewellery, and accents.
              </p>
            </div>
            {searchVal && (
              <div className="flex items-center gap-2 bg-brand-pastel-pink/15 px-3.5 py-1.5 rounded-full border border-brand-pastel-pink/20">
                <span className="text-xs font-bold text-brand-dark">Search: "{searchVal}"</span>
                <button onClick={() => updateParam("search", "")} className="text-brand-dark hover:text-stone-900 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs Strip */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {["All", "Sarees", "Jewellery", "Scoops"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs border transition-all cursor-pointer whitespace-nowrap shrink-0",
                category === cat
                  ? "bg-[#120e17] text-white border-transparent"
                  : "bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 bg-white p-6 rounded-[32px] neuo-flat border border-white space-y-6 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dark flex items-center gap-1.5">
                <Filter className="w-4 h-4" /> Filters
              </span>
              <button onClick={handleClearAll} className="text-[10px] font-extrabold text-stone-400 hover:text-stone-900 uppercase">
                Clear All
              </button>
            </div>

            {/* Price filter input */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-800">Price Band (₹)</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); updateParam("minPrice", e.target.value); }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink text-stone-900"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); updateParam("maxPrice", e.target.value); }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink text-stone-900"
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
                    className="text-[10px] font-bold px-2.5 py-1 bg-stone-100 hover:bg-brand-pastel-pink/15 text-stone-600 rounded-full border border-stone-200"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-800">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
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
            <div className="lg:hidden bg-white p-3 rounded-2xl shadow-xs border border-stone-100 flex items-center justify-between">
              <button 
                onClick={() => setShowFiltersMobile(true)}
                className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-xs font-bold text-stone-700"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
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
              <div className="bg-white p-12 rounded-[32px] neuo-flat border border-white text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                  <Grid className="w-6 h-6 text-stone-300" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">No Products Found</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-[280px] mx-auto">Try clearing your filters or checking back later for fresh updates.</p>
                </div>
                <button onClick={handleClearAll} className="px-6 py-2.5 bg-brand-dark text-white text-xs font-extrabold uppercase rounded-full shadow-md">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Modal Panel */}
      {showFiltersMobile && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setShowFiltersMobile(false)} />
          <div className="relative w-80 h-full bg-white p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dark flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </span>
                <button 
                  onClick={() => setShowFiltersMobile(false)}
                  className="w-7 h-7 rounded-full bg-stone-50 flex items-center justify-center text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price filter input */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-800">Price Band (₹)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); updateParam("minPrice", e.target.value); }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink text-stone-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); updateParam("maxPrice", e.target.value); }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-4">
              <button 
                onClick={() => { handleClearAll(); setShowFiltersMobile(false); }}
                className="py-2.5 bg-stone-100 text-stone-700 text-xs font-extrabold rounded-full uppercase tracking-wider text-center"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowFiltersMobile(false)}
                className="py-2.5 bg-brand-dark text-white text-xs font-extrabold rounded-full uppercase tracking-wider text-center"
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
