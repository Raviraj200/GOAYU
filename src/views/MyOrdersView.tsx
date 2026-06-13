import React, { useState, useEffect } from 'react';
import { Search, Hash, Clock, FileText, ChevronRight, Calendar, ShoppingBag, Eye, HelpCircle } from 'lucide-react';
import { Order, formatINR } from '../types';

interface MyOrdersViewProps {
  onNavigate: (view: string, extraArgs?: any) => void;
  currentUserEmail?: string | null;
}

export default function MyOrdersView({ onNavigate, currentUserEmail }: MyOrdersViewProps) {
  const [emailInput, setEmailInput] = useState(currentUserEmail || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fetch placed orders from local storage cache + email
  useEffect(() => {
    fetchOrdersByAutoDiscovery();
  }, [currentUserEmail]);

  const fetchOrdersByAutoDiscovery = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('API server unreachable');
      const data = await response.json();
      const allOrders: Order[] = Array.isArray(data) ? data : [];

      // Read local storage cache for tracked order numbers
      let cachedNumbers: string[] = [];
      try {
        const stored = localStorage.getItem('goayu_placed_orders_list');
        cachedNumbers = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error(e);
      }

      // Filter by logged-in email, or input email, or local cache numbers
      const discovered = allOrders.filter(o => {
        const emailMatch = (currentUserEmail && o.customerEmail.toLowerCase() === currentUserEmail.toLowerCase()) || 
                           (emailInput && o.customerEmail.toLowerCase() === emailInput.trim().toLowerCase());
        const numMatch = cachedNumbers.some(num => num.toUpperCase() === o.orderNumber.toUpperCase() || num === o.id);
        return emailMatch || numMatch;
      });

      // Sort by date descending
      discovered.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
      setOrders(discovered);
      if (currentUserEmail || emailInput || cachedNumbers.length > 0) {
        setSearched(true);
      }
    } catch (err) {
      setErrorMessage('Lost connection with Vedic databases.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('Please type inside the email address field to request ledger.');
      return;
    }
    fetchOrdersByAutoDiscovery();
  };

  return (
    <div id="goayu-my-orders-root" className="bg-stone-50 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-8">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700 cursor-pointer">Home</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <span className="text-emerald-950 font-bold">My Orders Ledgers</span>
        </div>

        <div className="text-center space-y-3 mb-10">
          <span className="text-amber-600 text-xs font-mono font-bold uppercase tracking-widest block">🌿 Patrons Dispatch Registry</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-emerald-950 tracking-tight">Your Order History</h1>
          <div className="w-12 h-1 bg-amber-500 mx-auto" />
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Verify dispatch queues, trace preparation timelines, or compile invoices for your natural remedial purchases.
          </p>
        </div>

        {/* Email Lookup form */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
          <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 mb-1.5">Registered Customer Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 text-stone-850 focus:bg-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-900 hover:bg-emerald-950 text-white font-mono font-bold uppercase text-[11px] tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition select-none"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Search</span>
              </button>
            </div>
          </form>
          {errorMessage && <p className="text-red-700 text-xs font-semibold mt-3">⚠️ {errorMessage}</p>}
        </div>

        {/* Results Block */}
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent" />
            <p className="text-xs font-mono text-stone-500 uppercase tracking-widest font-bold">Unearthing historical invoice sheets...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">{orders.length} Sacred Shipments Traced</span>
              <button 
                onClick={() => onNavigate('shop')}
                className="text-[11px] text-amber-700 hover:text-amber-805 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                Buy Additional Elixirs →
              </button>
            </div>

            {orders.map((o) => (
              <div 
                key={o.id} 
                className="bg-white border rounded-2xl overflow-hidden hover:border-amber-400/55 transition-all duration-350 shadow-xs"
              >
                {/* Header row of card */}
                <div className="bg-stone-50 px-6 py-4.5 border-b border-stone-100 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                      <Hash className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div>
                      <h4 className="font-mono text-emerald-950 font-bold text-sm tracking-wide">{o.orderNumber}</h4>
                      <p className="text-[10px] text-stone-400 flex items-center gap-1 font-mono mt-0.5">
                        <Calendar className="w-3 h-3 text-stone-400" /> {o.date ? new Date(o.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Unspecified Date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {o.status === 'pending' && <span className="text-[9px] uppercase font-mono font-bold px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800">Preparation</span>}
                    {o.status === 'processing' && <span className="text-[9px] uppercase font-mono font-bold px-2.5 py-1 rounded bg-stone-100 border border-stone-300 text-stone-700">Brewing Decoctions</span>}
                    {o.status === 'shipped' && <span className="text-[9px] uppercase font-mono font-bold px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800">BlueDart Cargo</span>}
                    {o.status === 'delivered' && <span className="text-[9px] uppercase font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">Blessed & Delivered</span>}
                    {o.status === 'cancelled' && <span className="text-[9px] uppercase font-mono font-bold px-2.5 py-1 rounded bg-red-50 border border-red-200 text-red-800">Cancelled</span>}
                  </div>
                </div>

                {/* Inner detail section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-6 space-y-2">
                    <span className="text-[9px] font-mono uppercase text-stone-400 font-bold block">Purchase Summary</span>
                    {o.items && o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-stone-700 gap-4">
                        <span className="truncate max-w-[200px]">🌿 {item.name}</span>
                        <span className="font-mono text-[11px] text-stone-400 shrink-0">x {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing detail column */}
                  <div className="md:col-span-3 text-left md:text-center space-y-1">
                    <span className="text-[9px] font-mono uppercase text-stone-400 font-bold block">Grand Total Paid</span>
                    <span className="text-base font-bold font-mono text-emerald-900 block">{formatINR(o.total)}</span>
                    <span className="text-[9px] text-stone-400 block font-semibold">{o.paymentMethod}</span>
                  </div>

                  {/* Actions column */}
                  <div className="md:col-span-3 flex flex-row md:flex-col justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onNavigate('tracker', { orderNumber: o.orderNumber })}
                      className="flex-grow bg-emerald-850 hover:bg-emerald-900 border border-emerald-950 text-white font-mono font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-lg text-center cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-xs transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Trace</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searched ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-stone-400 space-y-3">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
            <p className="font-mono text-xs">No active orders found matching '{emailInput || 'this browser cache'}'.</p>
            <p className="text-[10px] text-stone-300">If you completed standard cash-on-delivery checkouts, confirm spelling or register with your correct email address.</p>
          </div>
        ) : (
          <div className="bg-white border rounded-2xl p-12 text-center text-stone-400 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <HelpCircle className="w-5 h-5 text-emerald-800" />
            </div>
            <p className="font-mono text-xs">Please provide your registered Email above to fetch your GoAyu ledger.</p>
            <p className="text-[10px] text-stone-300">We will trace any matching order profiles, invoices, and active live trackers instantaneously.</p>
          </div>
        )}

      </div>
    </div>
  );
}
