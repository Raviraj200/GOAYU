import React, { useState, useEffect } from 'react';
import { Trash2, Lock, Tag, ChevronRight, CheckCircle, Package, Clock, Truck, Eye } from 'lucide-react';
import { Product, formatINR } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartViewProps {
  cart: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (view: string, args?: any) => void;
  onApplyCoupon: (discount: number, code: string) => void;
  appliedCoupon: { code: string; discount: number } | null;
}

export default function CartView({ cart, onUpdateQty, onRemoveItem, onNavigate, onApplyCoupon, appliedCoupon }: CartViewProps) {
  const [couponInput, setCouponInput] = useState(appliedCoupon ? appliedCoupon.code : '');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(appliedCoupon ? true : false);

  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [couponsList, setCouponsList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dynamic coupon entries
    fetch('/api/coupons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCouponsList(data);
        }
      })
      .catch(err => console.error('Error fetching coupon registries:', err));

    const fetchUserOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          const allOrders = Array.isArray(data) ? data : [];
          const loggedInEmail = localStorage.getItem('goayu_user_email')?.trim().toLowerCase() || '';
          
          let storedList: string[] = [];
          try {
            const storedStr = localStorage.getItem('goayu_placed_orders_list');
            storedList = storedStr ? JSON.parse(storedStr) : [];
          } catch (e) {
            console.error(e);
          }

          const matched = allOrders.filter((o: any) => {
            const isEmailMatch = loggedInEmail && o.customerEmail && o.customerEmail.trim().toLowerCase() === loggedInEmail;
            const isLocalListMatch = o.orderNumber && storedList.includes(o.orderNumber);
            return isEmailMatch || isLocalListMatch;
          });
          
          // Order matched by latest placed first
          setPastOrders(matched.reverse());
        }
      } catch (err) {
        console.error('Error fetching customer orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchUserOrders();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    // Find custom coupon code from dynamic list
    const foundCoupon = couponsList.find(c => c.code.toUpperCase() === code);

    if (!foundCoupon) {
      setCouponError('This coupon code is invalid or has expired.');
      return;
    }

    if (!foundCoupon.active) {
      setCouponError('This coupon is currently inactive.');
      return;
    }

    // Minimum purchase requirement check
    if (foundCoupon.minPurchase && subtotal < foundCoupon.minPurchase) {
      setCouponError(`${foundCoupon.code} requires a minimum order of $${foundCoupon.minPurchase}. Add more elixirs!`);
      return;
    }

    // Product specific coupon check
    if (foundCoupon.productId) {
      const targetProduct = cart.find(item => item.product.id === foundCoupon.productId);
      if (!targetProduct) {
        setCouponError(`This coupon only applies to a specific elixir that is not in your cart.`);
        return;
      }

      let discountAmount = 0;
      if (foundCoupon.discountType === 'percentage') {
        discountAmount = Number(((targetProduct.product.price * targetProduct.quantity) * (foundCoupon.discountValue / 100)).toFixed(2));
      } else {
        discountAmount = Math.min(foundCoupon.discountValue, targetProduct.product.price * targetProduct.quantity);
      }

      onApplyCoupon(discountAmount, foundCoupon.code);
      setCouponSuccess(true);
    } else {
      // General store-wide coupon
      let discountAmount = 0;
      if (foundCoupon.discountType === 'percentage') {
        discountAmount = Number((subtotal * (foundCoupon.discountValue / 100)).toFixed(2));
      } else {
        discountAmount = foundCoupon.discountValue;
      }

      onApplyCoupon(discountAmount, foundCoupon.code);
      setCouponSuccess(true);
    }
  };

  const deliveryCharge = subtotal >= 40 || subtotal === 0 ? 0 : 5.99;
  const finalDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal - finalDiscount + deliveryCharge);

  return (
    <div id="goayu-cart-root" className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-8 border-b border-light-beige/20 pb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700 cursor-pointer">Home</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <span className="text-emerald-950 font-bold">Your Ayurvedic Herb Bag</span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight mb-8">Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-105">
              👜
            </div>
            <h3 className="font-serif font-semibold text-lg text-emerald-950">Your Bag is Empty</h3>
            <p className="text-xs text-stone-500 my-2 leading-relaxed">
              Pranam! You have not loaded any slowly cooked Ayurvedic elixirs inside your container yet. Balance starts with healthy habits.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="mt-6 bg-emerald-800 hover:bg-emerald-900 border border-emerald-950 text-white text-xs font-bold px-6 py-3 rounded-lg cursor-pointer transition-colors shadow-sm uppercase tracking-wider"
            >
              Browse Products Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Col (8) - Items table list */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white border border-stone-200 rounded-2xl p-4.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="flex items-center gap-4">
                    <div className="w-18 h-18 rounded-lg bg-stone-55 overflow-hidden shrink-0 border border-stone-200">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-extrabold text-emerald-950 leading-snug line-clamp-2 max-w-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5 uppercase tracking-wider">
                        {item.product.category} Formulation
                      </p>
                      <p className="text-[11px] font-bold text-amber-700 mt-1">{formatINR(item.product.price)} each</p>
                    </div>
                  </div>

                  {/* Quantity modifier and subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6.5 pt-4 sm:pt-0 border-t sm:border-0 border-stone-100">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1))}
                        className="py-1 px-3 text-stone-500 hover:bg-stone-50 font-bold cursor-pointer"
                      >
                        −
                      </button>
                      <span className="font-mono text-xs px-2.5 font-bold text-emerald-950">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                        className="py-1 px-3 text-stone-500 hover:bg-stone-50 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right shrink-0 min-w-[70px]">
                      <p className="text-xs text-stone-400 font-mono">Row Total</p>
                      <p className="text-sm font-bold text-emerald-950 font-serif">{formatINR(item.product.price * item.quantity)}</p>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 text-stone-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-4.5 rounded-xl">
                <span className="text-xs text-emerald-950 font-medium">Want free shipping across India?</span>
                <span className="text-xs font-bold text-emerald-900">
                  {subtotal >= 40 
                    ? '✓ You qualified for Free Shipping!' 
                    : `Add ${formatINR(40 - subtotal)} more for Free Shipping.`}
                </span>
              </div>
            </div>

            {/* Right Col (4) - Billing Summary */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Promo Coupon Form */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-3 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-800" />
                  <span>Promo / Blessing Codes</span>
                </h4>
                
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    id="cart-coupon-input"
                    type="text"
                    placeholder="Enter AYU20 or OJAS10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:bg-white bg-stone-50 uppercase font-mono font-bold"
                  />
                  <button
                    id="cart-coupon-apply-btn"
                    type="submit"
                    className="bg-emerald-850 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-[10px] text-red-700 mt-2 font-semibold">✗ {couponError}</p>
                )}
                {couponSuccess && appliedCoupon && (
                  <p className="text-[10px] text-emerald-800 mt-2 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>✓ Coupon {appliedCoupon.code} applied successfully! Received {formatINR(appliedCoupon.discount)} off.</span>
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-stone-50 font-mono text-[9px] text-stone-400 uppercase tracking-widest text-center">
                  Try "AYU20" for 20% off • "OJAS10" for {formatINR(10)} flat off
                </div>
              </div>

              {/* Order bill recap */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6.5 shadow-sm space-y-4">
                <h4 className="text-xs font-sans font-extrabold tracking-wider uppercase text-emerald-905 pb-3 border-b border-stone-100">Order Summary</h4>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-stone-605">
                    <span>Herbal Bag Subtotal</span>
                    <span className="font-mono">{formatINR(subtotal)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>Discount Blessing ({appliedCoupon.code})</span>
                      <span className="font-mono">-{formatINR(appliedCoupon.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-605">
                    <span>Guaranteed Safe Delivery Cargo</span>
                    <span className="font-mono">
                      {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-between text-emerald-950 font-serif font-extrabold text-base">
                    <span>Grand Net Total</span>
                    <span>{formatINR(grandTotal)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    id="cart-proceed-checkout-btn"
                    onClick={() => onNavigate('checkout')}
                    className="w-full bg-emerald-850 hover:bg-emerald-900 border border-emerald-950 text-white font-bold py-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 text-xs tracking-wider uppercase shadow-md"
                  >
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Proceed to Secured Checkout</span>
                  </button>

                  <button
                    onClick={() => onNavigate('shop')}
                    className="w-full bg-stone-50 hover:bg-stone-100 text-[#4E3922] border border-stone-200 font-bold py-3 rounded-xl cursor-pointer text-xs"
                  >
                    Continue Sourcing Herbs
                  </button>
                </div>

                <div className="text-[10px] text-center text-stone-400 font-mono pt-4 border-t border-stone-50">
                  Secured by AES-256 SSL Encryption layer
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Past Placed Orders Integration in Shopping Bag */}
        <div className="mt-16 border-t border-stone-200 pt-10">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-emerald-800 animate-bounce-slow" />
            <h2 className="text-xl font-serif font-black text-emerald-950 uppercase tracking-tight">Your Placed Orders ({pastOrders.length})</h2>
          </div>

          {loadingOrders ? (
            <div className="bg-white border rounded-2xl p-6 text-center animate-pulse text-xs text-stone-500 font-bold font-mono">
              Synchronizing with compounding dispensary...
            </div>
          ) : pastOrders.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center text-xs text-stone-500 italic">
              No previous orders recorded for this browser session. Place your first organic order to see active trackers here!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastOrders.map((o) => (
                <div key={o.id || o.orderNumber} className="bg-white border border-stone-200 hover:border-emerald-805 rounded-2xl p-5 shadow-xs space-y-3.5 transition-all">
                  <div className="flex justify-between items-start border-b pb-3 border-stone-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">ORDER REFERENCE</span>
                      <p className="font-serif font-bold text-emerald-950 text-sm">{o.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">NET VALUE</span>
                      <p className="font-mono text-xs font-black text-emerald-900">{formatINR(o.total)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] text-stone-400 font-mono font-semibold uppercase tracking-wider">Status</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full border mt-1 ${
                        o.status === 'delivered' ? 'bg-emerald-50 text-emerald-850 border-emerald-100' :
                        o.status === 'shipped' ? 'bg-blue-50 text-blue-850 border-blue-100' :
                        o.status === 'processing' ? 'bg-amber-50 text-amber-850 border-amber-100' :
                        'bg-stone-50 text-stone-605 border-stone-200'
                      }`}>
                        {o.status === 'delivered' ? <CheckCircle className="w-3 h-3 shrink-0" /> : <Clock className="w-3 h-3 shrink-0 animate-pulse" />}
                        <span>{o.status || 'pending'}</span>
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] text-stone-400 font-mono font-semibold uppercase tracking-wider">Formulas</p>
                      <p className="font-bold text-stone-800 mt-1">{o.items?.length || 0} preparations</p>
                    </div>
                  </div>

                  {/* Tiny Item Thumbnails row */}
                  {o.items && o.items.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto py-1 border-t border-stone-50">
                      {o.items.map((item: any, idx: number) => (
                        <div key={idx} className="relative w-8 h-8 border rounded-md overflow-hidden shrink-0 group" title={item.name}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-100 flex justify-between items-center bg-stone-50/50 -mx-5 -mb-5 p-3 px-5 rounded-b-2xl">
                    <span className="text-[10px] text-stone-400 font-mono">Date: {o.addedAt ? new Date(o.addedAt).toLocaleDateString() : 'Recent Session'}</span>
                    <button
                      onClick={() => onNavigate('tracker', { orderNumber: o.orderNumber })}
                      className="bg-emerald-900 hover:bg-emerald-950 text-white font-mono font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-emerald-950 transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track Progress</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
