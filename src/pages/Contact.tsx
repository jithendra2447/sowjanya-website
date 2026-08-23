import { useState } from "react";
import { MessageCircle, Mail, MapPin, Send, Clock, Phone, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("Bridal Styling & Custom Saree Draping");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const quickTopics = [
    { label: "👑 Bridal Saree Consultation", category: "Bridal Styling & Custom Saree Draping", defaultMsg: "Hi LS Collections, I want to book a bridal saree drape consultation for my wedding." },
    { label: "✂️ Custom Blouse Stitching", category: "Blouse Stitching & Customization", defaultMsg: "Hi, I need custom blouse stitching and size fitting for my order." },
    { label: "💎 Jewellery Matching Sets", category: "Jewellery Matching & Sets", defaultMsg: "Hi, I would like guidance on matching temple jewellery sets for my silk saree." },
    { label: "📦 Order Tracking & Shipping", category: "Order Tracking & Shipping", defaultMsg: "Hi, I want to track the dispatch status of my recent purchase." },
    { label: "📍 Boutique Visit Appointment", category: "Store Visit Appointment", defaultMsg: "Hi, I would like to schedule a walk-in boutique visit at Amaravathi store." }
  ];

  const handleSelectQuickTopic = (topic: typeof quickTopics[0]) => {
    setInquiryType(topic.category);
    setMessage(topic.defaultMsg);
    toast.success(`Selected topic: ${topic.label}`);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error("Please fill in your name, phone number, and message.");
      return;
    }

    const mailtoSubject = encodeURIComponent(`[${inquiryType}] Inquiry from ${name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nPhone/WhatsApp: ${phone}\nEmail: ${email || "N/A"}\nCategory: ${inquiryType}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:lscollections25@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    setSubmitted(true);
    toast.success("Opening email client to send query to lscollections25@gmail.com!");
  };

  const handleWhatsAppSubmit = () => {
    if (!name || !message) {
      toast.error("Please provide your name and message details.");
      return;
    }
    const text = `Hi LS Collections!\nName: ${name} (${phone})\nCategory: ${inquiryType}\n\nMessage:\n${message}`;
    const link = buildWhatsAppUrl(text);
    window.open(link, "_blank");
    toast.success("Redirecting to Instant WhatsApp Concierge...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f5]/80 via-white to-[#fdf0f5]/50 pb-24 pt-16 md:pt-20 text-left font-sans">
      
      {/* 1. HERO BANNER USING EXACT HOME PAGE BG (/home-bg.jpg) AND BRAND COLORS */}
      <section className="relative w-full bg-[url('/home-bg.jpg')] bg-cover bg-center bg-no-repeat py-12 md:py-16 px-4 sm:px-8 border-b border-[#F8BBD0] shadow-xs mb-10">
        <div className="max-w-[1200px] mx-auto text-center space-y-3.5">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fdf0f5] border border-[#F8BBD0] text-xs font-black uppercase tracking-[0.2em] text-[#4A0E17] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" /> STORE HELPDESK & STYLING CONCIERGE
          </span>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold text-[#4A0E17] uppercase tracking-normal">
            Personal Concierge & Support
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#2D1C3D]/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience bespoke Indian ethnic luxury. Visit our Amaravathi store, schedule bridal consultations, or connect directly with our master stylists.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold text-[#4A0E17]">
            <span className="flex items-center gap-1.5 bg-[#fdf0f5]/90 border border-[#F8BBD0] px-3.5 py-1.5 rounded-full shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#4A0E17]" /> 100% Authentic Handloom Silk
            </span>
            <span className="flex items-center gap-1.5 bg-[#fdf0f5]/90 border border-[#F8BBD0] px-3.5 py-1.5 rounded-full shadow-2xs">
              <Clock className="w-4 h-4 text-[#4A0E17]" /> 10:00 AM – 7:00 PM IST (Mon - Sun)
            </span>
            <span className="flex items-center gap-1.5 bg-[#fdf0f5]/90 border border-[#F8BBD0] px-3.5 py-1.5 rounded-full shadow-2xs">
              <HeartHandshake className="w-4 h-4 text-[#4A0E17]" /> Walk-ins & Appointments Welcome
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">

        {/* 2. INTERACTIVE QUICK-SELECT TOPIC BADGES */}
        <div className="mb-8 bg-white p-5 sm:p-6 rounded-[4px] border border-[#F8BBD0]/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#4A0E17] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#4A0E17]" />
              <span>QUICK-SELECT YOUR INQUIRY TOPIC</span>
            </h3>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Click any pill to auto-fill form</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {quickTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectQuickTopic(topic)}
                className="px-3.5 py-2 rounded-[4px] bg-[#fdf0f5] hover:bg-[#4A0E17] text-[#4A0E17] hover:text-white border border-[#F8BBD0] text-xs font-bold transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>{topic.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. MAIN 2-COLUMN SECTION: FORM + STORE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[4px] border border-[#F8BBD0] shadow-sm space-y-6 relative">
            
            <div className="border-b border-[#F8BBD0]/60 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#4A0E17] tracking-wider uppercase">
                  SEND US A DIRECT MESSAGE
                </h2>
                <p className="text-xs font-semibold text-[#2D1C3D]/70 mt-0.5">
                  Fill out your details below and our customer desk will respond within 2–4 hours.
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-extrabold text-[#4A0E17] bg-[#fdf0f5] px-2.5 py-1 rounded-[4px] border border-[#F8BBD0] uppercase tracking-wider">
                  FAST RESPONSE DESK
                </span>
              </div>
            </div>

            {submitted ? (
              <div className="bg-[#fdf0f5] border border-[#F8BBD0] p-8 rounded-[4px] text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#4A0E17] mx-auto" />
                <h3 className="text-xl font-serif font-bold text-[#4A0E17]">Inquiry Prepared, {name}!</h3>
                <p className="text-xs text-[#2D1C3D] font-medium max-w-md mx-auto leading-relaxed">
                  Your message has been compiled for <strong>lscollections25@gmail.com</strong>. If your email client did not open automatically, click below to chat with our instant WhatsApp concierge.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-[#4A0E17] text-white text-xs font-bold uppercase tracking-wider rounded-[4px] shadow-xs"
                  >
                    Send Another Inquiry
                  </button>
                  <button
                    onClick={handleWhatsAppSubmit}
                    className="px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-[4px] shadow-xs flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" fill="currentColor" /> Chat WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs font-bold text-[#2D1C3D]">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="cont-name" className="uppercase tracking-wider text-[11px] text-[#4A0E17] font-black">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="cont-name"
                      type="text"
                      required
                      placeholder="e.g. Sowjanya Lakshmi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0] rounded-[4px] px-3.5 py-3 text-xs text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label htmlFor="cont-phone" className="uppercase tracking-wider text-[11px] text-[#4A0E17] font-black">
                      Phone / WhatsApp No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="cont-phone"
                      type="tel"
                      required
                      placeholder="+91 86398 76898"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0] rounded-[4px] px-3.5 py-3 text-xs text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="cont-email" className="uppercase tracking-wider text-[11px] text-[#4A0E17] font-black">
                      Email Address (Optional)
                    </label>
                    <input
                      id="cont-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0] rounded-[4px] px-3.5 py-3 text-xs text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Inquiry Category */}
                  <div className="space-y-1.5">
                    <label htmlFor="cont-type" className="uppercase tracking-wider text-[11px] text-[#4A0E17] font-black">
                      Inquiry Category
                    </label>
                    <select
                      id="cont-type"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0] rounded-[4px] px-3.5 py-3 text-xs text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white transition-all"
                    >
                      <option value="Bridal Styling & Custom Saree Draping">Bridal Styling & Custom Saree Draping</option>
                      <option value="Blouse Stitching & Customization">Blouse Stitching & Customization</option>
                      <option value="Jewellery Matching & Sets">Jewellery Matching & Sets</option>
                      <option value="Order Tracking & Shipping">Order Tracking & Shipping</option>
                      <option value="Store Visit Appointment">Store Visit Appointment</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="cont-msg" className="uppercase tracking-wider text-[11px] text-[#4A0E17] font-black">
                    Message / Query Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="cont-msg"
                    required
                    rows={4}
                    placeholder="Provide details about your saree drape preferences, color customization, event dates, or product codes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0] rounded-[4px] px-3.5 py-3 text-xs text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white resize-none transition-all"
                  />
                </div>

                {/* Dual Action CTA Buttons */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#4A0E17] hover:bg-[#6b1422] text-white text-xs font-bold uppercase tracking-widest rounded-[4px] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#F8BBD0]"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>Send Message (Email)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold uppercase tracking-widest rounded-[4px] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-white" fill="currentColor" />
                    <span>Chat on WhatsApp</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Right Column (5 cols): Store Details & Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Flagship Store Card (Clean Soft Blush Brand Card with Imperial Burgundy Text) */}
            <div className="bg-gradient-to-b from-[#fdf0f5] to-white text-[#2D1C3D] p-6 sm:p-8 rounded-[4px] border border-[#F8BBD0] shadow-sm space-y-5">
              
              <div>
                <span className="text-[10px] font-black tracking-[0.25em] text-[#4A0E17] uppercase block">
                  FLAGSHIP BOUTIQUE STORE
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A0E17] tracking-wide uppercase mt-1">
                  LS Collections
                </h3>
              </div>

              {/* Exact Address */}
              <div className="space-y-2 text-xs text-[#2D1C3D] leading-relaxed pt-3 border-t border-[#F8BBD0]/60">
                <p className="font-semibold text-[#4A0E17] flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#4A0E17] shrink-0 mt-0.5" />
                  <span>📍 LS Collections Near Busstand ,Towards Sattenapalli Road Amaravathi 522020</span>
                </p>
                <p className="text-[11px] font-bold text-stone-600 pl-6 italic">
                  (Walk-ins & Bridal Styling Appointments Welcome)
                </p>
              </div>

              {/* Timings & Phone */}
              <div className="space-y-2.5 pt-3 border-t border-[#F8BBD0]/60 text-xs font-semibold text-[#2D1C3D]">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#4A0E17] shrink-0" />
                  <span>Timings: Monday to Sunday: 10:00 AM – 7:00 PM IST</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#4A0E17] shrink-0" />
                  <span>Store Desk / Phone: <a href="tel:+918639876898" className="font-extrabold text-[#4A0E17] hover:underline">+91 86398 76898</a></span>
                </div>
              </div>

            </div>

            {/* Email Support & WhatsApp Card */}
            <div className="bg-white p-6 rounded-[4px] border border-[#F8BBD0] shadow-xs space-y-4">
              
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[4px] bg-[#fdf0f5] flex items-center justify-center text-[#4A0E17] border border-[#F8BBD0] shrink-0">
                  <Mail className="w-5.5 h-5.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Email Support</span>
                  <a 
                    href="mailto:lscollections25@gmail.com" 
                    className="text-xs sm:text-sm font-extrabold text-[#4A0E17] hover:underline truncate block"
                  >
                    lscollections25@gmail.com
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-[#F8BBD0]/40" />

              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[4px] bg-[#25D366]/10 flex items-center justify-center text-[#25D366] border border-[#25D366]/40 shrink-0">
                  <MessageCircle className="w-5.5 h-5.5" fill="currentColor" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Instant WhatsApp Concierge</span>
                  <a 
                    href={buildWhatsAppUrl("Hi LS Collections, I need help with an order.")}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-xs sm:text-sm font-extrabold text-[#25D366] hover:underline block"
                  >
                    +91 86398 76898
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
