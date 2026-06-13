import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AyuBot from './components/AyuBot';
// Views
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailView from './views/ProductDetailView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import BlogView from './views/BlogView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import OrderTrackerView from './views/OrderTrackerView';
import MyOrdersView from './views/MyOrdersView';
import AdminDashboardView from './views/AdminDashboardView';
import LoginView from './views/LoginView';
import WishlistView from './views/WishlistView';
import TermsView from './views/TermsView';
import RefundsView from './views/RefundsView';

import { Product, Category, Blog, HeroBanner, Review, Reel } from './types';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewArgs, setViewArgs] = useState<any>({});
  
  // Database datasets loaded from Express
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);
  const [loading, setLoading] = useState(true);

  // Authenticated user state
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('goayu_user_session') || 'Vaidya Dr. Raghav';
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('goayu_user_email') || 'dr_raghav@goayu.in';
  });

  // Cart state persisted inside localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('goayu_cart');
    return cached ? JSON.parse(cached) : [];
  });

  // Wishlist state initialized from localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const cached = localStorage.getItem('goayu_wishlist');
    return cached ? JSON.parse(cached) : [];
  });

  // Persists wishlist
  useEffect(() => {
    localStorage.setItem('goayu_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx > -1) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleOrderNow = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = Math.min(product.stock, next[idx].quantity + qty);
        return next;
      }
      return [...prev, { product, quantity: qty }];
    });
    handleNavigate('checkout');
  };

  // Applied promo coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Initial fetch of API endpoints
  useEffect(() => {
    fetchDatabase();

    // Verify secure session token on mounting
    const token = localStorage.getItem('goayu_user_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Expired');
      })
      .then(data => {
        if (data.success && data.user) {
          setUserName(data.user.name);
          setUserEmail(data.user.phone || data.user.email);
          localStorage.setItem('goayu_user_session', data.user.name);
          localStorage.setItem('goayu_user_email', data.user.phone || data.user.email);
        }
      })
      .catch(() => {
        // Token is decayed or tampered with, cleanse storage
        localStorage.removeItem('goayu_user_token');
        localStorage.removeItem('goayu_user_session');
        localStorage.removeItem('goayu_user_email');
        setUserName(null);
        setUserEmail(null);
      });
    }
  }, []);

  const fetchDatabase = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes, blogsRes, bannerRes, reelsRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()).catch(err => {
          console.error('Error fetching products:', err);
          return [];
        }),
        fetch('/api/categories').then(r => r.json()).catch(err => {
          console.error('Error fetching categories:', err);
          return [];
        }),
        fetch('/api/blogs').then(r => r.json()).catch(err => {
          console.error('Error fetching blogs:', err);
          return [];
        }),
        fetch('/api/hero-banner').then(r => r.json()).catch(err => {
          console.error('Error fetching hero banner:', err);
          return null;
        }),
        fetch('/api/reels').then(r => r.json()).catch(err => {
          console.error('Error fetching reels:', err);
          return [];
        })
      ]);

      setProducts(Array.isArray(prodsRes) ? prodsRes : []);
      setCategories(Array.isArray(catsRes) ? catsRes : []);
      setBlogs(Array.isArray(blogsRes) ? blogsRes : []);
      setHeroBanner((bannerRes && !bannerRes.error) ? bannerRes : {
        id: 'h1',
        title: 'Experience Pure Ayurvedic Alchemy',
        subtitle: '100% Organic formulas cooked over slow flame using Kashmiri Saffron, Bhringraj and Swarna Bhasma to bring you back into absolute balance.',
        bgImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
        ctaText: 'Shop the Ayurvedic Elixirs',
        link: 'shop',
        showTraditionalWisdom: true
      });
      setReels(Array.isArray(reelsRes) ? reelsRes : []);
    } catch (err) {
      console.error('Failed to handshake with database endpoints. Using local backup.', err);
    } finally {
      setLoading(false);
    }
  };

  // Persists cart
  useEffect(() => {
    localStorage.setItem('goayu_cart', JSON.stringify(cart));
  }, [cart]);

  const handleNavigate = (view: string, args: any = {}) => {
    setCurrentView(view);
    setViewArgs(args);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const handleLoginSuccess = (name: string, email: string, token?: string) => {
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem('goayu_user_session', name);
    localStorage.setItem('goayu_user_email', email);
    if (token) {
      localStorage.setItem('goayu_user_token', token);
    }
  };

  const handleLogout = () => {
    setUserName(null);
    setUserEmail(null);
    localStorage.removeItem('goayu_user_session');
    localStorage.removeItem('goayu_user_email');
    localStorage.removeItem('goayu_user_token');
    setCurrentView('home');
  };

  // Cart Management
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = Math.min(product.stock, next[idx].quantity + 1);
        return next;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleAddToCartWithQty = (product: Product, qty: number) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = Math.min(product.stock, next[idx].quantity + qty);
        return next;
      }
      return [...prev, { product, quantity: qty }];
    });
    handleNavigate('cart');
  };

  const handleUpdateQty = (productId: string, qty: number) => {
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const handleApplyCoupon = (discount: number, code: string) => {
    setAppliedCoupon({ code, discount });
  };

  // Updates reviews inside database and state
  const handleUpdateProductReviews = async (productId: string, updatedReviews: Review[]) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: updatedReviews })
      });
      if (response.ok) {
        // Refresh local memory table
        fetchDatabase();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Redirection on completed payment orders
  const handleOrderPlaced = (placedOrder: any) => {
    handleNavigate('tracker', { orderNumber: placedOrder.orderNumber });
  };

  if (loading || !heroBanner) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-800 border-t-transparent animate-spin" />
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-950 uppercase animate-pulse">
          Opening Sacred GoAyu Dispensary...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500/25 relative overflow-hidden bg-stone-50 text-emerald-800">
      {/* Organic Background Accents matching the Warm Organic / Cultural theme */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-100/40 -z-10 pointer-events-none" />
      <div className="absolute top-10 -left-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-amber-100/25 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      {/* 1. Header Layout navigation */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        currentView={currentView}
        onNavigate={handleNavigate}
        userName={userName}
        onLogout={handleLogout}
        isAdmin={userEmail === 'ravirajji1234@gmail.com' || userEmail === 'dr_raghav@goayu.in' || userName === 'Ravirajji Admin' || userName === 'Vaidya Dr. Raghav'}
        banner={heroBanner}
      />

      {/* 2. Main content switch routing controller */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView
            banner={heroBanner}
            products={products}
            categories={categories}
            blogs={blogs}
            reels={reels}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlist.map(p => p.id)}
            onOrderNow={handleOrderNow}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            categories={categories}
            initialCategoryFilter={viewArgs.category || 'all'}
            initialSearchText={viewArgs.search || ''}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlist.map(p => p.id)}
            onOrderNow={handleOrderNow}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailView
            productId={viewArgs.id}
            allProducts={products}
            onNavigate={handleNavigate}
            onAddToCartWithQty={handleAddToCartWithQty}
            onUpdateProductReviews={handleUpdateProductReviews}
            onOrderNow={handleOrderNow}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onOrderNow={handleOrderNow}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <ContactView onNavigate={handleNavigate} />
        )}

        {currentView === 'terms' && (
          <TermsView />
        )}

        {currentView === 'refunds' && (
          <RefundsView />
        )}

        {currentView === 'blog' && (
          <BlogView
            blogs={blogs}
            initialSelectedId={viewArgs.selectedId || null}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
            onApplyCoupon={handleApplyCoupon}
            appliedCoupon={appliedCoupon}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cart={cart}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onOrderPlaced={handleOrderPlaced}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'tracker' && (
          <OrderTrackerView
            initialSearchNumber={viewArgs.orderNumber || ''}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'my-orders' && (
          <MyOrdersView
            onNavigate={handleNavigate}
            currentUserEmail={userEmail}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            products={products}
            categories={categories}
            blogs={blogs}
            onRefreshData={fetchDatabase}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 3. Global Footer controls */}
      <Footer onNavigate={handleNavigate} />

      {/* 4. Global Floating widgets */}
      <AyuBot onSuggestProduct={(pid) => handleNavigate('product', { id: pid })} onNavigateToShop={() => handleNavigate('shop')} />

    </div>
  );
}
