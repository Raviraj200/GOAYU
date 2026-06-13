import { Shield, Sparkles, Award, HeartHandshake, ChevronRight, Check } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div id="goayu-about-root" className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb row */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-8 border-b border-light-beige/20 pb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700 cursor-pointer">Home</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <span className="text-emerald-950 font-bold">Our Heritage & Integrity</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-amber-700 text-xs font-mono font-bold tracking-widest uppercase block">ESTD. 2012 • SACRED BIOLOGICAL ALCHEMY</span>
            <h1 className="text-4xl sm:text-5xl font-serif font-black text-emerald-950 tracking-tight leading-tight">
              Honoring Sacred Ayurvedic Chemistry
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              At **GoAyu**, we believe modern wellness does not require newly synthesized artificial chemicals. Our ancestors spent ages mapping the biological attributes of roots, flowers, and metallic micro-crystals to support the absolute vital life force, **Ojas**.
            </p>
            <p className="text-xs sm:text-sm text-stone-605 leading-relaxed max-w-xl">
              We cultivate our raw ingredients under certified standard fair-trade partnerships with tribal forest dwellers in organic Himalayan valleys. Each leaf of Bhringraj, saffron thread, and amla gooseberry is handpicked under astrological lunar guidelines to protect vital active prana.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative p-3 border-4 border-amber-600/25 bg-emerald-900/45 rounded-2xl overflow-hidden aspect-video shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"
                alt="Ayurvedic Preparation"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Brand Values Grid */}
        <div className="bg-white border border-stone-200 rounded-3xl p-10 shadow-sm mb-20">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-700 font-bold">The Four Precepts</span>
            <h2 className="text-2xl font-serif font-bold text-emerald-950">How GoAyu Formulates Products</h2>
            <div className="w-12 h-0.5 bg-amber-650 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-105">
              <div className="w-10 h-10 bg-emerald-100/50 rounded-full flex items-center justify-center text-emerald-800 border border-emerald-150">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-sans font-bold text-emerald-950 uppercase tracking-wide">1. Handpicked Prana</h3>
              <p className="text-xs text-stone-500 leading-relaxed">We source wild herbs during correct lunar cycles so the leaf contains the maximum active volatile terpenes.</p>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-105">
              <div className="w-10 h-10 bg-emerald-100/50 rounded-full flex items-center justify-center text-emerald-800 border border-emerald-150">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-sans font-bold text-emerald-950 uppercase tracking-wide">2. 12-Hour Slow Embers</h3>
              <p className="text-xs text-stone-500 leading-relaxed">No high-heat industrial flash boilers. We cook copper decoctions slowly over herbal embers for pure botanical extraction.</p>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-105">
              <div className="w-10 h-10 bg-emerald-100/50 rounded-full flex items-center justify-center text-emerald-800 border border-emerald-150">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-sans font-bold text-emerald-950 uppercase tracking-wide">3. Swarna Bhasma Bio-Gold</h3>
              <p className="text-xs text-stone-500 leading-relaxed">Incorporating certified bioavailable gold and silver dust particles to trigger swift cellular regeneration.</p>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-105">
              <div className="w-10 h-10 bg-emerald-100/50 rounded-full flex items-center justify-center text-emerald-800 border border-emerald-150">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-sans font-bold text-emerald-950 uppercase tracking-wide">4. Fair Trade Sourcing</h3>
              <p className="text-xs text-stone-500 leading-relaxed">We settle direct revenues with our small cooperative farmers in Haridwar and Kashmiri valleys with pride.</p>
            </div>
          </div>
        </div>

        {/* Certification standards with checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-12">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#B58954] uppercase bg-amber-50 px-2.5 py-1 rounded border border-amber-200">regulatory assurances</span>
            <h3 className="text-2xl font-serif font-extrabold text-emerald-950 tracking-tight mt-3 mb-5 leading-tight">Certified Safe, Scientifically Standardized</h3>
            
            <p className="text-xs text-stone-605 leading-relaxed mb-6">
              While we preserve classical sacred recipes, we deploy pristine modern clinical cleanrooms. Each batch is double-checked for heavy metal indexes, microbiological activity, and purity.
            </p>

            <div className="space-y-3.5 text-xs text-stone-850 font-sans">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-105 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</div>
                <span>100% WHO-GMP compliant manufacturing environment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-105 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</div>
                <span>Certified by the Ministry of AYUSH, Government of India</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-105 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</div>
                <span>Certified Pure Kashmiri Kashmiri Saffron filments only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-105 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</div>
                <span>Zero sulfate surfactants (SLES/SLS), artificial silicones, or parabens</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 border border-emerald-950 p-8 rounded-3xl text-white relative overflow-hidden">
            <h4 className="font-serif font-bold text-lg text-white mb-2">Our Haridwar Apothecary Sourcing</h4>
            <div className="w-12 h-1 bg-amber-500 mb-5 rounded-full" />
            <p className="text-xs leading-relaxed text-emerald-200 mb-6 font-sans">
              For any doubts regarding your biological humor (Doshas) or order configurations, you can reach out to our active in-house clinical experts.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-amber-600 hover:bg-amber-700 text-emerald-950 font-bold px-5 py-3 rounded-xl text-xs cursor-pointer tracking-wider uppercase"
            >
              Contact Our Research Center
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
