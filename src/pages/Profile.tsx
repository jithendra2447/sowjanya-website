import { useState, useEffect } from "react";
import { User, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("lsc_profile_autofill");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setName(p.name || "");
        setPhone(p.phone || "");
        setAddress(p.address || "");
        setCity(p.city || "");
        setPincode(p.pincode || "");
      } catch (err) {
        console.error("Failed to load profile details", err);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (phone && phone.replace(/[^0-9]/g, "").length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (pincode && pincode.replace(/[^0-9]/g, "").length !== 6) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }

    localStorage.setItem("lsc_profile_autofill", JSON.stringify({
      name, phone, address, city, pincode
    }));
    toast.success("Profile delivery details saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 pt-28 md:pt-36 text-left">
      <div className="max-w-md mx-auto px-4">
        
        <div className="bg-white p-6 sm:p-8 rounded-[32px] neuo-flat border border-white space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-full bg-brand-pastel-pink/20 flex items-center justify-center text-brand-dark shrink-0">
              <User className="w-5.5 h-5.5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">Your Profile</h2>
              <p className="text-[10px] text-stone-400 font-semibold">Save details to autocomplete checkouts instantly.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-bold text-stone-700">
            <div className="space-y-1">
              <label htmlFor="prof-name" className="uppercase tracking-wider">Full Name</label>
              <input
                id="prof-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prof-phone" className="uppercase tracking-wider">Phone Number</label>
              <input
                id="prof-phone"
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prof-address" className="uppercase tracking-wider">Default Address</label>
              <input
                id="prof-address"
                type="text"
                placeholder="Flat number, building, street, area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="prof-city" className="uppercase tracking-wider">City</label>
                <input
                  id="prof-city"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="prof-pincode" className="uppercase tracking-wider">Pincode</label>
                <input
                  id="prof-pincode"
                  type="text"
                  maxLength={6}
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#120e17] hover:bg-[#2d1c3d] text-white text-xs font-extrabold uppercase rounded-full tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Delivery Details</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
