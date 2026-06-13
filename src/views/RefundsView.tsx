import React from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function RefundsView() {
  return (
    <div id="refunds-view-root" className="bg-stone-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-stone-200 shadow-xl rounded-3xl p-8 sm:p-12 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-105">
          <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto border shadow-inner">
            <RefreshCw className="w-6 h-6 text-amber-850" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-emerald-955 tracking-tight">Return & Refund Policy</h1>
          <p className="text-stone-400 font-mono text-[10px] uppercase tracking-widest">Last Updated: May 2026</p>
        </div>

        {/* Content */}
        <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-serif font-extrabold text-emerald-955 uppercase tracking-wide">1. Purity Guarantee & Hygiene Standards</h3>
            <p>
              Due to the holy, chemical-free and bio-organic nature of our apothecary formulas (including Kumkumadi oils, Shirodhara essences, and advanced herbal reductions), opened or unsealed bottles cannot be returned for reuse. This ensures absolute hygiene standards and biological safety across our entire patron circle.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-serif font-extrabold text-emerald-955 uppercase tracking-wide">2. 7-Day Unopened Returns Window</h3>
            <p>
              If your elixir is unopened, in its original luxury packaging, with seals intact, you are eligible to initiate a return or exchange within **7 days** from delivery. Please prepare a short video of the package showing the intact outer seal and reach out to our active WhatsApp helpline (+91-9644985389) or support email.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-serif font-extrabold text-emerald-955 uppercase tracking-wide">3. Damage & Leaks in Transit</h3>
            <p>
              Since we package GoAyu elixirs in premium protective amber glass vials to isolate bio-active nutrients from UV degradation, rare physical breaks can occur. If your formulation arrives damaged or leaking, please send us pictures of the broken delivery parcel. We will dispatch a pristine fresh bottle via fast BlueDart transport instantly at zero charge!
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-serif font-extrabold text-emerald-955 uppercase tracking-wide">4. Payment Gateway Refunds</h3>
            <p>
              Once your return is verified at our Central Address and cleared by physical quality desks, we will reverse the charge. Secure gateway refunds are credited back to the original source (UPI, PayTM, or Card) within **3 to 5 banking days**.
            </p>
          </section>
        </div>

        <div className="text-stone-400 font-mono text-[10px] text-center pt-4 border-t border-stone-105">
          <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1" />
          <span>GOAYU BOTANICAL HEALTH STANDARDS PROTECTION INC.</span>
        </div>
      </div>
    </div>
  );
}
