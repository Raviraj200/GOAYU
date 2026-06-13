import { useState, useEffect } from 'react';
import { Search, Compass, MessageSquare, Info, ShieldCheck, ShoppingCart, Loader2, Download } from 'lucide-react';
import { Order, formatINR } from '../types';

interface OrderTrackerViewProps {
  initialSearchNumber?: string;
  onNavigate: (view: string) => void;
}

export default function OrderTrackerView({ initialSearchNumber = '', onNavigate }: OrderTrackerViewProps) {
  const [orderQuery, setOrderQuery] = useState(initialSearchNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto look-up if initialized with order number
  useEffect(() => {
    if (initialSearchNumber) {
      handleLookup(initialSearchNumber);
    }
  }, [initialSearchNumber]);

  const handleLookup = async (qNumber: string) => {
    if (!qNumber.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      const response = await fetch('/api/orders');
      const orders: Order[] = await response.json();
      
      const found = orders.find(
        (o) => 
          o.orderNumber.toUpperCase() === qNumber.trim().toUpperCase() ||
          o.id.toUpperCase() === qNumber.trim().toUpperCase() ||
          (o.trackingId && o.trackingId.toUpperCase() === qNumber.trim().toUpperCase())
      );

      if (found) {
        setOrder(found);
      } else {
        setErrorMsg(`We cannot locate order '${qNumber}' inside our current dispatch records. Verify spelling or check your invoice inbox!`);
      }
    } catch (err) {
      setErrorMsg('Endpoint connection anomaly. Please verify if dev server is fully compiled.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (timeline: any[]) => {
    const completedCount = timeline.filter((t) => t.completed).length;
    return (completedCount / timeline.length) * 100;
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

  return (
    <div id="goayu-tracker-root" className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header Titles */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">Real-time Delivery Logs</span>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight">Track Your Ayurvedic Order</h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            All GoAyu packages are prepared fresh at Haridwar gardens. Enter your registered order number to view certified processing timelines.
          </p>
        </div>

        {/* Action Lookup bar */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6.5 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="tracker-order-number-input"
                type="text"
                placeholder="Ex: AYU-05240 or your newly generated number"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full text-xs p-3.5 pl-10 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white uppercase font-mono font-bold text-stone-800"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3 top-3.5" />
            </div>
            
            <button
              id="tracker-lookup-btn"
              onClick={() => handleLookup(orderQuery)}
              disabled={loading || !orderQuery.trim()}
              className="bg-emerald-850 hover:bg-emerald-900 px-6 py-3.5 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-40 transition-colors shrink-0 flex items-center justify-center gap-2 uppercase tracking-wide border border-emerald-950"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Locate Dispatch</span>
              )}
            </button>
          </div>

          <p className="text-[10px] text-stone-400 font-mono mt-3 uppercase tracking-widest text-center">
            Default sandbox record available for lookup: <strong className="text-emerald-950 underline cursor-pointer font-bold font-mono" onClick={() => {
              setOrderQuery('AYU-05240');
              handleLookup('AYU-05240');
            }}>AYU-05240</strong>
          </p>

          {errorMsg && (
            <div className="mt-5 bg-red-50 border border-red-150 p-4 rounded-xl text-xs text-red-800 font-sans tracking-wide">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Tracking Details Display View */}
        {order ? (
          <div className="bg-white border border-light-beige/40 rounded-2xl p-8 shadow-md space-y-8 animate-in fade-in duration-300">
            
            {/* Upper grid panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-100">
              <div>
                <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block">Official Invoice Register</span>
                <p className="font-serif font-black text-xl text-emerald-950 flex items-center gap-2">
                  <span>Order Number:</span>
                  <span className="text-amber-700 font-mono">{order.orderNumber}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(order)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl px-4 py-3 font-bold font-mono text-[10px] uppercase tracking-wider flex items-center gap-2 cursor-pointer transition select-none"
                  title="Download Official PDF-Style Invoice"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice (GST)</span>
                </button>

                <div className="bg-emerald-50 text-emerald-950 rounded-xl p-3 border border-emerald-100 text-right shrink-0">
                  <span className="text-[10px] uppercase font-mono tracking-wide text-emerald-700 font-bold block">Grand Settle Sum</span>
                  <span className="font-serif font-extrabold text-base">{formatINR(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Progress line */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-500 font-semibold">
                <span>Shipping Progress Baseline</span>
                <span className="font-mono text-emerald-950 font-bold">{Math.round(calculateProgress(order.trackingTimeline))}% Completed</span>
              </div>
              <div className="bg-stone-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-700 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(order.trackingTimeline)}%` }}
                />
              </div>
            </div>

            {/* Vertical Milestones Feed */}
            <div className="space-y-8 pt-4">
              <h3 className="text-xs font-sans font-extrabold tracking-wider text-emerald-950 uppercase border-b border-stone-50 pb-2">BLUE-DART INTEGRATIVE CARGO TIMELINE</h3>

              <div className="relative border-l border-emerald-250 ml-3 pl-8 space-y-8 pb-1">
                {order.trackingTimeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    
                    {/* Circle Bullet */}
                    <div
                      className={`absolute -left-11.5 top-0 w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-bold leading-none ${
                        step.completed
                          ? 'bg-emerald-700 border-emerald-800 text-white shadow-md'
                          : 'bg-stone-50 border-stone-300 text-stone-400'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>

                    {/* Step description detail */}
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className={`text-xs font-sans font-bold uppercase tracking-wider ${step.completed ? 'text-emerald-950 font-extrabold' : 'text-stone-400 font-semibold'}`}>
                          {step.label}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-mono">{step.date}</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">{step.description}</p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Customers shipping records block */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-150 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-stone-605">
              <div>
                <p className="font-bold text-emerald-950 mb-1">Shipping Destination Patron</p>
                <p className="font-semibold text-stone-800">{order.customerName}</p>
                <p>{order.shippingAddress}, {order.city}</p>
                <p>{order.state} - {order.zipCode}</p>
              </div>
              
              <div>
                <p className="font-bold text-emerald-950 mb-1">Billing Specifications</p>
                <p>Notification Mail: <span className="font-semibold text-stone-850">{order.customerEmail}</span></p>
                <p>Settlement Method: <span className="font-semibold text-stone-850">{order.paymentMethod}</span></p>
                <p>Dispatch Status: <span className="uppercase text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{order.status}</span></p>
              </div>
            </div>

          </div>
        ) : (
          !loading && (
            <div className="bg-emerald-900 border border-emerald-950 p-6.5 text-[#F5E6D3] rounded-2xl text-center space-y-3 shadow-md">
              <ShieldCheck className="w-8 h-8 text-amber-550 mx-auto" />
              <h3 className="font-serif font-bold text-white tracking-wide">Sacred Haridwar Heritage</h3>
              <p className="text-xs text-emerald-200 max-w-md mx-auto leading-relaxed">
                All bottles are packed with fresh tamper labels and insulated boxes to sustain bio-active terpenes in heavy climates across standard post transits.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}
