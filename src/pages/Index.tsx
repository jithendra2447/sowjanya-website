import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInventory } from "@/context/InventoryContext";
import { usePageCms } from "@/hooks/usePageCms";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles, Clock, Percent, ShieldCheck, Heart, RefreshCw, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function Index() {
  const { products } = useInventory();
  const { pageCms, loading } = usePageCms();
  const navigate = useNavigate();
  const homeCms = pageCms.home;

  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  // Urgency Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to 24h
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sareeScrollRef = useRef<HTMLDivElement>(null);
  const sareeCategoriesRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const [isCategoryHovered, setIsCategoryHovered] = useState(false);

  // Infinite Continuous Circular Marquee Auto-Scroll for Right Saree Categories Menu (Pauses on Mouse Hover)
  useEffect(() => {
    let animId: number;
    let lastTimestamp: number | null = null;
    const speedPixelsPerSec = 75; // Smooth continuous moving speed

    const step = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (sareeCategoriesRef.current && !isCategoryHovered) {
        const container = sareeCategoriesRef.current;
        container.scrollTop += (elapsed * speedPixelsPerSec) / 1000;

        // Seamless Infinite Loop Reset: when scrolled past half of duplicated content height
        const halfHeight = container.scrollHeight / 2;
        if (halfHeight > 0 && container.scrollTop >= halfHeight) {
          container.scrollTop -= halfHeight;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isCategoryHovered]);

  // Cursor Drag to Scroll Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sareeScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sareeScrollRef.current.offsetLeft);
    setScrollLeftState(sareeScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sareeScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - sareeScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    sareeScrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollSareeStrip = (direction: 'left' | 'right') => {
    if (sareeScrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      sareeScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Jewellery Studio State & Hooks
  const jewelleryScrollRef = useRef<HTMLDivElement>(null);
  const jewelleryCategoriesRef = useRef<HTMLDivElement>(null);
  const [isJewelleryDragging, setIsJewelleryDragging] = useState(false);
  const [jewelleryStartX, setJewelleryStartX] = useState(0);
  const [jewelleryScrollLeftState, setJewelleryScrollLeftState] = useState(0);
  const [isJewelleryHovered, setIsJewelleryHovered] = useState(false);

  useEffect(() => {
    let animId: number;
    let lastTimestamp: number | null = null;
    const speedPixelsPerSec = 75;

    const step = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (jewelleryCategoriesRef.current && !isJewelleryHovered) {
        const container = jewelleryCategoriesRef.current;
        container.scrollTop += (elapsed * speedPixelsPerSec) / 1000;

        const halfHeight = container.scrollHeight / 2;
        if (halfHeight > 0 && container.scrollTop >= halfHeight) {
          container.scrollTop -= halfHeight;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isJewelleryHovered]);

  const handleJewelleryMouseDown = (e: React.MouseEvent) => {
    if (!jewelleryScrollRef.current) return;
    setIsJewelleryDragging(true);
    setJewelleryStartX(e.pageX - jewelleryScrollRef.current.offsetLeft);
    setJewelleryScrollLeftState(jewelleryScrollRef.current.scrollLeft);
  };

  const handleJewelleryMouseLeave = () => {
    setIsJewelleryDragging(false);
  };

  const handleJewelleryMouseUp = () => {
    setIsJewelleryDragging(false);
  };

  const handleJewelleryMouseMove = (e: React.MouseEvent) => {
    if (!isJewelleryDragging || !jewelleryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - jewelleryScrollRef.current.offsetLeft;
    const walk = (x - jewelleryStartX) * 1.8;
    jewelleryScrollRef.current.scrollLeft = jewelleryScrollLeftState - walk;
  };

  const scrollJewelleryStrip = (direction: 'left' | 'right') => {
    if (jewelleryScrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      jewelleryScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Scoops Studio State & Hooks
  const scoopsScrollRef = useRef<HTMLDivElement>(null);
  const scoopsCategoriesRef = useRef<HTMLDivElement>(null);
  const [isScoopsDragging, setIsScoopsDragging] = useState(false);
  const [scoopsStartX, setScoopsStartX] = useState(0);
  const [scoopsScrollLeftState, setScoopsScrollLeftState] = useState(0);
  const [isScoopsHovered, setIsScoopsHovered] = useState(false);

  useEffect(() => {
    let animId: number;
    let lastTimestamp: number | null = null;
    const speedPixelsPerSec = 75;

    const step = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (scoopsCategoriesRef.current && !isScoopsHovered) {
        const container = scoopsCategoriesRef.current;
        container.scrollTop += (elapsed * speedPixelsPerSec) / 1000;

        const halfHeight = container.scrollHeight / 2;
        if (halfHeight > 0 && container.scrollTop >= halfHeight) {
          container.scrollTop -= halfHeight;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isScoopsHovered]);

  const handleScoopsMouseDown = (e: React.MouseEvent) => {
    if (!scoopsScrollRef.current) return;
    setIsScoopsDragging(true);
    setScoopsStartX(e.pageX - scoopsScrollRef.current.offsetLeft);
    setScoopsScrollLeftState(scoopsScrollRef.current.scrollLeft);
  };

  const handleScoopsMouseLeave = () => {
    setIsScoopsDragging(false);
  };

  const handleScoopsMouseUp = () => {
    setIsScoopsDragging(false);
  };

  const handleScoopsMouseMove = (e: React.MouseEvent) => {
    if (!isScoopsDragging || !scoopsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scoopsScrollRef.current.offsetLeft;
    const walk = (x - scoopsStartX) * 1.8;
    scoopsScrollRef.current.scrollLeft = scoopsScrollLeftState - walk;
  };

  const scrollScoopsStrip = (direction: 'left' | 'right') => {
    if (scoopsScrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scoopsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const [activeEditorialSlide, setActiveEditorialSlide] = useState(0);
  const [activeSareeLuxuryIndex, setActiveSareeLuxuryIndex] = useState(0);

  const sareeLuxuryBanners = [
    {
      title: "ROYAL HERITAGE",
      offer: "Bridal & Festive Edit",
      tag: "EXQUISITE CRAFTSMANSHIP",
      img: "/saree-banner-2.jpg",
      link: "/shop?category=Sarees"
    },
    {
      title: "KALAMKARI",
      offer: "Hand-Printed Vintage Weaves",
      tag: "ARTISANAL VINTAGE DRAPES",
      img: "/saree-banner-1.jpg",
      link: "/shop?category=Sarees&search=Kalamkari"
    },
    {
      title: "ROYAL ARCHWAYS",
      offer: "Pure Silks & Handlooms",
      tag: "PALACE DRAPES",
      img: "/saree-banner-3.jpg",
      link: "/shop?category=Sarees"
    },
    {
      title: "KANJEEVARAM SILK",
      offer: "Royal Gold Zari Weaves",
      tag: "PURE HANDLOOM SILK",
      img: "/saree-banner-4.png",
      link: "/shop?category=Sarees&search=Kanjeevaram"
    },
    {
      title: "TEMPLE DRAPES",
      offer: "Special Festive Wear @ ₹1999",
      tag: "HERITAGE SAREES",
      img: "/saree-banner-5.jpg",
      link: "/shop?category=Sarees"
    }
  ];

  // Saree Luxury Banner Auto-scroll Timer
  useEffect(() => {
    const sareeTimer = setInterval(() => {
      setActiveSareeLuxuryIndex((prev) => (prev + 1) % sareeLuxuryBanners.length);
    }, 3500);
    return () => clearInterval(sareeTimer);
  }, [sareeLuxuryBanners.length]);



  const editorialSlides = [
    {
      id: 1,
      title: "ROYAL KANJEEVARAM",
      offer: "50-70% Off",
      category: "Sarees",
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=cover",
      badge: "LS COLLECTIONS"
    },
    {
      id: 2,
      title: "TEMPLE JEWELLERY",
      offer: "Flat 40% Off",
      category: "Jewellery",
      img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=cover",
      badge: "LS COLLECTIONS"
    },
    {
      id: 3,
      title: "BOUTIQUE SCOOPS",
      offer: "Starting @ ₹499",
      category: "Scoops",
      img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=cover",
      badge: "LS COLLECTIONS"
    }
  ];

  // Editorial Slider Auto-play Timer
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveEditorialSlide((prev) => (prev + 1) % editorialSlides.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [editorialSlides.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-brand-dark animate-spin" />
          <span className="text-sm font-bold text-stone-500">Loading catalog...</span>
        </div>
      </div>
    );
  }

  // Filter lists
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const newArrivals = products.slice(0, 4);

  // Price range navigation handler
  const handlePriceBandClick = (bandIndex: number) => {
    switch (bandIndex) {
      case 0: navigate("/shop?maxPrice=500"); break;
      case 1: navigate("/shop?maxPrice=1000"); break;
      case 2: navigate("/shop?maxPrice=1500"); break;
      case 3: navigate("/shop?maxPrice=2000"); break;
    }
  };

  const globalOffer = homeCms.globalOffer || { isActive: false, title: "", code: "", discountPercentage: 0, endDate: "" };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-0 pt-28 md:pt-36">
      
      {/* Urgency Promotion Code Banner */}
      {globalOffer.isActive && (
        <div className="max-w-[1440px] mx-auto px-4 mb-6">
          <div className="bg-gradient-to-r from-brand-pastel-pink via-brand-pastel-lavender to-brand-pastel-blue p-4 rounded-3xl shadow-sm border border-white flex flex-col md:flex-row items-center justify-between gap-4 text-stone-900">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                <Percent className="w-5 h-5 text-brand-dark" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider">{globalOffer.title || "FESTIVE SALE"}</h2>
                <p className="text-xs text-stone-700 font-medium">Use code <span className="font-extrabold text-brand-dark bg-white px-1.5 py-0.5 rounded-md">{globalOffer.code || "FESTIVE10"}</span> for extra discount at checkout.</p>
              </div>
            </div>
            
            {/* Real-time Ticking Countdown */}
            <div className="flex items-center gap-4 bg-white/60 px-4 py-2 rounded-2xl border border-white/80 font-mono text-xs font-bold text-brand-dark shrink-0">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-brand-dark animate-pulse" />
                <span>Ends In:</span>
              </div>
              <div className="flex gap-1.5 text-sm font-extrabold">
                <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
                <span>:</span>
                <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
                <span>:</span>
                <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom LS COLLECTIONS Hero Banner */}
      {homeCms.showHero !== false && (
        <section className="w-full mb-0 overflow-hidden">
          <div className="relative bg-[url('/home-bg.jpg')] bg-cover bg-no-repeat bg-center shadow-md pt-8 pb-8 px-4 sm:p-12 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 min-h-[380px] sm:min-h-[460px] w-full">
            
            {/* Left Column (Desktop) / Top Banner Copy (Mobile) */}
            <div className="text-center md:text-left max-w-2xl md:w-[58%] lg:w-[60%] space-y-4 md:space-y-7 z-10 w-full">
              <h1 className="text-2.5xl sm:text-4xl md:text-6xl lg:text-7xl font-sans font-extrabold leading-[1.2] md:leading-[1.18] text-[#4A0E17] tracking-tight md:tracking-normal">
                Timeless Elegance.
                <span className="block mt-1 text-[#2D1C3D] font-normal">Beautifully Yours.</span>
              </h1>
              <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-[#2D1C3D]/80 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                A curated collection of exquisite sarees and elegant jewellery for your special celebrations.
              </p>

              {/* CTA Action Buttons for DESKTOP */}
              <div className="hidden md:flex flex-wrap items-center justify-start gap-3.5 pt-2">
                <Link
                  to="/shop?category=Sarees"
                  className="group cursor-pointer inline-flex items-center justify-center bg-[#fdf0f5]/90 hover:bg-[#4A0E17] text-[#4A0E17] hover:text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl border border-[#F8BBD0] hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 ease-out backdrop-blur-xs shadow-xs hover:shadow-md gap-2 active:scale-95 shrink-0"
                >
                  <span>Shop Sarees</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4A0E17] group-hover:text-white transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/shop?category=Jewellery"
                  className="group cursor-pointer inline-flex items-center justify-center bg-[#fdf0f5]/90 hover:bg-[#4A0E17] text-[#4A0E17] hover:text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl border border-[#F8BBD0] hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 ease-out backdrop-blur-xs shadow-xs hover:shadow-md gap-2 active:scale-95 shrink-0"
                >
                  <span>Explore Jewellery</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4A0E17] group-hover:text-white transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/shop?category=Scoops"
                  className="group cursor-pointer inline-flex items-center justify-center bg-[#fdf0f5]/90 hover:bg-[#4A0E17] text-[#4A0E17] hover:text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl border border-[#F8BBD0] hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 ease-out backdrop-blur-xs shadow-xs hover:shadow-md gap-2 active:scale-95 shrink-0"
                >
                  <span>Scoops</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4A0E17] group-hover:text-white transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Slanted Model Frames (Right Column on Desktop / Centered in Middle on Mobile) */}
            <div className="md:w-[42%] lg:w-[40%] flex items-center justify-center gap-2.5 sm:gap-4 md:gap-5 overflow-visible py-2 md:py-4 shrink-0 z-10 w-full md:w-auto">
              {/* Card 1 */}
              <div className="relative rounded-[4px] overflow-hidden border-2 sm:border-4 border-white shadow-lg md:shadow-xl rotate-[-4deg] skew-x-[-1deg] w-20 h-44 sm:w-32 sm:h-64 md:w-36 md:h-72 lg:w-44 lg:h-[350px] shrink-0 transition-all duration-500 hover:scale-105 hover:rotate-[-2deg] bg-white cursor-pointer">
                <img 
                  src="/model-1.png" 
                  alt="LS Collections Model 1" 
                  className="w-full h-full object-cover object-bottom scale-110 translate-y-2 sm:translate-y-3" 
                />
              </div>
              
              {/* Card 2 */}
              <div className="relative rounded-[4px] overflow-hidden border-2 sm:border-4 border-white shadow-lg md:shadow-xl rotate-[2deg] skew-x-[1deg] w-20 h-44 sm:w-32 sm:h-64 md:w-36 md:h-72 lg:w-44 lg:h-[350px] shrink-0 -translate-y-2 sm:-translate-y-6 transition-all duration-500 hover:scale-105 hover:rotate-[0deg] bg-white cursor-pointer">
                <img 
                  src="/model-3.png" 
                  alt="LS Collections Model 2" 
                  className="w-full h-full object-cover object-bottom scale-110 translate-y-2 sm:translate-y-4" 
                />
              </div>

              {/* Card 3 */}
              <div className="relative rounded-[4px] overflow-hidden border-2 sm:border-4 border-white shadow-lg md:shadow-xl rotate-[6deg] skew-x-[2deg] w-20 h-44 sm:w-32 sm:h-64 md:w-36 md:h-72 lg:w-44 lg:h-[350px] shrink-0 translate-y-1 sm:translate-y-4 transition-all duration-500 hover:scale-105 hover:rotate-[4deg] bg-white cursor-pointer">
                <img 
                  src="/model-2.png" 
                  alt="LS Collections Model 3" 
                  className="w-full h-full object-cover object-[75%_bottom] scale-110 translate-y-1 sm:translate-y-3" 
                />
              </div>
            </div>

            {/* CTA Buttons for MOBILE ONLY (Visible on Mobile < md, Hidden on Desktop) */}
            <div className="w-full max-w-xl mx-auto z-10 pt-1 md:hidden">
              <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-3 w-full">
                <Link
                  to="/shop?category=Sarees"
                  className="group cursor-pointer flex-1 inline-flex items-center justify-center bg-[#fdf0f5]/90 hover:bg-[#4A0E17] text-[#4A0E17] hover:text-white text-[9px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest px-2 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-[#F8BBD0] hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 ease-out backdrop-blur-xs shadow-2xs hover:shadow-md gap-1 active:scale-95 text-center whitespace-nowrap"
                >
                  <span>Shop Sarees</span>
                  <ArrowRight className="w-3 h-3 text-[#4A0E17] group-hover:text-white transition-all duration-300 ease-out hidden sm:inline-block group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/shop?category=Jewellery"
                  className="group cursor-pointer flex-1 inline-flex items-center justify-center bg-[#fdf0f5]/90 hover:bg-[#4A0E17] text-[#4A0E17] hover:text-white text-[9px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest px-2 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-[#F8BBD0] hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 ease-out backdrop-blur-xs shadow-2xs hover:shadow-md gap-1 active:scale-95 text-center whitespace-nowrap"
                >
                  <span>Jewellery</span>
                  <ArrowRight className="w-3 h-3 text-[#4A0E17] group-hover:text-white transition-all duration-300 ease-out hidden sm:inline-block group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/shop?category=Scoops"
                  className="group cursor-pointer flex-1 inline-flex items-center justify-center bg-[#fdf0f5]/90 hover:bg-[#4A0E17] text-[#4A0E17] hover:text-white text-[9px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest px-2 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-[#F8BBD0] hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 ease-out backdrop-blur-xs shadow-2xs hover:shadow-md gap-1 active:scale-95 text-center whitespace-nowrap"
                >
                  <span>Scoops</span>
                  <ArrowRight className="w-3 h-3 text-[#4A0E17] group-hover:text-white transition-all duration-300 ease-out hidden sm:inline-block group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Subtle Overlay Pattern for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </section>
      )}

      {/* Shop by Budget / Price Store Section (Balanced spacing above & below) */}
      <section className="max-w-[1440px] mx-auto px-4 mt-6 sm:mt-8 mb-6 sm:mb-8 text-left">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xs sm:text-sm font-extrabold text-[#4A0E17] tracking-widest uppercase flex items-center gap-2">
            <span>SHOP BY BUDGET</span>
            <div className="h-0.5 bg-[#4A0E17]/15 flex-1 rounded-full hidden sm:block" />
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "UNDER ₹500", price: "500", bg: "from-[#F8BBD0] to-[#F48FB1]", border: "border-[#F8BBD0]/60" },
            { label: "UNDER ₹1000", price: "1000", bg: "from-[#E1BEE7] to-[#CE93D8]", border: "border-[#E1BEE7]/60" },
            { label: "UNDER ₹1500", price: "1500", bg: "from-[#D1C4E9] to-[#B39DDB]", border: "border-[#D1C4E9]/60" },
            { label: "UNDER ₹2000", price: "2000", bg: "from-[#BBDEFB] to-[#90CAF9]", border: "border-[#BBDEFB]/60" }
          ].map((item, idx) => (
            <Link
              key={idx}
              to={`/shop?maxPrice=${item.price}`}
              className={`group relative overflow-hidden bg-white text-[#4A0E17] border ${item.border} rounded-[4px] p-2.5 sm:p-3 text-center transition-all duration-300 shadow-2xs hover:shadow-md hover:scale-[1.03] cursor-pointer flex flex-col items-center justify-center h-[78px] sm:h-[88px]`}
            >
              {/* Top Accent Line that Expands to Fill Entire Card with Same Line Color on Hover */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.bg} group-hover:h-full transition-all duration-300 ease-out pointer-events-none opacity-90 group-hover:opacity-100`} />
              
              <span className="relative z-10 text-[11px] sm:text-xs font-black tracking-[0.18em] text-stone-600 group-hover:text-[#4A0E17] uppercase mb-0.5 transition-colors">
                BUDGET STORE
              </span>
              <span className="relative z-10 text-base sm:text-xl md:text-[22px] font-extrabold tracking-wide uppercase text-[#4A0E17] transition-colors leading-none">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Ticker Strip - Infinite Continuous Marquee Scroll */}
      <div className="bg-gradient-to-r from-[#F8BBD0] via-[#EBD2F0] to-[#F8BBD0] text-[#4A0E17] py-3.5 sm:py-4 mb-8 overflow-hidden shadow-xs border-y border-[#4A0E17]/10 relative">
        <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap text-xs sm:text-sm font-black uppercase tracking-widest cursor-pointer">
          {[1, 2].map((loopKey) => (
            <div key={loopKey} className="flex items-center gap-8 sm:gap-12 shrink-0">
              <span>New Arrivals</span>
              <span className="text-[#4A0E17]/40">•</span>
              <span>Handpicked Collections</span>
              <span className="text-[#4A0E17]/40">•</span>
              <span>Elegant Craftsmanship</span>
              <span className="text-[#4A0E17]/40">•</span>
              <span>100% Pure Handloom Silks</span>
              <span className="text-[#4A0E17]/40">•</span>
              <span>Express Nationwide Shipping</span>
              <span className="text-[#4A0E17]/40">•</span>
              <span>Heirloom Bridal Wear</span>
              <span className="text-[#4A0E17]/40">•</span>
              <span>Assured Premium Quality</span>
              <span className="text-[#4A0E17]/40">•</span>
              <span>Direct Factory Pricing</span>
              <span className="text-[#4A0E17]/40">•</span>
            </div>
          ))}
        </div>
      </div>



      {/* Luxury Split Auto-Scrolling Editorial Saree Banner (Placed Right Above Studio Section) */}
      <section className="max-w-[1440px] mx-auto px-4 mb-8 text-left">
        <div className="w-full bg-white rounded-[4px] border border-stone-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[360px] sm:h-[400px] md:h-[430px] relative">
          
          {/* Left Column (~70% Width): Auto-Scrolling Image Banner Slider */}
          <div className="relative w-full md:w-[70%] h-[240px] sm:h-[280px] md:h-full bg-stone-100 overflow-hidden">
            {sareeLuxuryBanners.map((banner, idx) => (
              <div
                key={idx}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-in-out",
                  idx === activeSareeLuxuryIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                )}
              >
                <img
                  src={banner.img}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}

            {/* Bottom Center Pagination Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
              {sareeLuxuryBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSareeLuxuryIndex(idx)}
                  className={cn(
                    "transition-all duration-300 rounded-full cursor-pointer",
                    idx === activeSareeLuxuryIndex
                      ? "w-2.5 h-2.5 bg-white scale-110"
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column (~30% Width): White Luxury Editorial Card with Brand Fonts */}
          <div className="w-full md:w-[30%] bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-between items-start text-left relative z-10 border-t md:border-t-0 md:border-l border-stone-200">
            <div className="w-full space-y-2 sm:space-y-3">
              <span className="font-sans text-[11px] font-extrabold text-[#4A0E17]/80 uppercase tracking-[0.2em] block">
                {sareeLuxuryBanners[activeSareeLuxuryIndex].tag}
              </span>
              <h3 className="font-serif font-bold text-[#4A0E17] text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-normal uppercase leading-[1.08] my-1">
                {sareeLuxuryBanners[activeSareeLuxuryIndex].title}
              </h3>
              <p className="font-sans text-stone-700 text-sm sm:text-base md:text-lg font-semibold tracking-wide">
                {sareeLuxuryBanners[activeSareeLuxuryIndex].offer}
              </p>

              <div className="w-full h-px bg-stone-200/80 my-3 sm:my-4" />

              <Link
                to={sareeLuxuryBanners[activeSareeLuxuryIndex].link}
                className="font-sans inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#4A0E17] hover:text-[#6b1422] transition-colors group cursor-pointer bg-[#fdf0f5] px-3.5 py-2 rounded-[4px] border border-[#F8BBD0]"
              >
                <span>+ EXPLORE</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Bottom Right Next/Prev Control Buttons */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 z-20">
              <button
                onClick={() => setActiveSareeLuxuryIndex((prev) => (prev === 0 ? sareeLuxuryBanners.length - 1 : prev - 1))}
                className="w-8 h-8 bg-[#4A0E17] hover:bg-[#6b1422] text-white flex items-center justify-center transition-colors cursor-pointer rounded-[4px] font-bold text-sm border border-[#F8BBD0]"
                aria-label="Previous Slide"
              >
                ‹
              </button>
              <button
                onClick={() => setActiveSareeLuxuryIndex((prev) => (prev + 1) % sareeLuxuryBanners.length)}
                className="w-8 h-8 bg-[#4A0E17] hover:bg-[#6b1422] text-white flex items-center justify-center transition-colors cursor-pointer rounded-[4px] font-bold text-sm border border-[#F8BBD0]"
                aria-label="Next Slide"
              >
                ›
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Dedicated Section: THE JEWELLERY STUDIO */}
      <section className="max-w-[1440px] mx-auto px-4 mb-10 text-left">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-sans font-extrabold text-[#4A0E17] tracking-wider uppercase">
              THE JEWELLERY STUDIO
            </h2>
            <p className="text-[11px] font-medium text-stone-500 tracking-wider uppercase mt-0.5">
              ELEGANT ORNAMENTS & HEIRLOOM JEWELRY
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollJewelleryStrip('left')}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#4A0E17] text-stone-700 hover:text-white flex items-center justify-center transition-all border border-stone-200 cursor-pointer text-xs"
              aria-label="Scroll Left"
            >
              ‹
            </button>
            <button
              onClick={() => scrollJewelleryStrip('right')}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#4A0E17] text-stone-700 hover:text-white flex items-center justify-center transition-all border border-stone-200 cursor-pointer text-xs"
              aria-label="Scroll Right"
            >
              ›
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Left/Center: Horizontally Auto-Scrollable & Drag-Scrollable Jewellery Collection Banners */}
          <div 
            ref={jewelleryScrollRef}
            onMouseDown={handleJewelleryMouseDown}
            onMouseLeave={handleJewelleryMouseLeave}
            onMouseUp={handleJewelleryMouseUp}
            onMouseMove={handleJewelleryMouseMove}
            className={`w-full lg:w-[73%] flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth ${
              isJewelleryDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
          >
            {[
              {
                title: "Temple & Heritage Jewellery",
                tag: "GOLDEN ELEGANCE",
                img: "/jewellery-studio-hero-2.jpg"
              },
              {
                title: "Kundan & Polki Sets",
                tag: "ROYAL SPLENDOR",
                img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Silver & Oxidised Jewellery",
                tag: "MODERN CHIC",
                img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Earrings & Statement Jhumkas",
                tag: "EVERYDAY GRACE",
                img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Bridal Chokers & Rani Haars",
                tag: "BRIDAL COLLECTION",
                img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Antique Gold Finish Bangles",
                tag: "HERITAGE BANGLES",
                img: "https://images.unsplash.com/photo-1611591475777-233ca749229e?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Matha Patti & Maang Tikka",
                tag: "ROYAL ACCENTS",
                img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=cover"
              }
            ].map((banner, i) => (
              <Link
                key={i}
                to="/shop?category=Jewellery"
                className="w-[220px] sm:w-[260px] md:w-[300px] shrink-0 snap-start group relative rounded-[4px] overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-end h-[260px] sm:h-[280px] md:h-[300px]"
              >
                <img 
                  src={banner.img} 
                  alt={banner.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left z-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-white/20 backdrop-blur-md border border-white/35 text-[9px] font-black uppercase tracking-widest text-white mb-1.5 shadow-2xs">
                    {banner.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-sans font-extrabold text-white tracking-wide uppercase drop-shadow-xs">
                    {banner.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column: Jewellery Categories Menu List */}
          <div className="hidden lg:flex w-full lg:w-[27%] bg-gradient-to-b from-[#fdf0f5] to-[#f8bbd0]/10 border border-[#f8bbd0]/40 rounded-[4px] p-3.5 flex-col justify-between h-[300px] shrink-0 relative overflow-hidden shadow-2xs">
            <div 
              ref={jewelleryCategoriesRef} 
              onMouseEnter={() => setIsJewelleryHovered(true)}
              onMouseLeave={() => setIsJewelleryHovered(false)}
              className="overflow-y-auto pr-2 scrollbar-none relative z-1"
            >
              <h4 className="text-xs uppercase tracking-widest text-[#4A0E17] font-black mb-2.5 pb-2 border-b border-[#F8BBD0] sticky top-0 bg-[#fdf0f5] z-10 pt-0.5">
                JEWELLERY CATEGORIES
              </h4>

              <div className="space-y-0.5">
                {[
                  ...[
                    { name: "Temple Jewellery Sets" },
                    { name: "Kundan & Polki Necklaces" },
                    { name: "Bridal Chokers & Rani Haars" },
                    { name: "Oxidised Silver Jewellery" },
                    { name: "Antique Gold Finish Bangles" },
                    { name: "Jhumkas & Statement Earrings" },
                    { name: "Matha Patti & Maang Tikka" },
                    { name: "Naths & Nose Rings" },
                    { name: "Haram & Long Necklaces" },
                    { name: "Pearl & Stone Accessories" }
                  ],
                  ...[
                    { name: "Temple Jewellery Sets" },
                    { name: "Kundan & Polki Necklaces" },
                    { name: "Bridal Chokers & Rani Haars" },
                    { name: "Oxidised Silver Jewellery" },
                    { name: "Antique Gold Finish Bangles" },
                    { name: "Jhumkas & Statement Earrings" },
                    { name: "Matha Patti & Maang Tikka" },
                    { name: "Naths & Nose Rings" },
                    { name: "Haram & Long Necklaces" },
                    { name: "Pearl & Stone Accessories" }
                  ]
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={`/shop?category=Jewellery`}
                    className="block text-xs sm:text-[13px] font-semibold text-stone-700 hover:text-[#4A0E17] hover:bg-[#F8BBD0]/30 rounded-lg px-2 py-1.5 transition-all leading-snug cursor-pointer"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-1.5 pt-2 border-t border-[#F8BBD0]/80 shrink-0 relative z-1 px-1">
              <Link
                to="/shop?category=Jewellery"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#4A0E17] hover:underline uppercase tracking-widest group cursor-pointer"
              >
                <span>VIEW ALL JEWELLERY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Section: THE SCOOPS STUDIO */}
      <section className="max-w-[1440px] mx-auto px-4 mb-10 text-left">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-sans font-extrabold text-[#4A0E17] tracking-wider uppercase">
              THE SCOOPS STUDIO
            </h2>
            <p className="text-[11px] font-medium text-stone-500 tracking-wider uppercase mt-0.5">
              CURATED HANDPICKED SCOOPS & EXQUISITE ACCESSORIES
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollScoopsStrip('left')}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#4A0E17] text-stone-700 hover:text-white flex items-center justify-center transition-all border border-stone-200 cursor-pointer text-xs"
              aria-label="Scroll Left"
            >
              ‹
            </button>
            <button
              onClick={() => scrollScoopsStrip('right')}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#4A0E17] text-stone-700 hover:text-white flex items-center justify-center transition-all border border-stone-200 cursor-pointer text-xs"
              aria-label="Scroll Right"
            >
              ›
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Left/Center: Horizontally Auto-Scrollable & Drag-Scrollable Scoops Collection Banners */}
          <div 
            ref={scoopsScrollRef}
            onMouseDown={handleScoopsMouseDown}
            onMouseLeave={handleScoopsMouseLeave}
            onMouseUp={handleScoopsMouseUp}
            onMouseMove={handleScoopsMouseMove}
            className={`w-full lg:w-[73%] flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth ${
              isScoopsDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
          >
            {[
              {
                title: "Large Scoops",
                tag: "EXCLUSIVE COLLECTION",
                img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Small Scoops",
                tag: "MINIMAL ELEGANCE",
                img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Pearl Scoops",
                tag: "HEIRLOOM PEARLS",
                img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Designer Scoop Combos",
                tag: "FESTIVE ESSENTIALS",
                img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Floral & Fabric Scoops",
                tag: "HANDCRAFTED ACCENTS",
                img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Golden Finish Scoops",
                tag: "ROYAL FINISH",
                img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=cover"
              },
              {
                title: "Kundan & Stone Scoops",
                tag: "BRIDAL ACCENTS",
                img: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=800&auto=format&fit=cover"
              }
            ].map((banner, i) => (
              <Link
                key={i}
                to="/shop?category=Scoops"
                className="w-[220px] sm:w-[260px] md:w-[300px] shrink-0 snap-start group relative rounded-[4px] overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-end h-[260px] sm:h-[280px] md:h-[300px]"
              >
                <img 
                  src={banner.img} 
                  alt={banner.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left z-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-white/20 backdrop-blur-md border border-white/35 text-[9px] font-black uppercase tracking-widest text-white mb-1.5 shadow-2xs">
                    {banner.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-sans font-extrabold text-white tracking-wide uppercase drop-shadow-xs">
                    {banner.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column: Scoops Categories Menu List */}
          <div className="hidden lg:flex w-full lg:w-[27%] bg-gradient-to-b from-[#fdf0f5] to-[#f8bbd0]/10 border border-[#f8bbd0]/40 rounded-[4px] p-3.5 flex-col justify-between h-[300px] shrink-0 relative overflow-hidden shadow-2xs">
            <div 
              ref={scoopsCategoriesRef} 
              onMouseEnter={() => setIsScoopsHovered(true)}
              onMouseLeave={() => setIsScoopsHovered(false)}
              className="overflow-y-auto pr-2 scrollbar-none relative z-1"
            >
              <h4 className="text-xs uppercase tracking-widest text-[#4A0E17] font-black mb-2.5 pb-2 border-b border-[#F8BBD0] sticky top-0 bg-[#fdf0f5] z-10 pt-0.5">
                SCOOPS CATEGORIES
              </h4>

              <div className="space-y-0.5">
                {[
                  ...[
                    { name: "Large Scoops" },
                    { name: "Small Scoops" },
                    { name: "Pearl Scoops" },
                    { name: "Floral Scoops" },
                    { name: "Golden Finish Scoops" },
                    { name: "Kundan & Stone Scoops" },
                    { name: "Handcrafted Fabric Scoops" },
                    { name: "Bridal Scoop Sets" },
                    { name: "Festive Gift Scoops" }
                  ],
                  ...[
                    { name: "Large Scoops" },
                    { name: "Small Scoops" },
                    { name: "Pearl Scoops" },
                    { name: "Floral Scoops" },
                    { name: "Golden Finish Scoops" },
                    { name: "Kundan & Stone Scoops" },
                    { name: "Handcrafted Fabric Scoops" },
                    { name: "Bridal Scoop Sets" },
                    { name: "Festive Gift Scoops" }
                  ]
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={`/shop?category=Scoops`}
                    className="block text-xs sm:text-[13px] font-semibold text-stone-700 hover:text-[#4A0E17] hover:bg-[#F8BBD0]/30 rounded-lg px-2 py-1.5 transition-all leading-snug cursor-pointer"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-1.5 pt-2 border-t border-[#F8BBD0]/80 shrink-0 relative z-1 px-1">
              <Link
                to="/shop?category=Scoops"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#4A0E17] hover:underline uppercase tracking-widest group cursor-pointer"
              >
                <span>VIEW ALL SCOOPS</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>











      {/* Dedicated Section: OUR BESTSELLERS (Mix of All Categories) */}
      <section className="max-w-[1440px] mx-auto px-4 mb-10 text-left">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-sans font-extrabold text-[#4A0E17] tracking-wider uppercase">
              OUR BESTSELLERS
            </h2>
            <p className="text-[11px] font-medium text-stone-500 tracking-wider uppercase mt-0.5">
              HANDPICKED FAVORITES ACROSS ALL CATEGORIES
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollSareeStrip('left')}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#4A0E17] text-stone-700 hover:text-white flex items-center justify-center transition-all border border-stone-200 cursor-pointer text-xs"
              aria-label="Scroll Left"
            >
              ‹
            </button>
            <button
              onClick={() => scrollSareeStrip('right')}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#4A0E17] text-stone-700 hover:text-white flex items-center justify-center transition-all border border-stone-200 cursor-pointer text-xs"
              aria-label="Scroll Right"
            >
              ›
            </button>
          </div>
        </div>

        <div ref={sareeScrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
          {products.map((product) => (
            <div key={product.slug} className="w-[260px] sm:w-[280px] shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Dedicated Section: CUSTOMER REVIEWS & LOVE (Clean Single Row Marquee) */}
      <section className="w-full mt-6 mb-1 py-6 bg-gradient-to-b from-white via-[#fdf0f5]/40 to-white overflow-hidden text-left border-y border-[#F8BBD0]/30">
        <div className="max-w-[1440px] mx-auto px-4 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A0E17]">
              Customer Reviews & Love
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-500 mt-0.5">
              Real experiences from our verified buyers across India
            </p>
          </div>
        </div>

        {/* Single Moving Marquee Row */}
        <div className="relative w-full flex overflow-x-hidden">
          <div className="animate-marquee flex items-center gap-4 whitespace-normal cursor-pointer py-1">
            {[1, 2].map((loopKey) => (
              <div key={loopKey} className="flex items-center gap-4 shrink-0">
                {[
                  {
                    name: "Ananya Sharma",
                    city: "Bengaluru, KA",
                    stars: 5,
                    text: "The Pure Kanjeevaram Saree I ordered for my sister's wedding was beyond stunning! The gold zari sheen and silk texture are 100% authentic.",
                    tag: "Pure Silk Saree"
                  },
                  {
                    name: "Kavya Reddy",
                    city: "Hyderabad, TS",
                    stars: 5,
                    text: "Received my temple jewellery set in just 3 days. Premium weight, antique matte finish, and extremely well packaged!",
                    tag: "Temple Jewellery"
                  },
                  {
                    name: "Priya Natarajan",
                    city: "Chennai, TN",
                    stars: 5,
                    text: "Soft silk sarees from LS Collections are so light and comfortable for full-day events. Drapes effortlessly!",
                    tag: "Soft Silk"
                  },
                  {
                    name: "Meera Iyer",
                    city: "Mumbai, MH",
                    stars: 5,
                    text: "Ordered the Pearl Scoop set along with a Banarasi silk saree. Excellent customer support and instant WhatsApp delivery updates.",
                    tag: "Pearl Scoop Combo"
                  },
                  {
                    name: "Divya Menon",
                    city: "Kochi, KL",
                    stars: 5,
                    text: "The Zari work on my bridal saree was intricate and gorgeous. Everyone at the reception complimented the rich maroon color!",
                    tag: "Bridal Zari"
                  },
                  {
                    name: "Sneha Patel",
                    city: "Ahmedabad, GJ",
                    stars: 5,
                    text: "Direct factory pricing is genuine. Pure handloom silk quality at half the boutique price. Super happy with my purchase!",
                    tag: "Handloom Silk"
                  },
                  {
                    name: "Pooja Agarwal",
                    city: "New Delhi, DL",
                    stars: 5,
                    text: "The Kundan Choker set looks like real heirloom gold! Perfectly matched my sangeet lehenga.",
                    tag: "Kundan Choker"
                  },
                  {
                    name: "Ritu Verma",
                    city: "Jaipur, RJ",
                    stars: 5,
                    text: "Fast dispatch, pristine box packaging, and genuine silk mark guarantee included. Highly recommended brand!",
                    tag: "Pure Banarasi"
                  }
                ].map((review, idx) => (
                  <div 
                    key={idx}
                    className="w-[280px] sm:w-[320px] md:w-[350px] bg-white hover:bg-[#fdf0f5]/40 border border-stone-200 hover:border-[#F8BBD0] rounded-[4px] p-4 flex flex-col justify-between h-[145px] sm:h-[155px] shadow-2xs hover:shadow-sm transition-all duration-300 shrink-0"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(review.stars)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          Verified Buyer
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-stone-700 leading-snug font-medium line-clamp-2">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                      <div>
                        <h4 className="text-xs font-black text-[#4A0E17] leading-none">
                          {review.name}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {review.city}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#4A0E17] bg-[#F8BBD0]/30 px-2 py-0.5 rounded-md">
                        {review.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Flagship Store / Boutique Video Banner Section (Full-Width & Expanded Height) */}
      <section className="relative w-full overflow-hidden mt-1 mb-0 bg-black text-white h-[340px] sm:h-[450px] md:h-[580px] border-t border-stone-800">
        {/* Background Video aligned to top so faces are never cut off */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover object-[center_top] opacity-90"
        >
          <source src="/showcase-video-bottom.mp4" type="video/mp4" />
        </video>

        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      </section>

    </div>
  );
}
