import React, { useState, useEffect } from 'react';
import { Award, Compass, MessageSquare, ShieldAlert, Sparkles, Star, ArrowRight, HeartPulse, CheckSquare, Sparkle, Leaf, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Category, Blog, HeroBanner, formatINR, Reel } from '../types';
import ReelCard from '../components/ReelCard';

interface HomeViewProps {
  banner: HeroBanner;
  products: Product[];
  categories: Category[];
  blogs: Blog[];
  reels?: Reel[];
  onNavigate: (view: string, extraArgs?: any) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: string[];
  onOrderNow?: (product: Product) => void;
}

export default function HomeView({
  banner,
  products,
  categories,
  blogs,
  reels = [],
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOrderNow
}: HomeViewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeImages, setActiveImages] = useState<Record<string, string>>({});
  const [newsEmail, setNewsEmail] = useState('');
  const [newsAlert, setNewsAlert] = useState(false);

  // Home Dosha Quiz State
  const [userDosha, setUserDosha] = useState<'Vata' | 'Pitta' | 'Kapha' | null>(null);
  const [quizScore, setQuizScore] = useState({ v: 0, p: 0, k: 0 });
  const [quizFinished, setQuizFinished] = useState(false);
  
  // Home Testimonials State
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch(err => console.error('Error fetching testimonials:', err));
  }, []);
  
  const featured = products.filter(p => p.featured).slice(0, 3);
  const bestSellers = products.filter(p => p.bestSeller).slice(0, 3);

  const faqs = [
    {
      q: "What exactly is a 'Dosha' and why does it matter?",
      a: "According to Ayurvedic sages, daily human health is governed by three primary biological forces called Doshas: Vata (air/movement), Pitta (fire/metabolism), and Kapha (earth/structure). When these humors become unbalanced due to active stress, bad eating habits, or weather, symptoms crop up. Pinpointing your dosha helps customize diets, sleeping habits, and botanical elixirs."
    },
    {
      q: "Are GoAyu products safe for long-term organic therapies?",
      a: "Absolutely! Every single bottle designed by GoAyu is 100% natural, chemical-free, paraben-free, and cruelty-free. We cook our extracts slowly over embers strictly matching classical compendium guidelines of Ashtanga Hridaya. They are certified and fully compliant under our national GMP standards."
    },
    {
      q: "What is the delivery timeline within India?",
      a: "We process and bottle under certified pristine hygiene standards in Haridwar, Uttarakhand. Standard orders dispatch through our premium cargo shipping carrier (BlueDart / DHL Air). Arrival is typically between 2 to 4 business days, and you can track your live packet status here on our platform!"
    },
    {
      q: "Do you offer physical physician consultations?",
      a: "Yes! While you are browsing our shop, you can click on our interactive AI Wellness doctor 'Dr. Ayu' inside the AyuBot drawer in the corner. For deeper queries, click 'Chat with Ayurvedic Vaidya Support' to open a live WhatsApp consultation."
    }
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      const emailToSubmit = newsEmail.trim();
      try {
        await fetch('/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToSubmit })
        });
      } catch (err) {
        console.error('Failed to submit subscription', err);
      }
      setNewsAlert(true);
      setNewsEmail('');
      setTimeout(() => setNewsAlert(false), 4500);
    }
  };

  const handleHomeQuiz = (doshaType: 'v' | 'p' | 'k') => {
    const nextScore = { ...quizScore };
    nextScore[doshaType] += 1;
    setQuizScore(nextScore);

    // Calculate dominant dosha
    let dominant: 'Vata' | 'Pitta' | 'Kapha' = 'Vata';
    const maxVal = Math.max(nextScore.v, nextScore.p, nextScore.k);
    if (nextScore.p === maxVal) dominant = 'Pitta';
    else if (nextScore.k === maxVal) dominant = 'Kapha';

    setUserDosha(dominant);
    setQuizFinished(true);
  };

  const resetHomeQuiz = () => {
    setQuizScore({ v: 0, p: 0, k: 0 });
    setUserDosha(null);
    setQuizFinished(false);
  };

  return (
    <div id="goayu-homepage-root" className="bg-stone-50 text-stone-800">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[580px] bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden flex items-center">
        {/* Ambient background flora overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img
            src={banner.bgImage}
            alt="Organic Apothecary"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400 bg-amber-550/10 border border-amber-550/20 rounded-full animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Authentic Certified Ayurveda
            </span>

            {banner.title && (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
                {banner.title}
              </h1>
            )}
            
            {banner.subtitle && (
              <p className="text-stone-300 sm:text-lg max-w-xl leading-relaxed">
                {banner.subtitle}
              </p>
            )}

            {/* Micro Trust badges */}
            <div className="grid grid-cols-3 gap-3 text-stone-200 text-xs font-mono font-semibold pt-4">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✦</span>
                <span>Ministry of AYUSH Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✦</span>
                <span>Saffron & Swarna Bhasma</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✦</span>
                <span>Zero Chemical Toxins</span>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onNavigate(banner.link || 'shop')}
                className="bg-gradient-to-r from-amber-550 to-amber-650 hover:from-amber-650 hover:to-amber-700 text-emerald-950 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide uppercase"
              >
                <span>{banner.ctaText}</span>
                <ArrowRight className="w-4 h-4 shrink-0 stroke-[3px]" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('dosha-quiz-scroller');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold px-6 py-4 rounded-xl transition-all text-sm tracking-wide text-center uppercase cursor-pointer"
              >
                Determine My Dosha
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Elegant luxury graphic frame */}
            <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl border-4 border-amber-550/20 shadow-2xl overflow-hidden p-3 bg-emerald-900/40 backdrop-blur-md">
              <img
                src={banner.cardImage || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"}
                alt={banner.cardName || "Organic Healing Apothecary"}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-emerald-950/90 border border-emerald-800/80 p-4 rounded-lg text-center backdrop-blur-lg">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold block mb-1">
                  {banner.cardLabel || "Weekly Best-Seller"}
                </span>
                <p className="font-serif font-bold text-sm text-white">
                  {banner.cardName || "Kumkumadi Facial Elixir"}
                </p>
                <button
                  onClick={() => onNavigate('shop', { search: banner.cardLink || 'Kumkumadi' })}
                  className="mt-2 text-xs font-bold text-amber-300 hover:text-white underline cursor-pointer"
                >
                  {banner.cardCtaText || "Buy with 20% discount Code AYU20"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRANDS CATEGORIES HIGHLIGHT */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">Herbal Classifications</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-emerald-950 tracking-tight">Browse GoAyu Categories</h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.slug })}
              className="group relative h-80 rounded-2xl shadow-md p-6 overflow-hidden flex flex-col justify-end cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent z-10" />
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="relative z-20 space-y-2">
                <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">GoAyu Apothecary</span>
                <h3 className="text-xl font-serif font-bold text-white tracking-wide">{cat.name}</h3>
                <p className="text-xs text-stone-300 leading-relaxed max-w-xs">{cat.description}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 pt-2 group-hover:underline">
                  Explore Formula Lineup ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (ELIXIRS) */}
      <section className="py-20 bg-stone-100 border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 mb-12">
            <div className="space-y-1">
              <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">Apothecary Specialties</span>
              <h2 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight">Our Slow-Cooked Signature Elixirs</h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-emerald-850 hover:text-amber-700 font-bold text-sm tracking-wider uppercase cursor-pointer shrink-0 flex items-center gap-1 hover:underline"
            >
              <span>View Full Herbarium</span>
              <span>➔</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-light-beige/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div
                  className="relative h-64 bg-stone-100 p-2 overflow-hidden cursor-pointer"
                  onClick={() => onNavigate('product', { id: prod.id })}
                >
                  <img
                    src={activeImages[prod.id] || prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Interactive Thumbnail Gallery Strip */}
                  {(() => {
                    const allImages = Array.from(new Set([prod.image, ...(prod.images || [])].filter(Boolean)));
                    if (allImages.length > 1) {
                      return (
                        <div className="absolute top-1/2 -translate-y-1/2 right-2.5 flex flex-col gap-1 bg-white/70 backdrop-blur-xs p-1 rounded-lg shadow-sm z-10">
                          {allImages.map((imgUrl, imgIdx) => (
                            <button
                              key={imgIdx}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setActiveImages(prev => ({ ...prev, [prod.id]: imgUrl }));
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImages(prev => ({ ...prev, [prod.id]: imgUrl }));
                              }}
                              className={`w-6 h-6 rounded border overflow-hidden transition-all duration-200 cursor-pointer ${
                                (activeImages[prod.id] || prod.image) === imgUrl
                                  ? 'border-emerald-800 scale-110 shadow-xs ring-1 ring-emerald-800'
                                  : 'border-stone-200 hover:border-emerald-600 bg-white'
                              }`}
                            >
                              <img src={imgUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                            </button>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Mobile product title overlay */}
                  <div className="absolute bottom-2 left-2 right-2 bg-emerald-950/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl text-[#F5E6D3] sm:hidden flex flex-col gap-0.5 pointer-events-none border border-emerald-900/50 shadow-md">
                    <h3 className="font-serif font-black text-[10px] leading-tight line-clamp-2 uppercase tracking-wide text-white">
                      {prod.name}
                    </h3>
                    <span className="text-[8px] text-amber-300 font-sans italic leading-none line-clamp-1">{prod.tagline}</span>
                  </div>
                  
                  {prod.bestSeller && (
                    <span className="absolute top-4 left-4 bg-amber-600 text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                      Best Seller
                    </span>
                  )}

                  {onToggleWishlist && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(prod);
                      }}
                      className="absolute bottom-3 left-3 p-1.5 bg-white/95 backdrop-blur-xs rounded-full border border-stone-150 shadow-xs hover:bg-white text-rose-600 cursor-pointer transition-transform hover:scale-110"
                      title="Toggle Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${wishlistIds.includes(prod.id) ? 'fill-rose-550 text-rose-550' : 'text-stone-400 hover:text-rose-550'}`} />
                    </button>
                  )}

                  <div className="absolute top-4 right-4 bg-emerald-950/80 backdrop-blur-md text-[#F5E6D3] text-[9px] font-mono font-bold px-2 py-1 rounded border border-emerald-850">
                    {prod.category.toUpperCase()}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-stone-500 mb-1.5">
                      <div className="flex text-amber-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(prod.rating) ? 'fill-amber-550' : 'text-stone-200'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono font-semibold">({prod.reviewsCount} reviews)</span>
                    </div>

                    <h3
                      onClick={() => onNavigate('product', { id: prod.id })}
                      className="hidden sm:block font-serif font-semibold text-emerald-950 cursor-pointer hover:text-amber-800 transition-colors tracking-tight text-lg leading-tight"
                    >
                      {prod.name}
                    </h3>
                    
                    <p className="text-xs text-stone-600 font-sans italic font-medium">
                      {prod.tagline}
                    </p>

                    {/* 5 Option Product Using Points */}
                    {prod.usagePoints && prod.usagePoints.length > 0 && (
                      <div className="mt-2.5 bg-stone-50 border border-stone-105 p-2 rounded-lg text-[10px] text-stone-500 space-y-1">
                        <p className="font-mono text-[9px] font-bold text-amber-800 uppercase tracking-widest leading-none border-b pb-1 mb-1">Guideline Usage</p>
                        <ul className="list-disc pl-3.5 space-y-0.5 text-[10px] text-stone-605">
                          {prod.usagePoints.slice(0, 5).map((pt, idx) => (
                            <li key={idx}>
                              <span className="font-medium text-stone-702">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-emerald-950 font-serif">{formatINR(prod.price)}</span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-xs text-stone-400 line-through pl-2 font-mono">{formatINR(prod.originalPrice)}</span>
                        )}
                      </div>
                      
                      {!prod.stock && (
                        <span className="text-xs font-mono font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Awaiting Restock
                        </span>
                      )}
                    </div>

                    {prod.stock > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onAddToCart(prod)}
                          className="bg-stone-100 hover:bg-stone-200 text-[#0F172A] text-xs font-bold py-2.5 rounded-lg cursor-pointer transition-colors border"
                        >
                          Add to Bag
                        </button>
                        <button
                          onClick={() => onOrderNow ? onOrderNow(prod) : onAddToCart(prod)}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white font-serif font-black text-xs py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow-emerald-900/10"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>Order Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CLINICAL PERSPECTIVE: INTERACTIVE DOSHA ANALYZER */}
      <section id="dosha-quiz-scroller" className="py-20 bg-emerald-950 text-[#F5E6D3] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#0f3521,transparent)] opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-600/30 text-amber-400 text-[10px] font-bold font-mono tracking-widest uppercase px-3 py-1 rounded-full">
                <HeartPulse className="w-3.5 h-3.5" /> Constitutional Diagnosis
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
                Discover Your Bio-Element (Dosha) State
              </h2>
              <p className="text-emerald-250 leading-relaxed max-w-lg">
                In classical Ayurveda, we don’t treat disease; we restore the individual. An excess of certain elemental codes (excess dryness, temperature, or heavy digestion) causes stress. Let’s identify your physical state and prescribe natural slow-cooked therapies immediately.
              </p>
              
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-2 text-emerald-200">
                  <span className="text-amber-400 text-sm">✦</span>
                  <p><strong className="text-white">Vata (Air & Space):</strong> Governs nerve impulses, heartbeat, and creativity. Imbalance brings chronic pacing thoughts, insomnia, and joint pain.</p>
                </div>
                <div className="flex items-start gap-2 text-emerald-200">
                  <span className="text-amber-400 text-sm">✦</span>
                  <p><strong className="text-white">Pitta (Fire & Water):</strong> Governs biochemical conversions, heat, and courage. Imbalance triggers acidity, severe skin breakouts, and temper struggles.</p>
                </div>
                <div className="flex items-start gap-2 text-emerald-200">
                  <span className="text-amber-400 text-sm">✦</span>
                  <p><strong className="text-white">Kapha (Earth & Water):</strong> Governs structure, lubricating joints, and calmness. Imbalance feeds metabolic lethargy, bloating, and respiratory congestion.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-stone-100 text-stone-800 p-8 rounded-2xl shadow-xl border border-light-beige">
              <h3 className="text-lg font-serif font-bold text-emerald-950 mb-2">Micro Dosha Self-Assessment</h3>
              <p className="text-xs text-stone-500 mb-6">Select the primary characteristic that feels most dominant in your daily baseline life:</p>

              {!quizFinished ? (
                <div className="space-y-4">
                  <div className="bg-white border border-stone-200 rounded-xl p-4.5 hover:border-amber-600/40 transition-colors shadow-xs">
                    <span className="text-[10px] bg-sky-50 text-sky-800 font-mono font-bold px-2 py-0.5 rounded border border-sky-100">VATA CHARACTERISTICS</span>
                    <p className="text-sm text-stone-800 font-medium my-2">I am structurally lean, have cool dry feet, over-think frequently, struggle with gas, and enjoy dynamic movement.</p>
                    <button
                      onClick={() => handleHomeQuiz('v')}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                    >
                      This Matches Me ➔
                    </button>
                  </div>
                  
                  <div className="bg-white border border-stone-200 rounded-xl p-4.5 hover:border-amber-600/40 transition-colors shadow-xs">
                    <span className="text-[10px] bg-red-50 text-red-800 font-mono font-bold px-2 py-0.5 rounded border border-red-100">PITTA CHARACTERISTICS</span>
                    <p className="text-sm text-stone-800 font-medium my-2">I have extreme hunger/heat capacity, warm skin, prone to breakouts, sharp temper, outstanding intelligence, and hate hot humid sun.</p>
                    <button
                      onClick={() => handleHomeQuiz('p')}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                    >
                      This Matches Me ➔
                    </button>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-4.5 hover:border-amber-600/40 transition-colors shadow-xs">
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-100">KAPHA CHARACTERISTICS</span>
                    <p className="text-sm text-stone-800 font-medium my-2">I have a strong broad frame, slow digestion, calm peace-loving thoughts, healthy solid hair, sleep long hours, and feel lazy easily.</p>
                    <button
                      onClick={() => handleHomeQuiz('k')}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                    >
                      This Matches Me ➔
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-emerald-300 text-stone-800 p-6 rounded-xl text-center shadow-lg animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-900 mb-4 border border-emerald-250">
                    <Sparkles className="w-6 h-6 text-emerald-700 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-700">Diagnosis Output</span>
                  <h4 className="text-xl font-serif font-bold text-emerald-950 mt-1 mb-2">Dominant Humor: {userDosha?.toUpperCase()}</h4>
                  
                  <p className="text-xs text-stone-600 leading-relaxed mb-6">
                    {userDosha === 'Vata' && 'We recommend pure adaptogenic warming drops (Ashwagandha drops) and deep heating herbal head massages (Amrit Kesh Booster oil) to restore sleep cycles.'}
                    {userDosha === 'Pitta' && 'We recommend cooling face washes (Tejas Glowing cleanser) and premium skin polishing oils (Kumkumadi face serum) to pacify the cellular hot temperature.'}
                    {userDosha === 'Kapha' && 'We recommend digestive colon resets (Triphala caps), active rasayanas (Ojas Advanced Chyawanprash), and restricting dairy/sugar at sunset.'}
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        const cat = userDosha === 'Vata' ? 'wellness' : userDosha === 'Pitta' ? 'skincare' : 'wellness';
                        onNavigate('shop', { category: cat });
                      }}
                      className="bg-emerald-850 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-3 rounded-lg cursor-pointer flex items-center gap-1 shadow-md"
                    >
                      Shop {userDosha} Balancers
                    </button>
                    <button
                      onClick={resetHomeQuiz}
                      className="border border-stone-200 hover:bg-stone-55 text-[#5F4B32] text-xs px-4 py-3 rounded-lg font-bold cursor-pointer"
                    >
                      Recalculate
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 4.5 NATIVE PORTRAIT REELS SECTION */}
      {reels && reels.length > 0 && banner?.showTraditionalWisdom !== false && (
        <section className="py-20 bg-stone-900 border-y border-stone-850 overflow-hidden text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-3 mb-12">
              <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-widest block">
                🌿 Live Himalayan Botanical Reels
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight">
                Traditional Wisdom in Motion
              </h2>
              <div className="w-12 h-0.5 bg-amber-500 mx-auto" />
              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed mt-2">
                Step inside Haridwar labs. Tap on any video card below to watch real demonstrations, slow-brewed herbal extracts, and Kashmiri harvestings live.
              </p>
            </div>

            <div className="relative group/slider max-w-5xl mx-auto px-4 md:px-12">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => {
                  const slider = document.getElementById('home-reels-slider');
                  if (slider) {
                    slider.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-amber-500/90 hover:bg-amber-600 hover:scale-105 active:scale-95 text-stone-950 p-3 rounded-full shadow-xl transition-all hidden md:flex items-center justify-center cursor-pointer border-2 border-stone-900"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5 stroke-[3.5px]" />
              </button>

              {/* Slider Container */}
              <div 
                id="home-reels-slider"
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-none w-full max-w-full justify-start items-stretch focus:outline-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {reels.map((reel) => (
                  <div key={reel.id} className="snap-center shrink-0 w-[240px] xs:w-[260px] sm:w-[280px]">
                    <ReelCard 
                      reel={reel} 
                      products={products}
                      onAddToCart={onAddToCart}
                    />
                  </div>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => {
                  const slider = document.getElementById('home-reels-slider');
                  if (slider) {
                    slider.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-amber-500/90 hover:bg-amber-600 hover:scale-105 active:scale-95 text-stone-950 p-3 rounded-full shadow-xl transition-all hidden md:flex items-center justify-center cursor-pointer border-2 border-stone-900"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5 stroke-[3.5px]" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. CUSTOMER TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-stone-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">Patron Gratitude</span>
            <h2 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight">Whispers of Healing</h2>
            <div className="w-12 h-0.5 bg-amber-600 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => {
              const initial = t.name ? t.name.charAt(0).toUpperCase() : '✦';
              const bgColors = ['bg-emerald-100 text-emerald-900', 'bg-amber-100 text-amber-900', 'bg-stone-100 text-emerald-900'];
              const colorClass = bgColors[idx % bgColors.length];
              return (
                <div key={t.id || idx} className="bg-white hover:bg-stone-100 p-6.5 rounded-2xl border border-light-beige/35 shadow-xs flex flex-col justify-between transition-colors">
                  <p className="text-sm text-stone-600 leading-relaxed font-sans italic">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-stone-105 pt-4">
                    <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center font-serif text-sm ${colorClass}`}>
                      {initial}
                    </div>
                    <div>
                      <h5 className="font-sans font-bold text-emerald-950 text-xs">{t.name}</h5>
                      <p className="text-[10px] text-stone-400 font-mono">{t.location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. BLOG PREVIEW SECTION */}
      <section className="py-20 bg-stone-100 border-t border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 mb-12">
            <div className="space-y-1">
              <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">Educational Apothecary</span>
              <h2 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight">Ayurvedic Sages Wisdom</h2>
            </div>
            <button
              onClick={() => onNavigate('blog')}
              className="text-emerald-850 hover:text-amber-700 font-bold text-sm tracking-wider uppercase cursor-pointer shrink-0 flex items-center gap-1 hover:underline z-10"
            >
              <span>Explore All Read-ups</span>
              <span>➔</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.slice(0, 2).map((blog) => (
              <div
                key={blog.id}
                className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-xs flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                onClick={() => onNavigate('blog', { selectedId: blog.id })}
              >
                <div className="md:w-2/5 h-48 md:h-full min-h-[180px] relative overflow-hidden bg-stone-100">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
                <div className="md:w-3/5 p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-100">{blog.category}</span>
                    <h3 className="font-serif font-bold text-base text-emerald-950 leading-snug group-hover:text-amber-800 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-4 border-t border-stone-50 mt-4">
                    <span>{blog.author}</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">Answering Doubts</span>
          <h2 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight">Ancient Wisdom Clarified</h2>
          <div className="w-12 h-0.5 bg-amber-600 mx-auto" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left p-5 px-6 font-serif font-bold text-sm text-emerald-950 flex justify-between items-center hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-amber-600 font-mono text-lg font-bold ml-4 pr-1">
                  {activeFaq === i ? '−' : '+'}
                </span>
              </button>
              
              {activeFaq === i && (
                <div className="p-5 px-6 pt-0 border-t border-stone-50 text-xs text-stone-600 leading-relaxed font-sans bg-stone-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER SUBSCRIPTION */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white text-center relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1200"
            alt="Organic Apothecary Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-2xl px-4 space-y-5 flex flex-col items-center">
          <Leaf className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Receive Ayurvedic Blessing Letters</h3>
          <p className="text-emerald-200 text-xs sm:text-sm max-w-md leading-relaxed mx-auto">
            Subscribe to get weekly recipes, dietary recommendations for different seasons (Ritu Charya), coupon resets, and product launch invitations.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 w-full max-w-md">
            <input
              id="newsletter-email-input"
              type="email"
              placeholder="Enter your personal email..."
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white focus:text-stone-900 border border-emerald-800 focus:outline-none px-4 py-3 rounded-lg text-xs placeholder-emerald-300 font-medium transition-all"
              required
            />
            <button
              id="newsletter-subscribe-btn"
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-emerald-950 font-bold px-6 py-3 rounded-lg text-xs cursor-pointer tracking-wider uppercase"
            >
              Subscribe Truly
            </button>
          </form>

          {newsAlert && (
            <div className="bg-amber-100 border border-amber-300 text-emerald-950 text-xs px-4 py-2.5 rounded-lg font-bold tracking-wide mt-4">
              ✓ Pranam! You have been successfully enrolled under GoAyu wellness updates. Check your inbox soon.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
