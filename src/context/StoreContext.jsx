import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_CATEGORIES } from '../data/initialCategories';
import { INITIAL_COLLECTIONS } from '../data/initialCollections';
import { INITIAL_STORES } from '../data/initialStores';
import { IRAQ_GOVERNORATES } from '../data/governorates';
import { resolveVideoUrl } from '../utils/mediaStorage';

const StoreContext = createContext();

const INITIAL_ORDERS = [];


const INITIAL_CMS_SECTIONS = [
  { id: 'hero', name: 'Hero Banner & Video Showcase', isVisible: true, order: 1 },
  { id: 'categories', name: 'The Sanaria Edit (Editorial Fashion Campaign)', isVisible: true, order: 2 },
  { id: 'runway_reels', name: 'Sanaria Runway Video Showcase (Live Reels)', isVisible: true, order: 3 },
  { id: 'new_arrivals', name: 'New Season Gallery (New Arrivals)', isVisible: true, order: 4 },
  { id: 'promotional_banner', name: 'Promotional Campaign Banner', isVisible: true, order: 5 },
  { id: 'stores', name: 'Boutique Locations (Baghdad & Erbil)', isVisible: true, order: 6 },
  { id: 'delivery', name: 'Iraq Express Delivery Trust', isVisible: true, order: 7 },
  { id: 'instagram', name: 'Instagram Lookbook Feed', isVisible: true, order: 8 }
];

const INITIAL_CMS = {
  hero: {
    title: {
      en: 'Sanaria Fashion',
      ar: 'Sanaria Fashion',
      ku: 'Sanaria Fashion',
      tr: 'Sanaria Fashion'
    },
    since: {
      en: 'SINCE 1992',
      ar: 'منذ عام 1992',
      ku: 'لە ساڵی ١٩٩٢ـەوە',
      tr: '1992\'DEN BERİ'
    },
    tagline: {
      en: 'Timeless Elegance & Haute Couture',
      ar: 'الفخامة والأناقة الراقية المعاصرة',
      ku: 'شاهانەیی نەمر و مۆدێلی بەرز و ناوازە',
      tr: 'Zamansız Zarafet ve Haute Couture'
    },
    image: '/placeholder-luxury.svg',
    videoUrl: '',
    primaryButtonText: {
      en: "SHOP WOMEN'S COLLECTION",
      ar: 'تسوق تشكيلة النساء',
      ku: 'کڕینی کۆلێکژنی ئافرەتان',
      tr: 'KADIN KOLEKSİYONUNU KEŞFET'
    },
    secondaryButtonText: {
      en: 'VIEW LOOKBOOK',
      ar: 'دفتر الإطلالات',
      ku: 'لوک بووک',
      tr: 'LOOKBOOK İNCELE'
    }
  },
  banners: {
    announcement: {
      en: 'Official Sanaria Fashion Boutique — Express Delivery Across All Iraqi Governorates',
      ar: 'متجر Sanaria Fashion الرسمي — توصيل سريع وموثوق لكافة محافظات العراق',
      ku: 'فرۆشگای فەرمی Sanaria Fashion — گەیاندنی خێرا بۆ هەموو پارێزگاکانی عێراق',
      tr: 'Resmi Sanaria Fashion Butiği — Tüm Irak Vilayetlerine Hızlı Teslimat'
    },
    promotionalBanner: {
      isVisible: true,
      image: '/placeholder-luxury.svg',
      title: {
        en: 'THE AUTUMN / WINTER EDIT',
        ar: 'مجموعة الخريف والشتاء الحصرية',
        ku: 'کۆلێکژنی تایبەتی پایز و زستان',
        tr: 'SONBAHAR / KIŞ ÖZEL SEÇKİSİ'
      },
      subtitle: {
        en: 'Crafted with Italian heavyweight silk-crepe and bespoke virgin wool.',
        ar: 'منسوجة من الكريب الحريري الإيطالي الفاخر والصوف الطبيعي الخالص.',
        ku: 'دروستکراو لە ئاوریشمی کڕێپ و خوری سروشتی بەرز.',
        tr: 'İtalyan ağır ipek krepler ve özel saf yün terzilik ile hazırlandı.'
      },
      buttonText: {
        en: 'EXPLORE EDITORIAL',
        ar: 'استكشف المجموعة',
        ku: 'بینینی بەرهەمەکان',
        tr: 'SEÇKİYİ İNCELE'
      },
      linkCategory: 'women'
    }
  },
  sections: INITIAL_CMS_SECTIONS
};

export const DEFAULT_EDITORIAL_PLACEMENTS = {
  new_arrivals: {
    videoUrl: '/videos/showcase-couture-6998.mp4',
    title: 'New Arrivals',
    productId: null
  },
  evening_edit: {
    videoUrl: '/videos/showcase-runway-6998.mp4',
    title: 'The Evening Edit',
    productId: null
  },
  everyday_essentials: {
    videoUrl: '/videos/showcase-jacket-6768.mp4',
    title: 'Everyday Essentials',
    productId: null
  },
  signature_collection: {
    videoUrl: '/videos/showcase-ensemble-6931.mp4',
    title: 'Signature Collection',
    productId: null
  },
  runway_reels: {
    videoUrl: '',
    title: 'Runway Reels Showcase',
    productId: null
  },
  hero_banner: {
    videoUrl: '',
    title: 'Hero Banner',
    productId: null
  }
};

