import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { usePageCms, type CmsPageData, defaultCmsData } from "@/hooks/usePageCms";
import { Lock, Sparkles, Check, Trash2, Edit3, Plus, Settings, ShoppingBag, Eye, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, resetInventory } = useInventory();
  const { pageCms, updateCmsSetting } = usePageCms();

  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"inventory" | "cms">("inventory");

  // Product Form states
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [pSlug, setPSlug] = useState("");
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("Sarees");
  const [pPrice, setPPrice] = useState("");
  const [pOriginalPrice, setPOriginalPrice] = useState("");
  const [pImage, setPImage] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pStock, setPStock] = useState("10");
  const [pBestseller, setPBestseller] = useState(false);

  // CMS Form states (Announcement/Footer settings)
  const [aText1, setAText1] = useState(pageCms.announcement?.announcementText1 || "");
  const [aText2, setAText2] = useState(pageCms.announcement?.announcementText2 || "");
  const [aPhone, setAPhone] = useState(pageCms.announcement?.assistancePhone || "");
  const [fPhone, setFPhone] = useState(pageCms.footer?.phoneDisplay || "");
  const [fEmail, setFEmail] = useState(pageCms.footer?.email || "");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "lscadmin123") {
      setIsAuth(true);
      toast.success("Welcome back, Administrator!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pSlug || !pName || !pPrice || !pImage) {
      toast.error("Please fill in slug, name, price, and image URL.");
      return;
    }

    const itemObj = {
      slug: pSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: pName.trim(),
      category: pCategory,
      price: Number(pPrice),
      originalPrice: pOriginalPrice ? Number(pOriginalPrice) : undefined,
      image: pImage.trim(),
      description: pDescription.trim(),
      stock: Number(pStock),
      bestseller: pBestseller,
      sizes: pCategory === "Sarees" ? ["Regular"] : pCategory === "Jewellery" ? ["Free Size"] : ["One Size"]
    };

    if (editingSlug) {
      updateProduct(itemObj);
      toast.success("Product updated successfully!");
      setEditingSlug(null);
    } else {
      // Check duplicate slug
      if (products.some(p => p.slug === itemObj.slug)) {
        toast.error("A product with this slug already exists!");
        return;
      }
      addProduct(itemObj);
      toast.success("New product added to inventory!");
    }

    // Reset Form
    setPSlug("");
    setPName("");
    setPPrice("");
    setPOriginalPrice("");
    setPImage("");
    setPDescription("");
    setPStock("10");
    setPBestseller(false);
  };

  const handleEditInit = (p: any) => {
    setEditingSlug(p.slug);
    setPSlug(p.slug);
    setPName(p.name);
    setPCategory(p.category);
    setPPrice(String(p.price));
    setPOriginalPrice(p.originalPrice ? String(p.originalPrice) : "");
    setPImage(p.image);
    setPDescription(p.description || "");
    setPStock(String(p.stock ?? 10));
    setPBestseller(p.bestseller || false);
    toast.info(`Editing: ${p.name}`);
  };

  const handleCmsSave = async () => {
    // 1. Update announcement section
    const newAnn = {
      ...pageCms.announcement,
      announcementText1: aText1,
      announcementText2: aText2,
      assistancePhone: aPhone
    };
    await updateCmsSetting("announcement", newAnn);

    // 2. Update footer section
    const newFooter = {
      ...pageCms.footer,
      phoneDisplay: fPhone,
      email: fEmail
    };
    await updateCmsSetting("footer", newFooter);

    toast.success("CMS configurations successfully synced with MongoDB.");
  };

  const handleResetCatalog = async () => {
    if (window.confirm("Are you sure you want to delete all current products and reset the database to original seeds?")) {
      await resetInventory();
      await updateCmsSetting("home", defaultCmsData.home);
      await updateCmsSetting("navbar", defaultCmsData.navbar);
      await updateCmsSetting("announcement", defaultCmsData.announcement);
      await updateCmsSetting("footer", defaultCmsData.footer);
      setAText1(defaultCmsData.announcement.announcementText1 || "");
      setAText2(defaultCmsData.announcement.announcementText2 || "");
      setAPhone(defaultCmsData.announcement.assistancePhone || "");
      setFPhone(defaultCmsData.footer.phoneDisplay || "");
      setFEmail(defaultCmsData.footer.email || "");
      toast.success("Database and website configurations reset to clean seeds!");
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center pt-20 px-4">
        <div className="bg-white p-8 rounded-[32px] neuo-flat border border-white max-w-sm w-full space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-pastel-pink/20 flex items-center justify-center mx-auto text-brand-dark">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 uppercase tracking-wider">Admin Console</h2>
            <p className="text-xs text-stone-400 font-semibold mt-1">Please enter your password to authenticate.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold text-stone-700">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-950 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink text-center font-mono"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#120e17] hover:bg-[#2d1c3d] text-white text-xs font-extrabold uppercase rounded-full tracking-wider shadow-md transition-colors"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 pt-28 md:pt-36 text-left">
      <div className="max-w-[1440px] mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-[32px] neuo-flat border border-white">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase tracking-wide">
              Store Control Panel
            </h1>
            <p className="text-xs text-stone-400 font-semibold mt-0.5">
              Live updates linked directly to MongoDB.
            </p>
          </div>
          <button 
            onClick={() => setIsAuth(false)}
            className="flex items-center gap-1.5 bg-stone-100 hover:bg-red-50 hover:text-red-500 text-stone-600 text-xs font-bold px-4.5 py-2.5 rounded-full transition-colors self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("inventory")}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs border transition-all cursor-pointer",
              activeTab === "inventory" ? "bg-[#120e17] text-white border-transparent" : "bg-white text-stone-600 border-stone-200"
            )}
          >
            Manage Inventory
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs border transition-all cursor-pointer",
              activeTab === "cms" ? "bg-[#120e17] text-white border-transparent" : "bg-white text-stone-600 border-stone-200"
            )}
          >
            CMS Configurations
          </button>
        </div>

        {activeTab === "inventory" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Inventory Form (Left Column) */}
            <div className="lg:col-span-1 bg-white p-6 rounded-[32px] neuo-flat border border-white space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark pb-2 border-b border-stone-100 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> {editingSlug ? "Edit Product" : "Add Product"}
              </h3>

              <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-bold text-stone-700">
                <div className="space-y-1">
                  <label htmlFor="prod-slug" className="uppercase tracking-wider">Product Slug</label>
                  <input
                    id="prod-slug"
                    type="text"
                    required
                    disabled={!!editingSlug}
                    placeholder="kanjivaram-maroon-silk"
                    value={pSlug}
                    onChange={(e) => setPSlug(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="prod-name" className="uppercase tracking-wider">Product Name</label>
                  <input
                    id="prod-name"
                    type="text"
                    required
                    placeholder="Royal Kanjivaram Maroon Silk Saree"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="prod-cat" className="uppercase tracking-wider">Category</label>
                    <select
                      id="prod-cat"
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                    >
                      <option value="Sarees">Sarees</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Scoops">Scoops</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="prod-stock" className="uppercase tracking-wider">Stock Qty</label>
                    <input
                      id="prod-stock"
                      type="number"
                      required
                      placeholder="10"
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="prod-price" className="uppercase tracking-wider">Price (₹)</label>
                    <input
                      id="prod-price"
                      type="number"
                      required
                      placeholder="8499"
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="prod-orig-price" className="uppercase tracking-wider">Original Price (₹)</label>
                    <input
                      id="prod-orig-price"
                      type="number"
                      placeholder="12500"
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="prod-img" className="uppercase tracking-wider">Image URL</label>
                  <input
                    id="prod-img"
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="prod-desc" className="uppercase tracking-wider">Description</label>
                  <textarea
                    id="prod-desc"
                    placeholder="Detailed specifications about pure handloom silk weaves, gold embroidery, gems and kemp stone plating care instructions..."
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink h-20 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 py-1.5">
                  <input
                    id="prod-bestseller"
                    type="checkbox"
                    checked={pBestseller}
                    onChange={(e) => setPBestseller(e.target.checked)}
                    className="w-4 h-4 rounded-md border border-stone-200 text-brand-dark focus:ring-brand-pastel-pink cursor-pointer"
                  />
                  <label htmlFor="prod-bestseller" className="uppercase tracking-wider select-none cursor-pointer">Bestseller Highlight</label>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingSlug && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSlug(null);
                        setPSlug("");
                        setPName("");
                        setPPrice("");
                        setPOriginalPrice("");
                        setPImage("");
                        setPDescription("");
                        setPStock("10");
                        setPBestseller(false);
                      }}
                      className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-extrabold uppercase rounded-full tracking-wider text-center"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#120e17] hover:bg-[#2d1c3d] text-white text-xs font-extrabold uppercase rounded-full tracking-wider shadow-md text-center cursor-pointer"
                  >
                    {editingSlug ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>

            {/* Inventory Table List (Right Columns) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-[32px] neuo-flat border border-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" /> Live Inventory ({products.length})
                </h3>
                <button
                  onClick={handleResetCatalog}
                  className="flex items-center gap-1 bg-stone-100 hover:bg-red-50 hover:text-red-500 text-stone-600 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Database</span>
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50 font-bold uppercase tracking-wider text-stone-500 text-left">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-center">Stock</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700 font-semibold">
                    {products.map((p) => (
                      <tr key={p.slug} className="hover:bg-stone-50/50">
                        <td className="px-4 py-3 flex items-center gap-2 max-w-xs">
                          <img src={p.image} alt={p.name} className="w-8 h-8 object-cover rounded-lg border" />
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate">{p.name}</p>
                            <p className="text-[10px] text-stone-400 truncate">{p.slug}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">{p.category}</td>
                        <td className="px-4 py-3 text-right font-bold text-stone-900">₹{p.price.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", p.stock === 0 ? "bg-red-50 text-red-500 border border-red-100" : "bg-emerald-50 text-emerald-500 border border-emerald-100")}>
                            {p.stock ?? 10}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditInit(p)} className="p-1 hover:bg-stone-100 rounded-md text-stone-500 hover:text-brand-dark" aria-label="Edit product">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => { if(window.confirm(`Delete ${p.name}?`)) deleteProduct(p.slug); }} className="p-1 hover:bg-red-50 rounded-md text-stone-500 hover:text-red-500" aria-label="Delete product">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* CMS config tab */
          <div className="bg-white p-6 sm:p-8 rounded-[32px] neuo-flat border border-white space-y-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-dark pb-2 border-b border-stone-100 flex items-center gap-1.5">
              <Settings className="w-4 h-4" /> Page CMS settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-stone-700">
              
              {/* Announcement ticker settings */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50/70 border border-stone-100 shadow-2xs">
                <h4 className="text-xs uppercase tracking-wider text-brand-dark font-extrabold border-b border-stone-200 pb-2">Announcement Banner</h4>
                
                <div className="space-y-1">
                  <label htmlFor="ticker-1" className="uppercase tracking-wider">Announcement Text 1</label>
                  <input
                    id="ticker-1"
                    type="text"
                    value={aText1}
                    onChange={(e) => setAText1(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="ticker-2" className="uppercase tracking-wider">Announcement Text 2</label>
                  <input
                    id="ticker-2"
                    type="text"
                    value={aText2}
                    onChange={(e) => setAText2(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="ticker-phone" className="uppercase tracking-wider">Assistance Hotline Phone</label>
                  <input
                    id="ticker-phone"
                    type="text"
                    value={aPhone}
                    onChange={(e) => setAPhone(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>
              </div>

              {/* Contact / Footer details */}
              <div className="space-y-4 p-5 rounded-2xl bg-stone-50/70 border border-stone-100 shadow-2xs">
                <h4 className="text-xs uppercase tracking-wider text-brand-dark font-extrabold border-b border-stone-200 pb-2">Store Contact Information</h4>
                
                <div className="space-y-1">
                  <label htmlFor="contact-phone" className="uppercase tracking-wider">Contact Phone Display</label>
                  <input
                    id="contact-phone"
                    type="text"
                    value={fPhone}
                    onChange={(e) => setFPhone(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-email" className="uppercase tracking-wider">Contact Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={fEmail}
                    onChange={(e) => setFEmail(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-pastel-pink"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button
                onClick={handleCmsSave}
                className="px-8 py-3.5 bg-[#120e17] hover:bg-[#2d1c3d] text-white text-xs font-extrabold uppercase rounded-full tracking-wider shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save CMS Configurations</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
