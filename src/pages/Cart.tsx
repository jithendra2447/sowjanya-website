import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { usePageCms } from "@/hooks/usePageCms";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Ticket, Percent } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, clear } = useCart();
  const { pageCms } = usePageCms();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);

  const homeCms = pageCms.home;
  const globalOffer = homeCms.globalOffer || { isActive: false, title: "", code: "", discountPercentage: 0, endDate: "" };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const code = promoCode.toUpperCase().trim();

    if (globalOffer.isActive && code === globalOffer.code?.toUpperCase()) {
      setAppliedPromo({ code, percent: globalOffer.discountPercentage });
      toast.success(`Coupon code ${code} applied successfully!`);
    } else if (code === "PASTEL15") {
      setAppliedPromo({ code, percent: 15 });
      toast.success("Coupon code applied successfully! 15% discount applied.");
    } else {
      toast.error("Invalid coupon code. Please try another.");
    }
    setPromoCode("");
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.info("Coupon code removed");
  };

  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.percent) / 100) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleCheckoutClick = () => {
    if (appliedPromo) {
      localStorage.setItem("lsc_applied_promo", JSON.stringify({
        code: appliedPromo.code,
        amount: discountAmount,
        finalTotal: finalTotal
      }));
    } else {
      localStorage.removeItem("lsc_applied_promo");
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 pt-28 md:pt-36 text-left">
      <div className="max-w-[1440px] mx-auto px-4">
        
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase tracking-wide mb-6">
          Shopping Bag
        </h1>

        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Items List Column */}
            <div className="flex-1 w-full space-y-4">
              <div className="bg-white p-4 sm:p-6 rounded-[32px] neuo-flat border border-white space-y-4">
                {items.map((item) => (
                  <div key={item.slug} className="flex gap-4 p-4 rounded-2xl bg-stone-50/70 border border-stone-100 items-center justify-between">
                    <div className="flex gap-4 items-center min-w-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border shrink-0" />
                      <div className="min-w-0 text-left">
                        <Link to={`/product/${item.slug}`} className="hover:text-brand-dark transition-colors">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate max-w-[200px] sm:max-w-xs">{item.name}</h4>
                        </Link>
                        {item.itemCode && <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Code: {item.itemCode}</p>}
                        <p className="text-xs font-bold text-stone-700 mt-1 sm:hidden">₹{item.price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="text-sm font-extrabold text-stone-900 hidden sm:block">₹{item.price.toLocaleString("en-IN")}</span>
                      
                      <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-full p-1">
                        <button 
                          onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          className="w-6 h-6 rounded-full hover:bg-stone-100 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5 text-stone-500" />
                        </button>
                        <span className="text-xs font-bold px-1 text-stone-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          className="w-6 h-6 rounded-full hover:bg-stone-100 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-stone-500" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-extrabold text-stone-900 w-16 sm:w-20 text-right">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>

                      <button 
                        onClick={() => removeItem(item.slug)}
                        className="text-stone-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={clear}
                className="text-xs font-bold text-stone-400 hover:text-red-500 uppercase px-2"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary Column */}
            <aside className="w-full lg:w-96 bg-white p-6 rounded-[32px] neuo-flat border border-white space-y-6 shrink-0">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark pb-3 border-b border-stone-100">
                Order Summary
              </h3>

              {/* Promo code entry */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wide block">Promo Coupon</span>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-brand-pastel-pink/15 px-3 py-2 rounded-xl border border-brand-pastel-pink/20">
                    <span className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5" /> {appliedPromo.code} ({appliedPromo.percent}% Off)
                    </span>
                    <button onClick={handleRemovePromo} className="text-stone-400 hover:text-stone-700 text-xs font-bold uppercase cursor-pointer">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink text-stone-900 font-mono font-bold"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-brand-dark hover:bg-[#2d1c3d] text-white text-xs font-extrabold uppercase rounded-xl cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {globalOffer.isActive && !appliedPromo && (
                  <p className="text-[10px] text-stone-400 font-semibold leading-relaxed">
                    💡 Tip: Apply code <span className="font-bold text-brand-dark">{globalOffer.code}</span> for a {globalOffer.discountPercentage}% festive discount!
                  </p>
                )}
              </div>

              {/* Calculation ledger */}
              <div className="space-y-3 pt-3 border-t border-stone-100 text-xs font-bold">
                <div className="flex justify-between text-stone-500">
                  <span>Cart Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-600 uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-stone-100 text-stone-900">
                  <span>Grand Total</span>
                  <span className="font-extrabold text-base">₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout actions */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 bg-[#120e17] hover:bg-[#2d1c3d] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-full shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </aside>

          </div>
        ) : (
          <div className="bg-white p-16 rounded-[32px] neuo-flat border border-white text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 shadow-inner">
              <ShoppingBag className="w-7 h-7 text-stone-300" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Your Shopping bag is empty</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-[280px] mx-auto">It looks like you haven't added anything to your cart yet.</p>
            </div>
            <Link to="/shop" className="px-6 py-2.5 bg-brand-dark text-white text-xs font-extrabold uppercase rounded-full shadow-md">
              Start Shopping
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
