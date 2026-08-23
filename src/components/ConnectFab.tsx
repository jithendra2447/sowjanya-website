import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Instagram, Youtube, X, Share2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { usePageCms } from "@/hooks/usePageCms";
import { cn } from "@/lib/utils";

export default function ConnectFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { pageCms } = usePageCms();
  const menuRef = useRef<HTMLDivElement>(null);

  const whatsappHref = buildWhatsAppUrl("Hi LS Collections, I have a query about your collection.");
  const instagramHref = pageCms.footer?.instagramLink || "https://instagram.com";
  const youtubeHref = pageCms.footer?.youtubeLink || "https://youtube.com";

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 z-40 flex flex-col items-end" ref={menuRef}>
      {/* Expanded Menu */}
      <div 
        className={cn(
          "flex flex-col gap-3 mb-4 transition-all duration-300 ease-out origin-bottom",
          isOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-10 scale-50 pointer-events-none absolute bottom-14 right-0"
        )}
      >
        <a
          href={youtubeHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="w-11 h-11 rounded-full bg-white text-[#FF0000] flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 border border-stone-100"
        >
          <Youtube className="w-5.5 h-5.5" />
        </a>
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
        >
          <Instagram className="w-5.5 h-5.5" />
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="w-5.5 h-5.5" fill="currentColor" />
        </a>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Connect with us"
        className="w-13 h-13 rounded-full bg-brand-dark text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 group relative neuo-btn"
      >
        <span className="absolute inset-0 rounded-full bg-brand-dark opacity-35 animate-ping group-hover:hidden" />
        {isOpen ? (
          <X className="w-5 h-5 relative z-10 animate-in spin-in-180 duration-300" />
        ) : (
          <Share2 className="w-5 h-5 relative z-10 animate-in spin-in-[-180deg] duration-300" />
        )}
      </button>
    </div>
  );
}
