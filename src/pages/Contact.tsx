import { useState } from "react";
import { MessageCircle, Mail, MapPin, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { usePageCms } from "@/hooks/usePageCms";
import { toast } from "sonner";

export default function Contact() {
  const { pageCms } = usePageCms();
  const contact = pageCms.footer || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      toast.error("Please fill in your name and message.");
      return;
    }

    // Redirect to WhatsApp with contact query
    const text = `Hi LS Collections, my name is ${name}. ${message}`;
    const link = buildWhatsAppUrl(text);
    window.open(link, "_blank");
    toast.success("Redirecting to WhatsApp chat support...");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 pt-28 md:pt-36 text-left">
      <div className="max-w-[1440px] mx-auto px-4">
        
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase tracking-wide mb-6">
          Contact Support
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Form */}
          <div className="bg-white p-6 sm:p-8 rounded-[32px] neuo-flat border border-white space-y-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark pb-3 border-b border-stone-100">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-stone-700">
              <div className="space-y-1">
                <label htmlFor="cont-name" className="uppercase tracking-wider">Your Name</label>
                <input
                  id="cont-name"
                  type="text"
                  required
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="cont-email" className="uppercase tracking-wider">Email Address (Optional)</label>
                <input
                  id="cont-email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="cont-msg" className="uppercase tracking-wider">Your Message</label>
                <textarea
                  id="cont-msg"
                  required
                  placeholder="Type query details about custom orders, blouse alterations, stock checking, etc."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink h-28 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" fill="currentColor" />
                <span>Submit Query via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Contact Details Column */}
          <div className="bg-white p-6 sm:p-8 rounded-[32px] neuo-flat border border-white space-y-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark pb-3 border-b border-stone-100">
              Store Help Desk
            </h3>

            <div className="space-y-6 text-sm font-semibold text-stone-600">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-pastel-pink/20 flex items-center justify-center text-brand-dark shrink-0">
                  <MessageCircle className="w-5 h-5" fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wide">WhatsApp Assistance</h4>
                  <a 
                    href={buildWhatsAppUrl("Hi LS Collections, I'd like to ask a question.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-stone-500 hover:text-brand-dark block mt-1 hover:underline"
                  >
                    {contact.phoneDisplay || "+91 86398 76898"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-pastel-lavender/20 flex items-center justify-center text-brand-dark shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wide">Email Support</h4>
                  <a 
                    href={`mailto:${contact.email || "support@lscollections.in"}`}
                    className="text-xs font-bold text-stone-500 hover:text-brand-dark block mt-1 hover:underline"
                  >
                    {contact.email || "support@lscollections.in"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-pastel-blue/20 flex items-center justify-center text-brand-dark shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wide">Office Location</h4>
                  <p className="text-xs text-stone-500 font-bold block mt-1">
                    {contact.location || "Hyderabad, India"}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
