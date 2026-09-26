import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { OrderPrintInvoice } from '../components/admin/OrderPrintInvoice';
import { storeUploadedVideoFile } from '../utils/mediaStorage';
import { VideoPlacementsManager } from '../components/admin/VideoPlacementsManager';
import { getAssetUrl } from '../utils/assetHelper';
import {
  Plus,
  Package,
  ShoppingBag,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Printer,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Check,
  Palette,
  AlertTriangle,
  X,
  Upload,
  Play,
  Film,
  Image as ImageIcon,
  ArrowRight,
  LogOut,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Layers,
  Sliders,
  Users,
  UserCheck,
  UserX,
  ShieldCheck
} from 'lucide-react';

const SIZES_NUMERIC = ['36', '38', '40', '42', '44', '46', '48', '50'];
const SIZES_ALPHA = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SIZES_ONE_SIZE = ['One Size'];
const SIZES_PERFUMES = ['50ml', '75ml', '100ml', '125ml', '150ml', '200ml', 'One Size'];
const STANDARD_SIZES = [...SIZES_ALPHA];

const LUXURY_COLOR_PRESETS = [
  { name: { ar: 'أسود ملكي', en: 'Royal Black' }, hex: '#111111' },
  { name: { ar: 'أبيض لؤلؤي', en: 'Pearl White' }, hex: '#FFFFFF' },
  { name: { ar: 'بيج كلاسيكي', en: 'Classic Beige' }, hex: '#D2B48C' },
  { name: { ar: 'عاجي ناعم', en: 'Soft Ivory' }, hex: '#FDFBF7' },
  { name: { ar: 'نبيذي عنابي', en: 'Burgundy' }, hex: '#6B1D2F' },
  { name: { ar: 'كحلي ملكي', en: 'Royal Navy' }, hex: '#1B2A4A' },
  { name: { ar: 'زمردي فاخر', en: 'Emerald Green' }, hex: '#1B4D3E' },
  { name: { ar: 'وردي بودري', en: 'Powder Rose' }, hex: '#E8C5C8' },
  { name: { ar: 'جملي دافئ', en: 'Warm Camel' }, hex: '#C19A6B' },
  { name: { ar: 'ذهبي شامبين', en: 'Champagne Gold' }, hex: '#C5A880' },
  { name: { ar: 'رمادي دخاني', en: 'Smoke Grey' }, hex: '#555555' },
  { name: { ar: 'أزرق سماوي', en: 'Sky Blue' }, hex: '#87CEEB' },
  { name: { ar: 'ليلكي موف', en: 'Soft Lilac' }, hex: '#B39EB5' },
  { name: { ar: 'خردلي راقي', en: 'Mustard Ochre' }, hex: '#C68B59' }
];

const WOMEN_CATEGORIES = [
  { id: 'dresses', labelAr: 'فساتين', labelEn: 'Dresses', icon: '👗' },
  { id: 'tops', labelAr: 'قمصان وتوبات', labelEn: 'Tops & Blouses', icon: '👚' },
  { id: 'pants', labelAr: 'بناطيل', labelEn: 'Pants & Trousers', icon: '👖' },
  { id: 'skirts', labelAr: 'تنانير', labelEn: 'Skirts', icon: '🥻' },
  { id: 'jackets', labelAr: 'جاكيتات', labelEn: 'Jackets & Blazers', icon: '🧥' },
  { id: 'perfumes', labelAr: 'عطور وبخور', labelEn: 'Perfumes & Fragrances', icon: '✨' },
  { id: 'accessories', labelAr: 'إكسسوارات وحقائب', labelEn: 'Accessories & Bags', icon: '👜' },
  { id: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '✨' }
];

const BOUTIQUE_VIDEO_PRESETS = [];

const PRESET_PHOTO_SUGGESTIONS = [];