const INITIAL_PAYMENT_CONFIG = {
  qiCard: {
    enabled: true,
    title: 'Qi Card (Electronic Payment)',
    merchantId: 'QI-SANARIA-92801',
    terminalId: 'TRM-88180',
    mode: 'test',
    notes: 'National Iraqi Qi Card gateway connection'
  },
  fib: {
    enabled: true,
    title: 'First Iraqi Bank (FIB)',
    clientId: 'fib_client_sanaria_live_092',
    mode: 'test',
    notes: 'FIB direct mobile pay QR & digital account debit'
  },
  cod: {
    enabled: true,
    title: 'Cash on Delivery (COD)',
    notes: 'Inspection allowed upon courier arrival across all Iraqi cities'
  },
  cards: {
    enabled: true,
    title: 'Credit / Debit Cards (Visa & Mastercard)',
    provider: 'Sanaria Global Secure Pay',
    mode: 'test',
    notes: 'Compliant PCI-DSS card payment integration'
  }
};

const INITIAL_BUSINESS_SETTINGS = {
  brandName: 'Sanaria Fashion',
  establishedYear: '1992',
  phone: '+9647738888180',
  whatsapp: '+9647738888180',
  instagram: '@sanaria.fashion',
  instagramUrl: 'https://instagram.com/sanaria.fashion',
  email: 'contact@sanaria.waifly.com',
  currency: 'IQD',
  freeDeliveryThreshold: 150000,
  defaultDeliveryFee: 5000
};

const INITIAL_DISCOVER_CONFIG = {
  for_you: [],
  new_arrivals: [],
  women: [],
  men: [],
  accessories: []
};

