import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { Toaster } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConnectFab from "@/components/ConnectFab";

// Pages
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import Wishlist from "@/pages/Wishlist";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <InventoryProvider>
        <CartProvider>
          <WishlistProvider>
            
            <div className="flex flex-col min-h-screen">
              <Header />
              
              <main className="flex-1 w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>

              <Footer />
              <ConnectFab />
            </div>

            <Toaster 
              position="top-center" 
              toastOptions={{
                style: {
                  borderRadius: '1.25rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid #f3f4f6'
                }
              }}
            />
            
          </WishlistProvider>
        </CartProvider>
      </InventoryProvider>
    </BrowserRouter>
  );
}