const ORDER_STATUS_CONFIG = {
  new: { labelAr: 'جديد', labelEn: 'New', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  confirmed: { labelAr: 'مؤكد', labelEn: 'Confirmed', bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  preparing: { labelAr: 'قيد التجهيز', labelEn: 'Preparing', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
  ready: { labelAr: 'جاهز للتوصيل', labelEn: 'Ready', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  delivered: { labelAr: 'تم التوصيل', labelEn: 'Delivered', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
  cancelled: { labelAr: 'ملغي', labelEn: 'Cancelled', bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' }
};

// Flexible price parser: handles 35000, 35,000, 35k, ٣٥٠٠٠, 35.000 IQD safely
const parseFlexiblePrice = (raw) => {
  if (!raw && raw !== 0) return 0;
  let str = String(raw).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  if (/k/i.test(str)) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return num ? Math.round(num * 1000) : 0;
  }
  const digits = str.replace(/[^0-9]/g, '');
  return parseInt(digits, 10) || 0;
};

// Client-side image compressor: scales high-res photos to prevent localStorage quota errors
const compressImageFile = (file, maxWidth = 1200, quality = 0.82) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

const AdminDashboard = ({ onBackToStore, onNavigate, onSelectProduct }) => {
  const {
    isAdminAuthenticated,
    logoutAdmin,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleHideProduct,
    updateSizeStock,
    orders,
    updateOrderStatus,
    deleteOrder,
    customers,
    acceptCustomer,
    deleteCustomer,
    updateCustomer,
    addCustomer,
    businessSettings,
    addDiscoverProduct,
    editorialPlacements,
    updateEditorialPlacement
  } = useStore();

  const { showToast } = useToast();

  // Active Screen: 'home' | 'add_product' | 'orders' | 'customers' | 'products'
  const [currentView, setCurrentView] = useState('home');

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); // all, new, confirmed, preparing, ready, delivered, cancelled
  const [customerFilter, setCustomerFilter] = useState('all'); // all, accepted, pending
  const [customerSearch, setCustomerSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // all, in_stock, low_stock, out_of_stock, hidden

  // Modals & Print
  const [printSingleOrder, setPrintSingleOrder] = useState(null);
  const [isPrintAllOpen, setIsPrintAllOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [publishedSuccessProduct, setPublishedSuccessProduct] = useState(null);

  // Editing existing product ID (or null when creating fresh)
  const [editingProductId, setEditingProductId] = useState(null);

  // Form State for Add / Edit Product
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('dresses');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPhotos, setProductPhotos] = useState([]);
  const [productVideo, setProductVideo] = useState('');
  const [videoUploadMeta, setVideoUploadMeta] = useState(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [productVideoPlacement, setProductVideoPlacement] = useState('new_arrivals');
  const [productPlacement, setProductPlacement] = useState('BOTH'); // 'MAIN', 'SCROLL', 'BOTH'
  const [selectedSizesMap, setSelectedSizesMap] = useState({
    '38': 10,
    '40': 15,
    '42': 15,
    '44': 10
  });
  const [sizePresetTab, setSizePresetTab] = useState('numeric'); // 'numeric', 'alpha', 'perfumes', 'one_size'
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Offered Colors State
  const [productColors, setProductColors] = useState([
    { name: { ar: 'أسود ملكي', en: 'Royal Black' }, hex: '#111111' },
    { name: { ar: 'عاجي ناعم', en: 'Soft Ivory' }, hex: '#FDFBF7' }
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#C5A880');

  // --- STATS COMPUTATION ---
  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter(o => o.date && o.date.slice(0, 10) === today);
    const pendingOrders = orders.filter(o => !o.status || o.status === 'pending' || o.status === 'new' || o.status === 'preparing');
    const pendingCustomers = (customers || []).filter(c => c.status === 'pending' || !c.status);
    const acceptedCustomers = (customers || []).filter(c => c.status === 'accepted');
    
    // Low stock limit: 5 units or less
    const lowStockItems = [];
    products.forEach(p => {
      if (p.sizeStock) {
        Object.entries(p.sizeStock).forEach(([size, qty]) => {
          if (qty > 0 && qty <= 5) {
            lowStockItems.push({ product: p, size, qty });
          }
        });
      } else if (p.stock > 0 && p.stock <= 5) {
        lowStockItems.push({ product: p, size: 'All', qty: p.stock });
      }
    });

    const outOfStockCount = products.filter(p => (p.stock || 0) <= 0).length;

    return {
      todayCount: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      pendingCount: pendingOrders.length,
      totalProducts: products.length,
      lowStockList: lowStockItems,
      lowStockCount: lowStockItems.length,
      outOfStockCount,
      customersCount: (customers || []).length,
      pendingCustomersCount: pendingCustomers.length,
      acceptedCustomersCount: acceptedCustomers.length
    };
  }, [orders, products, customers]);

  // Filtered Customers for Directory View
  const filteredCustomers = useMemo(() => {
    return (customers || []).filter(cust => {
      const q = customerSearch.trim().toLowerCase();
      if (q) {
        const nameMatch = (cust.fullName || cust.name || '').toLowerCase().includes(q);
        const phoneMatch = (cust.phone || '').includes(q) || (cust.altPhone || '').includes(q);
        const cityMatch = (cust.city || '').toLowerCase().includes(q);
        const govMatch = (cust.governorateName || cust.governorate || '').toLowerCase().includes(q);
        if (!nameMatch && !phoneMatch && !cityMatch && !govMatch) return false;
      }
      if (customerFilter === 'accepted') {
        return cust.status === 'accepted';
      }
      if (customerFilter === 'pending') {
        return cust.status === 'pending' || !cust.status;
      }
      return true;
    });
  }, [customers, customerSearch, customerFilter]);

  // Total Stock Calculated for Form
  const formTotalStock = useMemo(() => {
    return Object.values(selectedSizesMap).reduce((a, b) => a + (Number(b) || 0), 0);
  }, [selectedSizesMap]);

  // Reset Add/Edit Form
  const resetForm = () => {
    setEditingProductId(null);
    setProductName('');
    setProductCategory('dresses');
    setProductPrice('');
    setProductDescription('');
    setProductPhotos([]);
    setProductVideo('');
    setVideoUploadMeta(null);
    setProductVideoPlacement('new_arrivals');
    setProductPlacement('BOTH');
    setSelectedSizesMap({ '38': 10, '40': 15, '42': 15, '44': 10 });
    setSizePresetTab('numeric');
    setCustomSizeInput('');
    setProductColors([
      { name: { ar: 'أسود ملكي', en: 'Royal Black' }, hex: '#111111' },
      { name: { ar: 'عاجي ناعم', en: 'Soft Ivory' }, hex: '#FDFBF7' }
    ]);
    setCustomColorName('');
    setCustomColorHex('#C5A880');
  };

  // 1-Click Quick Fill Sample for Instant & Frictionless Testing
  const handleQuickFillSample = () => {
    setEditingProductId(null);
    setProductName('فستان كريب سهرة ملكي فاخر • Royal Crepe Silk Evening Dress');
    setProductCategory('dresses');
    setProductPrice('38000');
    setProductDescription('تصميم راقٍ وفخم منسوج بأجود خامات الكريب الفاخر ومطرز يدوياً بحرفية عالية لإطلالة ملكية في السهرات والمناسبات الخاصة في العراق.');
    setProductPlacement('BOTH');
    setSelectedSizesMap({
      '38': 10,
      '40': 15,
      '42': 15,
      '44': 10
    });
    setSizePresetTab('numeric');
    setProductColors([
      { name: { ar: 'أسود ملكي', en: 'Royal Black' }, hex: '#111111' },
      { name: { ar: 'نبيذي عنابي', en: 'Burgundy' }, hex: '#6B1D2F' },
      { name: { ar: 'عاجي ناعم', en: 'Soft Ivory' }, hex: '#FDFBF7' }
    ]);
    if (productPhotos.length === 0) {
      setProductPhotos(['/placeholder-luxury.svg']);
    }
    showToast('⚡ تم ملء بيانات تجريبية متكاملة وجاهزة للنشر!', 'success');
  };

  // Populate Form for Editing
  const startEditProduct = (prod) => {
    setEditingProductId(prod.id);
    const pName = typeof prod.name === 'object' ? prod.name.ar || prod.name.en : prod.name;
    const pDesc = typeof prod.description === 'object' ? prod.description.ar || prod.description.en : prod.description;
    setProductName(pName || '');
    setProductCategory(prod.category || 'dresses');
    setProductPrice(String(prod.price || ''));
    setProductDescription(pDesc || '');
    setProductPhotos(prod.images || []);
    setProductVideo(prod.videoUrl || '');
    setVideoUploadMeta(null);
    setProductVideoPlacement(prod.videoPlacement || 'new_arrivals');
    setProductPlacement(prod.placement || 'BOTH');

    // Populate Offered Colors
    if (prod.colors && Array.isArray(prod.colors) && prod.colors.length > 0) {
      setProductColors(prod.colors);
    } else {
      setProductColors([{ name: { ar: 'أسود ملكي', en: 'Royal Black' }, hex: '#111111' }]);
    }
    setCustomColorName('');
    setCustomColorHex('#C5A880');

    if (prod.sizeStock && Object.keys(prod.sizeStock).length > 0) {
      setSelectedSizesMap(prod.sizeStock);
      const keys = Object.keys(prod.sizeStock);
      if (prod.category === 'perfumes' || keys.some(k => SIZES_PERFUMES.includes(k))) setSizePresetTab('perfumes');
      else if (keys.some(k => SIZES_NUMERIC.includes(k))) setSizePresetTab('numeric');
      else if (keys.some(k => SIZES_ALPHA.includes(k))) setSizePresetTab('alpha');
      else if (keys.includes('One Size')) setSizePresetTab('one_size');
    } else {
      const initialMap = {};
      const srcSizes = (Array.isArray(prod.sizes) && prod.sizes.length > 0)
        ? prod.sizes
        : (Array.isArray(prod.availableSizes) && prod.availableSizes.length > 0)
        ? prod.availableSizes
        : (prod.category === 'perfumes' ? ['50ml', '100ml'] : prod.category === 'accessories' ? ['One Size'] : ['38', '40', '42', '44']);

      srcSizes.forEach(s => {
        initialMap[s] = 12;
      });
      setSelectedSizesMap(initialMap);

      if (prod.category === 'perfumes' || srcSizes.some(k => SIZES_PERFUMES.includes(k))) setSizePresetTab('perfumes');
      else if (srcSizes.some(k => SIZES_NUMERIC.includes(k))) setSizePresetTab('numeric');
      else if (srcSizes.some(k => SIZES_ALPHA.includes(k))) setSizePresetTab('alpha');
      else if (srcSizes.includes('One Size')) setSizePresetTab('one_size');
    }

    setCurrentView('add_product');
  };

  // Handle Category Select with smart size adapting for Perfumes & Accessories
  const handleCategorySelect = (catId) => {
    setProductCategory(catId);
    if (catId === 'perfumes') {
      setSizePresetTab('perfumes');
      setSelectedSizesMap({
        '100ml': 15,
        '50ml': 10
      });
    } else if (catId === 'accessories') {
      setSizePresetTab('one_size');
      setSelectedSizesMap({ 'One Size': 20 });
    }
  };

  // Toggle Preset Color
  const handleTogglePresetColor = (preset) => {
    setProductColors(prev => {
      const exists = prev.some(c => c.hex.toLowerCase() === preset.hex.toLowerCase());
      if (exists) {
        if (prev.length <= 1) {
          showToast('يجب إبقاء لون واحد على الأقل للمنتج', 'info');
          return prev;
        }
        return prev.filter(c => c.hex.toLowerCase() !== preset.hex.toLowerCase());
      } else {
        return [...prev, preset];
      }
    });
  };

  // Add Custom Color
  const handleAddCustomColor = (e) => {
    if (e) e.preventDefault();
    const nameTrimmed = customColorName.trim();
    if (!nameTrimmed) {
      showToast('يرجى كتابة اسم اللون أولاً (مثال: أخضر زيتوني)', 'error');
      return;
    }
    const newColor = {
      name: { ar: nameTrimmed, en: nameTrimmed, ku: nameTrimmed, tr: nameTrimmed },
      hex: customColorHex
    };
    setProductColors(prev => {
      const exists = prev.some(c => c.hex.toLowerCase() === customColorHex.toLowerCase());
      if (exists) {
        return prev.map(c => c.hex.toLowerCase() === customColorHex.toLowerCase() ? newColor : c);
      }
      return [...prev, newColor];
    });
    setCustomColorName('');
    showToast(`✓ تم إضافة لون "${nameTrimmed}"`, 'success');
  };

  // Remove Color
  const handleRemoveColor = (indexToRemove) => {
    setProductColors(prev => {
      if (prev.length <= 1) {
        showToast('يجب إبقاء لون واحد على الأقل للمنتج', 'info');
        return prev;
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // Toggle Size in Form
  const handleToggleSize = (size) => {
    setSelectedSizesMap(prev => {
      const next = { ...prev };
      if (next[size] !== undefined) {
        delete next[size];
      } else {
        next[size] = 15; // default 15
      }
      return next;
    });
  };

  // Add Custom Size
  const handleAddCustomSize = (e) => {
    if (e) e.preventDefault();
    const val = customSizeInput.trim().toUpperCase();
    if (!val) return;
    setSelectedSizesMap(prev => ({
      ...prev,
      [val]: prev[val] !== undefined ? prev[val] : 15
    }));
    setCustomSizeInput('');
  };

  // Select all sizes in current preset
  const handleSelectAllInPreset = (presetList) => {
    setSelectedSizesMap(prev => {
      const next = { ...prev };
      presetList.forEach(s => {
        if (next[s] === undefined || next[s] <= 0) {
          next[s] = 15;
        }
      });
      return next;
    });
  };

  // Clear all selected sizes
  const handleClearAllSizes = () => {
    setSelectedSizesMap({});
  };

  // Update Stock For a Size in Form
  const handleSizeStockChange = (size, newQty) => {
    const val = Math.max(0, parseInt(newQty, 10) || 0);
    setSelectedSizesMap(prev => ({
      ...prev,
      [size]: val
    }));
  };

  // Photo Upload Handler (Compressed Data URL to protect storage quota)
  const handlePhotoFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let addedCount = 0;
    for (const file of files) {
      try {
        const compressed = await compressImageFile(file, 1200, 0.82);
        if (compressed) {
          setProductPhotos(prev => [...prev, compressed]);
          addedCount++;
        }
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }
    if (addedCount > 0) {
      showToast(`تم رفع وضغط ${addedCount} صورة بنجاح`, 'success');
    }
  };

  // Video Upload Handler (IndexedDB storage -> high capacity & safe persistence)
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsVideoUploading(true);
      const res = await storeUploadedVideoFile(file);
      setProductVideo(res.previewUrl);
      setVideoUploadMeta({
        id: res.id,
        previewUrl: res.previewUrl,
        name: res.name,
        size: (res.size / (1024 * 1024)).toFixed(1) + ' MB'
      });
      showToast(`✓ تم حفظ الفيديو بنجاح: ${res.name}`, 'success');
    } catch (err) {
      console.error('Error uploading video:', err);
      showToast('تعذر حفظ الفيديو، يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsVideoUploading(false);
    }
  };

  // Publish / Save Product
  const handlePublishProduct = (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      showToast('يرجى كتابة اسم المنتج • Please enter product name', 'error');
      return;
    }
    const parsedPrice = parseFlexiblePrice(productPrice);
    if (!parsedPrice || parsedPrice <= 0) {
      showToast('يرجى تحديد سعر صالح بالدينار العراقي • Please enter a valid price in IQD', 'error');
      return;
    }

    const activeSizes = Object.keys(selectedSizesMap).filter(s => Number(selectedSizesMap[s]) > 0);
    const allConfiguredSizes = Object.keys(selectedSizesMap);
    const finalStock = formTotalStock > 0 
      ? formTotalStock 
      : (allConfiguredSizes.length > 0 ? allConfiguredSizes.length * 10 : 15);

    const finalSizes = allConfiguredSizes.length > 0 
      ? allConfiguredSizes 
      : (productCategory === 'perfumes' ? ['50ml', '100ml'] : productCategory === 'accessories' ? ['One Size'] : ['38', '40', '42', '44']);
    const finalAvailableSizes = activeSizes.length > 0 ? activeSizes : finalSizes;
    const finalSizeStock = allConfiguredSizes.length > 0 
      ? selectedSizesMap 
      : finalSizes.reduce((acc, s) => ({ ...acc, [s]: 10 }), {});

    const photosToSave = productPhotos.length > 0
      ? productPhotos
      : ['/placeholder-luxury.svg'];

    const newProductData = {
      name: {
        ar: productName.trim(),
        en: productName.trim(),
        ku: productName.trim(),
        tr: productName.trim()
      },
      category: productCategory,
      price: parsedPrice,
      salePrice: null,
      description: {
        ar: productDescription.trim() || productName.trim(),
        en: productDescription.trim() || productName.trim(),
        ku: productDescription.trim() || productName.trim(),
        tr: productDescription.trim() || productName.trim()
      },
      images: photosToSave,
      colors: productColors.length > 0 ? productColors : [
        { name: { ar: 'أسود ملكي', en: 'Royal Black' }, hex: '#111111' }
      ],
      videoUrl: (videoUploadMeta && productVideo === videoUploadMeta.previewUrl) ? videoUploadMeta.id : (productVideo.trim() || ''),
      _idbKey: (videoUploadMeta && productVideo === videoUploadMeta.previewUrl) ? videoUploadMeta.id : undefined,
      sizes: finalSizes,
      availableSizes: finalAvailableSizes,
      sizeStock: finalSizeStock,
      stock: finalStock,
      placement: productPlacement,
      videoPlacement: productVideoPlacement,
      isNew: true,
      isFeatured: productPlacement === 'MAIN' || productPlacement === 'BOTH',
      isHidden: false
    };

    try {
      if (editingProductId) {
        updateProduct(editingProductId, newProductData);
        if (productVideo && productVideoPlacement && productVideoPlacement !== 'none') {
          try {
            updateEditorialPlacement(productVideoPlacement, {
              videoUrl: (videoUploadMeta && productVideo === videoUploadMeta.previewUrl) ? videoUploadMeta.id : productVideo,
              productId: editingProductId,
              title: productName.trim()
            });
          } catch {}
        }
        showToast('✓ تم تحديث المنتج بنجاح!', 'success');
        setPublishedSuccessProduct({ ...newProductData, id: editingProductId });
      } else {
        const created = addProduct(newProductData);
        if (productVideo && productVideoPlacement && productVideoPlacement !== 'none') {
          try {
            updateEditorialPlacement(productVideoPlacement, {
              videoUrl: (videoUploadMeta && productVideo === videoUploadMeta.previewUrl) ? videoUploadMeta.id : productVideo,
              productId: created.id,
              title: productName.trim()
            });
          } catch {}
        }
        // If Placement includes Scroll Down / Video Feed, register in Discover config
        if (productPlacement === 'SCROLL' || productPlacement === 'BOTH') {
          try {
            addDiscoverProduct('for_you', created.id);
            addDiscoverProduct('new_arrivals', created.id);
          } catch {}
        }
        showToast('✓ تم نشر المنتج بنجاح!', 'success');
        setPublishedSuccessProduct(created);
      }
    } catch (err) {
      console.error('Error publishing product:', err);
      showToast('حدث خطأ أثناء حفظ المنتج، يرجى المحاولة ثانية', 'error');
    }
  };

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      // Status filter
      if (orderFilter !== 'all') {
        const status = (ord.status || 'new').toLowerCase();
        if (orderFilter === 'new' && !(status === 'new' || status === 'pending')) return false;
        if (orderFilter !== 'new' && status !== orderFilter) return false;
      }
      // Search query
      if (globalSearch.trim()) {
        const query = globalSearch.toLowerCase();
        const ordId = String(ord.id || '').toLowerCase();
        const custName = String(ord.customer?.name || ord.customerName || '').toLowerCase();
        const phone = String(ord.customer?.phone || ord.customerPhone || '').toLowerCase();
        const gov = String(ord.customer?.governorate || ord.customerGovernorate || '').toLowerCase();
        return ordId.includes(query) || custName.includes(query) || phone.includes(query) || gov.includes(query);
      }
      return true;
    });
  }, [orders, orderFilter, globalSearch]);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false;
      }
      // Stock & visibility filter
      if (productStockFilter === 'low_stock') {
        const isLow = (p.stock > 0 && p.stock <= 5);
        if (!isLow) return false;
      } else if (productStockFilter === 'out_of_stock') {
        if ((p.stock || 0) > 0) return false;
      } else if (productStockFilter === 'in_stock') {
        if ((p.stock || 0) <= 0) return false;
      } else if (productStockFilter === 'hidden') {
        if (!p.isHidden) return false;
      }

      // Search query
      if (globalSearch.trim()) {
        const query = globalSearch.toLowerCase();
        const pName = typeof p.name === 'object' ? (p.name.ar + ' ' + p.name.en).toLowerCase() : String(p.name).toLowerCase();
        const sku = String(p.sku || '').toLowerCase();
        const cat = String(p.category || '').toLowerCase();
        const modelCode = String(p.modelCode || '').toLowerCase();
        return pName.includes(query) || sku.includes(query) || cat.includes(query) || modelCode.includes(query);
      }
      return true;
    });
  }, [products, productCategoryFilter, productStockFilter, globalSearch]);

  const formatPrice = (amount) => {
    return Number(amount || 0).toLocaleString() + ' د.ع';
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString || Date.now());
      return d.toLocaleDateString('ar-IQ', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString || '';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        fontFamily: "'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* =================================================================== */}
      {/* 1. TOP HEADER BAR                                                   */}
      {/* =================================================================== */}
      <header
        className="no-print"
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderBottom: '1px solid #1E293B',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Logo & Portal Title */}
          <div
            onClick={() => setCurrentView('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <img src={getAssetUrl('/logo.png')} alt="Seneria Fashion" style={{ height: '42px', width: 'auto' }} />
            <div>
              <div style={{ fontFamily: "'Cinzel', 'Amiri', serif", fontSize: '1.15rem', fontWeight: 700, letterSpacing: '0.08em', color: '#FAF8F5' }}>
                SENERIA FASHION
              </div>
              <div style={{ fontSize: '0.72rem', color: '#C5A880', fontWeight: 600, letterSpacing: '0.06em' }}>
                بوابة إدارة المتجر • Staff Admin Portal
              </div>
            </div>
          </div>

          {/* Quick Search */}
          <div style={{ flex: '1 1 260px', maxWidth: '420px', position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="بحث بالمنتجات، اسم العميل، رقم الهاتف، أو كود الطلب..."
              style={{
                width: '100%',
                padding: '9px 36px 9px 12px',
                borderRadius: '8px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                color: '#FAF8F5',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* 1. Dashboard */}
            <button
              onClick={() => setCurrentView('home')}
              style={{
                backgroundColor: currentView === 'home' ? '#C5A880' : 'transparent',
                color: currentView === 'home' ? '#0F172A' : '#E2E8F0',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              الرئيسية • Dashboard
            </button>

            {/* 2. Products */}
            <button
              onClick={() => setCurrentView('products')}
              style={{
                backgroundColor: currentView === 'products' ? '#C5A880' : 'transparent',
                color: currentView === 'products' ? '#0F172A' : '#E2E8F0',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShoppingBag size={15} />
              <span>المنتجات • Products</span>
            </button>

            {/* 3. Orders */}
            <button
              onClick={() => setCurrentView('orders')}
              style={{
                backgroundColor: currentView === 'orders' ? '#C5A880' : 'transparent',
                color: currentView === 'orders' ? '#0F172A' : '#E2E8F0',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative'
              }}
            >
              <Package size={15} />
              <span>الطلبات • Orders</span>
              {stats.pendingCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.68rem',
                    fontWeight: 800
                  }}
                >
                  {stats.pendingCount}
                </span>
              )}
            </button>

            {/* 4. Add Product */}
            <button
              onClick={() => {
                resetForm();
                setCurrentView('add_product');
              }}
              style={{
                backgroundColor: currentView === 'add_product' ? '#C5A880' : 'rgba(197, 168, 128, 0.15)',
                color: currentView === 'add_product' ? '#0F172A' : '#C5A880',
                border: '1px solid rgba(197, 168, 128, 0.4)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Plus size={15} />
              <span>إضافة منتج • Add Product</span>
            </button>

            {/* 5. Video Placements */}
            <button
              onClick={() => setCurrentView('video_placements')}
              style={{
                backgroundColor: currentView === 'video_placements' ? '#C5A880' : 'transparent',
                color: currentView === 'video_placements' ? '#0F172A' : '#E2E8F0',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Film size={15} />
              <span>مواضع الفيديوهات • Video Placements</span>
            </button>

            {/* 5. Settings */}
            <button
              onClick={() => setCurrentView('settings')}
              style={{
                backgroundColor: currentView === 'settings' ? '#C5A880' : 'transparent',
                color: currentView === 'settings' ? '#0F172A' : '#E2E8F0',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sliders size={15} />
              <span>الإعدادات • Settings</span>
            </button>

            {/* Auxiliary: Customers Directory */}
            <button
              onClick={() => setCurrentView('customers')}
              style={{
                backgroundColor: currentView === 'customers' ? '#C5A880' : 'transparent',
                color: currentView === 'customers' ? '#0F172A' : '#94A3B8',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Users size={14} />
              <span>الزبائن</span>
            </button>

            <div style={{ width: '1px', height: '22px', backgroundColor: '#334155', margin: '0 4px' }} />

            <button
              onClick={onBackToStore}
              title="زيارة موقع المتجر للزبائن"
              style={{
                backgroundColor: 'transparent',
                color: '#94A3B8',
                border: '1px solid #334155',
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>المتجر</span>
              <ExternalLink size={13} />
            </button>

            <button
              onClick={logoutAdmin}
              title="تسجيل الخروج"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '7px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={15} />
            </button>
          </nav>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. SIMPLE TOP STATISTICS DASHBOARD                                  */}
      {/* =================================================================== */}
      <div
        className="no-print"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '14px 20px'
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}
        >
          {/* Today's Orders */}
          <div
            onClick={() => {
              setOrderFilter('all');
              setCurrentView('orders');
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                طلبات اليوم • Today's Orders
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                {stats.todayCount} طلب
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#C5A880', fontWeight: 700, direction: 'ltr' }}>
              {formatPrice(stats.todayRevenue)}
            </div>
          </div>

          {/* Pending Orders */}
          <div
            onClick={() => {
              setOrderFilter('new');
              setCurrentView('orders');
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: stats.pendingCount > 0 ? '#FEF3C7' : '#F8FAFC',
              border: stats.pendingCount > 0 ? '1px solid #FCD34D' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: stats.pendingCount > 0 ? '#92400E' : '#64748B', fontWeight: 600 }}>
                طلبات معلقة • Pending Orders
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: stats.pendingCount > 0 ? '#B45309' : '#0F172A', marginTop: '2px' }}>
                {stats.pendingCount} بانتظار التجهيز
              </div>
            </div>
            <Package size={22} color={stats.pendingCount > 0 ? '#D97706' : '#94A3B8'} />
          </div>

          {/* Total Products */}
          <div
            onClick={() => {
              setProductStockFilter('all');
              setCurrentView('products');
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                إجمالي المنتجات • Products
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                {stats.totalProducts} قطعة
              </div>
            </div>
            <ShoppingBag size={22} color="#64748B" />
          </div>

          {/* Low Stock Alert */}
          <div
            onClick={() => {
              setProductStockFilter('low_stock');
              setCurrentView('products');
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: stats.lowStockCount > 0 ? '#FFF1F2' : '#F8FAFC',
              border: stats.lowStockCount > 0 ? '1px solid #FECDD3' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: stats.lowStockCount > 0 ? '#9F1239' : '#64748B', fontWeight: 600 }}>
                مخزون قارب على النفاد • Low Stock
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: stats.lowStockCount > 0 ? '#E11D48' : '#0F172A', marginTop: '2px' }}>
                {stats.lowStockCount} قياس أو منتج
              </div>
            </div>
            <AlertTriangle size={22} color={stats.lowStockCount > 0 ? '#E11D48' : '#94A3B8'} />
          </div>

          {/* Out of Stock Card */}
          <div
            onClick={() => {
              setProductStockFilter('out_of_stock');
              setCurrentView('products');
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: stats.outOfStockCount > 0 ? '#FEF2F2' : '#F8FAFC',
              border: stats.outOfStockCount > 0 ? '1px solid #FECACA' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: stats.outOfStockCount > 0 ? '#991B1B' : '#64748B', fontWeight: 600 }}>
                قطع نفذت • Out of Stock
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: stats.outOfStockCount > 0 ? '#DC2626' : '#0F172A', marginTop: '2px' }}>
                {stats.outOfStockCount} منتج
              </div>
            </div>
            <Package size={22} color={stats.outOfStockCount > 0 ? '#DC2626' : '#94A3B8'} />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 20px' }}>
        {/* =================================================================== */}
        {/* VIEW 1: ADMIN HOME (TWO LARGE MAIN OPTIONS)                         */}
        {/* =================================================================== */}
        {currentView === 'home' && (
          <div>
            {/* Welcoming Subtitle */}
            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <h1
                style={{
                  fontFamily: "'Cinzel', 'Amiri', serif",
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: '0 0 6px 0'
                }}
              >
                بوابة إدارة متجر سناريا فاشن
              </h1>
              <p style={{ fontSize: '0.92rem', color: '#64748B', margin: 0 }}>
                إدارة سهلة وسريعة ومباشرة للمنتجات والطلبات بدون أي تعقيد تقني
              </p>
            </div>

            {/* TWO LARGE MAIN OPTIONS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
              }}
            >
              {/* Option 1: ＋ Add New Product */}
              <div
                onClick={() => {
                  resetForm();
                  setCurrentView('add_product');
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '36px 32px',
                  border: '2px solid #C5A880',
                  boxShadow: '0 12px 32px rgba(197, 168, 128, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(197, 168, 128, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(197, 168, 128, 0.15)';
                }}
              >
                <div>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      backgroundColor: '#0F172A',
                      color: '#C5A880',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}
                  >
                    <Plus size={36} strokeWidth={2.5} />
                  </div>
                  <h2
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: '0 0 8px 0'
                    }}
                  >
                    ＋ إضافة منتج جديد
                  </h2>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#C5A880', marginBottom: '8px' }}>
                    Add New Product
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    إضافة فستان، طقم، بلوزة، بنطلون أو جاكيت جديد مع الصور، الفيديو، وتحديد القياسات والكميات المتوفرة.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#C5A880',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginTop: '24px'
                  }}
                >
                  <span>بدء إضافة المنتج</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Option 2: 📦 Check Orders */}
              <div
                onClick={() => setCurrentView('orders')}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '36px 32px',
                  border: '2px solid #1E293B',
                  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(15, 23, 42, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.25)';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px'
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        backgroundColor: '#1E293B',
                        color: '#C5A880',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Package size={34} />
                    </div>

                    {stats.pendingCount > 0 && (
                      <span
                        style={{
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 800
                        }}
                      >
                        {stats.pendingCount} طلب بانتظارك
                      </span>
                    )}
                  </div>

                  <h2
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: '0 0 8px 0'
                    }}
                  >
                    📦 متابعة وتجهيز الطلبات
                  </h2>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#C5A880', marginBottom: '8px' }}>
                    Check Orders
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                    استعراض طلبات الزبائن الجديدة، طباعة فواتير التجهيز للمندوب، وتحديث حالة الطلب (تأكيد، تجهيز، تسليم).
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#C5A880',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginTop: '24px'
                  }}
                >
                  <span>فتح قائمة الطلبات</span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Option 3: 👥 Check & Accept Customers */}
              <div
                onClick={() => setCurrentView('customers')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '36px 32px',
                  border: '2px solid #E2E8F0',
                  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = '#C5A880';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(197, 168, 128, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.06)';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px'
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        backgroundColor: '#F1F5F9',
                        color: '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Users size={34} />
                    </div>

                    {stats.pendingCustomersCount > 0 && (
                      <span
                        style={{
                          backgroundColor: '#FEF3C7',
                          color: '#B45309',
                          border: '1px solid #FCD34D',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 800
                        }}
                      >
                        {stats.pendingCustomersCount} بانتظار الاعتماد
                      </span>
                    )}
                  </div>

                  <h2
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: '0 0 8px 0'
                    }}
                  >
                    👥 إدارة واعتماد الزبائن
                  </h2>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#C5A880', marginBottom: '8px' }}>
                    Manage &amp; Accept Customers
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    مراجعة وتأكيد الزبائن الجدد، تتبع العناوين ومواقع GPS على الخريطة، أو حذف الزبائن نهائياً.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#0F172A',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginTop: '24px'
                  }}
                >
                  <span>عرض قائمة الزبائن</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>

            {/* Low Stock Warning Callout if any items are <= 5 */}
            {/* Detailed Low Stock Alert with Item Breakdown */}
            {stats.lowStockCount > 0 && (
              <div
                style={{
                  backgroundColor: '#FFF1F2',
                  border: '1px solid #FECDD3',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  marginBottom: '32px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#FFE4E6',
                        color: '#E11D48',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <AlertTriangle size={22} />
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: '#9F1239' }}>
                        ⚠ تنبيه المخزون المنخفض • Low Stock Attention
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#BE123C' }}>
                        يوجد {stats.lowStockCount} قياس أو قطعة أوشكت على النفاد (5 قطع أو أقل).
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setProductStockFilter('low_stock');
                      setCurrentView('products');
                    }}
                    style={{
                      backgroundColor: '#E11D48',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '9px 18px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    عرض المنتجات لإعادة التعبئة
                  </button>
                </div>

                {/* Specific Low Stock Items List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {stats.lowStockList.slice(0, 6).map((item, idx) => {
                    const pName = typeof item.product?.name === 'object' ? item.product.name.ar || item.product.name.en : item.product?.name;
                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #FECDD3',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem'
                        }}
                      >
                        <div>
                          <strong style={{ color: '#0F172A', display: 'block' }}>{pName}</strong>
                          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>المقاس: <strong>{item.size}</strong></span>
                        </div>
                        <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.78rem' }}>
                          بقي {item.qty} فقط
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Orders Quick Preview */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                  أحدث الطلبات المستلمة • Recent Orders
                </h3>
                <button
                  onClick={() => setCurrentView('orders')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#C5A880',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  عرض جميع الطلبات ({orders.length}) ←
                </button>
              </div>

              {orders.slice(0, 4).map((ord) => {
                const customer = ord.customer || {};
                const st = ORDER_STATUS_CONFIG[ord.status] || ORDER_STATUS_CONFIG.new;

                return (
                  <div
                    key={ord.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 0',
                      borderBottom: '1px solid #F1F5F9',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                          #{ord.id}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          {formatDate(ord.date)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '2px' }}>
                        <strong>{customer.name || ord.customerName || 'عميل'}</strong> • {customer.phone || ord.customerPhone} ({customer.governorate || ord.customerGovernorate || 'بغداد'})
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          backgroundColor: st.bg,
                          color: st.color,
                          border: `1px solid ${st.border}`,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        {st.labelAr}
                      </span>

                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', direction: 'ltr' }}>
                        {formatPrice(ord.total)}
                      </div>

                      <button
                        onClick={() => setPrintSingleOrder(ord)}
                        title="طباعة الفاتورة"
                        style={{
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.78rem'
                        }}
                      >
                        <Printer size={14} />
                        <span>طباعة</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: ＋ ADD / EDIT PRODUCT GUIDED FORM                           */}
        {/* =================================================================== */}
        {currentView === 'add_product' && (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {/* Header with Back button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <button
                  onClick={() => setCurrentView('home')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0,
                    marginBottom: '6px'
                  }}
                >
                  ← العودة للرئيسية
                </button>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
                  {editingProductId ? 'تعديل المنتج' : 'إضافة منتج نسائي جديد'}
                </h1>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleQuickFillSample}
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #F59E0B',
                    color: '#B45309',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(245, 158, 11, 0.15)',
                    transition: 'all 0.15s ease'
                  }}
                  title="تعبئة سريعة تلقائية بضغطة زر واحدة لتجربة إضافة المنتج فوراً"
                >
                  <Sparkles size={16} color="#D97706" />
                  <span>⚡ تعبئة سريعة للتجربة • Quick Fill</span>
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  مسح الحقول • Clear
                </button>
              </div>
            </div>

            {/* Published Success Confirmation Card */}
            {publishedSuccessProduct && (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '2px solid #86EFAC',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '28px',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px auto'
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: 800, color: '#15803D' }}>
                  ✓ Product published successfully
                </h2>
                <div style={{ fontSize: '0.95rem', color: '#166534', marginBottom: '18px' }}>
                  تم نشر المنتج <strong>"{typeof publishedSuccessProduct.name === 'object' ? publishedSuccessProduct.name.ar : publishedSuccessProduct.name}"</strong> بنجاح في متجر سناريا فاشن
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <button
                    onClick={() => {
                      resetForm();
                      setPublishedSuccessProduct(null);
                    }}
                    style={{
                      backgroundColor: '#15803D',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ＋ إضافة منتج آخر
                  </button>

                  <button
                    onClick={() => {
                      setPublishedSuccessProduct(null);
                      setCurrentView('products');
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    عرض قائمة المنتجات
                  </button>

                  <button
                    onClick={() => {
                      setPublishedSuccessProduct(null);
                      setCurrentView('orders');
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      border: '1px solid #CBD5E1',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    متابعة الطلبات
                  </button>
                </div>

                {/* WHERE DOES THIS CLOTH GO? Live Destination Map */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1.5px solid #86EFAC',
                    padding: '20px',
                    textAlign: 'right',
                    boxShadow: '0 4px 15px rgba(22, 101, 52, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Compass size={20} color="#15803D" />
                      <span>أين ذهب هذا الموديل الآن في الموقع؟ • Where It Appears Right Now</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '6px', fontWeight: 800 }}>
                      ✓ تم التوزيع والربط التلقائي في كافة أقسام المتجر
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                    أصبح هذا الموديل منشوراً ومتاحاً للزبائن في المواقع المحددة أدناه. اضغط على أي زر لمعاينة ظهوره مباشرة:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                    {/* 1. View in Homepage */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onBackToStore) onBackToStore();
                      }}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>🏠</span>
                      <span>معاينة في الصفحة الرئيسية (Homepage)</span>
                    </button>

                    {/* 2. View in Shop Category */}
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('shop', { category: publishedSuccessProduct.category });
                        }}
                        style={{
                          padding: '12px 14px',
                          backgroundColor: '#F8FAFC',
                          color: '#0F172A',
                          border: '1.5px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🛍️</span>
                        <span>معاينة في قسم ({WOMEN_CATEGORIES.find(c => c.id === publishedSuccessProduct.category)?.labelAr || publishedSuccessProduct.category})</span>
                      </button>
                    )}

                    {/* 3. View in Runway Reels if has video */}
                    {publishedSuccessProduct.videoUrl && onNavigate && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('discover');
                        }}
                        style={{
                          padding: '12px 14px',
                          backgroundColor: '#DCFCE7',
                          color: '#15803D',
                          border: '1.5px solid #86EFAC',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <Film size={15} />
                        <span>🎬 معاينة في ريلز الفيديوهات (Discover Feed)</span>
                      </button>
                    )}

                    {/* 4. Open Customer Product Detail Page */}
                    {onSelectProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProduct(publishedSuccessProduct);
                        }}
                        style={{
                          padding: '12px 14px',
                          backgroundColor: '#C5A880',
                          color: '#0A0A0A',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🔍</span>
                        <span>فتح صفحة الموديل كما يراها الزبون</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handlePublishProduct} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* SECTION 1: Product Information */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C5A880', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  خطوة 1 • STEP 1
                </div>
                <h3 style={{ margin: '0 0 18px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                  معلومات المنتج • Product Information
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Product Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      اسم المنتج • Product Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="مثال: فستان كريب حريري ميدي، طقم قميص وبنطلون كود 7051..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Category Selection (Women's Clothing) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      القسم • Category <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {WOMEN_CATEGORIES.map(cat => {
                        const isSelected = productCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategorySelect(cat.id)}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? '#0F172A' : '#F8FAFC',
                              color: isSelected ? '#C5A880' : '#334155',
                              border: isSelected ? '2px solid #C5A880' : '1px solid #CBD5E1',
                              fontWeight: isSelected ? 800 : 600,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.labelAr}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      السعر بالدينار العراقي • Price (IQD) <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        required
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="مثال: 35000 أو 35,000"
                        style={{
                          width: '200px',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '1rem',
                          fontWeight: 700,
                          direction: 'ltr',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748B' }}>دينار عراقي (IQD)</span>

                      {/* Live Parsed Price Preview */}
                      {parseFlexiblePrice(productPrice) > 0 && (
                        <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800 }}>
                          ✓ {formatPrice(parseFlexiblePrice(productPrice))}
                        </span>
                      )}

                      {/* Quick price presets */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {[25000, 28000, 32000, 35000, 45000].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setProductPrice(String(amt))}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: parseFlexiblePrice(productPrice) === amt ? '#C5A880' : '#F1F5F9',
                              color: parseFlexiblePrice(productPrice) === amt ? '#0F172A' : '#475569',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {formatPrice(amt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product Description (Optional) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      وصف وتفاصيل الموديل (اختياري) • Product Description
                    </label>
                    <textarea
                      rows={3}
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="نوع القماش، تفاصيل القصة، المناسبات الملائمة..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Live Website Placement Guide */}
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '16px',
                      marginTop: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                      <Compass size={17} color="#C5A880" />
                      <span>خريطة ظهور هذا الموديل في الموقع • Where This Cloth Will Go</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 10px 0' }}>
                      بمجرد نشر الموديل، سيتم توجيهه وعرضه تلقائياً في الأماكن التالية داخل المتجر:
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
                      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#0F172A' }}>
                          <span>🏠</span>
                          <span>الصفحة الرئيسية (Homepage)</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '4px', lineHeight: 1.5 }}>
                          • يظهر في شريط "أحدث الموديلات" (New Arrivals)<br />
                          • يظهر في قسم ({WOMEN_CATEGORIES.find(c => c.id === productCategory)?.labelAr || productCategory})
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#0F172A' }}>
                          <span>🎬</span>
                          <span>خلاصة الفيديوهات (Runway Reels)</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: productVideo ? '#15803D' : '#64748B', marginTop: '4px', lineHeight: 1.5, fontWeight: productVideo ? 700 : 500 }}>
                          {productVideo 
                            ? '✓ مرفق فيديو: سيظهر في ريلز المنصة بالرئيسية وصفحة Discover' 
                            : '• بدون فيديو: يظهر كصورة في الكتالوج (أرفق فيديو بالخطوة 3 ليظهر بالريلز)'}
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#0F172A' }}>
                          <span>🛍️</span>
                          <span>صفحة المتجر والبحث المباشر</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '4px', lineHeight: 1.5 }}>
                          • متاح في كتالوج المتجر الكامل مع الفلترة<br />
                          • يظهر فوراً عند كتابة "{productName || 'اسم الموديل'}" بالبحث
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Offered Colors */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C5A880', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    خطوة 2 • STEP 2
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: productColors.length > 0 ? '#15803D' : '#64748B' }}>
                    {productColors.length > 0 ? `✓ تم اختيار ${productColors.length} ألوان` : 'اختياري • Optional'}
                  </div>
                </div>

                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                  الألوان المتوفرة للموديل • Offered Colors
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  حدد ألوان الموديل المتوفرة بالنقر على تشكيلة الألوان الجاهزة أدناه، أو أضف لوناً مخصصاً بدرجته الدقيقة واسمه. ستظهر دوائر الألوان لزبائن المتجر لاختيار لونهم المفضل عند الطلب.
                </p>

                {/* Selected Active Colors List */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    الألوان المحددة حالياً لهذا الموديل ({productColors.length}):
                  </div>
                  {productColors.length === 0 ? (
                    <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1', fontSize: '0.82rem', color: '#64748B' }}>
                      لم تختر أي لون بعد. اضغط على أي لون من التشكيلة أدناه لإضافته فوراً، أو استخدم محدد اللون المخصص.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {productColors.map((colorItem, cIdx) => {
                        const nameAr = typeof colorItem.name === 'object' ? colorItem.name.ar : colorItem.name;
                        const nameEn = typeof colorItem.name === 'object' ? colorItem.name.en : '';
                        return (
                          <div
                            key={cIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              backgroundColor: '#F1F5F9',
                              border: '1.5px solid #CBD5E1',
                              borderRadius: '24px',
                              padding: '6px 12px 6px 8px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                          >
                            <span
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: colorItem.hex,
                                border: '1.5px solid #FFFFFF',
                                boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
                                flexShrink: 0
                              }}
                            />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                              {nameAr} {nameEn && <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>({nameEn})</span>}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                              {colorItem.hex}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveColor(cIdx)}
                              title="إزالة هذا اللون"
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#E2E8F0',
                                border: 'none',
                                color: '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Luxury Color Presets Grid */}
                <div style={{ marginBottom: '18px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                      ✨ تشكيلة الألوان الشائعة والفاخرة (اضغط للاختيار أو الإلغاء السريع):
                    </div>
                    {productColors.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setProductColors([])}
                        style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        مسح كافة الألوان
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {LUXURY_COLOR_PRESETS.map((preset, pIdx) => {
                      const isSelected = productColors.some(
                        c => (typeof c.name === 'object' ? c.name.ar === preset.name.ar : c.name === preset.name.ar) || c.hex?.toLowerCase() === preset.hex?.toLowerCase()
                      );

                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleTogglePresetColor(preset)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '7px 10px',
                            borderRadius: '8px',
                            backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                            color: isSelected ? '#C5A880' : '#1E293B',
                            border: isSelected ? '2px solid #C5A880' : '1px solid #CBD5E1',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 800 : 600,
                            textAlign: 'right',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: preset.hex,
                              border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(0,0,0,0.2)',
                              flexShrink: 0
                            }}
                          />
                          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {preset.name.ar}
                          </span>
                          {isSelected && <span style={{ fontSize: '0.75rem', color: '#C5A880' }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Adder */}
                <div style={{ backgroundColor: '#FAF8F5', border: '1px solid #EFEAE3', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    🎨 إضافة لون مخصص بدرجة دقيقة (Custom Color):
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', padding: '4px 8px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(e.target.value)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          background: 'none',
                          padding: 0
                        }}
                      />
                      <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 700, color: '#475569' }}>
                        {customColorHex}
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="اسم اللون بالعربية (مثال: برونزي، بترولي ملوكي)..."
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomColor();
                        }
                      }}
                      style={{
                        flex: '1 1 200px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />

                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      style={{
                        backgroundColor: '#C5A880',
                        color: '#0A0A0A',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ＋ إضافة هذا اللون
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Product Media & Placement */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C5A880', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  خطوة 3 • STEP 3
                </div>
                <h3 style={{ margin: '0 0 18px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                  صور وفيديو المنتج • Photos & Video
                </h3>

                {/* Multiple Photos Upload */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    صور المنتج (يمكنك رفع عدة صور) • Multiple Photos
                  </label>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Upload size={16} />
                      <span>اختر صور من جهازك • Upload Images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>


                  </div>

                  {/* Photos Preview Thumbnails */}
                  {productPhotos.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                      {productPhotos.map((imgUrl, i) => (
                        <div key={i} style={{ position: 'relative', width: '90px', height: '120px', borderRadius: '6px', overflow: 'hidden', border: i === 0 ? '2px solid #C5A880' : '1px solid #CBD5E1' }}>
                          <img src={imgUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {i === 0 && (
                            <span style={{ position: 'absolute', bottom: '4px', left: '4px', right: '4px', backgroundColor: '#C5A880', color: '#0F172A', fontSize: '0.625rem', fontWeight: 800, textAlign: 'center', borderRadius: '2px' }}>
                              الغلاف
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setProductPhotos(prev => prev.filter((_, idx) => idx !== i))}
                            style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Video Upload & Selection */}
                <div style={{ marginBottom: '28px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      <Film size={18} color="#C5A880" />
                      <span>فيديو المنتج (فيديو الموديل) • Product Video</span>
                    </label>
                    {productVideo && (
                      <span style={{ fontSize: '0.72rem', backgroundColor: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        ✓ تم إرفاق فيديو
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                    يمكنك رفع فيديو من جهازك (MP4 / WebM / MOV) ليظهر في صفحة تفاصيل المنتج، عروض المنصة (Runway Reels)، وتغذية الفيديو التفاعلية.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: isVideoUploading ? '#94A3B8' : '#C5A880',
                        color: '#0F172A',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: isVideoUploading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 6px rgba(197, 168, 128, 0.3)'
                      }}
                    >
                      <Upload size={16} />
                      <span>{isVideoUploading ? 'جاري رفع الفيديو...' : 'رفع فيديو من جهازك • Upload Video'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/*"
                        onChange={handleVideoFileUpload}
                        disabled={isVideoUploading}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <input
                      type="text"
                      value={productVideo}
                      onChange={(e) => {
                        setProductVideo(e.target.value);
                        setVideoUploadMeta(null);
                      }}
                      placeholder="أو الصق رابط الفيديو (مثال: https://... أو /videos/...)"
                      style={{
                        flex: '1 1 260px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        backgroundColor: '#FFFFFF',
                        direction: 'ltr'
                      }}
                    />

                    {productVideo && (
                      <button
                        type="button"
                        onClick={() => {
                          setProductVideo('');
                          setVideoUploadMeta(null);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 14px',
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={15} />
                        <span>إزالة الفيديو</span>
                      </button>
                    )}
                  </div>

                  {/* Video Meta & Preview */}
                  {productVideo && (
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ width: '180px', height: '240px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', position: 'relative', flexShrink: 0 }}>
                        <video
                          src={productVideo}
                          controls
                          playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: '1 1 200px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                          معاينة مشغل الفيديو
                        </div>
                        {videoUploadMeta ? (
                          <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
                            <div><strong>الملف:</strong> {videoUploadMeta.name}</div>
                            <div><strong>الحجم:</strong> {videoUploadMeta.size}</div>
                            <div style={{ color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>✓ مخزن محلياً بتقنية IndexedDB السريعة</div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.78rem', color: '#475569', wordBreak: 'break-all' }}>
                            <div><strong>الرابط:</strong> {productVideo}</div>
                          </div>
                        )}
                        <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '10px', lineHeight: 1.4 }}>
                          يمكنك النقر على زر التشغيل للتأكد من جودة وحركة الفيديو قبل النشر.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Video Placement Destination in Store */}
                  <div style={{ marginTop: '16px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        <Sparkles size={16} color="#C5A880" />
                        <span>🎯 أين تريد وضع هذا الفيديو في المتجر؟ • Video Placement Destination</span>
                      </label>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        اضغط لاختيار اللوحة التحريرية المحددة
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
                      {[
                        { id: 'new_arrivals', icon: '⭐', titleAr: 'وصل حديثاً', titleEn: 'NEW ARRIVALS', desc: 'اللوحة 1 في مختارات سناريا' },
                        { id: 'evening_edit', icon: '🌙', titleAr: 'مختارات السهرة', titleEn: 'THE EVENING EDIT', desc: 'اللوحة 2 فساتين وسهرات' },
                        { id: 'everyday_essentials', icon: '👔', titleAr: 'الأساسيات الراقية', titleEn: 'EVERYDAY ESSENTIALS', desc: 'اللوحة 3 أطقم وبلايزرات' },
                        { id: 'signature_collection', icon: '👑', titleAr: 'المجموعة الأيقونية', titleEn: 'SIGNATURE COLLECTION', desc: 'اللوحة 4 تصاميم 1992' },
                        { id: 'runway_reels', icon: '🎬', titleAr: 'عروض المنصة', titleEn: 'RUNWAY REELS', desc: 'شريط الفيديوهات التفاعلية' },
                        { id: 'hero_banner', icon: '🌟', titleAr: 'واجهة المتجر', titleEn: 'HERO BANNER', desc: 'الفيديو الرئيسي بأعلى الموقع' },
                        { id: 'none', icon: '🛍️', titleAr: 'صفحة المنتج فقط', titleEn: 'PRODUCT PAGE ONLY', desc: 'لا يتم ربطه باللوحات' }
                      ].map(opt => {
                        const isChosen = productVideoPlacement === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => setProductVideoPlacement(opt.id)}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '8px',
                              border: isChosen ? '2px solid #C5A880' : '1px solid #CBD5E1',
                              backgroundColor: isChosen ? '#0F172A' : '#F8FAFC',
                              color: isChosen ? '#FFFFFF' : '#1E293B',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '1.1rem' }}>{opt.icon}</span>
                              {isChosen && <span style={{ color: '#C5A880', fontSize: '0.72rem', fontWeight: 800 }}>✓ محدد</span>}
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isChosen ? '#C5A880' : '#0F172A' }}>
                              {opt.titleAr}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: isChosen ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                              {opt.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Where Does the Product Appear? */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    أين يظهر المنتج في الموقع؟ • Where should the product appear?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {[
                      { id: 'BOTH', titleAr: 'الاثنين معاً (موصى به)', titleEn: 'BOTH (Main + Video Feed)', desc: 'يظهر في الصفحة الرئيسية وخلاصة الفيديوهات' },
                      { id: 'MAIN', titleAr: 'الصفحة الرئيسية فقط', titleEn: 'MAIN PAGE ONLY', desc: 'يظهر في كتالوج وأقسام الصفحة الرئيسية' },
                      { id: 'SCROLL', titleAr: 'خلاصة الفيديوهات (Reels)', titleEn: 'Scroll Down / Video Feed', desc: 'يظهر في خلاصة الفيديوهات العمودية' }
                    ].map(option => {
                      const isSelected = productPlacement === option.id;
                      return (
                        <div
                          key={option.id}
                          onClick={() => setProductPlacement(option.id)}
                          style={{
                            padding: '14px',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid #C5A880' : '1px solid #CBD5E1',
                            backgroundColor: isSelected ? 'rgba(197, 168, 128, 0.08)' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#C5A880' : '#0F172A' }}>
                            <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: isSelected ? '5px solid #C5A880' : '2px solid #CBD5E1' }} />
                            <span>{option.titleAr}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', paddingRight: '24px' }}>
                            {option.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Sizes & Stock */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C5A880', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    خطوة 4 • STEP 4
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: formTotalStock > 0 ? '#15803D' : '#DC2626' }}>
                    إجمالي القطع المتوفرة: {formTotalStock} قطعة
                  </div>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                  القياسات والمخزون • Sizes & Stock
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 18px 0' }}>
                  اضغط على القياس لتحديده، ثم حدد الكمية المتوفرة منه. إذا وصلت كمية أي قياس إلى 0، سيظهر تلقائياً كـ (نفذت الكمية) للزبائن.
                </p>

                {/* Size Presets Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setSizePresetTab('numeric')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: sizePresetTab === 'numeric' ? '2px solid #C5A880' : '1px solid #CBD5E1',
                      backgroundColor: sizePresetTab === 'numeric' ? '#0F172A' : '#F8FAFC',
                      color: sizePresetTab === 'numeric' ? '#C5A880' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    أرقام أوروبية وتركية (36 - 50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizePresetTab('alpha')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: sizePresetTab === 'alpha' ? '2px solid #C5A880' : '1px solid #CBD5E1',
                      backgroundColor: sizePresetTab === 'alpha' ? '#0F172A' : '#F8FAFC',
                      color: sizePresetTab === 'alpha' ? '#C5A880' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    أحرف دولية (XXS - 3XL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizePresetTab('perfumes')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: sizePresetTab === 'perfumes' ? '2px solid #C5A880' : '1px solid #CBD5E1',
                      backgroundColor: sizePresetTab === 'perfumes' ? '#0F172A' : '#F8FAFC',
                      color: sizePresetTab === 'perfumes' ? '#C5A880' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✨ عبوات وسعات العطور (50ml - 200ml)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizePresetTab('one_size')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: sizePresetTab === 'one_size' ? '2px solid #C5A880' : '1px solid #CBD5E1',
                      backgroundColor: sizePresetTab === 'one_size' ? '#0F172A' : '#F8FAFC',
                      color: sizePresetTab === 'one_size' ? '#C5A880' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    قياس موحد (One Size)
                  </button>
                </div>

                {/* Quick actions row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const preset = sizePresetTab === 'numeric' 
                          ? SIZES_NUMERIC 
                          : sizePresetTab === 'alpha' 
                          ? SIZES_ALPHA 
                          : sizePresetTab === 'perfumes'
                          ? SIZES_PERFUMES
                          : SIZES_ONE_SIZE;
                        handleSelectAllInPreset(preset);
                      }}
                      style={{ padding: '5px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', backgroundColor: '#E2E8F0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      ✓ تحديد كل قياسات الفئة
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllSizes}
                      style={{ padding: '5px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      ✕ مسح التحديد
                    </button>
                  </div>

                  {/* Custom Size Form Input */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="إضافة قياس مخصص (مثل: 52 أو 120ml)"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomSize(e); }}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', width: '180px' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSize}
                      style={{ padding: '6px 12px', backgroundColor: '#C5A880', color: '#121212', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      + إضافة
                    </button>
                  </div>
                </div>

                {/* Size Selector Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {(() => {
                    const presetList = sizePresetTab === 'numeric'
                      ? SIZES_NUMERIC
                      : sizePresetTab === 'alpha'
                      ? SIZES_ALPHA
                      : sizePresetTab === 'perfumes'
                      ? SIZES_PERFUMES
                      : SIZES_ONE_SIZE;
                    // Union of current preset and any currently selected sizes
                    const allButtons = Array.from(new Set([...presetList, ...Object.keys(selectedSizesMap)]));

                    return allButtons.map(size => {
                      const isSelected = selectedSizesMap[size] !== undefined;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleToggleSize(size)}
                          style={{
                            minWidth: '64px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: isSelected ? '#0F172A' : '#F8FAFC',
                            color: isSelected ? '#C5A880' : '#475569',
                            border: isSelected ? '2px solid #C5A880' : '1px solid #CBD5E1',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{size}</span>
                          {isSelected && (
                            <span style={{ fontSize: '0.625rem', color: '#A3E635', marginTop: '2px' }}>
                              {selectedSizesMap[size]} ق
                            </span>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>

                {/* Quantity inputs for each selected size */}
                {Object.keys(selectedSizesMap).length === 0 ? (
                  <div style={{ padding: '16px', backgroundColor: '#FEF2F2', border: '1px dashed #F87171', borderRadius: '8px', color: '#B91C1C', fontSize: '0.85rem', fontWeight: 600 }}>
                    يرجى اختيار قياس واحد على الأقل لتحديد الكمية المتوفرة
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', backgroundColor: '#F8FAFC', padding: '18px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    {Object.keys(selectedSizesMap).map(size => {
                      const qty = selectedSizesMap[size];
                      return (
                        <div
                          key={size}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '12px 14px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                              قياس {size}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: qty > 0 ? '#15803D' : '#DC2626' }}>
                              {qty > 0 ? `${qty} متوفر` : 'نفذت الكمية'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleSizeStockChange(size, qty - 1)}
                              style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              -
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={qty}
                              onChange={(e) => handleSizeStockChange(size, e.target.value)}
                              style={{ width: '60px', textAlign: 'center', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 800, fontSize: '0.95rem' }}
                            />

                            <button
                              type="button"
                              onClick={() => handleSizeStockChange(size, qty + 1)}
                              style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              +
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSizeStockChange(size, qty + 10)}
                              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              +10
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 5: Live Summary Preview & Big Publish Button */}
              <div
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '28px',
                  boxShadow: '0 8px 30px rgba(15, 23, 42, 0.2)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C5A880', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  خطوة 5 • معاينة ما قبل النشر • PREVIEW BEFORE PUBLISHING
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #1E293B',
                    marginBottom: '20px'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {productName || 'اسم المنتج سيظهر هنا'}
                    </h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: '#1E293B', color: '#C5A880', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {WOMEN_CATEGORIES.find(c => c.id === productCategory)?.labelAr || productCategory}
                      </span>
                      <span style={{ backgroundColor: '#1E293B', color: '#94A3B8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
                        الظهور: {productPlacement === 'BOTH' ? 'الرئيسية + الفيديوهات' : productPlacement === 'MAIN' ? 'الرئيسية فقط' : 'الفيديوهات'}
                      </span>
                      {productVideo && (
                        <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                          ▶ مرفق فيديو
                        </span>
                      )}
                    </div>

                    {/* Colors Preview */}
                    {productColors.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>الألوان ({productColors.length}):</span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {productColors.map((clr, cIdx) => {
                            const clrName = typeof clr.name === 'object' ? clr.name.ar : clr.name;
                            return (
                              <span
                                key={cIdx}
                                title={clrName}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  backgroundColor: '#1E293B',
                                  color: '#F8FAFC',
                                  padding: '2px 8px',
                                  borderRadius: '16px',
                                  fontSize: '0.72rem',
                                  border: '1px solid #334155'
                                }}
                              >
                                <span
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: clr.hex,
                                    border: '1px solid rgba(255,255,255,0.4)'
                                  }}
                                />
                                <span>{clrName}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'left', direction: 'ltr' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C5A880' }}>
                      {productPrice ? formatPrice(productPrice) : '0 د.ع'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                      إجمالي المخزون: {formTotalStock} قطعة
                    </div>
                  </div>
                </div>

                {/* Big Publish Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '8px',
                    backgroundColor: '#C5A880',
                    color: '#0A0A0A',
                    border: 'none',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(197, 168, 128, 0.3)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C5A880')}
                >
                  <span>{editingProductId ? 'تحديث ونشر التعديلات' : 'نشر المنتج في المتجر • PUBLISH PRODUCT'}</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: 📦 CHECK ORDERS DASHBOARD                                   */}
        {/* =================================================================== */}
        {currentView === 'orders' && (
          <div>
            {/* Orders Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <button
                  onClick={() => setCurrentView('home')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0,
                    marginBottom: '4px'
                  }}
                >
                  ← العودة للرئيسية
                </button>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
                  متابعة وتجهيز الطلبات • Check Orders
                </h1>
              </div>

              {/* Print All Orders Button */}
              <button
                onClick={() => setIsPrintAllOpen(true)}
                disabled={filteredOrders.length === 0}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: '1px solid #334155',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Printer size={16} color="#C5A880" />
                <span>🖨 طباعة جميع الطلبات ({filteredOrders.length}) • Print All Orders</span>
              </button>
            </div>

            {/* Filter Tabs for Order Statuses */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '12px',
                marginBottom: '20px'
              }}
            >
              {[
                { id: 'all', labelAr: 'جميع الطلبات', labelEn: 'All' },
                { id: 'new', labelAr: 'طلبات جديدة / معلقة', labelEn: 'New' },
                { id: 'confirmed', labelAr: 'مؤكدة', labelEn: 'Confirmed' },
                { id: 'preparing', labelAr: 'قيد التجهيز', labelEn: 'Preparing' },
                { id: 'ready', labelAr: 'جاهزة للتوصيل', labelEn: 'Ready' },
                { id: 'delivered', labelAr: 'تم التوصيل', labelEn: 'Delivered' },
                { id: 'cancelled', labelAr: 'ملغية', labelEn: 'Cancelled' }
              ].map(tab => {
                const isSelected = orderFilter === tab.id;
                const count = orders.filter(o => {
                  if (tab.id === 'all') return true;
                  const s = (o.status || 'new').toLowerCase();
                  if (tab.id === 'new') return s === 'new' || s === 'pending';
                  return s === tab.id;
                }).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setOrderFilter(tab.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                      color: isSelected ? '#C5A880' : '#475569',
                      border: isSelected ? '1px solid #0F172A' : '1px solid #CBD5E1',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{tab.labelAr}</span>
                    <span
                      style={{
                        backgroundColor: isSelected ? '#C5A880' : '#F1F5F9',
                        color: isSelected ? '#0F172A' : '#475569',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: 800
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Orders Cards List */}
            {filteredOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: '#64748B'
                }}
              >
                <Package size={48} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#0F172A' }}>
                  لا توجد طلبات مطابقة حالياً
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  جرب تغيير حالة التصفية أو البحث برقم آخر
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOrders.map(order => {
                  const customer = order.customer || {};
                  const customerName = customer.name || order.customerName || 'عميل سناريا';
                  const customerPhone = customer.phone || order.customerPhone || 'غير متوفر';
                  const customerGov = customer.governorate || order.customerGovernorate || 'بغداد';
                  const customerAddress = customer.address || order.customerAddress || 'الفرع';
                  const mapsUrl = order.mapsUrl || customer.mapsUrl;
                  const currentStatus = order.status || 'new';
                  const st = ORDER_STATUS_CONFIG[currentStatus] || ORDER_STATUS_CONFIG.new;

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Order Card Header */}
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderBottom: '1px solid #E2E8F0',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                            #{order.id}
                          </span>
                          <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                            {formatDate(order.date)}
                          </span>
                        </div>

                        {/* Status Changer & Print Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>حالة الطلب:</span>
                            <select
                              value={currentStatus}
                              onChange={(e) => {
                                updateOrderStatus(order.id, e.target.value);
                                showToast(`تم تحديث حالة الطلب #${order.id}`, 'success');
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: `1px solid ${st.border}`,
                                backgroundColor: st.bg,
                                color: st.color,
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              <option value="new">جديد • New</option>
                              <option value="confirmed">مؤكد • Confirmed</option>
                              <option value="preparing">قيد التجهيز • Preparing</option>
                              <option value="ready">جاهز للتوصيل • Ready</option>
                              <option value="delivered">تم التوصيل • Delivered</option>
                              <option value="cancelled">ملغي • Cancelled</option>
                            </select>
                          </div>

                          {/* Print Single Order Button */}
                          <button
                            onClick={() => setPrintSingleOrder(order)}
                            style={{
                              backgroundColor: '#0F172A',
                              color: '#FAF8F5',
                              border: 'none',
                              padding: '7px 14px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Printer size={15} color="#C5A880" />
                            <span>🖨 طباعة الفاتورة</span>
                          </button>

                          {/* Delete Order Button */}
                          <button
                            onClick={() => setOrderToDelete(order)}
                            style={{
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              border: '1px solid #FECACA',
                              padding: '7px 12px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            title="حذف هذا الطلب نهائياً"
                          >
                            <Trash2 size={14} />
                            <span>حذف الطلب</span>
                          </button>
                        </div>
                      </div>

                      {/* Order Card Body */}
                      <div style={{ padding: '20px' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                            marginBottom: '20px'
                          }}
                        >
                          {/* Customer Details */}
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                              معلومات العميل • Customer
                            </div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                              {customerName}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                              <a
                                href={`tel:${customerPhone}`}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem' }}
                              >
                                <Phone size={14} color="#C5A880" />
                                <span style={{ direction: 'ltr' }}>{customerPhone}</span>
                              </a>

                              <a
                                href={`https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: '#DCFCE7',
                                  color: '#15803D',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  textDecoration: 'none'
                                }}
                              >
                                <MessageCircle size={13} />
                                <span>واتساب</span>
                              </a>
                            </div>

                            {/* Customer Status & Accept / Delete Buttons */}
                            {(() => {
                              const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
                              const custRecord = customers?.find(c => (c.phone && cleanPhone && c.phone.replace(/[^0-9]/g, '').includes(cleanPhone)) || c.id === order.customer?.id);
                              const isAccepted = custRecord ? custRecord.status === 'accepted' : false;
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                                  {isAccepted ? (
                                    <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                      <CheckCircle2 size={12} />
                                      <span>زبون معتمد (Accepted)</span>
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        acceptCustomer(custRecord?.id || customerPhone);
                                        showToast(`تم قبول واعتماد الزبون ${customerName} بنجاح`, 'success');
                                      }}
                                      style={{
                                        backgroundColor: '#16A34A',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '4px 10px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                    >
                                      <UserCheck size={13} />
                                      <span>✓ قبول الزبون</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setCustomerToDelete(custRecord || { id: order.customer?.id || customerPhone, fullName: customerName, phone: customerPhone })}
                                    style={{
                                      backgroundColor: '#FEE2E2',
                                      color: '#DC2626',
                                      border: '1px solid #FECACA',
                                      borderRadius: '6px',
                                      padding: '3px 8px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                    title="حذف هذا الزبون نهائياً"
                                  >
                                    <UserX size={12} />
                                    <span>حذف الزبون</span>
                                  </button>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Delivery Address */}
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                              عنوان التوصيل • Location
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                              {customerGov} — {customerAddress}
                            </div>
                            {mapsUrl && (
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563EB', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', marginTop: '4px' }}
                              >
                                <MapPin size={13} />
                                <span>فتح خريطة التوصيل (Google Maps GPS)</span>
                              </a>
                            )}
                          </div>

                          {/* Total & Payment */}
                          <div style={{ textAlign: 'left', direction: 'ltr' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                              المبلغ الإجمالي • Total Price
                            </div>
                            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#B45309' }}>
                              {formatPrice(order.total)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, marginTop: '2px' }}>
                              الدفع عند الاستلام (COD)
                            </div>
                          </div>
                        </div>

                        {/* Items Ordered List */}
                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px' }}>
                            المنتجات المطلوبة • Ordered Items:
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(order.items || []).map((item, idx) => {
                              const itTitle = typeof item.name === 'object' ? item.name.ar || item.name.en : item.name;
                              const itSize = item.size || item.selectedSize || 'Free Size';
                              const itQty = item.quantity || 1;
                              const itImg = item.image || item.images?.[0] || '/placeholder-luxury.svg';

                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#F8FAFC',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    gap: '12px'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img
                                      src={itImg}
                                      alt="thumb"
                                      style={{ width: '42px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <div>
                                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
                                        {itTitle}
                                      </div>
                                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                                        <span style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                                          القياس: {itSize}
                                        </span>
                                        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                          الكمية: <strong>{itQty}</strong>
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ direction: 'ltr', fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
                                    {formatPrice((item.price || 0) * itQty)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 4b: 👥 CUSTOMERS MANAGEMENT (STAFF SECTION)                   */}
        {/* =================================================================== */}
        {currentView === 'customers' && (
          <div>
            {/* Header with Breadcrumb and Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <button
                  onClick={() => setCurrentView('home')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                    marginBottom: '6px'
                  }}
                >
                  <ArrowRight size={16} />
                  <span>العودة للرئيسية</span>
                </button>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  👥 إدارة واعتماد الزبائن • Customers Directory
                </h1>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '4px 0 0 0' }}>
                  مراجعة الزبائن، قبولهم واعتمادهم للطلب، استعراض مواقع GPS الدقيقة، أو حذفهم بشكل دائم.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => {
                    const phone = prompt('أدخل رقم هاتف الزبون الجديد (+964):');
                    if (!phone || !phone.trim()) return;
                    const name = prompt('أدخل اسم الزبون:');
                    if (!name || !name.trim()) return;
                    const city = prompt('أدخل المدينة / المحافظة:') || 'العراق';
                    addCustomer({
                      fullName: name.trim(),
                      phone: phone.trim(),
                      city: city.trim(),
                      governorateName: city.trim(),
                      status: 'accepted',
                      notes: 'تمت الإضافة يدوياً بواسطة الإدارة'
                    });
                    showToast('تمت إضافة واعتماد الزبون بنجاح', 'success');
                  }}
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} color="#C5A880" />
                  <span>إضافة زبون جديد</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}
            >
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>إجمالي الزبائن</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{stats.customersCount} زبون</div>
                </div>
                <Users size={24} color="#0F172A" />
              </div>

              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>زبائن معتمدون • Accepted</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>{stats.acceptedCustomersCount} معتمد</div>
                </div>
                <CheckCircle2 size={24} color="#16A34A" />
              </div>

              <div style={{ backgroundColor: stats.pendingCustomersCount > 0 ? '#FEF3C7' : '#FFFFFF', border: stats.pendingCustomersCount > 0 ? '1px solid #FCD34D' : '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: stats.pendingCustomersCount > 0 ? '#92400E' : '#64748B', fontWeight: 600 }}>بانتظار الاعتماد • Pending</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stats.pendingCustomersCount > 0 ? '#B45309' : '#0F172A', marginTop: '2px' }}>{stats.pendingCustomersCount} بانتظار التأكيد</div>
                </div>
                <AlertTriangle size={24} color={stats.pendingCustomersCount > 0 ? '#D97706' : '#94A3B8'} />
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>إجمالي مبيعات الزبائن</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#C5A880', direction: 'ltr', marginTop: '2px' }}>
                    {formatPrice((customers || []).reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
                  </div>
                </div>
                <Package size={24} color="#C5A880" />
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="بحث بالاسم، رقم الهاتف (+964)، المدينة، أو المحافظة..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 36px 9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'accepted', label: 'معتمدون فقط ✓' },
                  { id: 'pending', label: 'بانتظار الاعتماد ⏳' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setCustomerFilter(filter.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: customerFilter === filter.id ? '2px solid #0F172A' : '1px solid #E2E8F0',
                      backgroundColor: customerFilter === filter.id ? '#0F172A' : '#F8FAFC',
                      color: customerFilter === filter.id ? '#FFFFFF' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customers Cards Grid */}
            {filteredCustomers.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: '#64748B'
                }}
              >
                <UserX size={48} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#0F172A' }}>
                  لا يوجد زبائن مطابقين حالياً
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  جرب تغيير نص البحث أو تصفية الحالة
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '20px'
                }}
              >
                {filteredCustomers.map(cust => {
                  const isAccepted = cust.status === 'accepted';
                  const cleanPhone = (cust.phone || '').replace(/[^0-9]/g, '');
                  const mapsUrl = cust.mapsUrl || cust.location?.mapsUrl;

                  return (
                    <div
                      key={cust.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: isAccepted ? '1px solid #E2E8F0' : '2px solid #FCD34D',
                        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Customer Card Top */}
                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#0F172A',
                                color: '#C5A880',
                                border: '2px solid #C5A880',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1rem',
                                flexShrink: 0
                              }}
                            >
                              {(cust.fullName || cust.name || 'SF').slice(0, 2)}
                            </div>
                            <div>
                              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                                {cust.fullName || cust.name || 'عميل سناريا'}
                              </h3>
                              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                كود العميل: {cust.id}
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          {isAccepted ? (
                            <span
                              style={{
                                backgroundColor: '#DCFCE7',
                                color: '#166534',
                                border: '1px solid #BBF7D0',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <CheckCircle2 size={13} />
                              <span>معتمد وموثوق</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                backgroundColor: '#FEF3C7',
                                color: '#B45309',
                                border: '1px solid #FCD34D',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <AlertTriangle size={13} />
                              <span>بانتظار الاعتماد</span>
                            </span>
                          )}
                        </div>

                        {/* Contact details */}
                        <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <a
                              href={`tel:${cust.phone}`}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}
                            >
                              <Phone size={14} color="#C5A880" />
                              <span style={{ direction: 'ltr' }}>{cust.phone}</span>
                            </a>

                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: '#DCFCE7',
                                  color: '#15803D',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  textDecoration: 'none'
                                }}
                              >
                                <MessageCircle size={14} />
                                <span>محادثة واتساب</span>
                              </a>
                            )}
                          </div>

                          {cust.altPhone && (
                            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '6px', direction: 'ltr', textAlign: 'right' }}>
                              هاتف إضافي: {cust.altPhone}
                            </div>
                          )}
                        </div>

                        {/* Location and Address */}
                        <div style={{ marginBottom: '14px' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                            المحافظة والعنوان
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                            {cust.governorateName || cust.governorate || 'العراق'} {cust.city ? `— ${cust.city}` : ''}
                          </div>
                          {cust.address && (
                            <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
                              {cust.address}
                            </div>
                          )}

                          {mapsUrl && (
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                color: '#2563EB',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                marginTop: '6px'
                              }}
                            >
                              <MapPin size={14} />
                              <span>📍 موقع الزبون الدقيق على خرائط جوجل (GPS)</span>
                            </a>
                          )}
                        </div>

                        {/* Order History Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#FAF8F5', border: '1px solid #EFEAE3', borderRadius: '8px', padding: '10px 12px' }}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#8C7A6B', fontWeight: 600 }}>إجمالي الطلبات</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                              {cust.ordersCount || 1} طلب
                            </div>
                          </div>
                          <div style={{ textAlign: 'left', direction: 'ltr' }}>
                            <div style={{ fontSize: '0.72rem', color: '#8C7A6B', fontWeight: 600 }}>إجمالي الشراء</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#C5A880', marginTop: '2px' }}>
                              {formatPrice(cust.totalSpent || 0)}
                            </div>
                          </div>
                        </div>

                        {cust.notes && (
                          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '10px', fontStyle: 'italic' }}>
                            ملاحظة: {cust.notes}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderTop: '1px solid #E2E8F0',
                          padding: '12px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <div>
                          {isAccepted ? (
                            <button
                              onClick={() => {
                                updateCustomer(cust.id, { status: 'pending' });
                                showToast('تم تحويل الزبون إلى بانتظار الاعتماد', 'info');
                              }}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#F1F5F9',
                                color: '#475569',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="إلغاء الاعتماد وتحويله للمراجعة"
                            >
                              إلغاء الاعتماد
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                acceptCustomer(cust.id);
                                showToast(`تم قبول واعتماد الزبون ${cust.fullName || cust.name} بنجاح`, 'success');
                              }}
                              style={{
                                padding: '7px 14px',
                                backgroundColor: '#16A34A',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <UserCheck size={14} />
                              <span>✓ قبول واعتماد الزبون</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => setCustomerToDelete(cust)}
                          style={{
                            padding: '7px 12px',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="حذف هذا الزبون نهائياً من المتجر"
                        >
                          <Trash2 size={13} />
                          <span>حذف نهائي</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 4: 👗 PRODUCT MANAGEMENT (STAFF SECTION)                       */}
        {/* =================================================================== */}
        {currentView === 'products' && (
          <div>
            {/* Header with Add Product CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <button
                  onClick={() => setCurrentView('home')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0,
                    marginBottom: '4px'
                  }}
                >
                  ← العودة للرئيسية
                </button>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
                  إدارة المنتجات • Product Management ({filteredProducts.length})
                </h1>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setCurrentView('add_product');
                }}
                style={{
                  backgroundColor: '#C5A880',
                  color: '#0A0A0A',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                <span>＋ إضافة منتج جديد</span>
              </button>
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              {/* Category Filter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '4px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setProductCategoryFilter('all')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: productCategoryFilter === 'all' ? '#0F172A' : '#FFFFFF',
                    color: productCategoryFilter === 'all' ? '#C5A880' : '#475569',
                    border: productCategoryFilter === 'all' ? '1px solid #0F172A' : '1px solid #CBD5E1',
                    fontSize: '0.78rem',
                    fontWeight: productCategoryFilter === 'all' ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  جميع الأقسام
                </button>
                {WOMEN_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setProductCategoryFilter(cat.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: productCategoryFilter === cat.id ? '#0F172A' : '#FFFFFF',
                      color: productCategoryFilter === cat.id ? '#C5A880' : '#475569',
                      border: productCategoryFilter === cat.id ? '1px solid #0F172A' : '1px solid #CBD5E1',
                      fontSize: '0.78rem',
                      fontWeight: productCategoryFilter === cat.id ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.labelAr}</span>
                  </button>
                ))}
              </div>

              {/* Stock Filter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  overflowX: 'auto',
                  paddingBottom: '4px'
                }}
              >
                {[
                  { id: 'all', label: 'كافة الحالات' },
                  { id: 'in_stock', label: 'متوفر بالمخزن' },
                  { id: 'low_stock', label: '⚠ مخزون منخفض (<=5)' },
                  { id: 'out_of_stock', label: 'نفذت الكمية (Out of stock)' },
                  { id: 'hidden', label: 'مخفي مؤقتاً' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setProductStockFilter(f.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      backgroundColor: productStockFilter === f.id ? '#C5A880' : '#FFFFFF',
                      color: productStockFilter === f.id ? '#0F172A' : '#475569',
                      border: productStockFilter === f.id ? '1px solid #C5A880' : '1px solid #CBD5E1',
                      fontSize: '0.75rem',
                      fontWeight: productStockFilter === f.id ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '20px'
              }}
            >
              {filteredProducts.map(prod => {
                const pTitle = typeof prod.name === 'object' ? prod.name.ar || prod.name.en : prod.name;
                const pImg = prod.images?.[0] || '/placeholder-luxury.svg';
                const isOutOfStock = (prod.stock || 0) <= 0;

                return (
                  <div
                    key={prod.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: isOutOfStock ? '1px solid #F87171' : '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: prod.isHidden ? 0.65 : 1
                    }}
                  >
                    <div>
                      <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#000', overflow: 'hidden' }}>
                        {prod.videoUrl ? (
                          <video
                            src={prod.videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img src={pImg} alt={pTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}

                        {/* Top Badges */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                          <span style={{ backgroundColor: '#0F172A', color: '#C5A880', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                            {WOMEN_CATEGORIES.find(c => c.id === prod.category)?.labelAr || prod.category}
                          </span>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            {prod.videoUrl && (
                              <span style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                                ▶ فيديو
                              </span>
                            )}
                            {prod.isHidden && (
                              <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#F87171', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                                مخفي
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Out of stock banner */}
                        {isOutOfStock && (
                          <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', backgroundColor: '#DC2626', color: '#FFF', padding: '5px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, textAlign: 'center' }}>
                            OUT OF STOCK • نفذت الكمية
                          </div>
                        )}
                      </div>

                      {/* Product Content */}
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                            {pTitle}
                          </h3>
                        </div>

                        {/* Price & SKU */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', direction: 'ltr' }}>
                            {formatPrice(prod.price)}
                          </span>
                          {prod.modelCode && (
                            <span style={{ backgroundColor: '#C5A880', color: '#0F172A', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                              كود {prod.modelCode}
                            </span>
                          )}
                        </div>

                        {/* Offered Colors */}
                        {Array.isArray(prod.colors) && prod.colors.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>الألوان:</span>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                              {prod.colors.map((c, cIdx) => (
                                <span
                                  key={cIdx}
                                  title={typeof c.name === 'object' ? c.name.ar : c.name}
                                  style={{
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    backgroundColor: c.hex || '#000',
                                    border: '1.5px solid #CBD5E1',
                                    display: 'inline-block',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                  }}
                                />
                              ))}
                              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                                ({prod.colors.length})
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Stock per Size Grid (Interactive +/-) */}
                        <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                            الكمية حسب القياس (اضغط + أو - للتعديل السريع):
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {(() => {
                              const productSizesList = (Array.isArray(prod.sizes) && prod.sizes.length > 0)
                                ? prod.sizes
                                : (prod.sizeStock && Object.keys(prod.sizeStock).length > 0)
                                ? Object.keys(prod.sizeStock)
                                : (Array.isArray(prod.availableSizes) && prod.availableSizes.length > 0)
                                ? prod.availableSizes
                                : STANDARD_SIZES;

                              return productSizesList.map(s => {
                                const qty = prod.sizeStock ? prod.sizeStock[s] : undefined;
                                if (qty === undefined && (!prod.availableSizes || !prod.availableSizes.includes(s))) return null;
                                const cur = qty !== undefined ? qty : 0;
                                return (
                                  <div
                                    key={s}
                                    style={{
                                      backgroundColor: '#FFFFFF',
                                      border: cur <= 0 ? '1px solid #FCA5A5' : cur <= 5 ? '1px solid #FCD34D' : '1px solid #CBD5E1',
                                      borderRadius: '4px',
                                      padding: '4px 6px',
                                      fontSize: '0.72rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <strong>{s}:</strong>
                                    <span style={{ color: cur <= 0 ? '#DC2626' : cur <= 5 ? '#D97706' : '#15803D', fontWeight: 800 }}>
                                      {cur}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateSizeStock(prod.id, s, cur + 5)}
                                      title="إضافة 5 قطع"
                                      style={{ background: 'none', border: 'none', color: '#C5A880', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                                    >
                                      +5
                                    </button>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                        {/* Live Destination Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px', fontSize: '0.72rem' }}>
                          <span style={{ color: '#64748B', fontWeight: 700 }}>يظهر في:</span>
                          <span style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>🏠 الرئيسية</span>
                          <span style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>🛍️ المتجر</span>
                          {prod.videoUrl && (
                            <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>🎬 ريلز الفيديوهات</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div
                      style={{
                        padding: '12px 16px',
                        borderTop: '1px solid #F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FAFAFA',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => startEditProduct(prod)}
                          title="تعديل المنتج"
                          style={{
                            backgroundColor: '#0F172A',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit size={14} />
                          <span>تعديل</span>
                        </button>

                        {onSelectProduct && (
                          <button
                            onClick={() => onSelectProduct(prod)}
                            title="معاينة الموديل كما يظهر للزبون في الموقع"
                            style={{
                              backgroundColor: '#C5A880',
                              color: '#0A0A0A',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <ExternalLink size={13} />
                            <span>معاينة بالموقع</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            toggleHideProduct(prod.id);
                            showToast(prod.isHidden ? 'تم إظهار المنتج' : 'تم إخفاء المنتج عن الزبائن', 'info');
                          }}
                          title={prod.isHidden ? 'إظهار للزبائن' : 'إخفاء مؤقت'}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            color: prod.isHidden ? '#15803D' : '#64748B',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {prod.isHidden ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      </div>

                      <button
                        onClick={() => setProductToDelete(prod)}
                        title="حذف المنتج"
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 5: ⚙ SETTINGS (STORE & BUSINESS CONFIGURATION)                 */}
        {/* =================================================================== */}
        {currentView === 'settings' && (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setCurrentView('home')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0,
                  marginBottom: '4px'
                }}
              >
                ← العودة للرئيسية
              </button>
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
                ⚙ إعدادات المتجر • Store Settings
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#64748B' }}>
                إدارة هوية متجر سناريا فاشن، أرقام الواتساب وخدمة العملاء، سياسة التوصيل، وبوابات الدفع.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Store Identity */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                  هوية العلامة التجارية • Brand Identity
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      اسم المتجر الرسمي • Store Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value="SENERIA FASHION (سناريا فاشن)"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      العملة المعتمدة • Currency
                    </label>
                    <input
                      type="text"
                      disabled
                      value="دينار عراقي (IQD)"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Concierge & Contact Phone */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                  قنوات التواصل المباشر وخدمة الزبائن • Concierge & WhatsApp
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      رقم الواتساب المعتمد للطلبات • WhatsApp Support
                    </label>
                    <input
                      type="text"
                      disabled
                      value="+964 773 888 8180"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontSize: '0.88rem', direction: 'ltr', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      الفروع الفعلية • Boutique Locations
                    </label>
                    <input
                      type="text"
                      disabled
                      value="فرع بغداد (المنصور) + فرع أربيل (إمباير وورلد)"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Policy */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                  سياسة التوصيل لكافة المحافظات • Iraq Express Delivery
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      حد التوصيل المجاني • Free Delivery Above
                    </label>
                    <input
                      type="text"
                      disabled
                      value="150,000 د.ع"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      أجور التوصيل القياسية • Standard Delivery Fee
                    </label>
                    <input
                      type="text"
                      disabled
                      value="5,000 د.ع لكافة المحافظات الـ 18"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Staff Authentication & Data Safety */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                  جلسة طاقم الإدارة وأمان البيانات • Admin Session & Safety
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#166534', fontSize: '0.88rem', fontWeight: 600 }}>
                    <ShieldCheck size={20} color="#16A34A" />
                    <span>جلسة الإدارة نشطة وآمنة (جميع المنتجات والطلبات والزبائن محفوظة ومحمية تلقائياً ✓)</span>
                  </div>

                  <button
                    onClick={() => {
                      logoutAdmin();
                      showToast('تم تسجيل الخروج من لوحة الإدارة بنجاح', 'info');
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={16} />
                    <span>تسجيل الخروج من لوحة التحكم</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 7: VIDEO & EDITORIAL CAMPAIGN PLACEMENTS MANAGER               */}
        {/* =================================================================== */}
        {currentView === 'video_placements' && (
          <VideoPlacementsManager
            onBackToStore={onBackToStore}
            onNavigate={onNavigate}
          />
        )}
      </main>

      {/* =================================================================== */}
      {/* 5. PRINT MODALS (SINGLE & BATCH)                                    */}
      {/* =================================================================== */}
      {printSingleOrder && (
        <OrderPrintInvoice
          order={printSingleOrder}
          onClose={() => setPrintSingleOrder(null)}
        />
      )}

      {isPrintAllOpen && (
        <OrderPrintInvoice
          orders={filteredOrders}
          onClose={() => setIsPrintAllOpen(false)}
        />
      )}

      {/* =================================================================== */}
      {/* 6. DELETE PRODUCT CONFIRMATION MODAL                                */}
      {/* =================================================================== */}
      {productToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#0F172A' }}>
              تأكيد حذف المنتج
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.88rem', color: '#64748B' }}>
              هل أنت متأكد من حذف المنتج "{typeof productToDelete.name === 'object' ? productToDelete.name.ar : productToDelete.name}"؟
              <br />
              <span style={{ color: '#DC2626', fontSize: '0.82rem', fontWeight: 700 }}>
                سيتم مسحه بشكل دائم ونهائي ولن يعود عند إعادة تحميل الصفحة أو إعادة التعيين.
              </span>
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setProductToDelete(null)}
                style={{ padding: '9px 18px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  showToast('تم حذف المنتج نهائياً من المتجر', 'info');
                  setProductToDelete(null);
                }}
                style={{ padding: '9px 18px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                تأكيد الحذف النهائي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Customer Deletion Confirmation Modal */}
      {customerToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setCustomerToDelete(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <UserX size={28} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#0F172A', fontWeight: 800 }}>
              تأكيد حذف الزبون نهائياً
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
              هل أنت متأكد من حذف الزبون <strong>"{customerToDelete.fullName || customerToDelete.name || customerToDelete.phone}"</strong> نهائياً؟
              <br />
              <span style={{ color: '#DC2626', fontSize: '0.82rem', fontWeight: 700 }}>
                سيتم مسح بيانات الزبون وسجله بشكل دائم ولن يعود عند إعادة تحميل الصفحة.
              </span>
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setCustomerToDelete(null)}
                style={{ padding: '10px 20px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  deleteCustomer(customerToDelete.id || customerToDelete.phone);
                  showToast('تم حذف الزبون نهائياً بنجاح', 'info');
                  setCustomerToDelete(null);
                }}
                style={{ padding: '10px 20px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer' }}
              >
                تأكيد الحذف النهائي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Order Deletion Confirmation Modal */}
      {orderToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setOrderToDelete(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Trash2 size={26} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#0F172A', fontWeight: 800 }}>
              تأكيد حذف الطلب #{orderToDelete.id}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
              هل أنت متأكد من حذف هذا الطلب نهائياً من السجلات؟ سيتم مسح بيانات الطلب بشكل دائم.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setOrderToDelete(null)}
                style={{ padding: '10px 20px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  deleteOrder(orderToDelete.id);
                  showToast(`تم حذف الطلب #${orderToDelete.id} نهائياً`, 'info');
                  setOrderToDelete(null);
                }}
                style={{ padding: '10px 20px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer' }}
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPage = ({ onBackToStore, onNavigate, onSelectProduct }) => {
  const { isAdminAuthenticated } = useStore();

  if (!isAdminAuthenticated) {
    return <AdminLogin onBackToStore={onBackToStore} />;
  }

  return <AdminDashboard onBackToStore={onBackToStore} onNavigate={onNavigate} onSelectProduct={onSelectProduct} />;
};

export default AdminPage;
