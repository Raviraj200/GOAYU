import { Heart, ShieldCheck, Award, Leaf } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="goayu-footer" className="bg-emerald-950 border-t border-emerald-900 text-emerald-100">
      {/* Trust Badges Bar */}
      <div className="border-b border-emerald-900 bg-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 mb-3 text-amber-500">
                <Leaf className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">100% Natural</p>
              <p className="text-xs text-emerald-400 mt-1">Sourced from Himalayan foothill farmers.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 mb-3 text-amber-500">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">Ayurvedic Formula</p>
              <p className="text-xs text-emerald-400 mt-1">Prescribed in clinical Ashtanga Hridaya texts.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 mb-3 text-amber-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">Chemical & Cruelty-Free</p>
              <p className="text-xs text-emerald-400 mt-1">Zero sulfates, parabens, or toxins.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 mb-3 text-amber-500">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">Made in India</p>
              <p className="text-xs text-emerald-400 mt-1">GMP & AYUSH ministry standard certified.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4 h-[40px]">
              <Logo className="h-10 text-white animate-pulse-slow [&_img]:w-[100px] [&_img]:h-auto [&_img]:max-w-none [&_.text-stone-900]:text-white [&_.text-stone-400]:text-emerald-300 [&_.bg-emerald-50]:bg-emerald-900/50 [&_.text-emerald-800]:text-amber-400 [&_.border-emerald-100]:border-emerald-800" />
            </div>
            <p className="text-sm text-emerald-300 leading-relaxed">
              Authentic wellness for the modern lifestyle. We fuse ancient organic chemistry with contemporary safety standards to elevate physical energy, mental silence, and dermal youth.
            </p>
            <p className="text-xs text-emerald-400 mt-4 font-mono">
              Tagline: "100% Natural Wellness"
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Pages</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="text-emerald-300 hover:text-amber-500 transition-colors cursor-pointer text-left">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="text-emerald-300 hover:text-amber-500 transition-colors cursor-pointer text-left">
                  Shop
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-emerald-300 hover:text-amber-500 transition-colors cursor-pointer text-left">
                  Our Heritage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="text-emerald-300 hover:text-amber-500 transition-colors cursor-pointer text-left">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-emerald-300 hover:text-amber-500 transition-colors cursor-pointer text-left">
                  Get in Touch
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Support & Trust</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('tracker')} className="text-emerald-300 hover:text-amber-500 transition-colors cursor-pointer text-left font-semibold text-amber-500">
                  Track All Orders ➔
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-emerald-300 hover:text-amber-500 transition-colors cursor-pointer text-left block">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refunds')} className="text-emerald-300 hover:text-amber-500 transition-colors cursor-pointer text-left block">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <span className="text-emerald-300 block">FDA & AYUSH Disclaimers</span>
              </li>

            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">India Head Office</h3>
            <p className="text-sm text-emerald-300 leading-relaxed mb-2">
              GoAyu Organic Apothecary,<br />
              Banda, Sagar, Madhya Pradesh - 470335
            </p>
            <p className="text-sm text-emerald-300">
              Email: <span className="text-amber-500">support@goayu.co.in</span>
            </p>
            <p className="text-sm text-emerald-300 mt-1">
              Call: <span className="text-emerald-400 font-mono">+91-9644985389</span>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-900/80 text-center text-xs text-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} GoAyu Organic Herbals Private Limited. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Made under sacred formulas for <Heart className="w-3 h-3 text-amber-500 fill-amber-500 inline" /> Absolute Health.
          </p>
        </div>
      </div>
    </footer>
  );
}
