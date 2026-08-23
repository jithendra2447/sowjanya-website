import { Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 pt-28 md:pt-36 text-left">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        
        <div className="bg-white p-6 sm:p-8 rounded-[32px] neuo-flat border border-white space-y-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase tracking-wide border-b border-stone-100 pb-3">
            Our Story
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-semibold">
            Welcome to <span className="text-brand-dark font-extrabold font-serif">LS Collections</span>. Founded on the principle of bringing traditional Indian artistry directly to the modern wardrobe, we specialize in curated pure silk sarees and exquisite temple jewellery.
          </p>

          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-semibold">
            Every thread of our sarees is woven by hand loom artisans using premium gold threads and traditional patterns passed down through generations. Our antique matte jewelry collections are cast from copper-silver alloys to preserve detail, plated with 22k gold matte, and accented with Kemp ruby replicas to recreate royal temple jewelry aesthetics.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <Sparkles className="w-5 h-5 text-brand-dark mb-2" />
              <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider">Artisan Woven</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <ShieldCheck className="w-5 h-5 text-brand-dark mb-2" />
              <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider">Certified Zari</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <Heart className="w-5 h-5 text-brand-dark mb-2" />
              <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider">Made in India</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
