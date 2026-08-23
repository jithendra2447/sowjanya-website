import { useState } from "react";
import { MessageCircle, Mail, MapPin, Send, Clock, Phone, Sparkles, CheckCircle2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("Bridal Styling & Custom Saree Draping");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error("Please fill in your name, phone number, and message.");
      return;
    }

    // Direct mailto link creation
    const mailtoSubject = encodeURIComponent(`[Inquiry - ${inquiryType}] from ${name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nPhone/WhatsApp: ${phone}\nEmail: ${email || "N/A"}\nInquiry Type: ${inquiryType}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:lscollections25@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    setSubmitted(true);
    toast.success("Opening your email client to send query to lscollections25@gmail.com!");
  };

  const handleWhatsAppSubmit = () => {
    if (!name || !message) {
      toast.error("Please provide your name and message details.");
      return;
    }
    const text = `Hi LS Collections! My name is ${name} (${phone}).\nInquiry Category: ${inquiryType}\n\nMessage:\n${message}`;
    const link = buildWhatsAppUrl(text);
    window.open(link, "_blank");
    toast.success("Redirecting to Instant WhatsApp Concierge...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f5]/60 via-white to-[#fdf0f5]/30 pb-24 pt-20 md:pt-28 text-left">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        
        {/* Page Title Header Banner */}
        <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fdf0f5] border border-[#F8BBD0] text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#4A0E17]">
            <Sparkles className="w-3.5 h-3.5" /> STORE HELPDESK & STYLING CONCIERGE
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#4A0E17] uppercase tracking-wide">
            Contact LS Collections
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-600">
            Visit our flagship boutique, book a bridal styling consultation, or send us your custom order requests.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Contact Us Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[4px] border border-[#F8BBD0]/80 shadow-md space-y-6">
            
            <div className="border-b border-[#F8BBD0]/50 pb-4">
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A0E17] tracking-wider uppercase">
                SEND US A MESSAGE
              </h2>
              <p className="text-xs font-medium text-stone-500 mt-0.5">
                Fill out the form below and our customer desk will respond within 2-4 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#fdf0f5] border border-[#F8BBD0] p-6 rounded-[4px] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#4A0E17] mx-auto" />
                <h3 className="text-base font-serif font-bold text-[#4A0E17]">Thank You, {name}!</h3>
                <p className="text-xs text-stone-700 font-medium max-w-md mx-auto">
                  Your message has been formatted. If your email application didn't open automatically, you can also reach us directly via WhatsApp below.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-5 py-2 bg-[#4A0E17] text-white text-xs font-bold uppercase tracking-wider rounded-[4px]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs font-bold text-stone-800">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="cont-name" className="uppercase tracking-wider text-[11px] text-[#4A0E17]">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="cont-name"
                      type="text"
                      required
                      placeholder="e.g. Sowjanya Lakshmi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0]/80 rounded-[4px] px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label htmlFor="cont-phone" className="uppercase tracking-wider text-[11px] text-[#4A0E17]">
                      Phone / WhatsApp No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="cont-phone"
                      type="tel"
                      required
                      placeholder="+91 86398 76898"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0]/80 rounded-[4px] px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="cont-email" className="uppercase tracking-wider text-[11px] text-[#4A0E17]">
                      Email Address (Optional)
                    </label>
                    <input
                      id="cont-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0]/80 rounded-[4px] px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-1.5">
                    <label htmlFor="cont-type" className="uppercase tracking-wider text-[11px] text-[#4A0E17]">
                      Inquiry Category
                    </label>
                    <select
                      id="cont-type"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0]/80 rounded-[4px] px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white"
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
                  <label htmlFor="cont-msg" className="uppercase tracking-wider text-[11px] text-[#4A0E17]">
                    Message / Query Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="cont-msg"
                    required
                    rows={4}
                    placeholder="Provide details about your saree drape preferences, color customization, event dates, or product codes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#fdf0f5]/40 border border-[#F8BBD0]/80 rounded-[4px] px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] focus:bg-white resize-none"
                  />
                </div>

                {/* Action Buttons: Email & WhatsApp */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#4A0E17] hover:bg-[#6b1422] text-white text-xs font-bold uppercase tracking-widest rounded-[4px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#F8BBD0]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message (Email)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold uppercase tracking-widest rounded-[4px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" fill="currentColor" />
                    <span>Chat on WhatsApp</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Right Column (5 cols): Store Info Card */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Flagship Boutique Store Card */}
            <div className="bg-[#4A0E17] text-white p-6 sm:p-8 rounded-[4px] border border-[#F8BBD0] shadow-md space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <span className="text-[10px] font-black tracking-[0.2em] text-[#F8BBD0] uppercase block">
                  FLAGSHIP BOUTIQUE STORE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide uppercase mt-1">
                  LS Collections
                </h3>
              </div>

              {/* Address */}
              <div className="space-y-1.5 text-xs text-[#fdf0f5] leading-relaxed pt-2 border-t border-[#F8BBD0]/30">
                <p className="font-semibold text-white flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#F8BBD0] shrink-0 mt-0.5" />
                  <span>📍 LS Collections Near Busstand ,Towards Sattenapalli Road Amaravathi 522020</span>
                </p>
                <p className="text-[11px] font-medium text-[#F8BBD0] pl-5 italic">
                  (Walk-ins & Bridal Styling Appointments Welcome)
                </p>
              </div>

              {/* Timings & Phone */}
              <div className="space-y-2 pt-3 border-t border-[#F8BBD0]/30 text-xs font-medium text-[#fdf0f5]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F8BBD0] shrink-0" />
                  <span>Timings: Monday to Sunday: 10:00 AM – 7:00 PM IST</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#F8BBD0] shrink-0" />
                  <span>Store Desk / Phone: <a href="tel:+918639876898" className="font-bold text-white hover:underline">+91 86398 76898</a></span>
                </div>
              </div>

            </div>

            {/* Email Support & Instant WhatsApp Concierge Card */}
            <div className="bg-white p-6 rounded-[4px] border border-[#F8BBD0]/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#fdf0f5] flex items-center justify-center text-[#4A0E17] border border-[#F8BBD0] shrink-0">
                  <Mail className="w-5 h-5" />
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

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] border border-[#25D366]/40 shrink-0">
                  <MessageCircle className="w-5 h-5" fill="currentColor" />
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