// Helpers for permanent deletion tracking (prevents deleted items from resurrecting after page reload/reset)
export const getDeletedProductIds = () => {
  try {
    const d = localStorage.getItem('sanaria_deleted_product_ids');
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
};

export const getDeletedOrderIds = () => {
  try {
    const d = localStorage.getItem('sanaria_deleted_order_ids');
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
};

export const getDeletedCustomerIds = () => {
  try {
    const d = localStorage.getItem('sanaria_deleted_customer_ids');
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
};

const INITIAL_CUSTOMERS = [];

// Automatic migration purge for legacy mock data and external photos from browser cache
const SANARIA_STORAGE_VERSION = 'sanaria_v9_custom_admin_videos';
if (typeof window !== 'undefined') {
  try {
    const storedVersion = localStorage.getItem('sanaria_data_version');
    if (storedVersion !== SANARIA_STORAGE_VERSION) {
      localStorage.removeItem('sanaria_products');
      localStorage.removeItem('sanaria_categories');
      localStorage.removeItem('sanaria_collections');
      localStorage.removeItem('sanaria_orders');
      localStorage.removeItem('sanaria_customers');
      localStorage.removeItem('sanaria_discover_config');
      localStorage.removeItem('sanaria_cms');
      localStorage.setItem('sanaria_data_version', SANARIA_STORAGE_VERSION);
    }
  } catch (e) {
    console.error('Storage version migration error:', e);
  }
}

export const StoreProvider = ({ children }) => {
  // 1. PRODUCTS (User-added authentic pieces only)
  const [products, setProducts] = useState(() => {
    const deletedIds = getDeletedProductIds();
    const saved = localStorage.getItem('sanaria_products');
    let list = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    // Permanently filter out any deleted products!
    list = (list || []).filter(p => !deletedIds.includes(p.id));
    // Hard filter out any legacy demo/sample items, test items, and template runway items!
    list = list.filter(p => !p.id.startsWith('sf-w') && !p.id.startsWith('sf-m') && !p.id.startsWith('sf-b') && !p.id.startsWith('sf-a') && !p.id.startsWith('sf-runway'));
    list = list.filter(p => {
      const pName = typeof p.name === 'object' ? (p.name.ar || p.name.en || '') : String(p.name || '');
      return !pName.toLowerCase().includes('signature musk');
    });

    // Strip out any legacy unsplash images and hardcoded /videos/sanaria- files
    list = list.map(p => ({
      ...p,
      images: (p.images || []).filter(img => !img.includes('unsplash') && !img.startsWith('http')),
      videoUrl: (p.videoUrl && p.videoUrl.includes('/videos/sanaria-')) ? null : p.videoUrl
    }));

    return list.map(p => {
      const rawSizes = (Array.isArray(p.sizes) && p.sizes.length > 0)
        ? p.sizes
        : (Array.isArray(p.availableSizes) && p.availableSizes.length > 0)
        ? p.availableSizes
        : (p.sizeStock && Object.keys(p.sizeStock).length > 0)
        ? Object.keys(p.sizeStock)
        : ['38', '40', '42', '44'];

      const isOneSize = p.category === 'accessories' || p.category === 'bags' ||
        (rawSizes.length === 1 && (String(rawSizes[0]).toLowerCase().includes('one') || String(rawSizes[0]).toLowerCase().includes('standard')));

      const defaultAvailable = isOneSize 
        ? ['One Size'] 
        : (p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : rawSizes);

      let sizeStock = p.sizeStock;
      if (!sizeStock || Object.keys(sizeStock).length === 0) {
        sizeStock = {};
        defaultAvailable.forEach(s => {
          sizeStock[s] = 12;
        });
      }

      const totalStock = Object.values(sizeStock).reduce((sum, q) => sum + (Number(q) || 0), 0);

      return {
        ...p,
        sizes: isOneSize ? ['One Size'] : rawSizes,
        availableSizes: defaultAvailable,
        sizeStock,
        stock: p.stock !== undefined && p.stock > 0 ? p.stock : totalStock,
        ordersStopped: p.ordersStopped || false,
        stoppedSizes: p.stoppedSizes || [],
        isHidden: p.isHidden || false,
        isFeatured: p.isFeatured ?? true,
        isNew: p.isNew ?? true,
        isSale: p.isSale ?? Boolean(p.salePrice && p.salePrice < p.price)
      };
    });
  });

  // 2. CATEGORIES
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sanaria_categories');
    let cats = saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    // Sanitize any legacy men categories or unsplash photos from client localStorage
    cats = (cats || []).filter(c => c.id !== 'men' && c.id !== 'cat-men-suits' && c.id !== 'cat-shirts' && c.id !== 'cat-jackets' && c.parentId !== 'men');
    // Ensure no unsplash or external photos
    cats = cats.map(c => ({
      ...c,
      image: (c.image && (c.image.includes('unsplash') || c.image.startsWith('http'))) ? null : c.image
    }));
    // Sanitize names for clean luxury navigation
    cats = cats.map(c => {
      const updated = { ...c };
      if (c.id === 'dresses') {
        updated.name = { en: 'Dresses', ar: 'فساتين', ku: 'فستان', tr: 'Elbise' };
      } else if (c.id === 'tops') {
        updated.name = { en: 'Tops', ar: 'قمصان وبلوزات', ku: 'کراس و سێت', tr: 'Üst & Bluz' };
      }
      return updated;
    });
    if (!cats || cats.length === 0 || !cats.some(c => c.id === 'dresses' || c.id === 'tops')) {
      cats = INITIAL_CATEGORIES;
    }
    // Ensure perfumes category exists
    if (!cats.some(c => c.id === 'perfumes')) {
      const perfumeCat = INITIAL_CATEGORIES.find(c => c.id === 'perfumes');
      if (perfumeCat) cats.push(perfumeCat);
    }
    return cats;
  });

  // 3. COLLECTIONS
  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem('sanaria_collections');
    let cols = saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
    cols = (cols || []).map(col => ({
      ...col,
      coverImage: (col.coverImage && (col.coverImage.includes('unsplash') || col.coverImage.startsWith('http'))) ? null : col.coverImage,
      productIds: (col.productIds || []).filter(pid => !pid.startsWith('sf-w') && !pid.startsWith('sf-m') && !pid.startsWith('sf-b') && !pid.startsWith('sf-a'))
    }));
    if (!cols || cols.length === 0) cols = INITIAL_COLLECTIONS;
    return cols;
  });

  // 4. ORDERS (Clean - No fake orders)
  const [orders, setOrders] = useState(() => {
    const deletedOrderIds = getDeletedOrderIds();
    const saved = localStorage.getItem('sanaria_orders');
    let list = saved ? JSON.parse(saved) : INITIAL_ORDERS;
    return (list || []).filter(o => !deletedOrderIds.includes(o.id) && o.id !== 'SF-92-8412' && o.id !== 'SF-92-8411');
  });

  // 4c. CUSTOMERS (Clean - No fake customers)
  const [customers, setCustomers] = useState(() => {
    const deletedCustomerIds = getDeletedCustomerIds();
    const saved = localStorage.getItem('sanaria_customers');
    let list = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch {
        list = [];
      }
    }
    if (!list || list.length === 0) {
      list = INITIAL_CUSTOMERS;
    }
    return (list || []).filter(c => !deletedCustomerIds.includes(c.id) && !deletedCustomerIds.includes(c.phone) && !c.id.startsWith('cust-0'));
  });

  // 4b. CUSTOMER OWN ORDERS (Tracks orders placed by this customer/device for verified VIP support)
  const [customerOrders, setCustomerOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sanaria_customer_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sanaria_customer_orders', JSON.stringify(customerOrders));
      if (customerOrders.length > 0) {
        localStorage.setItem('sanaria_has_purchased', 'true');
      }
    } catch (e) {
      console.error('Error saving customer orders:', e);
    }
  }, [customerOrders]);

  // 5. STORES (v3 with Baghdad, Erbil & Sulaymaniyah Google Maps links)
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('sanaria_stores_v3');
    if (!saved) {
      localStorage.removeItem('sanaria_stores');
      return INITIAL_STORES;
    }
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length !== INITIAL_STORES.length || !parsed.some(s => s.city === 'sulaymaniyah')) {
        return INITIAL_STORES;
      }
      return parsed;
    } catch {
      return INITIAL_STORES;
    }
  });

  // 6. GOVERNORATES
  const [governorates, setGovernorates] = useState(() => {
    const saved = localStorage.getItem('sanaria_governorates');
    return saved ? JSON.parse(saved) : IRAQ_GOVERNORATES;
  });

  // 7. CMS (SECTIONS, HERO, BANNERS)
  const [cms, setCms] = useState(() => {
    const saved = localStorage.getItem('sanaria_cms');
    if (!saved) return INITIAL_CMS;
    try {
      const parsed = JSON.parse(saved);
      let sections = parsed.sections && parsed.sections.length > 0 ? parsed.sections : INITIAL_CMS_SECTIONS;
      if (!sections.some(s => s.id === 'runway_reels')) {
        sections = [
          ...sections.slice(0, 2),
          { id: 'runway_reels', name: 'Sanaria Runway Video Showcase (Live Reels)', isVisible: true, order: 3 },
          ...sections.slice(2).map((s, idx) => ({ ...s, order: 4 + idx }))
        ];
      }
      const heroVideo = (parsed.hero?.videoUrl && !parsed.hero.videoUrl.includes('/videos/sanaria-'))
        ? parsed.hero.videoUrl
        : '';

      return {
        ...INITIAL_CMS,
        ...parsed,
        hero: {
          ...INITIAL_CMS.hero,
          ...(parsed.hero || {}),
          videoUrl: heroVideo
        },
        sections
      };
    } catch {
      return INITIAL_CMS;
    }
  });

  // 8. PAYMENT CONFIG
  const [paymentConfig, setPaymentConfig] = useState(() => {
    const saved = localStorage.getItem('sanaria_payment_config');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_CONFIG;
  });

  // 9. BUSINESS SETTINGS
  const [businessSettings, setBusinessSettings] = useState(() => {
    const saved = localStorage.getItem('sanaria_business_settings');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_SETTINGS;
  });

  // 10. DISCOVER FEED CONFIGURATION
  const [discoverConfig, setDiscoverConfig] = useState(() => {
    const saved = localStorage.getItem('sanaria_discover_config');
    if (!saved) return INITIAL_DISCOVER_CONFIG;
    try {
      const parsed = JSON.parse(saved);
      return {
        for_you: parsed.for_you || INITIAL_DISCOVER_CONFIG.for_you,
        new_arrivals: parsed.new_arrivals || INITIAL_DISCOVER_CONFIG.new_arrivals,
        women: parsed.women || INITIAL_DISCOVER_CONFIG.women,
        men: parsed.men || INITIAL_DISCOVER_CONFIG.men,
        accessories: parsed.accessories || INITIAL_DISCOVER_CONFIG.accessories
      };
    } catch {
      return INITIAL_DISCOVER_CONFIG;
    }
  });

  // 10b. EDITORIAL VIDEO PLACEMENTS (THE SANARIA EDIT & HERO & RUNWAY)
  const [editorialPlacements, setEditorialPlacements] = useState(() => {
    try {
      const saved = localStorage.getItem('sanaria_editorial_placements');
      return saved ? { ...DEFAULT_EDITORIAL_PLACEMENTS, ...JSON.parse(saved) } : DEFAULT_EDITORIAL_PLACEMENTS;
    } catch {
      return DEFAULT_EDITORIAL_PLACEMENTS;
    }
  });

  const updateEditorialPlacement = (placementKey, data) => {
    setEditorialPlacements(prev => {
      const updated = {
        ...prev,
        [placementKey]: {
          ...(prev[placementKey] || {}),
          ...data
        }
      };
      try {
        localStorage.setItem('sanaria_editorial_placements', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving editorial placements:', e);
      }
      return updated;
    });
  };

  // 11. ADMIN AUTH STATE
  const [adminToken, setAdminToken] = useState(() => {
    return sessionStorage.getItem('sanaria_admin_session') || null;
  });

  // --- PERSISTENCE EFFECTS ---
  // Resolve any stored IndexedDB videos to active playable object URLs
  useEffect(() => {
    let active = true;
    const resolveIndexedDbVideos = async () => {
      let needsUpdate = false;
      const updated = await Promise.all(products.map(async (p) => {
        const idbKey = p._idbKey || (p.videoUrl && p.videoUrl.startsWith('idb://') ? p.videoUrl : null);
        if (idbKey) {
          const resolvedUrl = await resolveVideoUrl(idbKey);
          if (resolvedUrl && p.videoUrl !== resolvedUrl) {
            needsUpdate = true;
            return { ...p, videoUrl: resolvedUrl, _idbKey: idbKey };
          }
        }
        return p;
      }));

      if (needsUpdate && active) {
        setProducts(updated);
      }
    };

    resolveIndexedDbVideos();
    return () => { active = false; };
  }, [products.length]);

  useEffect(() => {
    const saveProductsToStorage = (items) => {
      const serializableProducts = items.map(p => {
        if (p._idbKey) {
          return { ...p, videoUrl: p._idbKey };
        }
        return p;
      });
      return JSON.stringify(serializableProducts);
    };

    try {
      localStorage.setItem('sanaria_products', saveProductsToStorage(products));
    } catch (e) {
      console.warn('Primary save to localStorage failed (storage quota), attempting compressed fallback:', e);
      try {
        // Fallback: If user uploaded very large base64 images that filled quota,
        // sanitize large base64 strings so product information is safely preserved
        const pruned = products.map(p => ({
          ...p,
          images: (p.images || []).map(img => (typeof img === 'string' && img.startsWith('data:') && img.length > 200000) ? '/placeholder-luxury.svg' : img)
        }));
        localStorage.setItem('sanaria_products', saveProductsToStorage(pruned));
      } catch (fallbackError) {
        console.error('Critical quota error saving products:', fallbackError);
      }
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sanaria_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sanaria_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('sanaria_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sanaria_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sanaria_stores_v3', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('sanaria_governorates', JSON.stringify(governorates));
  }, [governorates]);

  useEffect(() => {
    localStorage.setItem('sanaria_cms', JSON.stringify(cms));
  }, [cms]);

  useEffect(() => {
    localStorage.setItem('sanaria_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('sanaria_business_settings', JSON.stringify(businessSettings));
  }, [businessSettings]);

  useEffect(() => {
    localStorage.setItem('sanaria_discover_config', JSON.stringify(discoverConfig));
  }, [discoverConfig]);

  // =========================================================================
  // PRODUCT ACTIONS
  // =========================================================================
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: `sf-${Date.now()}`,
      sku: newProduct.sku || `SF-${Date.now().toString().slice(-4)}`,
      ordersStopped: false,
      stoppedSizes: [],
      isHidden: false
    };
    setProducts(prev => [product, ...prev]);
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => {
      const remaining = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('sanaria_products', JSON.stringify(remaining));
        const deleted = getDeletedProductIds();
        if (!deleted.includes(id)) {
          localStorage.setItem('sanaria_deleted_product_ids', JSON.stringify([...deleted, id]));
        }
      } catch (e) {
        console.error('Error saving deleted product:', e);
      }
      return remaining;
    });
  };

  const duplicateProduct = (id) => {
    const target = products.find(p => p.id === id);
    if (!target) return null;

    const clonedName = typeof target.name === 'object'
      ? {
          en: `${target.name.en || ''} (Copy)`,
          ar: `${target.name.ar || ''} (نسخة)`,
          ku: `${target.name.ku || ''} (کۆپی)`,
          tr: `${target.name.tr || ''} (Kopya)`
        }
      : `${target.name} (Copy)`;

    const clone = {
      ...target,
      id: `sf-${Date.now()}`,
      sku: `SF-CPY-${Math.floor(1000 + Math.random() * 9000)}`,
      name: clonedName,
      ordersStopped: false
    };

    setProducts(prev => [clone, ...prev]);
    return clone;
  };

  const toggleHideProduct = (id) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isHidden: !p.isHidden } : p))
    );
  };

  const toggleStopOrders = (productId, optionalSize = null) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id !== productId) return item;

        if (optionalSize) {
          const currentStopped = item.stoppedSizes || [];
          const exists = currentStopped.includes(optionalSize);
          const newStopped = exists
            ? currentStopped.filter(s => s !== optionalSize)
            : [...currentStopped, optionalSize];
          return { ...item, stoppedSizes: newStopped };
        }

        return { ...item, ordersStopped: !item.ordersStopped };
      })
    );
  };

  const quickAdjustStock = (productId, delta) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id !== productId) return item;
        const currentStock = item.stock || 0;
        const newStock = Math.max(0, currentStock + delta);
        return {
          ...item,
          stock: newStock
        };
      })
    );
  };

  // Atomic stock adjustment per product and size (supports negative delta for purchases, positive for restorations)
  const adjustProductItemStock = (productId, size, delta) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id !== productId) return item;

        let updatedSizeStock = item.sizeStock ? { ...item.sizeStock } : null;
        let newStock = item.stock !== undefined ? Number(item.stock) : 0;
        let newAvailableSizes = Array.isArray(item.availableSizes) ? [...item.availableSizes] : [];

        if (updatedSizeStock && size) {
          // Normalize matching size in sizeStock keys
          const matchedKey = Object.keys(updatedSizeStock).find(
            k => k.trim().toUpperCase() === String(size).trim().toUpperCase()
          );

          if (matchedKey) {
            const currentSizeQty = Number(updatedSizeStock[matchedKey]) || 0;
            const nextSizeQty = Math.max(0, currentSizeQty + delta);
            updatedSizeStock[matchedKey] = nextSizeQty;

            newStock = Object.values(updatedSizeStock).reduce((sum, q) => sum + (Number(q) || 0), 0);
            newAvailableSizes = Object.keys(updatedSizeStock).filter(s => (Number(updatedSizeStock[s]) || 0) > 0);
          } else {
            // Key not yet in sizeStock: create it or adjust overall stock
            const baseQty = Math.max(0, delta > 0 ? delta : 0);
            updatedSizeStock[size] = baseQty;
            newStock = Math.max(0, newStock + delta);
            newAvailableSizes = Object.keys(updatedSizeStock).filter(s => (Number(updatedSizeStock[s]) || 0) > 0);
          }
        } else {
          newStock = Math.max(0, newStock + delta);
        }

        return {
          ...item,
          sizeStock: updatedSizeStock || item.sizeStock,
          stock: newStock,
          availableSizes: updatedSizeStock ? newAvailableSizes : item.availableSizes
        };
      })
    );
  };

  const updateSizeStock = (productId, size, qty) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id !== productId) return item;
        const sizeStock = { ...(item.sizeStock || {}) };
        sizeStock[size] = Math.max(0, Number(qty));

        const total = Object.values(sizeStock).reduce((a, b) => a + Number(b), 0);
        const availableSizes = Object.keys(sizeStock).filter(s => sizeStock[s] > 0);

        return {
          ...item,
          sizeStock,
          stock: total,
          availableSizes: availableSizes.length > 0 ? availableSizes : []
        };
      })
    );
  };

  const setProductCoverImage = (productId, imageIndex) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id !== productId || !item.images || item.images.length <= imageIndex) return item;
        const images = [...item.images];
        const [chosen] = images.splice(imageIndex, 1);
        images.unshift(chosen);
        return { ...item, images };
      })
    );
  };

  const reorderProductImages = (productId, newImagesArray) => {
    setProducts(prev =>
      prev.map(item => (item.id === productId ? { ...item, images: newImagesArray } : item))
    );
  };

  // Bulk Actions on Products
  const bulkUpdateProducts = (productIds, updates) => {
    setProducts(prev =>
      prev.map(item => (productIds.includes(item.id) ? { ...item, ...updates } : item))
    );
  };

  const bulkDeleteProducts = (productIds) => {
    setProducts(prev => {
      const remaining = prev.filter(item => !productIds.includes(item.id));
      try {
        localStorage.setItem('sanaria_products', JSON.stringify(remaining));
        const deleted = getDeletedProductIds();
        const updated = Array.from(new Set([...deleted, ...productIds]));
        localStorage.setItem('sanaria_deleted_product_ids', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving bulk deleted products:', e);
      }
      return remaining;
    });
  };

  // =========================================================================
  // CATEGORY ACTIONS
  // =========================================================================
  const addCategory = (categoryData) => {
    const newCat = {
      ...categoryData,
      id: categoryData.id || `cat-${Date.now()}`,
      order: categories.length + 1,
      isVisible: categoryData.isVisible ?? true
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updatedFields } : cat))
    );
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const reorderCategories = (newCategoriesArray) => {
    setCategories(newCategoriesArray);
  };

  const toggleCategoryVisibility = (id) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, isVisible: !cat.isVisible } : cat))
    );
  };

  // =========================================================================
  // COLLECTION ACTIONS
  // =========================================================================
  const addCollection = (collectionData) => {
    const newCol = {
      ...collectionData,
      id: collectionData.id || `col-${Date.now()}`,
      isVisible: collectionData.isVisible ?? true,
      productIds: collectionData.productIds || []
    };
    setCollections(prev => [newCol, ...prev]);
    return newCol;
  };

  const updateCollection = (id, updatedFields) => {
    setCollections(prev =>
      prev.map(col => (col.id === id ? { ...col, ...updatedFields } : col))
    );
  };

  const deleteCollection = (id) => {
    setCollections(prev => prev.filter(col => col.id !== id));
  };

  const toggleCollectionVisibility = (id) => {
    setCollections(prev =>
      prev.map(col => (col.id === id ? { ...col, isVisible: !col.isVisible } : col))
    );
  };

  // =========================================================================
  // HOMEPAGE & CMS ACTIONS
  // =========================================================================
  const toggleSectionVisibility = (sectionId) => {
    setCms(prev => ({
      ...prev,
      sections: prev.sections.map(sec =>
        sec.id === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec
      )
    }));
  };

  const moveSection = (sectionId, direction) => {
    setCms(prev => {
      const sections = [...prev.sections];
      const index = sections.findIndex(s => s.id === sectionId);
      if (index === -1) return prev;

      if (direction === 'up' && index > 0) {
        const temp = sections[index - 1];
        sections[index - 1] = sections[index];
        sections[index] = temp;
      } else if (direction === 'down' && index < sections.length - 1) {
        const temp = sections[index + 1];
        sections[index + 1] = sections[index];
        sections[index] = temp;
      }

      return {
        ...prev,
        sections: sections.map((sec, idx) => ({ ...sec, order: idx + 1 }))
      };
    });
  };

  const updateHero = (newHero) => {
    setCms(prev => ({
      ...prev,
      hero: { ...prev.hero, ...newHero }
    }));
  };

  const updatePromotionalBanner = (newBanner) => {
    setCms(prev => ({
      ...prev,
      banners: {
        ...prev.banners,
        promotionalBanner: { ...prev.banners.promotionalBanner, ...newBanner }
      }
    }));
  };

  const updateCmsSettings = (newCms) => {
    setCms(prev => ({ ...prev, ...newCms }));
  };

  // =========================================================================
  // ORDERS & STORES ACTIONS
  // =========================================================================
  const createOrder = (orderData) => {
    const extractedLocation = orderData.location || orderData.customer?.location || null;
    const extractedMapsUrl = orderData.mapsUrl || orderData.customer?.mapsUrl || (extractedLocation?.mapsUrl || null);

    const newOrder = {
      ...orderData,
      id: `SF-92-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: 'pending',
      location: extractedLocation,
      mapsUrl: extractedMapsUrl,
      customer: {
        ...orderData.customer,
        location: extractedLocation,
        mapsUrl: extractedMapsUrl
      }
    };

    // Deduct stock on purchase (size-specific and total stock)
    orderData.items?.forEach(cartItem => {
      const pid = cartItem.productId || cartItem.id;
      const size = cartItem.size;
      const qty = Number(cartItem.quantity) || 1;
      adjustProductItemStock(pid, size, -qty);
    });

    setOrders(prev => [newOrder, ...prev]);

    // Automatically link/upsert customer record
    const customerPhone = newOrder.customer?.phone?.trim();
    if (customerPhone) {
      setCustomers(prev => {
        const existingIdx = prev.findIndex(c => c.phone?.trim() === customerPhone);
        if (existingIdx >= 0) {
          const updated = [...prev];
          const curr = updated[existingIdx];
          updated[existingIdx] = {
            ...curr,
            fullName: newOrder.customer.fullName || curr.fullName,
            altPhone: newOrder.customer.altPhone || curr.altPhone,
            governorateName: newOrder.customer.governorateName || curr.governorateName,
            city: newOrder.customer.city || curr.city,
            address: newOrder.customer.address || curr.address,
            location: newOrder.customer.location || curr.location,
            mapsUrl: newOrder.customer.mapsUrl || curr.mapsUrl,
            totalSpent: (curr.totalSpent || 0) + (newOrder.total || 0),
            ordersCount: (curr.ordersCount || 0) + 1,
            lastOrderDate: newOrder.date,
            status: curr.status || 'pending'
          };
          return updated;
        } else {
          const newCust = {
            id: `cust-${Date.now()}`,
            fullName: newOrder.customer.fullName || 'عميل سناريا',
            phone: customerPhone,
            altPhone: newOrder.customer.altPhone || '',
            governorateName: newOrder.customer.governorateName || '',
            city: newOrder.customer.city || '',
            address: newOrder.customer.address || '',
            location: newOrder.customer.location,
            mapsUrl: newOrder.customer.mapsUrl,
            status: 'pending',
            totalSpent: newOrder.total || 0,
            ordersCount: 1,
            createdAt: newOrder.date,
            lastOrderDate: newOrder.date,
            notes: 'طلب جديد عبر المتجر'
          };
          return [newCust, ...prev];
        }
      });
    }

    // Automatically mark this user as a verified customer who bought something
    setCustomerOrders(prev => [newOrder.id, ...prev.filter(id => id !== newOrder.id)]);
    try {
      localStorage.setItem('sanaria_has_purchased', 'true');
    } catch (e) {
      console.error(e);
    }

    return newOrder;
  };

  // Support Verification for customers who bought something
  const verifyOrderForSupport = (identifier) => {
    if (!identifier || typeof identifier !== 'string') {
      return { success: false, message: 'Please enter a valid Order ID' };
    }
    const clean = identifier.trim().toUpperCase();
    const digitsOnly = clean.replace(/[^0-9]/g, '');

    const found = orders.find(o => {
      const oId = (o.id || '').toUpperCase();
      const oDigits = oId.replace(/[^0-9]/g, '');
      const oPhone = (o.customer?.phone || '').replace(/[^0-9]/g, '');
      const oAltPhone = (o.customer?.altPhone || '').replace(/[^0-9]/g, '');

      return oId === clean || 
        (digitsOnly.length >= 4 && oDigits.includes(digitsOnly)) ||
        (digitsOnly.length >= 7 && (oPhone.includes(digitsOnly) || oAltPhone.includes(digitsOnly)));
    });

    if (found) {
      setCustomerOrders(prev => [found.id, ...prev.filter(id => id !== found.id)]);
      try {
        localStorage.setItem('sanaria_has_purchased', 'true');
      } catch (e) {}
      return { success: true, order: found };
    }

    return { 
      success: false, 
      message: 'Order reference not found in store database. Please check your order receipt or place an order.' 
    };
  };

  const hasCustomerPurchased = Boolean(
    customerOrders.length > 0 || 
    (typeof window !== 'undefined' && localStorage.getItem('sanaria_has_purchased') === 'true')
  );

  const latestCustomerOrder = orders.find(o => customerOrders.includes(o.id)) || 
    (customerOrders.length > 0 ? orders.find(o => o.id === customerOrders[0]) : null) || 
    null;

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const prevStatus = order.status || 'new';

        // Automatic stock restoration if cancelled
        if (newStatus === 'cancelled' && prevStatus !== 'cancelled') {
          order.items?.forEach(cartItem => {
            const pid = cartItem.productId || cartItem.id;
            const size = cartItem.size;
            const qty = Number(cartItem.quantity) || 1;
            adjustProductItemStock(pid, size, qty);
          });
        }
        // Automatic stock deduction if restored from cancelled to active
        else if (prevStatus === 'cancelled' && newStatus !== 'cancelled') {
          order.items?.forEach(cartItem => {
            const pid = cartItem.productId || cartItem.id;
            const size = cartItem.size;
            const qty = Number(cartItem.quantity) || 1;
            adjustProductItemStock(pid, size, -qty);
          });
        }
        return { ...order, status: newStatus };
      })
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => {
      const remaining = prev.filter(o => o.id !== orderId);
      try {
        localStorage.setItem('sanaria_orders', JSON.stringify(remaining));
        const deleted = getDeletedOrderIds();
        if (!deleted.includes(orderId)) {
          localStorage.setItem('sanaria_deleted_order_ids', JSON.stringify([...deleted, orderId]));
        }
      } catch (e) {
        console.error('Error saving deleted order:', e);
      }
      return remaining;
    });
  };

  // Customer Management: Accept, Delete, Update, Add
  const acceptCustomer = (customerId) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId || c.phone === customerId) {
          return {
            ...c,
            status: 'accepted',
            acceptedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
  };

  const deleteCustomer = (customerId) => {
    setCustomers(prev => {
      const target = prev.find(c => c.id === customerId || c.phone === customerId);
      const remaining = prev.filter(c => c.id !== customerId && c.phone !== customerId);
      try {
        localStorage.setItem('sanaria_customers', JSON.stringify(remaining));
        const deleted = getDeletedCustomerIds();
        const toAdd = [customerId];
        if (target?.id) toAdd.push(target.id);
        if (target?.phone) toAdd.push(target.phone);
        const updated = Array.from(new Set([...deleted, ...toAdd]));
        localStorage.setItem('sanaria_deleted_customer_ids', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving deleted customer:', e);
      }
      return remaining;
    });
  };

  const updateCustomer = (customerId, fields) => {
    setCustomers(prev =>
      prev.map(c => (c.id === customerId || c.phone === customerId ? { ...c, ...fields } : c))
    );
  };

  const addCustomer = (customerData) => {
    const newCust = {
      ...customerData,
      id: `cust-${Date.now()}`,
      status: customerData.status || 'accepted',
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const addStore = (storeData) => {
    const newStore = {
      ...storeData,
      id: `store-${Date.now()}`
    };
    setStores(prev => [...prev, newStore]);
    return newStore;
  };

  const updateStore = (id, updatedFields) => {
    setStores(prev =>
      prev.map(store => (store.id === id ? { ...store, ...updatedFields } : store))
    );
  };

  const deleteStore = (id) => {
    setStores(prev => prev.filter(store => store.id !== id));
  };

  const updateGovernorateRate = (govId, newFee) => {
    setGovernorates(prev =>
      prev.map(gov => (gov.id === govId ? { ...gov, deliveryFee: Number(newFee) } : gov))
    );
  };

  const updatePaymentSettings = (newConfig) => {
    setPaymentConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updateBusinessSettings = (newSettings) => {
    setBusinessSettings(prev => ({ ...prev, ...newSettings }));
  };

  // =========================================================================
  // DISCOVER FEED ACTIONS (TIKTOK-STYLE VERTICAL FEED CONTROLLER)
  // =========================================================================
  const addDiscoverProduct = (tabKey, productId) => {
    setDiscoverConfig(prev => {
      const list = prev[tabKey] || [];
      if (list.some(item => item.productId === productId)) return prev;
      return {
        ...prev,
        [tabKey]: [{ productId, isHidden: false, isFeatured: false }, ...list]
      };
    });
  };

  const removeDiscoverProduct = (tabKey, productId) => {
    setDiscoverConfig(prev => ({
      ...prev,
      [tabKey]: (prev[tabKey] || []).filter(item => item.productId !== productId)
    }));
  };

  const reorderDiscoverProducts = (tabKey, sourceIndex, targetIndex) => {
    setDiscoverConfig(prev => {
      const list = [...(prev[tabKey] || [])];
      if (sourceIndex < 0 || sourceIndex >= list.length || targetIndex < 0 || targetIndex >= list.length) {
        return prev;
      }
      const [moved] = list.splice(sourceIndex, 1);
      list.splice(targetIndex, 0, moved);
      return {
        ...prev,
        [tabKey]: list
      };
    });
  };

  const toggleDiscoverHide = (tabKey, productId) => {
    setDiscoverConfig(prev => ({
      ...prev,
      [tabKey]: (prev[tabKey] || []).map(item =>
        item.productId === productId ? { ...item, isHidden: !item.isHidden } : item
      )
    }));
  };

  const toggleDiscoverFeatured = (tabKey, productId) => {
    setDiscoverConfig(prev => ({
      ...prev,
      [tabKey]: (prev[tabKey] || []).map(item =>
        item.productId === productId ? { ...item, isFeatured: !item.isFeatured } : item
      )
    }));
  };

  const resetDiscoverConfig = () => {
    setDiscoverConfig(INITIAL_DISCOVER_CONFIG);
    localStorage.removeItem('sanaria_discover_config');
  };

  // Reset to initial catalog safely
  const resetToInitialCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setCollections(INITIAL_COLLECTIONS);
    setStores(INITIAL_STORES);
    setCms(INITIAL_CMS);
    setBusinessSettings(INITIAL_BUSINESS_SETTINGS);
    setDiscoverConfig(INITIAL_DISCOVER_CONFIG);
    localStorage.removeItem('sanaria_products');
    localStorage.removeItem('sanaria_categories');
    localStorage.removeItem('sanaria_collections');
    localStorage.removeItem('sanaria_stores_v3');
    localStorage.removeItem('sanaria_stores');
    localStorage.removeItem('sanaria_cms');
    localStorage.removeItem('sanaria_business_settings');
    localStorage.removeItem('sanaria_discover_config');
  };

  // Admin Auth Logic
  const loginAdmin = (username, password) => {
    if ((username === 'admin' || username === 'sanaria') && password === 'sanaria1992') {
      const token = `sanaria_adm_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      sessionStorage.setItem('sanaria_admin_session', token);
      setAdminToken(token);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Please try again.' };
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('sanaria_admin_session');
    setAdminToken(null);
  };

  const isAdminAuthenticated = Boolean(adminToken);



  return (
    <StoreContext.Provider
      value={{
        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleHideProduct,
        setProductCoverImage,
        reorderProductImages,
        bulkUpdateProducts,
        bulkDeleteProducts,
        toggleStopOrders,
        quickAdjustStock,
        updateSizeStock,
        adjustProductItemStock,

        // Categories & Collections
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        toggleCategoryVisibility,
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        toggleCollectionVisibility,

        // CMS & Homepage sections
        cms,
        toggleSectionVisibility,
        moveSection,
        updateHero,
        updatePromotionalBanner,
        updateCmsSettings,

        // Discover Feed Controls (TikTok-Style)
        discoverConfig,
        addDiscoverProduct,
        removeDiscoverProduct,
        reorderDiscoverProducts,
        toggleDiscoverHide,
        toggleDiscoverFeatured,
        resetDiscoverConfig,

        // Orders & Customers Management
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        customerOrders,
        hasCustomerPurchased,
        latestCustomerOrder,
        verifyOrderForSupport,
        customers,
        acceptCustomer,
        deleteCustomer,
        updateCustomer,
        addCustomer,
        stores,
        addStore,
        updateStore,
        deleteStore,
        governorates,
        updateGovernorateRate,
        paymentConfig,
        updatePaymentSettings,
        businessSettings,
        updateBusinessSettings,

        // Editorial Video Placements (The Sanaria Edit & Video Hub)
        editorialPlacements,
        updateEditorialPlacement,

        // Reset
        resetToInitialCatalog,

        // Auth
        adminToken,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
