import { Link } from "react-router-dom";
import { usePageCms } from "@/hooks/usePageCms";
import { MessageCircle, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  const { pageCms } = usePageCms();
  const contact = pageCms.footer || {};

  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden md:block bg-white border-t border-stone-200/80 pt-14 pb-12 text-left text-stone-700">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* About Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-brand-dark tracking-wide font-serif">LS Collections</h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs">
            Handcrafting premium sarees, antique temple jewellery, and accents styled for the modern Indian woman. Speed, style, and luxury in every thread.
          </p>
          <div className="flex items-center gap-3.5 pt-2">
            <a 
              href={contact.instagramLink || "https://instagram.com"} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-brand-pastel-pink hover:text-brand-dark transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href={contact.youtubeLink || "https://youtube.com"} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a 
              href={buildWhatsAppUrl("Hi LS Collections, I'd like to ask about your products.")} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" fill="currentColor" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-brand-dark font-bold">Quick Links</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link to="/shop?category=Sarees" className="hover:text-brand-dark hover:underline transition-colors text-stone-500">
                Sarees Collection
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Jewellery" className="hover:text-brand-dark hover:underline transition-colors text-stone-500">
                Jewellery Collection
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Scoops" className="hover:text-brand-dark hover:underline transition-colors text-stone-500">
                Scoops & Accents
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-brand-dark hover:underline transition-colors text-stone-500">
                Our Story
              </Link>
            </li>
          </ul>
        </div>

        {/* Help & Policies Column */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-brand-dark font-bold">Help & Policies</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link to="/contact" className="hover:text-brand-dark hover:underline transition-colors text-stone-500">
                Contact Support
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-brand-dark hover:underline transition-colors text-stone-500">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-brand-dark hover:underline transition-colors text-stone-500">
                Refund & Returns
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-brand-dark hover:underline transition-colors text-stone-500">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-brand-dark font-bold">Contact Store</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-stone-500">
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>{contact.phoneDisplay || "+91 86398 76898"}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <a href={`mailto:${contact.email || "support@lscollections.in"}`} className="hover:underline">
                {contact.email || "support@lscollections.in"}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>{contact.location || "Hyderabad, India"}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-[1440px] mx-auto px-6 mt-12 pt-6 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-medium">
        <p>© {currentYear} LS Collections. All rights reserved.</p>
        <p>Built with ❤️ for speed & mobile responsiveness.</p>
      </div>
    </footer>
  );
}
