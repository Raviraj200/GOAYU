import React from 'react';
import { ShieldCheck, Scale } from 'lucide-react';

export default function TermsView() {
  return (
    <div id="terms-view-root" className="bg-stone-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-stone-200 shadow-xl rounded-3xl p-8 sm:p-12 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-100">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-850 rounded-full flex items-center justify-center mx-auto border shadow-inner">
            <Scale className="w-6 h-6 text-emerald-800" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-emerald-955 tracking-tight">Terms & Conditions</h1>
          <p className="text-stone-400 font-mono text-[10px] uppercase tracking-widest">Last Updated: May 2026</p>
        </div>

        {/* Content */}
        <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-serif font-extrabold text-emerald-955 uppercase tracking-wide">1. Sacred Wellness & Intent</h3>
            <p>
              Welcome to GoAyu Organic Herbals. By using this website, you agree to comply with our commercial terms and spiritual intent. Everything presented here is intended to help rebalance your bio-energies (Vata, Pitta, Kapha) through pure, non-chemical formulations.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-serif font-extrabold text-emerald-955 uppercase tracking-wide">2. Clinical & Medical Disclaimer</h3>
            <p>
              GoAyu is compliant with the Ministry of AYUSH guidelines. Our botanical elixirs, facial oils, and advanced reductions are crafted strictly in GMP-governed apothecary labs. However, website reviews, general dosha checklists, and botanical product outlines are for educational awareness and are not a substitute for standard clinical medical consultation.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-serif font-extrabold text-emerald-955 uppercase tracking-wide">3. Commercial Checkout & Shipping Alignment</h3>
            <p>
              We prioritize premium delivery streams across India using BlueDart and Shiprocket integrations. While we endeavor to dispatch all orders within 24 hours of checkout, certain seasonal herbal extractions (such as Woodfired Chyawanprash cooked during crop cycles) are subject to slow maturity times. If delays arise, customer desk supports will reach out directly.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-serif font-extrabold text-emerald-955 uppercase tracking-wide">4. User Authenticator Verification</h3>
            <p>
              Clients creating profiles on our website are verified via one-time SMS OTP verification. You are responsible for ensuring your active contact credentials are valid. We reserve the right to limit or terminate profiles engaged in checkout disruptions.
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
