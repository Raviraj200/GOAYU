import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Archive, DollarSign, Star, CheckSquare, Settings, LayoutGrid, Sparkles, Tag, HelpCircle, Loader2, Upload, Search, Mail, BookOpen, TrendingUp, Download, Globe, MessageSquare, Play, Pause, Database, AlertTriangle } from 'lucide-react';
import { Product, Category, Blog, Order, formatINR, Reel } from '../types';

interface AdminDashboardViewProps {
  products: Product[];
  categories: Category[];
  blogs: Blog[];
  onRefreshData: () => void;
}

export default function AdminDashboardView({ products, categories, blogs, onRefreshData }: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'blogs' | 'queries' | 'banner' | 'metrics' | 'subscribers' | 'coupons' | 'reels' | 'testimonials'>('products');
  
  // Testimonials management
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testName, setTestName] = useState('');
  const [testLocation, setTestLocation] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  
  // Newsletter subscribers state & selection
  const [subscribersList, setSubscribersList] = useState<string[]>([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  // Dynamic Coupon form and list states
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [cpCode, setCpCode] = useState('');
  const [cpType, setCpType] = useState<'percentage' | 'fixed'>('percentage');
  const [cpValue, setCpValue] = useState<number>(10);
  const [cpMin, setCpMin] = useState<number>(0);
  const [cpProductId, setCpProductId] = useState<string>('');
  const [cpActive, setCpActive] = useState<boolean>(true);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  // Dynamic Reels form and list states
  const [reelsList, setReelsList] = useState<Reel[]>([]);
  const [loadingReels, setLoadingReels] = useState(false);
  const [showReelForm, setShowReelForm] = useState(false);
  const [reelTitle, setReelTitle] = useState('');
  const [reelUrl, setReelUrl] = useState('');
  const [reelTagline, setReelTagline] = useState('');
  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [reelProductId, setReelProductId] = useState('');

  // Form states for adding or editing
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New/Edit product fields
  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodCategory, setProdCategory] = useState('skincare');
  const [prodTagline, setProdTagline] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState(25);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(29);
  const [prodStock, setProdStock] = useState(50);
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodBenefits, setProdBenefits] = useState('Nourishes skin layers, Balances Vata & Pitta humors');
  const [prodIngredients, setProdIngredients] = useState('Kashmiri Saffron, Sandalwood essence, Almond oil');
  const [prodUsage, setProdUsage] = useState('Apply 3 drops on clean skin at sunset.');
  const [prodUsagePoint1, setProdUsagePoint1] = useState('');
  const [prodUsagePoint2, setProdUsagePoint2] = useState('');
  const [prodUsagePoint3, setProdUsagePoint3] = useState('');
  const [prodUsagePoint4, setProdUsagePoint4] = useState('');
  const [prodUsagePoint5, setProdUsagePoint5] = useState('');

  // Categories form states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400');

  // Blogs form states
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600');
  const [blogAuthor, setBlogAuthor] = useState('Acharya GoAyu');

  // Hero Banner form states
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerBgImage, setBannerBgImage] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerCardImage, setBannerCardImage] = useState('');
  const [bannerCardLabel, setBannerCardLabel] = useState('');
  const [bannerCardName, setBannerCardName] = useState('');
  const [bannerCardCtaText, setBannerCardCtaText] = useState('');
  const [bannerCardLink, setBannerCardLink] = useState('');
  const [bannerLogoUrl, setBannerLogoUrl] = useState('');
  const [bannerShowTraditionalWisdom, setBannerShowTraditionalWisdom] = useState(true);

  // Db Status Diagnostician State
  const [dbStatus, setDbStatus] = useState<{
    isMongoEnabled: boolean;
    isMongoConnected: boolean;
    mongoConnectionError: string | null;
  }>({
    isMongoEnabled: false,
    isMongoConnected: false,
    mongoConnectionError: null
  });


  // Pharmacist Inquiries & Queries
  const [pharmacistQueries, setPharmacistQueries] = useState<any[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(false);

  // Search selectors
  const [orderSearchText, setOrderSearchText] = useState('');
  const [querySearchText, setQuerySearchText] = useState('');

  // Selected Inspect Order modal
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const handleDownloadOrderReports = () => {
    if (orders.length === 0) {
      alert('No orders available to export.');
      return;
    }
    const headers = 'Order Number,Date,Customer Name,Phone,Email,Coupon,Subtotal,Discount,Grand Total,Payment Method,Payment Status,Fulfillment Status,Tracking ID\n';
    const rows = orders.map(o => {
      const cleanName = (o.customerName || '').replace(/,/g, ' ');
      const cleanPhone = (o.customerPhone || '').replace(/,/g, ' ');
      const cleanEmail = (o.customerEmail || '').replace(/,/g, ' ');
      const cleanCoupon = (o.couponCode || '').replace(/,/g, ' ');
      const cleanTracking = (o.trackingId || 'N/A').replace(/,/g, ' ');
      return `"${o.orderNumber}","${o.date || ''}","${cleanName}","${cleanPhone}","${cleanEmail}","${cleanCoupon}",${o.subtotal},${o.discount},${o.total},"${o.paymentMethod || 'COD'}","${o.paymentStatus || 'pending'}","${o.status || 'processing'}","${cleanTracking}"`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GoAyu_Order_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadGSTReport = () => {
    if (orders.length === 0) {
      alert('No orders available to compile GST ledger.');
      return;
    }
    const headers = 'Invoice Number,Date,Purchaser Name,Purchaser Email,Recipient State,Tax Residency GSTIN,Assessable Base Value (INR),SGST Amount (9%),CGST Amount (9%),IGST Amount (18%),Tax Settlement Mode,Invoice Grand Total (INR)\n';
    const rows = orders.map(o => {
      const cleanName = (o.customerName || '').replace(/,/g, ' ');
      const cleanEmail = (o.customerEmail || '').replace(/,/g, ' ');
      const cleanState = (o.state || 'Uttarakhand').replace(/,/g, ' ');
      const cleanGstin = ((o as any).gstin || 'B2C Consolidated').replace(/,/g, ' ');

      const totalINR = Math.round(o.total * 80);
      const subtotalINR = Math.round(o.subtotal * 80);
      const discountINR = Math.round((o.discount || 0) * 80);
      const baseAssessable = Math.max(0, subtotalINR - discountINR);

      const isUttarakhand = cleanState.toLowerCase().includes('uttarakhand');
      const cgst = isUttarakhand ? Math.round(baseAssessable * 0.09) : 0;
      const sgst = isUttarakhand ? Math.round(baseAssessable * 0.09) : 0;
      const igst = !isUttarakhand ? Math.round(baseAssessable * 0.18) : 0;
      const taxMode = isUttarakhand ? 'Intra-State (9% CGST + 9% SGST)' : 'Inter-State (18% IGST)';

      return `"${o.orderNumber}","${o.date ? new Date(o.date).toLocaleDateString() : 'Recent'}","${cleanName}","${cleanEmail}","${cleanState}","${cleanGstin}",${baseAssessable},${sgst},${cgst},${igst},"${taxMode}",${totalINR}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GoAyu_GST_Ledger_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInvoice = (invoiceOrder: Order) => {
    const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GoAyu Invoice - ${invoiceOrder.orderNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1c1917; margin: 0; padding: 40px; background-color: #fafaf9; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: white; border: 1px solid #e7e5e4; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #064e3b; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { color: #064e3b; font-size: 24px; font-weight: bold; font-family: Georgia, serif; }
    .title { color: #b45309; font-size: 28px; font-weight: 900; text-transform: uppercase; margin: 0; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .section-title { font-size: 11px; text-transform: uppercase; color: #a8a29e; font-family: monospace; letter-spacing: 0.1em; margin-bottom: 8px; font-weight: bold; }
    .text-block { background: #fdfbf7; border: 1px solid #f5f5f4; border-radius: 8px; padding: 15px; }
    .text-block p { margin: 4px 0; font-size: 13px; color: #44403c; }
    .text-block strong { color: #1c1917; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #064e3b; color: white; text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em; }
    td { padding: 12px; border-bottom: 1px solid #f5f5f4; font-size: 13px; }
    .recap-table { margin-left: auto; width: 320px; margin-top: 20px; }
    .recap-table td { padding: 8px 12px; font-size: 12px; }
    .total-row { font-size: 15px; font-weight: bold; color: #064e3b; border-top: 2px solid #064e3b; }
    .footer { text-align: center; border-top: 1px solid #e7e5e4; padding-top: 20px; margin-top: 40px; font-size: 11px; color: #78716c; font-family: monospace; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">🌿 GoAyu Wellness</div>
        <div style="font-size: 10px; color: #78716c; margin-top: 4px; font-family: monospace; text-transform: uppercase;">Apothecary & Himalayan Botanical Laboratories</div>
      </div>
      <div style="text-align: right;">
        <h1 class="title">INVOICE-RECEIPT</h1>
        <div style="font-size: 12px; font-family: monospace; margin-top: 4px;">Order No: <strong>${invoiceOrder.orderNumber}</strong></div>
        <div style="font-size: 12px; font-family: monospace; color: #78716c;">Date: ${invoiceOrder.date || 'Today'}</div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="section-title">Billed To (Patron)</div>
        <div class="text-block">
          <p><strong>${invoiceOrder.customerName}</strong></p>
          <p>Email: ${invoiceOrder.customerEmail}</p>
          <p>Phone: ${invoiceOrder.customerPhone || 'N/A'}</p>
        </div>
      </div>
      <div>
        <div class="section-title">Detailed Shipping Location</div>
        <div class="text-block">
          <p>${invoiceOrder.shippingAddress}</p>
          <p>${invoiceOrder.city}, ${invoiceOrder.state} - ${invoiceOrder.zipCode}</p>
          <p>Courier Terminals: <strong>BlueDart India Dispatch Cargo</strong></p>
        </div>
      </div>
    </div>

    <div class="section-title">Purchased Items & Blessings</div>
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Formulation / Item Specs</th>
          <th style="text-align: right;">Unit Price Conversion</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Total Net Price</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceOrder.items.map((item: any, idx: number) => `
          <tr>
            <td style="font-family: monospace; color: #78716c;">${idx + 1}</td>
            <td><strong>${item.name}</strong></td>
            <td style="text-align: right; font-family: monospace;">₹${Math.round(item.price * 80).toLocaleString('en-IN')}</td>
            <td style="text-align: center; font-family: monospace;">${item.quantity}</td>
            <td style="text-align: right; font-family: monospace; font-weight: bold;">₹${Math.round(item.price * item.quantity * 80).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <table class="recap-table">
      <tr>
        <td style="color: #78716c;">Settle Base Subtotal:</td>
        <td style="text-align: right; font-family: monospace;">₹${Math.round(invoiceOrder.subtotal * 80).toLocaleString('en-IN')}</td>
      </tr>
      ${invoiceOrder.discount ? `
      <tr style="color: #064e3b; font-weight: bold;">
        <td>Redeemed Coupon Reduction:</td>
        <td style="text-align: right; font-family: monospace;">-₹${Math.round(invoiceOrder.discount * 80).toLocaleString('en-IN')}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="color: #78716c;">CGST (9.0% Included):</td>
        <td style="text-align: right; font-family: monospace; color: #78716c;">₹${Math.round(invoiceOrder.total * 0.09 * 80).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="color: #78716c;">SGST (9.0% Included):</td>
        <td style="text-align: right; font-family: monospace; color: #78716c;">₹${Math.round(invoiceOrder.total * 0.09 * 80).toLocaleString('en-IN')}</td>
      </tr>
      <tr class="total-row">
        <td>Grand Total Amount Due:</td>
        <td style="text-align: right; font-family: monospace;">₹${Math.round(invoiceOrder.total * 80).toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <div style="margin-top: 30px; font-size: 11px; color: #44403c; line-height: 1.6; border-left: 2px solid #b45309; padding-left: 15px; background: #faf9f6; padding: 12px; border-radius: 4px;">
      <strong>Traditional Organic Quality Seal:</strong> Certified that this formulation is crafted under supervisions of certified Vaidyas and Vaidyashalas in India, using pure, wild-harvested Himalayan herbs and organic oils. 100% heavy metal toxin free.
    </div>

    <div class="footer">
      Thank you for your valued patronship! Reclaiming absolute cellular vitality since generations.<br>
      © GoAyu Wellness, Haridwar Bypass Highway, Haridwar Rural-249408, Uttarakhand.
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GoAyu-Invoice-${invoiceOrder.orderNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fetch orders, queries, subscribers, coupons and banner on screen load
  useEffect(() => {
    fetchOrdersList();
    fetchQueriesList();
    fetchBannerConfigs();
    fetchSubscribersList();
    fetchCouponsList();
    fetchReelsList();
    fetchTestimonialsList();
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const response = await fetch('/api/db-status');
      if (response.ok) {
        const data = await response.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTestimonialsList = async () => {
    setLoadingTestimonials(true);
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonialsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const fetchReelsList = async () => {
    setLoadingReels(true);
    try {
      const response = await fetch('/api/reels');
      if (response.ok) {
        const data = await response.json();
        setReelsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReels(false);
    }
  };

  const fetchCouponsList = async () => {
    setLoadingCoupons(true);
    try {
      const response = await fetch('/api/coupons');
      if (response.ok) {
        const data = await response.json();
        setCouponsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const fetchSubscribersList = async () => {
    setLoadingSubscribers(true);
    try {
      const response = await fetch('/api/subscribers');
      if (response.ok) {
        const data = await response.json();
        setSubscribersList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const fetchQueriesList = async () => {
    setLoadingQueries(true);
    try {
      const response = await fetch('/api/queries');
      if (response.ok) {
        const data = await response.json();
        setPharmacistQueries(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQueries(false);
    }
  };

  const fetchBannerConfigs = async () => {
    try {
      const response = await fetch('/api/hero-banner');
      if (response.ok) {
        const data = await response.json();
        if (data && !data.error) {
          setBannerTitle(data.title || '');
          setBannerSubtitle(data.subtitle || '');
          setBannerBgImage(data.bgImage || '');
          setBannerCtaText(data.ctaText || '');
          setBannerLink(data.link || '');
          setBannerCardImage(data.cardImage || '');
          setBannerCardLabel(data.cardLabel || '');
          setBannerCardName(data.cardName || '');
          setBannerCardCtaText(data.cardCtaText || '');
          setBannerCardLink(data.cardLink || '');
          setBannerLogoUrl(data.logoUrl || '');
          setBannerShowTraditionalWisdom(data.showTraditionalWisdom !== false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrdersList = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setShowAddForm(true);

    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdTagline(prod.tagline);
    setProdDescription(prod.description);
    setProdPrice(prod.price);
    setProdOriginalPrice(prod.originalPrice);
    setProdStock(prod.stock);
    setProdImage(prod.image);
    setProdImages((prod as any).images || [prod.image].filter(Boolean));
    setProdBenefits(prod.benefits.join(', '));
    setProdIngredients(prod.ingredients.join(', '));
    setProdUsage(prod.usage);
    setProdUsagePoint1(prod.usagePoints?.[0] || '');
    setProdUsagePoint2(prod.usagePoints?.[1] || '');
    setProdUsagePoint3(prod.usagePoints?.[2] || '');
    setProdUsagePoint4(prod.usagePoints?.[3] || '');
    setProdUsagePoint5(prod.usagePoints?.[4] || '');
  };

  const handleResetForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);

    setProdName('');
    setProdCategory('skincare');
    setProdTagline('');
    setProdDescription('');
    setProdPrice(25);
    setProdOriginalPrice(29);
    setProdStock(50);
    setProdImage('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400');
    setProdImages([]);
    setProdBenefits('Balances Doshas, Nourishes cells');
    setProdIngredients('Organic Herbs');
    setProdUsage('Consume daily as required.');
    setProdUsagePoint1('');
    setProdUsagePoint2('');
    setProdUsagePoint3('');
    setProdUsagePoint4('');
    setProdUsagePoint5('');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess('');
    setFormError('');

    if (!prodName.trim()) {
      setFormError('Product Name is required.');
      return;
    }

    const primaryImage = prodImages[0] || prodImage || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400';

    const payload = {
      name: prodName,
      category: prodCategory,
      tagline: prodTagline,
      description: prodDescription,
      price: Number(prodPrice),
      originalPrice: Number(prodOriginalPrice),
      stock: Number(prodStock),
      image: primaryImage,
      images: prodImages.length > 0 ? prodImages : [primaryImage],
      benefits: prodBenefits.split(',').map(b => b.trim()).filter(Boolean),
      ingredients: prodIngredients.split(',').map(i => i.trim()).filter(Boolean),
      usage: prodUsage,
      usagePoints: [
        prodUsagePoint1.trim(),
        prodUsagePoint2.trim(),
        prodUsagePoint3.trim(),
        prodUsagePoint4.trim(),
        prodUsagePoint5.trim()
      ].filter(Boolean)
    };

    try {
      let response;
      if (editingProduct) {
        // Edit item PUT request
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create item POST request
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setFormSuccess(editingProduct ? 'Product synchronized successfully!' : 'New formula botanical successfully registered!');
        onRefreshData();
        setTimeout(() => {
          handleResetForm();
        }, 1200);
      } else {
        setFormError('Settle error during database write.');
      }
    } catch (err) {
      setFormError('Endpoint connection lost during submit.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are your sure you want to delete this Ayurvedic formula?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!catName || !catSlug) {
      setFormError('Category Name and Slug are required.');
      return;
    }

    const payload = {
      name: catName,
      slug: catSlug,
      description: catDesc,
      image: catImage
    };

    try {
      let r;
      if (editingCategory) {
        r = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        r = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (r.ok) {
        setFormSuccess(editingCategory ? 'Category lineage synchronized!' : 'New Category lineage created!');
        onRefreshData();
        setTimeout(() => {
          handleResetCategoryForm();
          setFormSuccess('');
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditCategoryClick = (cat: Category) => {
    setEditingCategory(cat);
    setShowCatForm(true);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || '');
    setCatImage(cat.image);
  };

  const handleResetCategoryForm = () => {
    setEditingCategory(null);
    setShowCatForm(false);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatImage('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to retire this category lineage?')) return;
    try {
      const r = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (r.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!blogTitle || !blogSlug) {
      setFormError('Blog Title and Slug are required.');
      return;
    }

    const payload = {
      title: blogTitle,
      slug: blogSlug,
      excerpt: blogExcerpt,
      content: blogContent,
      image: blogImage,
      author: blogAuthor
    };

    try {
      let r;
      if (editingBlog) {
        r = await fetch(`/api/blogs/${editingBlog.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        r = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (r.ok) {
        setFormSuccess(editingBlog ? 'Editorial research synchronized!' : 'New Editorial research posted!');
        onRefreshData();
        setTimeout(() => {
          handleResetBlogForm();
          setFormSuccess('');
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditBlogClick = (blog: Blog) => {
    setEditingBlog(blog);
    setShowBlogForm(true);
    setBlogTitle(blog.title);
    setBlogSlug(blog.slug);
    setBlogExcerpt(blog.excerpt);
    setBlogContent(blog.content);
    setBlogImage(blog.image);
    setBlogAuthor(blog.author || 'Acharya GoAyu');
  };

  const handleResetBlogForm = () => {
    setEditingBlog(null);
    setShowBlogForm(false);
    setBlogTitle('');
    setBlogSlug('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogImage('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600');
    setBlogAuthor('Acharya GoAyu');
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this editorial blog?')) return;
    try {
      const r = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (r.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const payload = {
      title: bannerTitle,
      subtitle: bannerSubtitle,
      bgImage: bannerBgImage,
      ctaText: bannerCtaText,
      link: bannerLink,
      cardImage: bannerCardImage,
      cardLabel: bannerCardLabel,
      cardName: bannerCardName,
      cardCtaText: bannerCardCtaText,
      cardLink: bannerCardLink,
      logoUrl: bannerLogoUrl,
      showTraditionalWisdom: bannerShowTraditionalWisdom
    };

    try {
      const response = await fetch('/api/hero-banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setFormSuccess('Home page promotional banner is now updated!');
        onRefreshData();
        setTimeout(() => {
          setFormSuccess('');
        }, 3000);
      } else {
        setFormError('Failed to synchronize banner settings.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Lost connection to API endpoints.');
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!cpCode.trim()) {
      setFormError('Coupon code is required.');
      return;
    }

    const payload = {
      code: cpCode.trim().toUpperCase(),
      discountType: cpType,
      discountValue: Number(cpValue),
      minPurchase: Number(cpMin),
      productId: cpProductId || null,
      active: cpActive
    };

    try {
      const url = editingCouponId ? `/api/coupons/${editingCouponId}` : '/api/coupons';
      const method = editingCouponId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFormSuccess(editingCouponId ? 'Coupon updated successfully!' : 'Coupon created successfully!');
        setCpCode('');
        setCpValue(10);
        setCpMin(0);
        setCpProductId('');
        setCpActive(true);
        setEditingCouponId(null);
        setShowCouponForm(false);
        fetchCouponsList();
        setTimeout(() => setFormSuccess(''), 3000);
      } else {
        const errData = await response.json();
        setFormError(errData.error || 'Failed to save coupon code.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Lost connection to API.');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this discount coupon?')) return;
    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchCouponsList();
      } else {
        alert('Failed to delete coupon.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!testName.trim() || !testQuote.trim()) {
      setFormError('Name and Quotation quote are required elements.');
      return;
    }

    const payload = {
      name: testName.trim(),
      location: testLocation.trim() || 'Valued Patron',
      quote: testQuote.trim()
    };

    try {
      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial.id}` : '/api/testimonials';
      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFormSuccess(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial created successfully!');
        setTestName('');
        setTestLocation('');
        setTestQuote('');
        setEditingTestimonial(null);
        setShowTestimonialForm(false);
        fetchTestimonialsList();
        setTimeout(() => setFormSuccess(''), 3000);
      } else {
        setFormError('Failed to save testimonial.');
      }
    } catch (err) {
      console.error(err);
      setFormError('API endpoint connectivity loss.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTestimonialsList();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTestimonialClick = (t: any) => {
    setEditingTestimonial(t);
    setTestName(t.name || '');
    setTestLocation(t.location || '');
    setTestQuote(t.quote || '');
    setShowTestimonialForm(true);
  };

  const handleEditCouponClick = (coupon: any) => {
    setEditingCouponId(coupon.id);
    setCpCode(coupon.code);
    setCpType(coupon.discountType);
    setCpValue(coupon.discountValue);
    setCpMin(coupon.minPurchase || 0);
    setCpProductId(coupon.productId || '');
    setCpActive(coupon.active);
    setShowCouponForm(true);
  };

  const handleDownloadSubscribers = (emailsToDownload: string[]) => {
    if (emailsToDownload.length === 0) {
      alert('Please select at least one email address to download.');
      return;
    }
    const textContent = emailsToDownload.join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GoAyu_Subscribers_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteQuery = async (id: string) => {
    if (!window.confirm('Are you sure you want to retire this inquiries record?')) return;
    try {
      const response = await fetch(`/api/queries/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchQueriesList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics calculators
  const statsSubtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscounts = orders.reduce((sum, o) => sum + o.discount, 0);
  const statsTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= 10);

  const filteredAdminProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.tagline && p.tagline.toLowerCase().includes(productSearch.toLowerCase()))
  );

  return (
    <div id="goayu-admin-root" className="bg-stone-50 min-h-screen py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SIDEBAR CONTAINER FLEX */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION PANEL */}
          <aside className="w-full lg:w-72 shrink-0 bg-white border border-stone-200 rounded-2xl p-5 space-y-6 shadow-xs max-h-fit lg:sticky lg:top-6">
            <div className="pb-4 border-b">
              <span className="text-amber-700 text-[10px] font-mono font-bold uppercase tracking-widest block">Apothecary Settlement Console</span>
              <h1 className="text-xl font-serif font-black text-emerald-950 tracking-tight flex items-center gap-1.5 mt-0.5">
                <span>GoAyu Admin</span>
              </h1>
              
              {dbStatus.isMongoEnabled ? (
                dbStatus.isMongoConnected ? (
                  <div className="mt-2 text-[10px] font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-250 w-full flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                    <span>MongoDB: Connected</span>
                  </div>
                ) : (
                  <div className="mt-2 text-[10px] font-mono font-bold text-red-900 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 w-full flex flex-col gap-1 normal-case font-medium">
                    <div className="flex items-center gap-1 font-bold text-red-700 uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                      <span>MongoDB Offline</span>
                    </div>
                    <span className="text-[9px] text-stone-600 leading-tight">
                      IP Whitelist block. Fallback to local db.json is active.
                    </span>
                  </div>
                )
              ) : (
                <div className="mt-2 text-[10px] font-mono font-bold text-stone-600 bg-stone-100 px-2.5 py-1.5 rounded-lg border border-stone-250 w-full flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-stone-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Base: db.json</span>
                </div>
              )}
            </div>
            
            {/* Sidebar Tab Select Triggers */}
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span>Formulas Table ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <Tag className="w-4 h-4 shrink-0" />
                <span>Therapeutic Linages</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  fetchOrdersList();
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <CheckSquare className="w-4 h-4 shrink-0" />
                <span>Patrons Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'blogs'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Editorial Blogs ({blogs.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('subscribers');
                  fetchSubscribersList();
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'subscribers'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>True Subscribers ({subscribersList.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('banner');
                  fetchBannerConfigs();
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'banner'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <Globe className="w-4 h-4 shrink-0" />
                <span>Promotional Banner</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('coupons');
                  fetchCouponsList();
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <Tag className="w-4 h-4 shrink-0" />
                <span>Discounts & Coupons ({couponsList.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('reels');
                  fetchReelsList();
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'reels'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <Play className="w-4 h-4 shrink-0" />
                <span>Manage Reels ({reelsList.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('testimonials');
                  fetchTestimonialsList();
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Patron Gratitude ({testimonialsList.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('metrics');
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'metrics'
                    ? 'bg-emerald-850 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-emerald-950'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Sales Graphics</span>
              </button>
            </nav>
          </aside>

          {/* MAIN COLUMN WRAPPER */}
          <div className="flex-1 space-y-6">
            
            {/* Quick Metrics Header Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400">Total Formulas</span>
                <span className="text-xl font-serif font-bold text-emerald-955 pt-1.5">{products.length} Items</span>
              </div>
              <div className="bg-white p-4.5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400">Total Settle Sum</span>
                <span className="text-xl font-serif font-extrabold text-emerald-955 pt-1.5">{formatINR(statsTotal)}</span>
              </div>
              <div className="bg-white p-4.5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400">Total Orders placed</span>
                <span className="text-xl font-serif font-bold text-emerald-955 pt-1.5">{orders.length} Handed over</span>
              </div>
              <div className="bg-white p-4.5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400">Scarce Stock Batches</span>
                <span className="text-xl font-serif font-bold text-amber-750 pt-1.5">{lowStockProducts.length} Under 10</span>
              </div>
            </div>

            {/* Content panel matching Active Tab */}
            <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-xs">

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header controls to add */}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Products List</h3>
              
              {!showAddForm && (
                <button
                  id="admin-trigger-add-form"
                  onClick={() => setShowAddForm(true)}
                  className="bg-emerald-850 hover:bg-emerald-900 border border-emerald-950 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Botanical Formula</span>
                </button>
              )}
            </div>

            {/* EXPANDABLE ADD/EDIT FORM */}
            {showAddForm && (
              <div className="bg-white border rounded-2xl p-6.5 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-baseline pb-3 border-b border-stone-105">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B58954]">
                    {editingProduct ? `Edit Formula Registration: #${editingProduct.id}` : 'Compile New Slow-Cooked Formula'}
                  </h4>
                  <button onClick={handleResetForm} className="text-stone-400 hover:text-stone-700 font-mono text-xs cursor-pointer font-bold">[ Cancel ]</button>
                </div>

                {formError && (
                  <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded border">✗ {formError}</p>
                )}
                {formSuccess && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded border font-bold">✓ {formSuccess}</p>
                )}

                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-stone-705">
                  <div>
                    <label className="block mb-1 font-semibold">Botanical Title Name *</label>
                    <input
                      id="admin-form-name-input"
                      type="text"
                      required
                      placeholder="Kumkumadi Glow-Polish"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Active Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-55 border border-stone-200 rounded-lg text-stone-880 cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Tagline / Motto</label>
                    <input
                      type="text"
                      placeholder="100% Saffron Skin Nectar"
                      value={prodTagline}
                      onChange={(e) => setProdTagline(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Unit Net Price (INR) *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Original Price (INR) (Offer cross-out)</label>
                    <input
                      type="number"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-605">Active Inventory Handover Stock *</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block mb-1 font-semibold text-emerald-950 font-sans">
                      Slow-Cooked Formula Images (Upload up to 5 images) *
                    </label>
                    <div className="grid grid-cols-5 gap-3 mt-1.5">
                      {[0, 1, 2, 3, 4].map((index) => {
                        const img = prodImages[index];
                        return (
                          <div key={index} className="relative aspect-square rounded-xl border-2 border-stone-150 hover:border-emerald-800 transition-all overflow-hidden bg-stone-50 flex flex-col items-center justify-center cursor-pointer group">
                            {img ? (
                              <>
                                <img src={img} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProdImages(prev => prev.filter((_, i) => i !== index));
                                  }}
                                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-0 text-[8px] bg-emerald-955/85 text-white py-0.5 w-full text-center">
                                  {index === 0 ? 'Main Cover' : `Image ${index + 1}`}
                                </span>
                              </>
                            ) : (
                              <label className="inset-0 absolute flex flex-col items-center justify-center p-1 text-center cursor-pointer hover:bg-emerald-50/10">
                                <Plus className="w-4 h-4 text-emerald-800" />
                                <span className="text-[8px] mt-0.5 text-stone-500 font-bold uppercase tracking-wider">
                                  Img {index + 1}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          const resultStr = reader.result;
                                          setProdImages(prev => {
                                            const next = [...prev];
                                            next[index] = resultStr;
                                            return next;
                                          });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1 font-semibold">
                      Note: The first image will be set as the primary cover across search logs and listings. Max 5MB per file.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Categorys (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Tranquilizes Pitta breakouts, Deep herbal luster, Hydrates capillaries"
                      value={prodBenefits}
                      onChange={(e) => setProdBenefits(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block mb-1 font-semibold">Ingredients List Formulation (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Pure Kumkumadi oil, Swarna Dust, Kashmiri Saffron threads, Lodhra essence"
                      value={prodIngredients}
                      onChange={(e) => setProdIngredients(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block mb-1 font-semibold">Description text</label>
                    <textarea
                      rows={2}
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block mb-1 font-semibold">Clinical Usage Guide instructions</label>
                    <input
                      type="text"
                      value={prodUsage}
                      onChange={(e) => setProdUsage(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div className="md:col-span-3 border-t border-dashed border-stone-200 pt-4 mt-2">
                    <p className="font-serif font-bold text-xs text-[#B58954] uppercase tracking-wider mb-2">5 Option bullet points for product using (Show on Website Card)</p>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block mb-1 text-[10px] font-mono font-bold text-stone-400">Option 1</label>
                        <input
                          type="text"
                          placeholder="e.g. Apply 2-3 drops"
                          value={prodUsagePoint1}
                          onChange={(e) => setProdUsagePoint1(e.target.value)}
                          className="w-full text-xs p-2 border border-stone-200 rounded-lg text-stone-800 bg-stone-50 focus:bg-white focus:outline-none focus:border-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[10px] font-mono font-bold text-stone-400">Option 2</label>
                        <input
                          type="text"
                          placeholder="e.g. Massage gently"
                          value={prodUsagePoint2}
                          onChange={(e) => setProdUsagePoint2(e.target.value)}
                          className="w-full text-xs p-2 border border-stone-200 rounded-lg text-stone-800 bg-stone-50 focus:bg-white focus:outline-none focus:border-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[10px] font-mono font-bold text-stone-400">Option 3</label>
                        <input
                          type="text"
                          placeholder="e.g. Leave overnight"
                          value={prodUsagePoint3}
                          onChange={(e) => setProdUsagePoint3(e.target.value)}
                          className="w-full text-xs p-2 border border-stone-200 rounded-lg text-stone-800 bg-stone-50 focus:bg-white focus:outline-none focus:border-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[10px] font-mono font-bold text-stone-400">Option 4</label>
                        <input
                          type="text"
                          placeholder="e.g. Rinse with warm water"
                          value={prodUsagePoint4}
                          onChange={(e) => setProdUsagePoint4(e.target.value)}
                          className="w-full text-xs p-2 border border-stone-200 rounded-lg text-stone-800 bg-stone-50 focus:bg-white focus:outline-none focus:border-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[10px] font-mono font-bold text-stone-400">Option 5</label>
                        <input
                          type="text"
                          placeholder="e.g. Use twice daily"
                          value={prodUsagePoint5}
                          onChange={(e) => setProdUsagePoint5(e.target.value)}
                          className="w-full text-xs p-2 border border-stone-200 rounded-lg text-stone-800 bg-stone-50 focus:bg-white focus:outline-none focus:border-emerald-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 pt-3 flex gap-2">
                    <button
                      id="admin-form-submit-btn"
                      type="submit"
                      className="bg-emerald-850 hover:bg-emerald-950 text-white font-bold py-2.5 px-6 rounded-lg cursor-pointer"
                    >
                      {editingProduct ? 'Commit Changes' : 'Write inside db.json'}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="border border-stone-200 text-[#4A3D2D] hover:bg-stone-105 font-semibold py-2.5 px-4 rounded-lg cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Find Products Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-stone-50 border border-stone-200 p-4 rounded-xl">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Find formula by name, category, or tagline..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:bg-white bg-white font-medium text-stone-850"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 font-mono text-[10px] uppercase font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="text-stone-500 font-mono text-[10px] font-bold uppercase tracking-wider self-center">
                {productSearch ? `Found ${filteredAdminProducts.length} matching formulas` : `${products.length} registered elixirs`}
              </div>
            </div>

            {/* List products Table */}
            <div className="bg-white border text-xs text-stone-800 rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50 uppercase font-mono font-bold tracking-wider text-[10px] border-b text-stone-500">
                  <tr>
                    <th className="p-4 px-5">Formula</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Unit Price</th>
                    <th className="p-4">Stock Count</th>
                    <th className="p-4 text-right px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {filteredAdminProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-stone-400 font-medium">
                        No formulas found matching "{productSearch}". Adjust your search or clear it.
                      </td>
                    </tr>
                  ) : (
                    filteredAdminProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/50">
                      <td className="p-4 px-5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-stone-105 overflow-hidden border shrink-0">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-emerald-950">{prod.name}</p>
                          <p className="text-[10px] text-stone-400 font-normal italic">{prod.tagline}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-805 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase text-[9px] font-mono leading-none">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-900 font-serif text-sm">{formatINR(prod.price)}</td>
                      <td className="p-4">
                        <span className={`font-mono font-bold ${prod.stock <= 10 ? 'text-red-700 bg-red-50 p-1 rounded' : 'text-stone-605'}`}>{prod.stock} Units</span>
                      </td>
                      <td className="p-4 text-right px-5">
                        <div className="flex justify-end gap-2 text-[10px] font-bold">
                          <button
                            onClick={() => handleEditProductClick(prod)}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-701 p-1 px-2.5 rounded-md flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Modify</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-705 p-1 px-2.5 rounded-md flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: CATEGORY MANAGERS */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Ayurvedic Sages Classifications</h3>
              {!showCatForm && (
                <button
                  onClick={() => setShowCatForm(true)}
                  className="bg-emerald-850 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer transition-transform"
                >
                  <Plus className="w-4 h-3.5" />
                  <span>Build Linage Category</span>
                </button>
              )}
            </div>

            {showCatForm && (
              <form onSubmit={handleSaveCategory} className="bg-white p-6 rounded-2xl border text-xs text-stone-705 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">Category Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tejas Skincare"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 focus:outline-none bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Category Slug Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="skincare"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 focus:outline-none bg-stone-50 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold">Descriptive Summary</label>
                  <input
                    type="text"
                    placeholder="Cooling extracts compiled under pitta balance..."
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 focus:outline-none bg-stone-50 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold text-emerald-950">Category Cover Image File</label>
                  <div className="flex items-center gap-4 mt-2">
                    {catImage && (
                      <div className="w-16 h-16 rounded-xl border overflow-hidden shrink-0 bg-stone-50 shadow-inner">
                        <img src={catImage} className="w-full h-full object-cover" alt="Category preview" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 hover:border-emerald-800 rounded-xl p-4 bg-stone-50 hover:bg-emerald-50/10 cursor-pointer text-center text-xs transition-colors relative">
                        <span className="font-semibold text-emerald-900">🌿 Click or Drag to Upload cover photo</span>
                        <span className="text-[10px] text-stone-500 mt-0.5">Supports JPG, PNG (Max 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setCatImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2 pt-2 flex gap-2">
                  <button type="submit" className="bg-emerald-900 border border-emerald-950 text-white font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-950 transition-colors">
                    {editingCategory ? 'Update' : 'Register'}
                  </button>
                  <button type="button" onClick={handleResetCategoryForm} className="border text-stone-600 font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white border rounded-xl p-5 shadow-xs flex items-start gap-4 relative group">
                  <div className="w-12 h-12 bg-stone-55 rounded-lg border overflow-hidden shrink-0">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow pr-16 m-1">
                    <h5 className="font-serif font-bold text-[#0D2418] uppercase tracking-wide leading-none">{cat.name}</h5>
                    <p className="text-[10px] text-stone-400 font-mono mt-1 font-bold">Slug: {cat.slug}</p>
                    <p className="text-xs text-stone-550 leading-relaxed mt-2.5">{cat.description}</p>
                  </div>
                  
                  {/* Action buttons on the right side of the card */}
                  <div className="absolute right-4 top-4 flex gap-1 bg-white p-1 rounded-lg border shadow-sm">
                    <button
                      onClick={() => handleEditCategoryClick(cat)}
                      className="p-1 px-1.5 hover:bg-amber-50 hover:text-amber-700 text-stone-600 rounded transition cursor-pointer"
                      title="Edit lineage"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 px-1.5 hover:bg-red-50 hover:text-red-600 text-stone-600 rounded transition cursor-pointer"
                      title="Retire lineage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

             {/* TAB 3: REGISTERED ORDERS HISTORIC */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Orders</h3>
                <p className="text-xs text-stone-500 font-sans mt-1">Manage catalog fulfillment, track packages, update billing states.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleDownloadOrderReports}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition select-none"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download Order Report</span>
                </button>

                <button
                  onClick={handleDownloadGSTReport}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition select-none"
                >
                  <Download className="w-4 h-4 shrink-0 text-amber-300" />
                  <span>Download GST Report</span>
                </button>
                
                {/* Order Search Bar */}
                <div className="w-full sm:w-60">
                  <input
                    type="text"
                    placeholder="🔍 Search order by ref, name..."
                    value={orderSearchText}
                    onChange={(e) => setOrderSearchText(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-xl bg-white text-stone-850 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                  />
                </div>
              </div>
            </div>
            
            {loadingOrders ? (
              <p className="text-xs text-stone-500 font-semibold italic">Processing ledger...</p>
            ) : (
              (() => {
                const searchClean = orderSearchText.trim().toLowerCase();
                const filteredOrders = orders.filter(o => 
                  o.orderNumber.toLowerCase().includes(searchClean) ||
                  o.customerName.toLowerCase().includes(searchClean) ||
                  (o.customerPhone && o.customerPhone.toLowerCase().includes(searchClean)) ||
                  o.customerEmail.toLowerCase().includes(searchClean)
                );

                if (filteredOrders.length === 0) {
                  return <p className="text-xs text-stone-500 italic bg-white p-8 rounded-xl text-center border">No matching orders found in archives.</p>;
                }

                return (
                  <div className="space-y-4">
                    {filteredOrders.map((o) => {
                      const isInspected = inspectingOrder?.id === o.id;

                      return (
                        <div key={o.orderNumber} className="bg-white border rounded-xl p-5 shadow-xs text-xs font-medium space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Order Reference</p>
                              <p className="font-serif font-bold text-emerald-955 text-sm">{o.orderNumber}</p>
                              <span className="font-mono text-[9px] font-bold text-stone-500 block uppercase bg-stone-100 px-1 py-0.5 rounded mt-1 max-w-max select-all">ID: {o.id}</span>
                              <p className="text-stone-450 tracking-wide text-[10px] uppercase font-mono mt-0.5">Method: {o.paymentMethod || 'Online'}</p>
                            </div>
                            <div>
                              <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Settle Name</p>
                              <p className="font-bold text-stone-850">{o.customerName}</p>
                              <p className="text-stone-500 font-mono">{o.customerEmail}</p>
                            </div>
                            <div>
                              <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Formula Load count</p>
                              <p className="text-stone-704 font-bold">{o.items?.length || 0} Preparations</p>
                              {o.trackingId && (
                                <p className="text-[10px] font-mono font-bold text-emerald-800 mt-0.5">ID: {o.trackingId}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-start md:items-end justify-between">
                              <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider md:text-right w-full">Gross Revenue</p>
                              <p className="font-serif font-black text-emerald-955 text-sm md:text-right w-full">{formatINR(o.total)}</p>
                              <div className="mt-1 flex gap-2 w-full justify-start md:justify-end">
                                <span className={`inline-block text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${o.paymentStatus === 'paid' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                                  {o.paymentStatus === 'paid' ? 'Paid Settlement' : 'Pending Payment'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Detail Toggle action */}
                          <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                            <button
                              onClick={() => setInspectingOrder(isInspected ? null : o)}
                              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                            >
                              {isInspected ? 'Hide User & Order Details [-]' : 'Show User & Order Details [+]'}
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDownloadInvoice(o)}
                                className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition select-none"
                                title="Download Customer Invoice Breakdown (GST)"
                              >
                                <Download className="w-3.5 h-3.5 shrink-0" />
                                <span>Invoice</span>
                              </button>
                              <span className="text-[10px] font-mono text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg uppercase">Status: {o.status || 'processing'}</span>
                            </div>
                          </div>

                          {/* Expanded User Context Details Segment */}
                          {isInspected && (
                            <div className="p-4 bg-stone-50 rounded-lg space-y-4 border text-stone-700 font-sans grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
                              <div>
                                <h4 className="font-serif font-black text-xs text-stone-900 border-b pb-1.5 mb-2 uppercase tracking-wide">Patron & Shipping Details</h4>
                                <table className="w-full text-xs space-y-1.5">
                                  <tbody>
                                    <tr>
                                      <td className="w-24 text-stone-400 font-mono text-[10px] uppercase font-bold">Patron Name:</td>
                                      <td className="font-semibold text-stone-800">{o.customerName}</td>
                                    </tr>
                                    <tr>
                                      <td className="text-stone-400 font-mono text-[10px] uppercase font-bold">Phone Number:</td>
                                      <td className="font-mono text-stone-800">{o.customerPhone || 'Not specified'}</td>
                                    </tr>
                                    <tr>
                                      <td className="text-stone-400 font-mono text-[10px] uppercase font-bold">Email:</td>
                                      <td className="text-stone-800 font-semibold">{o.customerEmail}</td>
                                    </tr>
                                    <tr>
                                      <td className="text-stone-400 font-mono text-[10px] uppercase font-bold">Full Address:</td>
                                      <td className="text-stone-850 font-semibold leading-relaxed">
                                        {o.shippingAddress}, {o.city}, {o.state}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-stone-400 font-mono text-[10px] uppercase font-bold">Zip/Pincode:</td>
                                      <td className="font-mono text-stone-900 font-black">{o.zipCode || 'No code'}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              <div>
                                <h4 className="font-serif font-black text-xs text-stone-900 border-b pb-1.5 mb-2 uppercase tracking-wide font-bold">Ordered Formulas</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {o.items && o.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border">
                                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md border shrink-0" />
                                      <div className="flex-grow">
                                        <p className="font-bold text-stone-800">{item.name}</p>
                                        <p className="text-[10px] text-stone-400">{item.quantity} units • {formatINR(item.price)} each</p>
                                      </div>
                                      <div className="text-right font-mono font-bold text-stone-800">
                                        {formatINR(item.price * item.quantity)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* STATUS UPDATE & SETTLE CONTROL PANEL */}
                              <div className="bg-amber-50/20 border border-amber-100 p-4 rounded-xl space-y-3.5">
                                <h4 className="font-serif font-black text-xs text-stone-900 border-b pb-1.5 mb-2 uppercase tracking-wide">Fulfillment & Payment Ledger</h4>
                                
                                <div className="space-y-3 text-xs">
                                  <div>
                                    <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 mb-1">Fulfillment Status</label>
                                    <select
                                      defaultValue={o.status || 'processing'}
                                      onChange={async (e) => {
                                        const newStatus = e.target.value;
                                        await fetch(`/api/orders/${o.id}/status`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ status: newStatus })
                                        });
                                        fetchOrdersList();
                                      }}
                                      className="w-full p-2 border border-stone-250 rounded-lg bg-white font-semibold cursor-pointer text-stone-800"
                                    >
                                      <option value="processing">Processing (Sterile Standard)</option>
                                      <option value="shipped">Shipped (Carrier Assigned)</option>
                                      <option value="delivered">Delivered (Doorstep Settle)</option>
                                    </select>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 mb-1">Payment Status</label>
                                      <select
                                        defaultValue={o.paymentStatus || 'pending'}
                                        onChange={async (e) => {
                                          const newPayStatus = e.target.value;
                                          await fetch(`/api/orders/${o.id}/status`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ paymentStatus: newPayStatus })
                                          });
                                          fetchOrdersList();
                                        }}
                                        className="w-full p-2 border border-stone-250 rounded-lg bg-white font-semibold cursor-pointer text-stone-800"
                                      >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                      </select>
                                    </div>

                                    <div>
                                      <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 mb-1">Payment Option</label>
                                      <select
                                        defaultValue={o.paymentMethod || 'COD'}
                                        onChange={async (e) => {
                                          const newPayMethod = e.target.value;
                                          await fetch(`/api/orders/${o.id}/status`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ paymentMethod: newPayMethod })
                                          });
                                          fetchOrdersList();
                                        }}
                                        className="w-full p-2 border border-stone-250 rounded-lg bg-white font-semibold cursor-pointer text-stone-800"
                                      >
                                        <option value="COD">India COD</option>
                                        <option value="Online">Online Pay</option>
                                        <option value="UPI">UPI Sacred</option>
                                        <option value="Bank Transfer">Bank Wire</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 mb-1">Order Tracking ID Number</label>
                                    <div className="flex gap-1.5">
                                      <input
                                        id={`tracking-id-input-${o.id}`}
                                        type="text"
                                        placeholder="e.g. BLUEDART-94812"
                                        defaultValue={o.trackingId || ''}
                                        className="flex-grow p-2 border border-stone-250 rounded-lg bg-white text-xs font-mono text-stone-800 uppercase"
                                      />
                                      <button
                                        onClick={async () => {
                                          const inputEl = document.getElementById(`tracking-id-input-${o.id}`) as HTMLInputElement;
                                          if (inputEl) {
                                            const val = inputEl.value.trim();
                                            await fetch(`/api/orders/${o.id}/status`, {
                                              method: 'PUT',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ trackingId: val })
                                            });
                                            alert('Tracking ID registered and saved successfully!');
                                            fetchOrdersList();
                                          }
                                        }}
                                        className="bg-emerald-850 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* TAB: EDITORIAL BLOGS */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Blogs</h3>
              {!showBlogForm && (
                <button
                  onClick={() => setShowBlogForm(true)}
                  className="bg-emerald-850 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-emerald-900 transition"
                >
                  <Plus className="w-4 h-3.5" />
                  <span>Write Blog Article</span>
                </button>
              )}
            </div>

            {/* Write/Edit Blog Form */}
            {showBlogForm && (
              <form onSubmit={handleSaveBlog} className="bg-white p-6 rounded-2xl border text-xs text-stone-705 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <h4 className="font-serif font-black text-sm text-stone-900 border-b pb-1.5 mb-2">
                    {editingBlog ? 'Edit Formulation Article' : 'Draft New Formulation Scientific Article'}
                  </h4>
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Saffron Secrets: Shimmering Skin Layers"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Article Slug Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="saffron-secrets-skin"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Author Writer *</label>
                  <input
                    type="text"
                    required
                    placeholder="Acharya GoAyu"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold font-serif">Upload Cover Image *</label>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBlogImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="blog-image-upload-input"
                    />
                    <label
                      htmlFor="blog-image-upload-input"
                      className="cursor-pointer border border-dashed border-stone-300 hover:border-emerald-800 bg-stone-55 hover:bg-emerald-50/30 text-stone-600 hover:text-emerald-900 font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-2 transition"
                    >
                      <Upload className="w-4 h-4 text-emerald-800" />
                      <span>{blogImage ? 'Replace Image' : 'Choose Cover Image'}</span>
                    </label>
                    {blogImage && (
                      <div className="relative w-12 h-12 border rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img src={blogImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold">Brief Summary Excerpt</label>
                  <input
                    type="text"
                    placeholder="An analytical research overview profiling the transdermal efficacy of Kumkumadi..."
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold">Full Scientific Narrative Content (Markdown Supported)</label>
                  <textarea
                    rows={6}
                    placeholder="Draft complete botanical dissertation or commentary..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2 pt-2 flex gap-2">
                  <button type="submit" className="bg-emerald-900 border border-emerald-950 text-white font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-955 transition-colors">
                    {editingBlog ? 'Update Article' : 'Publish Article'}
                  </button>
                  <button type="button" onClick={handleResetBlogForm} className="border text-stone-600 font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </form>
            )}

            {/* Blogs list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between relative">
                  <div className="space-y-3">
                    <img src={blog.image} alt={blog.title} className="w-full h-32 object-cover rounded-lg border shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest">{blog.author || 'Acharya'}</span>
                      <h5 className="font-serif font-bold text-[#0D2418] uppercase tracking-wide text-sm mt-1">{blog.title}</h5>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">Slug: {blog.slug}</p>
                      <p className="text-xs text-stone-550 leading-relaxed mt-2 line-clamp-2">{blog.excerpt}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                    <button
                      onClick={() => handleEditBlogClick(blog)}
                      className="p-1 px-3 hover:bg-amber-50 text-amber-700 bg-amber-50/20 text-xs border border-amber-100 rounded-lg transition font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-1 px-3 hover:bg-red-50 text-red-601 bg-red-50/20 text-xs border border-red-100 rounded-lg transition font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PHARMACIST HEALTH INQUIRIES */}
        {activeTab === 'queries' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Research Pharmacist Inquiries Journal</h3>
              
              {/* Queries Search Bar */}
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  placeholder="🔍 Filter inquiries by name, concern context..."
                  value={querySearchText}
                  onChange={(e) => setQuerySearchText(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-xl bg-white text-stone-850 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>

            {loadingQueries ? (
              <p className="text-xs text-stone-500 font-semibold italic">Reading health ledger records...</p>
            ) : (
              (() => {
                const searchClean = querySearchText.trim().toLowerCase();
                const filteredQueries = pharmacistQueries.filter(q => 
                  q.name.toLowerCase().includes(searchClean) ||
                  q.email.toLowerCase().includes(searchClean) ||
                  (q.phone && q.phone.toLowerCase().includes(searchClean)) ||
                  q.query.toLowerCase().includes(searchClean) ||
                  (q.subject && q.subject.toLowerCase().includes(searchClean))
                );

                if (filteredQueries.length === 0) {
                  return <p className="text-xs text-stone-500 italic bg-white p-8 rounded-xl text-center border">No matching pharmacist healthcare queries located structure.</p>;
                }

                return (
                  <div className="space-y-4">
                    {filteredQueries.map((q) => (
                      <div key={q.id || q._id} className="bg-white border rounded-xl p-5 shadow-xs text-xs space-y-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Inquirer Profile</p>
                            <p className="font-serif font-black text-emerald-955 text-sm">{q.name}</p>
                            <p className="text-stone-400 text-[10px] font-mono">Date: {q.addedAt ? new Date(q.addedAt).toLocaleDateString() : 'Recent'}</p>
                          </div>
                          <div>
                            <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Contact Credentials</p>
                            <p className="font-serif font-bold text-stone-850">{q.email}</p>
                            <p className="text-stone-500 font-mono">{q.phone || 'Phone not provided'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">Ayurvedic Dosha / Health Subject</p>
                            <p className="font-bold text-amber-850 italic">Subject: {q.subject || 'Therapeutic Inquiry'}</p>
                          </div>
                        </div>

                        <div className="p-3.5 bg-emerald-50/30 rounded-lg border border-emerald-100 text-stone-750 text-xs leading-relaxed font-sans">
                          <p className="font-semibold text-emerald-950 mb-1.5 uppercase font-mono text-[9px] tracking-wider">Botanical Concerns Narrative Description:</p>
                          <p className="italic">"{q.query}"</p>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleDeleteQuery(q.id)}
                            className="bg-red-50 text-red-650 hover:bg-red-100 hover:text-red-750 p-2.5 px-3 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wide cursor-pointer border border-red-100 transition flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Retire Inquirer Query Record</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* TAB: NEWSLETTER SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Ayurvedic True Subscribers Journal</h3>
              <p className="text-xs text-stone-500 font-sans mt-1">Patrons who subscribed to receive Ayurvedic Blessing Letters and newsletter announcements.</p>
            </div>

            {loadingSubscribers ? (
              <p className="text-xs text-stone-500 font-semibold italic">Processing subscriber lists...</p>
            ) : subscribersList.length === 0 ? (
              <p className="text-xs text-stone-500 italic bg-white p-8 rounded-xl text-center border">No subscribers registered yet in database.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => handleDownloadSubscribers(subscribersList)}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold font-mono uppercase text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All ({subscribersList.length})</span>
                  </button>

                  <button
                    disabled={selectedSubscribers.length === 0}
                    onClick={() => handleDownloadSubscribers(selectedSubscribers)}
                    className="bg-emerald-850 hover:bg-emerald-900 text-white font-bold font-mono uppercase text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Selected ({selectedSubscribers.length})</span>
                  </button>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200">
                        <th className="p-3 font-mono font-bold uppercase text-stone-400 text-[10px] w-12 text-center">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.length === subscribersList.length && subscribersList.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubscribers([...subscribersList]);
                              } else {
                                setSelectedSubscribers([]);
                              }
                            }}
                            className="w-4 h-4 rounded border-stone-300 text-emerald-850 focus:ring-emerald-800 cursor-pointer"
                          />
                        </th>
                        <th className="p-3 font-mono font-bold uppercase text-stone-400 text-[10px] tracking-wider">Email Address</th>
                        <th className="p-3 font-mono font-bold uppercase text-[#B58954] text-[10px] text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {subscribersList.slice().reverse().map((subscriber, idx) => {
                        const isChecked = selectedSubscribers.includes(subscriber);
                        return (
                          <tr key={idx} className="hover:bg-stone-50 transition-colors">
                            <td className="p-3 text-center w-12">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedSubscribers(selectedSubscribers.filter(s => s !== subscriber));
                                  } else {
                                    setSelectedSubscribers([...selectedSubscribers, subscriber]);
                                  }
                                }}
                                className="w-4 h-4 rounded border-stone-300 text-emerald-850 focus:ring-emerald-800 cursor-pointer"
                              />
                            </td>
                            <td className="p-3 font-semibold text-stone-850 font-mono select-all text-sm">{subscriber}</td>
                            <td className="p-3 text-right">
                              <span className="inline-block text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border text-emerald-800 bg-emerald-50 border-emerald-200">
                                Active Blessing Receiver
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'banner' && (
          <form onSubmit={handleSaveBanner} className="bg-white p-6.5 rounded-2xl border text-xs text-stone-705 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-300">
            <div className="md:col-span-2 border-b pb-2">
              <h3 className="text-sm font-serif font-black text-emerald-900 uppercase tracking-wider">Banner</h3>
              <p className="text-[10px] text-stone-400 font-mono mt-0.5 uppercase tracking-wider font-semibold">Live website cover display setup module</p>
            </div>

            {/* LOGO CONFIGURATION */}
            <div className="md:col-span-2 bg-stone-50 p-4.5 rounded-xl border border-stone-200/55 space-y-3">
              <h4 className="text-xs font-serif font-black text-emerald-900 uppercase tracking-widest">Brand Logo Configuration</h4>
              <p className="text-[10px] text-stone-550">Specify an image URL or upload your corporate logo (.h-10 image) to replace the default brand emblem globally in the header and footer.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Custom Logo Image URL / Base64</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://your-domain.com/logo.png"
                      value={bannerLogoUrl}
                      onChange={(e) => setBannerLogoUrl(e.target.value)}
                      className="flex-grow text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-white"
                    />
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        className="bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg px-3.5 py-2.5 font-bold font-mono text-stone-700 flex items-center gap-1 cursor-pointer transition select-none text-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setBannerLogoUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-3 pb-1">
                  {bannerLogoUrl ? (
                    <>
                      <div className="h-10 px-4 bg-white border border-stone-200 rounded-lg flex items-center justify-center shrink-0">
                        <img src={bannerLogoUrl} alt="Logo Preview" className="h-7 w-auto object-contain" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setBannerLogoUrl('')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-2.5 rounded-lg border border-red-200 text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove Custom Logo</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-stone-400 italic">Currently displaying default GoAyu Brand Logo.</span>
                  )}
                </div>
              </div>
            </div>

            {/* HOMEPAGE SECTIONS VISIBILITY */}
            <div className="md:col-span-2 bg-stone-50 p-4.5 rounded-xl border border-stone-200/55 space-y-3">
              <h4 className="text-xs font-serif font-black text-emerald-900 uppercase tracking-widest">Homepage Layout Sections Visibility</h4>
              <p className="text-[10px] text-stone-550">Toggle visibility on and off for special widgets displaying dynamic or custom organic media panels directly on the core visitor front-page.</p>
              
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-lg border border-stone-150">
                <input
                  type="checkbox"
                  id="toggle-reels-traditional-wisdom"
                  checked={bannerShowTraditionalWisdom}
                  onChange={(e) => setBannerShowTraditionalWisdom(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-stone-300 rounded cursor-pointer"
                />
                <label htmlFor="toggle-reels-traditional-wisdom" className="font-bold text-stone-850 cursor-pointer select-none">
                  Display "Traditional Wisdom in Motion" Video Reels Section
                </label>
              </div>
            </div>

            {/* BANNER HEADLINE CONTROLS */}
            <div className="md:col-span-2 bg-stone-50 p-4.5 rounded-xl border border-stone-200/55 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-serif font-black text-emerald-900 uppercase tracking-widest">Banner Promotional Text Headlines</h4>
                {(bannerTitle || bannerSubtitle) && (
                  <button
                    type="button"
                    onClick={() => {
                      setBannerTitle('');
                      setBannerSubtitle('');
                    }}
                    className="text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-250 px-2.5 py-1 rounded cursor-pointer uppercase flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove Headline Text
                  </button>
                )}
              </div>
              <p className="text-[10px] text-stone-500">Edit or clear the typography header of the cover page. Clearing both fields leaves the background illustration completely clean.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Main Banner Display Title</label>
                  <input
                    type="text"
                    placeholder="Enter brand banner title"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-white"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold">Display Subtitle / Promotic Pitch</label>
                  <input
                    type="text"
                    placeholder="Enter brand banner subtitle"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold">Background Landscape Cover Image *</label>
              <div className="space-y-2">
                <div className="flex gap-2 justify-center items-center">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={bannerBgImage}
                    onChange={(e) => setBannerBgImage(e.target.value)}
                    className="flex-grow text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      className="bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg px-3.5 py-2.5 font-bold font-mono text-stone-700 flex items-center gap-1 cursor-pointer transition select-none text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setBannerBgImage(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
                {bannerBgImage && (
                  <div className="h-16 w-full rounded-lg overflow-hidden border border-stone-200 bg-stone-50 relative group">
                    <img src={bannerBgImage} alt="Banner Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setBannerBgImage('')}
                      className="absolute top-1 right-1 p-1 bg-red-650/80 hover:bg-red-700 text-white rounded-full transition-all cursor-pointer opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                      title="Clear image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold">Call-To-Action CTA Button Text *</label>
              <input
                type="text"
                required
                placeholder="Shop Organic Healing Collection"
                value={bannerCtaText}
                onChange={(e) => setBannerCtaText(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-bold">Button CTA Redirection Link (Route View identifier e.g., 'shop') *</label>
              <input
                type="text"
                required
                placeholder="shop"
                value={bannerLink}
                onChange={(e) => setBannerLink(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
              />
            </div>

            {/* FLOATING PRODUCT CARD CONTROLS */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h4 className="text-xs font-serif font-black text-emerald-900 uppercase tracking-widest mb-1">Configure Floating Banner Product Card</h4>
              <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider font-semibold mb-4 text-amber-800">Customize the small promotional highlight card overlay shown on desktop devices</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Card Highlight Image *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={bannerCardImage}
                      onChange={(e) => setBannerCardImage(e.target.value)}
                      className="flex-grow text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                    />
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        className="bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg px-3.5 py-2.5 font-bold font-mono text-stone-700 flex items-center gap-1 cursor-pointer transition select-none text-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setBannerCardImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold">Card Top Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="Weekly Best-Seller"
                    value={bannerCardLabel}
                    onChange={(e) => setBannerCardLabel(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold">Featured Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Kumkumadi Facial Elixir"
                    value={bannerCardName}
                    onChange={(e) => setBannerCardName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold">Card CTA Button/Discount Offer *</label>
                  <input
                    type="text"
                    required
                    placeholder="Buy with 20% discount Code AYU20"
                    value={bannerCardCtaText}
                    onChange={(e) => setBannerCardCtaText(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-bold">Card Redirection Target (Search keyword e.g. "Kumkumadi") *</label>
                  <input
                    type="text"
                    required
                    placeholder="Kumkumadi"
                    value={bannerCardLink}
                    onChange={(e) => setBannerCardLink(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-2 flex gap-3">
              <button
                type="submit"
                className="bg-emerald-900 border border-emerald-950 text-white font-serif font-black px-6 py-3 rounded-xl cursor-pointer hover:bg-emerald-955 transition-all text-xs tracking-wider uppercase"
              >
                Save Promotional Banner Formulas
              </button>
            </div>
          </form>
        )}

        {/* TAB: DISCOUNTS & COUPONS CRUD */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Custom Dynamic Promotional Discounts</h3>
                <p className="text-xs text-stone-500 font-sans mt-0.5">Configure digital coupons, seasonal promotions, or custom product discount parameters.</p>
              </div>
              <button
                onClick={() => {
                  setEditingCouponId(null);
                  setCpCode('');
                  setCpType('percentage');
                  setCpValue(10);
                  setCpMin(0);
                  setCpProductId('');
                  setCpActive(true);
                  setShowCouponForm(!showCouponForm);
                }}
                className="bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition select-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showCouponForm ? 'Hide Creator Form' : 'Create New Coupon'}</span>
              </button>
            </div>

            {/* Coupon creator/editor form */}
            {showCouponForm && (
              <form onSubmit={handleSaveCoupon} className="bg-white p-6.5 rounded-2xl border text-xs text-stone-705 grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                <div className="md:col-span-2 border-b pb-2">
                  <h4 className="text-sm font-serif font-black text-emerald-900 uppercase tracking-widest">
                    {editingCouponId ? 'Modify Dynamic Discount Code' : 'Bootstrap Fresh Discount Code'}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5 uppercase tracking-wider font-bold">Configure active status and product specific application rules</p>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Coupon Reference Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AYUSH30"
                    value={cpCode}
                    onChange={(e) => setCpCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white uppercase font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Discount Reduction Formula Type *</label>
                  <select
                    value={cpType}
                    onChange={(e) => setCpType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white font-semibold cursor-pointer"
                  >
                    <option value="percentage">Percentage Reduction (e.g. 15% Off)</option>
                    <option value="fixed">Fixed Global Settle Amount (e.g. $10 Off)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Reduction Value (Percent / Flat Rate) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={cpValue}
                    onChange={(e) => setCpValue(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Minimum Bag Settle Purchase Floor ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={cpMin}
                    onChange={(e) => setCpMin(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Apply to Specific Elixir Product (Optional)</label>
                  <select
                    value={cpProductId}
                    onChange={(e) => setCpProductId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white font-semibold cursor-pointer text-stone-750"
                  >
                    <option value="">Store-wide (Applies to all products in Cart)</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Active Campaign Status *</label>
                  <select
                    value={cpActive ? 'yes' : 'no'}
                    onChange={(e) => setCpActive(e.target.value === 'yes')}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-50 focus:bg-white font-semibold cursor-pointer"
                  >
                    <option value="yes">Campaign Active & Redeemable</option>
                    <option value="no">Campaign Inactive / Paused</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="bg-emerald-900 border border-emerald-950 text-white font-serif font-black px-6 py-3 rounded-xl cursor-pointer hover:bg-emerald-955 transition-all text-xs tracking-wider uppercase"
                  >
                    {editingCouponId ? 'Save Discount Code Changes' : 'Bootstrap Active Coupon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCouponForm(false);
                      setEditingCouponId(null);
                    }}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold border border-stone-300 rounded-xl px-5 py-3 cursor-pointer text-xs uppercase"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Coupons List */}
            {loadingCoupons ? (
              <p className="text-xs text-stone-500 font-semibold italic">Processing discount records...</p>
            ) : couponsList.length === 0 ? (
              <p className="text-xs text-stone-500 italic bg-white p-8 rounded-xl text-center border">No custom coupons registered yet. Click Create New Coupon above to add one!</p>
            ) : (
              <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="p-3 font-mono font-bold uppercase text-stone-400 text-[10px] w-[15%]">Code</th>
                      <th className="p-3 font-mono font-bold uppercase text-stone-400 text-[10px] tracking-wider w-[20%]">Formula / Type</th>
                      <th className="p-3 font-mono font-bold uppercase text-stone-400 text-[10px] tracking-wider w-[25%]">Target Scope</th>
                      <th className="p-3 font-mono font-bold uppercase text-stone-400 text-[10px] tracking-wider w-[15%]">Min Settle</th>
                      <th className="p-3 font-mono font-bold uppercase text-stone-400 text-[10px] text-center w-[10%]">Status</th>
                      <th className="p-3 font-mono font-bold uppercase text-[#B58954] text-[10px] text-right w-[15%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {couponsList.map((cp) => {
                      const matchedItem = products.find(p => p.id === cp.productId);
                      return (
                        <tr key={cp.id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-3 font-bold font-mono text-emerald-900 text-sm select-all uppercase">{cp.code}</td>
                          <td className="p-3 text-stone-700">
                            {cp.discountType === 'percentage' ? (
                              <span className="font-sans font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px]">{cp.discountValue}% Reduction</span>
                            ) : (
                              <span className="font-sans font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[10px]">${cp.discountValue} Flat Off</span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-stone-850">
                            {matchedItem ? (
                              <span className="text-emerald-950 font-sans italic hover:underline">Only {matchedItem.name}</span>
                            ) : (
                              <span className="text-stone-400 font-mono uppercase text-[10px]">Store-wide (All Elixirs)</span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-stone-600 font-bold">${cp.minPurchase || 0} Floor</td>
                          <td className="p-3 text-center">
                            {cp.active ? (
                              <span className="inline-block text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded text-emerald-800 bg-emerald-50 border border-emerald-250">Active</span>
                            ) : (
                              <span className="inline-block text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded text-stone-500 bg-stone-100 border border-stone-200">Paused</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEditCouponClick(cp)}
                                className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 p-2 rounded cursor-pointer transition"
                                title="Edit Coupon Parameters"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(cp.id)}
                                className="bg-red-50 text-red-650 hover:bg-red-100 hover:text-red-750 p-2 rounded cursor-pointer transition"
                                title="Delete Coupon"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: TESTIMONIALS (PATRON GRATITUDE & WHISPERS OF HEALING) CRUD */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-in fade-in duration-300 text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Patron Gratitude & Testimonials</h3>
                <p className="text-[11px] text-stone-500 font-sans mt-0.5">Manage Customer Feedback displayed inside the "Whispers of Healing" home carousel section.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial(null);
                  setTestName('');
                  setTestLocation('');
                  setTestQuote('');
                  setShowTestimonialForm(!showTestimonialForm);
                }}
                className="bg-emerald-950 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer hover:bg-emerald-990 transition select-none uppercase tracking-wider text-[10px] border border-emerald-950 shadow-md"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>{showTestimonialForm ? 'Hide Form' : 'Register New Testimonial'}</span>
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg flex items-center gap-2">
                <HelpCircle className="w-4 h-3.5 text-red-700 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-lg flex items-center gap-2 font-bold font-serif">
                <span>{formSuccess}</span>
              </div>
            )}

            {showTestimonialForm && (
              <form onSubmit={handleSaveTestimonial} className="bg-stone-50 p-6 rounded-2xl border border-stone-200/55 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <h4 className="font-serif font-black text-emerald-955 text-xs uppercase tracking-wider">
                  {editingTestimonial ? 'Amend Testimonial Credentials' : 'Create New Patron Testimonial'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold text-stone-700">Genuine Patron Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Shruti Deshmukh"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-250 rounded-lg text-stone-850 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-stone-700">Location / Occupation</label>
                    <input
                      type="text"
                      placeholder="Ex: Pune, Maharashtra"
                      value={testLocation}
                      onChange={(e) => setTestLocation(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-250 rounded-lg text-stone-850 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Patron Healing Quote & Review *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how the facial elixirs or organic chyawanprash rebalanced vital energy..."
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-250 rounded-lg text-stone-850 bg-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="bg-emerald-950 border border-emerald-990 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-emerald-990 transition text-[10px] uppercase tracking-wider"
                  >
                    {editingTestimonial ? 'Update Testimonial' : 'Seed Testimonial'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTestimonialForm(false);
                      setEditingTestimonial(null);
                    }}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer transition text-[10px] uppercase tracking-wider border border-stone-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loadingTestimonials ? (
              <div className="flex items-center justify-center p-12 text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Synchronizing testimonial tables...</span>
              </div>
            ) : testimonialsList.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border text-center text-stone-400 font-serif italic">
                No custom testimonials registered in GoAyu. Click "Register New Testimonial" to write one!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonialsList.map((t) => (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs hover:border-emerald-300 hover:shadow-md transition">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-emerald-955 text-xs">{t.name}</h4>
                          <span className="text-[10px] text-stone-400 font-mono">{t.location}</span>
                        </div>
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                      </div>
                      <p className="text-stone-605 italic text-[11px] leading-relaxed font-sans mt-2">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-stone-100 justify-end">
                      <button
                        onClick={() => handleEditTestimonialClick(t)}
                        className="bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 p-2 rounded-lg cursor-pointer transition flex items-center gap-1 text-[10px]"
                        title="Edit Testimonial Content"
                      >
                        <Edit2 className="w-3 h-3 text-stone-500" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirmDeleteId === t.id) {
                            handleDeleteTestimonial(t.id);
                            setConfirmDeleteId(null);
                          } else {
                            setConfirmDeleteId(t.id);
                          }
                        }}
                        onMouseLeave={() => {
                          if (confirmDeleteId === t.id) setConfirmDeleteId(null);
                        }}
                        className={`p-2 rounded-lg cursor-pointer transition flex items-center gap-1 text-[10px] font-bold border ${
                          confirmDeleteId === t.id
                            ? 'bg-red-600 border-red-700 text-white hover:bg-red-700 animate-pulse'
                            : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                        }`}
                        title="Delete Testimonial permanent"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{confirmDeleteId === t.id ? 'Confirm?' : 'Remove'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: REELS & VERTICAL VIDEOS MANAGEMENT */}
        {activeTab === 'reels' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Live Botanical Reels & Shorts</h3>
                <p className="text-xs text-stone-500 font-sans mt-0.5">Publish vertical videos demonstrating organic extractions, slow-brewed decoctions, and Swarna Swasa harvests.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingReel(null);
                  setReelTitle('');
                  setReelUrl('');
                  setReelTagline('');
                  setReelProductId('');
                  setShowReelForm(!showReelForm);
                }}
                className="bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition select-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showReelForm ? 'Hide Reels Creator' : 'Add Brand Reel'}</span>
              </button>
            </div>

            {/* Reel Creator Form */}
            {showReelForm && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!reelTitle || !reelUrl) {
                    alert('Title and Video URL are required.');
                    return;
                  }
                  try {
                    const isNew = !editingReel;
                    const endpoint = isNew ? '/api/reels' : `/api/reels/${editingReel.id}`;
                    const method = isNew ? 'POST' : 'PUT';
                    
                    const response = await fetch(endpoint, {
                      method,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: reelTitle,
                        url: reelUrl,
                        tagline: reelTagline,
                        productId: reelProductId || undefined
                      })
                    });
                    if (response.ok) {
                      setEditingReel(null);
                      setReelTitle('');
                      setReelUrl('');
                      setReelTagline('');
                      setReelProductId('');
                      setShowReelForm(false);
                      fetchReelsList();
                      onRefreshData();
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="bg-white p-6.5 rounded-2xl border text-xs text-stone-705 grid grid-cols-1 md:grid-cols-2 gap-5 relative animate-in slide-in-from-top-4 duration-300"
              >
                <div className="md:col-span-2 border-b pb-2">
                  <h4 className="text-sm font-serif font-black text-emerald-900 uppercase tracking-widest">
                    {editingReel ? 'Modify Existing Brand Reel' : 'Publish New Himalayan Reel Video'}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5 uppercase tracking-wider font-bold">
                    {editingReel ? 'Editing attributes of registered short video asset' : 'Provide portrait 9:16 layout mp4, kaltura or stock video links'}
                  </p>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Reel Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Swarna Swasa Woodfire Slow reduction"
                    value={reelTitle}
                    onChange={(e) => setReelTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-55 focus:bg-white focus:outline-emerald-850"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-stone-700">Video Source URL (direct .mp4 link) *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://assets.mixkit.co/videos/...mp4"
                    value={reelUrl}
                    onChange={(e) => setReelUrl(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-55 focus:bg-white focus:outline-emerald-850"
                  />
                  <span className="text-[9px] text-stone-400 block mt-1">Accepts any raw portrait MP4 stream URL.</span>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-bold text-stone-700">Scenic Tagline & Description</label>
                  <textarea
                    rows={2}
                    placeholder="Slow cooked under certified Panchagavya ghee extracts in certified copper vessels..."
                    value={reelTagline}
                    onChange={(e) => setReelTagline(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-55 focus:bg-white focus:outline-emerald-850"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-bold text-stone-700 font-mono tracking-wider text-[10px] uppercase text-amber-800">Apply to Specific Elixir Product (Optional) *</label>
                  <select
                    value={reelProductId}
                    onChange={(e) => setReelProductId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-lg text-stone-850 bg-stone-55 focus:bg-white font-semibold cursor-pointer text-stone-750"
                  >
                    <option value="">Store-wide Branding (No specific product mapping)</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{Math.round(p.price * 80)})</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="bg-emerald-900 hover:bg-emerald-950 text-white font-mono font-bold px-5 py-2.5 rounded-lg text-[11px] uppercase tracking-wider transition cursor-pointer select-none"
                  >
                    {editingReel ? 'Apply Settings' : 'Publish Video Reel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReel(null);
                      setReelTitle('');
                      setReelUrl('');
                      setReelTagline('');
                      setReelProductId('');
                      setShowReelForm(false);
                    }}
                    className="border border-stone-200 hover:bg-stone-50 text-stone-600 px-4 py-2.5 rounded-lg font-mono font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Reels Grid Manager List */}
            {loadingReels ? (
              <div className="flex justify-center p-12 text-stone-400 gap-2 items-center font-mono">
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                <span>Syncing live Vedic video streams...</span>
              </div>
            ) : reelsList.length === 0 ? (
              <div className="bg-white border rounded-2xl p-12 text-center text-stone-400">
                <p className="font-mono text-xs">No active video reels detected in server database ledger.</p>
                <p className="text-[10px] text-stone-300 mt-1">Click "Add Brand Reel" on top right to bootstrap live footage.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reelsList.map((rl) => (
                  <div key={rl.id} className="bg-white border rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs border-stone-150">
                    <div className="w-full max-w-[280px] mx-auto aspect-[9/16] relative bg-stone-900 group rounded-t-xl overflow-hidden">
                      <video
                        src={rl.url}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-left">
                        <span className="text-[10px] text-stone-300 font-mono font-semibold flex items-center gap-1">
                          <Play className="w-3 h-3 fill-white text-white" /> Vertical Player Ready
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5 text-left border-t border-stone-100 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-black text-emerald-950 text-xs tracking-wide truncate">{rl.title}</h4>
                        {rl.tagline && <p className="text-[10px] text-stone-550 line-clamp-2 leading-relaxed mt-1">{rl.tagline}</p>}
                        {rl.productId && (
                          <div className="mt-1.5">
                            <span className="text-[9px] font-mono text-amber-800 font-bold bg-amber-55 border border-amber-200/50 rounded-md px-2 py-0.5 inline-block">
                              🛍️ Linked: {products.find(p => p.id === rl.productId)?.name || 'Himalayan Elixir'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-2.5 text-[9px] font-mono text-stone-400 border-t border-stone-100 mt-3 gap-2">
                        <span className="flex items-center gap-1">❤️ {rl.likes || 120} Loves</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReel(rl);
                              setReelTitle(rl.title);
                              setReelUrl(rl.url);
                              setReelTagline(rl.tagline || '');
                              setReelProductId(rl.productId || '');
                              setShowReelForm(true);
                            }}
                            className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-emerald-100/30 font-bold"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm('Are you absolutely sure you want to remove this video reel?')) return;
                              try {
                                const res = await fetch(`/api/reels/${rl.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  fetchReelsList();
                                  onRefreshData();
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-rose-100/30"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* TAB 4: INTERACTIVE SALES GRAPHICS */}
        {activeTab === 'metrics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-emerald-900">Apothecary Sales & Revenue Suite</h3>
                <p className="text-xs text-stone-500 font-sans mt-0.5">Real-time telemetry of physical settlements, dosage orders, and coupon usage.</p>
              </div>
            </div>

            {/* KPI Metrics Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-stone-150 shadow-xs text-left">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400">Gross Sales</span>
                <p className="text-xl font-serif font-black text-emerald-955 pt-1">{formatINR(statsTotal)}</p>
                <div className="text-[9px] text-emerald-600 font-mono mt-1 font-bold">▲ 18.4% this month</div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-stone-150 shadow-xs text-left">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400">Dosage Orders</span>
                <p className="text-xl font-serif font-black text-emerald-955 pt-1">{orders.length} placed</p>
                <div className="text-[9px] text-stone-400 font-mono mt-1 font-bold">Apothecary dispatched status</div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-stone-150 shadow-xs text-left">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400">Avg Order Value (AOV)</span>
                <p className="text-xl font-serif font-black text-emerald-955 pt-1">
                  {orders.length > 0 ? formatINR(Math.round(statsTotal / orders.length)) : formatINR(0)}
                </p>
                <div className="text-[9px] text-amber-700 font-mono mt-1 font-bold">Premium cart value target reached</div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-stone-150 shadow-xs text-left">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400">Active Coupons conversions</span>
                <p className="text-xl font-serif font-black text-emerald-955 pt-1">
                  {couponsList.filter(c => c.active).length} Codes Live
                </p>
                <div className="text-[9px] text-stone-400 font-mono mt-1 font-bold">True voucher codes on sync</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Dynamic SVG Bar Chart */}
              <div className="bg-white border rounded-2xl p-6.5 shadow-sm text-left">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B58954]">Chronological Sales Chart (May 2026)</h4>
                  <span className="text-[9px] bg-stone-100 px-2 py-1 rounded-md text-stone-500 font-mono uppercase">Order Sum values</span>
                </div>
                
                {/* SVG Live Bar chart */}
                <div className="h-64 flex items-end gap-3.5 border-b border-l border-stone-200/60 p-4 pt-10 font-mono text-[10px] text-stone-400 relative">
                  {orders.length === 0 ? (
                    // Fallback visual data if orders is empty
                    <>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-[#E5DBC7] hover:bg-amber-600 h-16 rounded-t-md transition-all relative group cursor-pointer">
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-stone-900 text-amber-250 px-2 py-0.5 rounded font-mono text-[9px] font-bold z-10 whitespace-nowrap shadow-md">₹5,400</span>
                        </div>
                        <span>Wk 1</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-[#E5DBC7] hover:bg-amber-600 h-28 rounded-t-md transition-all relative group cursor-pointer">
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-stone-900 text-amber-250 px-2 py-0.5 rounded font-mono text-[9px] font-bold z-10 whitespace-nowrap shadow-md">₹9,800</span>
                        </div>
                        <span>Wk 2</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-[#E2EADA] hover:bg-[#6FA832] h-40 rounded-t-md transition-all relative group cursor-pointer">
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-stone-900 text-amber-250 px-2 py-0.5 rounded font-mono text-[9px] font-bold z-10 whitespace-nowrap shadow-md">₹14,500</span>
                        </div>
                        <span>Wk 3</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-emerald-850 h-48 rounded-t-md relative group cursor-pointer transition-all">
                          <span className="opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-955 text-amber-300 px-2 py-0.5 rounded border border-emerald-800 font-mono text-[9px] font-bold z-10 whitespace-nowrap shadow-md">₹18,205</span>
                        </div>
                        <span className="text-emerald-950 font-bold font-mono">Wk 4 (Cur)</span>
                      </div>
                    </>
                  ) : (
                    // True Dynamic order breakdown visual!
                    orders.slice(-5).map((ord, idx) => {
                      const totalVal = ord.total;
                      const maxPossible = Math.max(...orders.slice(-5).map(o => o.total), 1000);
                      const barPercentage = Math.round((totalVal / maxPossible) * 100);
                      const barHeightStyle = { height: `${Math.max(barPercentage, 10)}%` };
                      return (
                        <div key={ord.id} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-emerald-850 hover:bg-emerald-900 rounded-t-md transition-all relative group cursor-pointer"
                            style={barHeightStyle}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 transform -translate-x-1/2 bg-stone-900 text-amber-250 px-2.5 py-1 rounded font-mono text-[9px] font-bold z-10 whitespace-nowrap shadow-md text-center">
                              <div>{formatINR(totalVal)}</div>
                              <div className="text-[7px] text-stone-400 uppercase tracking-widest">{ord.id.substring(0,6)}</div>
                            </div>
                          </div>
                          <span className="text-[8px] truncate max-w-[50px] font-mono">{ord.id.substring(0,8)}</span>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <p className="text-[10px] text-stone-404 leading-relaxed font-sans mt-4 text-center">
                  ✦ May 2026 chronologic sales metrics parsed in real-time from Active orders ledger databases.
                </p>
              </div>

              {/* Therapeutic category performance */}
              <div className="bg-white border rounded-2xl p-6.5 shadow-sm space-y-4 text-left">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B58954]">Therapeutic Class Performance</h4>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-emerald-955">
                      <span>Tejas Skincare Formulas ( Oils & Balms )</span>
                      <span className="font-mono text-emerald-850">55% Distribution</span>
                    </div>
                    <div className="bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200/50">
                      <div className="bg-[#B58954] h-2 rounded-full" style={{ width: '55%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-emerald-955">
                      <span>Ojas Wellness Drops & Chyawanprash</span>
                      <span className="font-mono text-emerald-850">30% Distribution</span>
                    </div>
                    <div className="bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200/50">
                      <div className="bg-emerald-800 h-2 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-emerald-955">
                      <span>Amrit Kesh Hair Cleaners</span>
                      <span className="font-mono text-emerald-850">15% Distribution</span>
                    </div>
                    <div className="bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200/50">
                      <div className="bg-stone-850 h-2 rounded-full" style={{ width: '15%', backgroundColor: '#2d3748' }} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl text-[10px] text-stone-500 font-mono leading-relaxed uppercase mt-5 border border-stone-200">
                  ✦ Category indexes allow our extraction laboratory to synchronize saffron and bhringraj sourcing in correlation with active order loads.
                </div>
              </div>

            </div>
          </div>
        )}

          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
