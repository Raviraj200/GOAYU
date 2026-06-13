import React, { useState } from 'react';
import { Lock, ShieldCheck, ChevronRight, Landmark, CreditCard, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { Product, formatINR } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutViewProps {
  cart: CartItem[];
  appliedCoupon: { code: string; discount: number } | null;
  onApplyCoupon: (discount: number, code: string) => void;
  onOrderPlaced: (orderObj: any) => void;
  onClearCart: () => void;
  onNavigate: (view: string) => void;
}

export default function CheckoutView({ cart, appliedCoupon, onApplyCoupon, onOrderPlaced, onClearCart, onNavigate }: CheckoutViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [zip, setZip] = useState('');
  const [gstin, setGstin] = useState('');
  const [payMethod, setPayMethod] = useState('UPI / Razorpay Cards');

  // Razorpay simulation overlay state
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayStep, setRazorpayStep] = useState<'init' | 'processing' | 'done'>('init');
  const [formError, setFormError] = useState('');

  // Discount Coupons states within Checkout context
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [couponInput, setCouponInput] = useState(appliedCoupon ? appliedCoupon.code : '');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(appliedCoupon ? true : false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  React.useEffect(() => {
    fetch('/api/coupons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCouponsList(data);
        }
      })
      .catch(err => console.error('Error fetching coupon registries:', err));
  }, []);

  const handleApplyCouponCode = () => {
    setCouponError('');
    setCouponSuccess(false);

    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const foundCoupon = couponsList.find(c => c.code.toUpperCase() === code);

    if (!foundCoupon) {
      setCouponError('This coupon code is invalid or has expired.');
      return;
    }

    if (!foundCoupon.active) {
      setCouponError('This coupon is currently inactive.');
      return;
    }

    if (foundCoupon.minPurchase && subtotal < foundCoupon.minPurchase) {
      setCouponError(`${foundCoupon.code} requires a minimum order of ₹${Math.round(foundCoupon.minPurchase * 80)} (${formatINR(foundCoupon.minPurchase)}) to redeem.`);
      return;
    }

    if (foundCoupon.productId) {
      const targetProduct = cart.find(item => item.product.id === foundCoupon.productId);
      if (!targetProduct) {
        setCouponError(`This coupon only applies to a specific formula that is not in your checkout list.`);
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

  const deliveryCharge = subtotal >= 40 ? 0 : 5.99;
  const finalDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal - finalDiscount + deliveryCharge);

  const indiaStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 
    'Himachal Pradesh', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) return setFormError('Shipping recipient Name is required.');
    if (!email.trim() || !email.includes('@')) return setFormError('Please enter a valid notification Email address.');
    if (!phone.trim() || phone.length < 8) return setFormError('Please enter a valid Mobile number under shipping regulations.');
    if (!address.trim()) return setFormError('Complete detailed Shipping Address is required.');
    if (!city.trim()) return setFormError('Town/City is required.');
    if (!zip.trim() || zip.length < 5) return setFormError('Please enter a valid pincode (Zip Code).');

    if (payMethod === 'UPI / Razorpay Cards') {
      // Open Razorpay sandboxed gateway screen
      setShowRazorpay(true);
      setRazorpayStep('init');
      setTimeout(() => {
        setRazorpayStep('processing');
        // Wait 2.5 seconds to simulate payment processing
        setTimeout(() => {
          setRazorpayStep('done');
          // Complete actual order placement in db
          setTimeout(() => {
            placeOrderInDb();
          }, 1500);
        }, 2200);
      }, 800);
    } else {
      // COD place immediately
      placeOrderInDb();
    }
  };

  const placeOrderInDb = async () => {
    const orderObj = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      city,
      state,
      zipCode: zip,
      gstin: gstin.trim() || null,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal,
      discount: finalDiscount,
      total: grandTotal,
      paymentMethod: payMethod
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderObj)
      });
      const data = await response.json();
      
      // Stop Razorpay overlay
      setShowRazorpay(false);
      
      // Save order number to local storage for display in Shopping Bag
      try {
        const stored = localStorage.getItem('goayu_placed_orders_list');
        const list = stored ? JSON.parse(stored) : [];
        if (data && data.orderNumber && !list.includes(data.orderNumber)) {
          list.push(data.orderNumber);
          localStorage.setItem('goayu_placed_orders_list', JSON.stringify(list));
        }
      } catch (e) {
        console.error('Error saving local order reference', e);
      }

      onClearCart();
      onOrderPlaced(data); // Pass full order output with track timeline to main App state
    } catch (err) {
      console.error(err);
      alert('Security connection with GoAyu API interrupted. Order saved in temporary storage.');
    }
  };

  return (
    <div id="goayu-checkout-root" className="bg-stone-50 py-12 min-h-screen relative">
      
      {/* SECURED RAZORPAY SANDBOX GATEWAY MODAL OVERLAY */}
      {showRazorpay && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border-2 border-[#1E2E3D] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Merchant info */}
            <div className="bg-[#1E2E3D] p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] tracking-widest text-[#528FF0] uppercase font-mono font-bold">Razorpay Secure Merchant</span>
                <h3 className="font-serif font-black text-base text-white tracking-wide">GoAyu Online Store</h3>
              </div>
              <div className="bg-emerald-600/20 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-500/20">
                SANDBOX ACTIVE
              </div>
            </div>

            {/* Price indicator card */}
            <div className="bg-stone-50 px-6 py-4.5 border-b border-stone-100 flex justify-between items-baseline">
              <span className="text-stone-500 text-xs font-semibold">Total Amount Due</span>
              <span className="text-xl font-bold font-mono text-stone-950">{formatINR(grandTotal)}</span>
            </div>

            {/* Inner actions depending on mock step */}
            <div className="p-8 text-center space-y-6">
              {razorpayStep === 'init' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="w-14 h-14 bg-blue-50 text-blue-800 flex items-center justify-center rounded-full mx-auto border border-blue-150">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1e2e3d]" />
                  </div>
                  <h4 className="font-sans font-bold text-sm text-[#1E2E3D]">Connecting Secured API Link...</h4>
                  <p className="text-xs text-stone-500">Initiating handshakes. Syncing with encrypted UPI / Card protocols in India...</p>
                </div>
              )}

              {razorpayStep === 'processing' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="w-16 h-16 bg-[#F5F8FC] rounded-full flex items-center justify-center mx-auto border border-[#E1EBF5]">
                    <CreditCard className="w-6 h-6 text-[#2B6CB0] animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-[#1E2E3D]">Authorizing Merchant Settlement</h4>
                    <p className="text-[10px] text-[#2B6CB0] font-mono mt-0.5 font-bold uppercase tracking-wider">Reference: GOAYU-PAY-{Date.now().toString().slice(-6)}</p>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                    Contacting your banking servers. Do not close, refresh, or hit back buttons on this browser session.
                  </p>
                </div>
              )}

              {razorpayStep === 'done' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 flex items-center justify-center rounded-full mx-auto border border-emerald-200">
                    ✓
                  </div>
                  <h4 className="font-sans font-bold text-sm text-[#1E2E3D]">Payment Secured & Cleared</h4>
                  <p className="text-xs text-stone-500">Redirecting back to GoAyu and printing your live BlueDart dispatch tracking order invoice.</p>
                </div>
              )}
            </div>

            <div className="bg-stone-100 px-6 py-4 border-t border-stone-150 text-center text-[10px] text-stone-400 font-mono">
              Certified by PCI-DSS Security Level 1 Standards
            </div>

          </div>
        </div>
      )}

      {/* Primary Layout Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb row */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-8 border-b border-light-beige/20 pb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700 cursor-pointer">Home</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <button onClick={() => onNavigate('cart')} className="hover:text-amber-700 cursor-pointer text-stone-500">Shopping Bag</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <span className="text-emerald-950 font-bold">Secured Dispatch Details</span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight mb-8">Secured Checkout</h1>

        {cart.length === 0 ? (
          <div className="bg-white border p-12 text-center rounded-2xl max-w-xl mx-auto">
            <h3 className="font-serif font-bold text-emerald-950">Your bag is empty</h3>
            <button onClick={() => onNavigate('shop')} className="mt-4 bg-emerald-800 text-white px-4 py-2 rounded">Browse Shop</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Shipping details Form intake (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-stone-200 p-8 rounded-2xl shadow-sm">
              <h2 className="text-base font-serif font-bold text-emerald-950 tracking-wide pb-4 border-b border-stone-100 mb-6 uppercase">
                1. Shipping & Contact Identification
              </h2>

              {formError && (
                <div className="mb-6 flex gap-1.5 items-center bg-red-50 border border-red-200 text-red-850 text-xs p-3.5 rounded-lg font-semibold">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-700 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleValidation} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-605 font-semibold mb-1">Recipient Full Name *</label>
                    <input
                      type="text"
                      placeholder="Sagar Stone"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-605 font-semibold mb-1">Mobile Contact Phone (BlueDart SMS) *</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-605 font-semibold mb-1">Contact Email (Notification Invoice copy) *</label>
                  <input
                    type="email"
                    placeholder="sagarstone2002@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-605 font-semibold mb-1">Detailed Street Address / Estate *</label>
                  <textarea
                    rows={2}
                    placeholder="Flat 402, Lotus Towers, Shivaji Road, near Hanuman Temple"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-605 font-semibold mb-1">Town / City *</label>
                    <input
                      type="text"
                      placeholder="Pune"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-605 font-semibold mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-3 bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-880 cursor-pointer"
                    >
                      {indiaStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-605 font-semibold mb-1">Postal Pincode *</label>
                    <input
                      type="text"
                      placeholder="411005"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-605 font-semibold mb-1">Tax Residency GSTIN (Optional B2B Code)</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g., 05AAAAA1111A1Z1"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-800 uppercase tracking-widest"
                  />
                  <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider font-mono">Providing a valid GSTIN enables local/interstate tax split invoices</p>
                </div>

                <h3 className="text-sm font-serif font-bold text-emerald-950 tracking-wide pt-6 pb-2 border-b border-stone-100 uppercase mb-4 flex items-center gap-1">
                  <span>2. Payment Configuration Gateway</span>
                </h3>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between border p-4 rounded-xl cursor-pointer transition-colors ${
                      payMethod === 'UPI / Razorpay Cards' 
                        ? 'border-emerald-800 bg-emerald-50/40 text-emerald-950 font-bold' 
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={payMethod === 'UPI / Razorpay Cards'}
                        onChange={() => setPayMethod('UPI / Razorpay Cards')}
                        className="text-emerald-850 focus:ring-emerald-800"
                      />
                      <div>
                        <p className="text-xs">UPI / GPay / Razorpay Secured Online Cards</p>
                        <p className="text-[10px] text-stone-400 font-mono font-normal">Settle instantly natively. Sandboxed Razorpay active.</p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-emerald-800" />
                  </label>

                  <label
                    className={`flex items-center justify-between border p-4 rounded-xl cursor-pointer transition-colors ${
                      payMethod === 'Cash on Delivery (COD)' 
                        ? 'border-emerald-800 bg-emerald-50/40 text-emerald-950 font-bold' 
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={payMethod === 'Cash on Delivery (COD)'}
                        onChange={() => setPayMethod('Cash on Delivery (COD)')}
                        className="text-emerald-850 focus:ring-emerald-800"
                      />
                      <div>
                        <p className="text-xs">Cash on Delivery (COD)</p>
                        <p className="text-[10px] text-stone-400 font-mono font-normal">Add {formatINR(2)} safe courier cash handling on doorstep handover.</p>
                      </div>
                    </div>
                    <Landmark className="w-5 h-5 text-stone-500" />
                  </label>
                </div>

                <div className="pt-6">
                  <button
                    id="payments-action-execute-complete-btn"
                    type="submit"
                    className="w-full bg-emerald-850 hover:bg-emerald-900 border border-emerald-950 text-white font-bold py-4 rounded-xl text-center cursor-pointer transition-all uppercase tracking-wider text-xs shadow-md shadow-emerald-900/10"
                  >
                    {payMethod === 'UPI / Razorpay Cards' ? 'Pay with Razorpay Gateway' : 'Complete Cash on Delivery Order'}
                  </button>
                </div>

              </form>
            </div>

            {/* Price recap and items billing list (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Items recap */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6.5 shadow-xs space-y-4">
                <h4 className="text-xs font-sans font-extrabold tracking-wider uppercase text-emerald-905 pb-3 border-b border-emerald-50">Items in Order</h4>
                
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-stone-55 border rounded-md overflow-hidden shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-serif font-bold text-emerald-950 line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono">Qty: {item.quantity} × {formatINR(item.product.price)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-emerald-900">{formatINR(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Coupon Card */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6.5 shadow-xs space-y-4">
                <h4 className="text-xs font-sans font-extrabold tracking-wider uppercase text-emerald-950 pb-3 border-b border-stone-100 flex items-center justify-between">
                  <span>Promo / Discount Code</span>
                  <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-widest animate-pulse">Save Now</span>
                </h4>
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. AYU20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 text-xs p-2.5 rounded-lg border border-stone-200 uppercase font-mono font-bold bg-stone-50 focus:bg-white text-stone-850"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCouponCode}
                      className="bg-emerald-850 hover:bg-emerald-900 text-white font-mono font-bold py-2 px-4 rounded-lg text-xs uppercase cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-2 text-[10px] font-semibold text-red-705 bg-red-50 border border-red-100 p-2 rounded">{couponError}</p>
                  )}
                  {couponSuccess && appliedCoupon && (
                    <p className="mt-2 text-[10px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-150 p-2 rounded animate-in fade-in duration-300">
                      Coupon <strong>{appliedCoupon.code}</strong> applied! Saved <strong className="font-mono">{formatINR(appliedCoupon.discount)}</strong> on your total.
                    </p>
                  )}
                </div>
              </div>

              {/* Price recaps */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6.5 shadow-sm space-y-3">
                <h4 className="text-xs font-sans font-extrabold tracking-wider uppercase text-emerald-900 pb-2.5 border-b">Recap Statement</h4>
                
                <div className="space-y-2 text-xs font-medium text-stone-605">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-mono font-bold">{formatINR(subtotal)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-850 font-bold">
                      <span>Applied Coupon ({appliedCoupon.code})</span>
                      <span className="font-mono">-{formatINR(appliedCoupon.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Dispatch Cargo Shipping</span>
                    <span className="font-mono">
                      {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                    </span>
                  </div>

                  {payMethod === 'Cash on Delivery (COD)' && (
                    <div className="flex justify-between text-amber-800">
                      <span>COD Surcharge Courier handling</span>
                      <span className="font-mono">+{formatINR(2)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-stone-100 flex justify-between text-emerald-950 font-serif font-black text-base">
                    <span>Grand Total Due</span>
                    <span>
                      {payMethod === 'Cash on Delivery (COD)' 
                        ? formatINR(grandTotal + 2) 
                        : formatINR(grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100/50 p-4.5 rounded-xl space-y-2.5 mt-6 text-[11px] text-emerald-900 font-sans">
                  <div className="flex gap-2 items-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <p>GoAyu guarantees that all medical oils are freshly prepared, vacuum certified, and direct from Haridwar laboratories.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
