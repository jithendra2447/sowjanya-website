import { useState, useEffect } from "react";
import { fetchCmsSettingsFromAPI, upsertCmsSettingToAPI } from "@/lib/api";

export interface HeroBanner {
  tag?: string;
  offer?: string;
  desc: string;
  link: string;
  img?: string;
  btnText?: string;
}

export interface CuratedCategory {
  name: string;
  tag?: string;
  img?: string;
  link: string;
}

export interface CmsPageData {
  home: {
    showHero?: boolean;
    heroBanners: HeroBanner[];
    showPriceBands?: boolean;
    band1Label: string;
    band2Label: string;
    band3Label: string;
    band4Label: string;
    showShopByCategory?: boolean;
    categorySectionTitle: string;
    shopCat1Title?: string;
    shopCat1Image?: string;
    shopCat2Title?: string;
    shopCat2Image?: string;
    shopCat3Title?: string;
    shopCat3Image?: string;
    showTrustStrip?: boolean;
    trust1Title: string;
    trust1Subtitle: string;
    trust2Title: string;
    trust2Subtitle: string;
    trust3Title: string;
    trust3Subtitle: string;
    trust4Title: string;
    trust4Subtitle: string;
    showCategories?: boolean;
    showNewlyUploaded?: boolean;
    newlyUploadedTitle?: string;
    newlyUploadedSlugs?: string[];
    showBestsellers?: boolean;
    bestsellerSectionTitle?: string;
    bestsellerSlugs?: string[];
    showYoutube?: boolean;
    globalOffer?: {
      isActive: boolean;
      title: string;
      code: string;
      discountPercentage: number;
      endDate: string;
    };
  };
  navbar: {
    logoUrl?: string;
    showSareesLink?: boolean;
    sareesLabel?: string;
    showJewelleryLink?: boolean;
    jewelleryLabel?: string;
    showScoopsLink?: boolean;
    scoopsLabel?: string;
    showShopAllLink?: boolean;
    shopAllLabel?: string;
    showAboutLink?: boolean;
    aboutLabel?: string;
    showContactLink?: boolean;
    contactLabel?: string;
    searchPlaceholder?: string;
  };
  announcement: {
    showAnnouncement?: boolean;
    badgeText?: string;
    announcementText1?: string;
    announcementText2?: string;
    assistanceLabel?: string;
    assistancePhone?: string;
  };
  footer: {
    instagramLink?: string;
    youtubeLink?: string;
    phoneDisplay?: string;
    email?: string;
    location?: string;
  };
}

export const defaultCmsData: CmsPageData = {
  home: {
    showHero: true,
    heroBanners: [
      {
        tag: "WELCOME",
        offer: "Your New Storefront",
        desc: "Customize this hero slider and edit announcements directly from the Admin control panel.",
        link: "/shop",
        img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=cover",
        btnText: "Shop Catalog"
      }
    ],
    showPriceBands: true,
    band1Label: "Under ₹2,000",
    band2Label: "₹2k to ₹5k",
    band3Label: "₹5k to ₹8k",
    band4Label: "Above ₹8k",
    showShopByCategory: true,
    categorySectionTitle: "Shop by Collections",
    shopCat1Title: "Sarees",
    shopCat1Image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=cover",
    shopCat2Title: "Jewellery",
    shopCat2Image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=cover",
    shopCat3Title: "Scoops",
    shopCat3Image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=cover",
    showTrustStrip: true,
    trust1Title: "Express Shipping",
    trust1Subtitle: "Free shipping across India",
    trust2Title: "Premium Quality",
    trust2Subtitle: "Verified quality & craftsmanship",
    trust3Title: "Secure Payments",
    trust3Subtitle: "UPI, card & wallets checkout",
    trust4Title: "Order Support",
    trust4Subtitle: "WhatsApp order tracking",
    showCategories: true,
    showNewlyUploaded: true,
    newlyUploadedTitle: "New Arrivals",
    newlyUploadedSlugs: [],
    showBestsellers: true,
    bestsellerSectionTitle: "Best Sellers",
    bestsellerSlugs: [],
    showYoutube: false,
    globalOffer: {
      isActive: false,
      title: "Festive Sale!",
      code: "FESTIVE10",
      discountPercentage: 10,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  navbar: {
    logoUrl: "",
    showSareesLink: true,
    sareesLabel: "Sarees",
    showJewelleryLink: true,
    jewelleryLabel: "Jewellery",
    showScoopsLink: true,
    scoopsLabel: "Scoops",
    showShopAllLink: true,
    shopAllLabel: "Shop All",
    showAboutLink: true,
    aboutLabel: "About",
    showContactLink: true,
    contactLabel: "Contact",
    searchPlaceholder: "Search catalog..."
  },
  announcement: {
    showAnnouncement: true,
    badgeText: "Welcome",
    announcementText1: "Enjoy express delivery across India! | WhatsApp order tracking enabled",
    announcementText2: "Handcrafted heritage collections.",
    assistanceLabel: "WhatsApp Support:",
    assistancePhone: "+91 00000 00000"
  },
  footer: {
    instagramLink: "https://instagram.com",
    youtubeLink: "https://youtube.com",
    phoneDisplay: "+91 00000 00000",
    email: "support@example.com",
    location: "India"
  }
};

export function usePageCms() {
  const [pageCms, setPageCms] = useState<CmsPageData>(defaultCmsData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCms() {
      try {
        const data = await fetchCmsSettingsFromAPI();
        if (data && Object.keys(data).length > 0) {
          const merged: CmsPageData = {
            home: { ...defaultCmsData.home, ...data.home },
            navbar: { ...defaultCmsData.navbar, ...data.navbar },
            announcement: { ...defaultCmsData.announcement, ...data.announcement },
            footer: { ...defaultCmsData.footer, ...data.footer }
          };
          setPageCms(merged);
        } else {
          console.info("[usePageCms] CMS settings empty in database, saving defaults...");
          await upsertCmsSettingToAPI('home', defaultCmsData.home);
          await upsertCmsSettingToAPI('navbar', defaultCmsData.navbar);
          await upsertCmsSettingToAPI('announcement', defaultCmsData.announcement);
          await upsertCmsSettingToAPI('footer', defaultCmsData.footer);
        }
      } catch (err) {
        console.warn("Using local default CMS settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCms();
  }, []);

  const updateCmsSetting = async (section: keyof CmsPageData, value: any) => {
    try {
      setPageCms(prev => ({
        ...prev,
        [section]: value
      }));
      await upsertCmsSettingToAPI(section, value);
    } catch (err) {
      console.error("Failed to update CMS settings:", err);
    }
  };

  return { pageCms, loading, updateCmsSetting };
}
