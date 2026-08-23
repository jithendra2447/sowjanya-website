import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { createOrderInAPI } from "@/lib/api";
import { buildWhatsAppUrl, buildOrderMessage } from "@/lib/whatsapp";
import { CreditCard, MessageSquare, CheckCircle, RefreshCw, AlertCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [instruction, setInstruction] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "razorpay">("whatsapp");
  const [loading, setLoading] = useState(false);

  // Discount info
  const [promoInfo, setPromoInfo] = useState<{ code: string; amount: number; finalTotal: number } | null>(null);

  // Load applied coupon and profile details on mount
  useEffect(() => {
    const savedPromo = localStorage.getItem("lsc_applied_promo");
    if (savedPromo) {
      setPromoInfo(JSON.parse(savedPromo));
    }

    const savedProfile = localStorage.getItem("lsc_profile_autofill");
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        setName(p.name || "");
        setPhone(p.phone || "");
        setAddress(p.address || "");
        setCity(p.city || "");
        setPincode(p.pincode || "");
      } catch (err) {
        console.error("Failed to parse autofill profile", err);
      }
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <ShoppingBag className="w-12 h-12 text-stone-300 mb-4" />
        <h2 className="text-lg font-bold text-stone-800 uppercase tracking-wider">No Items to Checkout</h2>
        <Link to="/shop" className="mt-5 px-6 py-2.5 bg-brand-dark text-white text-xs font-extrabold uppercase rounded-full shadow-md">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const finalAmount = promoInfo ? promoInfo.finalTotal : subtotal;

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter your shipping address.");
      return false;
    }
    if (!city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }
    const cleanPin = pincode.replace(/[^0-9]/g, "");
    if (cleanPin.length !== 6) {
      toast.error("Please enter a valid 6-digit Pincode.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Auto-save shipping details for profile autofill
    localStorage.setItem("lsc_profile_autofill", JSON.stringify({
      name, phone, address, city, pincode
    }));

    if (paymentMethod === "whatsapp") {
      // WhatsApp Order Summary Redirection
      try {
        const orderData = {
          id: orderId,
          customer_name: name,
          customer_phone: phone,
          shipping_address: `${address}, ${city} - ${pincode}`,
          total_amount: finalAmount,
          payment_method: "WhatsApp COD",
          payment_status: "Pending",
          order_status: "Pending",
          items: items.map(i => ({
            slug: i.slug,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            itemCode: i.itemCode,
          })),
        };

        // Log order to database
        await createOrderInAPI(orderData);

        const customer = { name, phone, address, city, pincode, instruction };
        const orderMsg = buildOrderMessage(orderId, items, subtotal, customer, promoInfo || undefined);
        const link = buildWhatsAppUrl(orderMsg);
        
        toast.success("Order recorded. Redirecting to WhatsApp...");
        clear();
        localStorage.removeItem("lsc_applied_promo");
        
        setTimeout(() => {
          window.open(link, "_blank");
          navigate("/");
        }, 1500);
      } catch (err: any) {
        toast.error(`Error saving order: ${err.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      // Razorpay Checkout Integration
      try {
        // 1. Fetch Razorpay Order from Backend API
        const orderRes = await fetch("/api/create-razorpay-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: finalAmount }),
        });

        if (!orderRes.ok) {
          throw new Error("Failed to initialize Razorpay checkout session.");
        }

        const rzpData = await orderRes.json();

        // 2. Load Razorpay Script
        const loadRzpScript = () => {
          return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const loaded = await loadRzpScript();
        if (!loaded) {
          toast.error("Razorpay script failed to load. Please verify your connection.");
          setLoading(false);
          return;
        }

        // 3. Launch Checkout Window
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || rzpData.key_id || "rzp_test_dummy_key",
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: "LS Collections",
          description: "Premium Sarees & Jewellery Checkout",
          order_id: rzpData.id,
          prefill: {
            name: name,
            contact: phone,
          },
          theme: {
            color: "#4A0E17",
          },
          handler: async function (response: any) {
            // Payment success callback
            try {
              const orderData = {
                id: orderId,
                customer_name: name,
                customer_phone: phone,
                shipping_address: `${address}, ${city} - ${pincode}`,
                total_amount: finalAmount,
                payment_method: "Razorpay Online",
                payment_status: "Paid",
                order_status: "Pending",
                items: items.map(i => ({
                  slug: i.slug,
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity,
                  image: i.image,
                  itemCode: i.itemCode,
                })),
              };

              // Write paid order to MongoDB
              await createOrderInAPI(orderData);

              toast.success("Payment successful! Order processed.");
              clear();
              localStorage.removeItem("lsc_applied_promo");
              navigate("/");
            } catch (err: any) {
              toast.error("Payment was successful but failed to log order in database.");
            }
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment cancelled by customer.");
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err: any) {
        console.error(err);
        toast.error(`Checkout Session Error: ${err.message}`);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 pt-28 md:pt-36 text-left">
      <div className="max-w-[1440px] mx-auto px-4">
        
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase tracking-wide mb-6">
          Checkout Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Shipping Form (Grid Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[32px] neuo-flat border border-white space-y-6">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark pb-3 border-b border-stone-100">
                Shipping Address
              </h3>

              <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs font-bold text-stone-700">
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="uppercase tracking-wider">Full Name</label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone-input" className="uppercase tracking-wider">Phone Number (10 digits)</label>
                  <input
                    id="phone-input"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="address-input" className="uppercase tracking-wider">Delivery Address</label>
                  <input
                    id="address-input"
                    type="text"
                    required
                    placeholder="House number, flat, street, area details"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="city-input" className="uppercase tracking-wider">City</label>
                    <input
                      id="city-input"
                      type="text"
                      required
                      placeholder="City/Town"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="pincode-input" className="uppercase tracking-wider">Pincode (6 digits)</label>
                    <input
                      id="pincode-input"
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-digit PIN code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="instruction-input" className="uppercase tracking-wider">Order Instructions (Optional)</label>
                  <textarea
                    id="instruction-input"
                    placeholder="Custom blouse stitching requests, preferred delivery times, landmarks..."
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink h-20 resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Payment Options (Grid Bottom Left) */}
            <div className="bg-white p-6 rounded-[32px] neuo-flat border border-white space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark pb-2 border-b border-stone-100">
                Payment Option
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Order Button selector */}
                <button
                  onClick={() => setPaymentMethod("whatsapp")}
                  className={cn(
                    "flex items-start gap-3.5 p-4 rounded-2xl border text-left cursor-pointer transition-all",
                    paymentMethod === "whatsapp" ? "border-emerald-500 bg-emerald-50/50 shadow-inner" : "border-stone-200 hover:border-stone-300"
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <MessageSquare className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">WhatsApp Checkout</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">Submit details, review summary, and complete order via WhatsApp chat.</p>
                  </div>
                </button>

                {/* Razorpay selector */}
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={cn(
                    "flex items-start gap-3.5 p-4 rounded-2xl border text-left cursor-pointer transition-all",
                    paymentMethod === "razorpay" ? "border-brand-dark bg-stone-50 shadow-inner" : "border-stone-200 hover:border-stone-300"
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-brand-dark shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">Online Payment</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">Pay instantly and securely via Razorpay UPI, Cards, Netbanking.</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Checkout Ledger (Grid Right) */}
          <aside className="w-full bg-white p-6 rounded-[32px] neuo-flat border border-white space-y-6 shrink-0">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark pb-3 border-b border-stone-100">
              Your Order Ledger
            </h3>

            {/* Items display list */}
            <div className="divide-y divide-stone-100 max-h-[220px] overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.slug} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={i.image} alt={i.name} className="w-8 h-8 object-cover rounded-lg border" />
                    <span className="font-bold text-stone-800 truncate max-w-[120px]">{i.name}</span>
                    <span className="text-[10px] text-stone-400 font-bold">x{i.quantity}</span>
                  </div>
                  <span className="font-extrabold text-stone-900">₹{(i.price * i.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="space-y-3 pt-3 border-t border-stone-100 text-xs font-bold">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {promoInfo && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promo Discount ({promoInfo.code})</span>
                  <span>-₹{promoInfo.amount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500">
                <span>Shipping Fee</span>
                <span className="text-emerald-600 uppercase">FREE</span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-stone-100 text-stone-900">
                <span>Final Payable</span>
                <span className="font-extrabold text-base">₹{finalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 bg-[#120e17] hover:bg-[#2d1c3d] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-full shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : paymentMethod === "whatsapp" ? (
                <>
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>Submit Order via WhatsApp</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4.5 h-4.5" />
                  <span>Pay Now with Razorpay</span>
                </>
              )}
            </button>
          </aside>

        </div>

      </div>
    </div>
  );
}
