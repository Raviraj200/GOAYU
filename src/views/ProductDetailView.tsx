import { ChevronRight, ShieldCheck, HeartPulse, Award, Info, RefreshCw, ShoppingCart, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Product, Review, formatINR } from '../types';
import ReviewSystem from '../components/ReviewSystem';

interface ProductDetailViewProps {
  productId: string;
  allProducts: Product[];
  onNavigate: (view: string, extraArgs?: any) => void;
  onAddToCartWithQty: (product: Product, quantity: number) => void;
  onUpdateProductReviews: (productId: string, updatedReviews: Review[]) => void;
  onOrderNow?: (product: Product, quantity: number) => void;
}

export default function ProductDetailView({
  productId,
  allProducts,
  onNavigate,
  onAddToCartWithQty,
  onUpdateProductReviews,
  onOrderNow
}: ProductDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'usage'>('benefits');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const product = allProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="bg-stone-50 min-h-screen py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-light-beige">
          <Info className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif font-bold text-lg text-emerald-950">Formulation Not Found</h3>
          <p className="text-xs text-stone-600 mt-2">The requested GoAyu therapy could not be fetched from the database registry.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="mt-6 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            Return to Herbarium
          </button>
        </div>
      </div>
    );
  }

  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const fullReview: Review = {
      ...newReviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [fullReview, ...product.reviews];
    onUpdateProductReviews(product.id, updated);
  };

  const triggerAddToCart = () => {
    setAddedAnimation(true);
    onAddToCartWithQty(product, qty);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div id="goayu-product-detail-root" className="bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-8 border-b border-light-beige/25 pb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700 cursor-pointer">Home</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <button onClick={() => onNavigate('shop')} className="hover:text-amber-700 cursor-pointer text-stone-500">Shop Elixirs</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <span className="text-emerald-950 font-bold overflow-hidden text-ellipsis max-w-[200px] whitespace-nowrap">{product.name}</span>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
                    {/* LEFT: Image Frame & Trust seals (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-3 rounded-2xl border border-light-beige/30 shadow-sm relative aspect-square overflow-hidden">
              <img
                src={activeImg || product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl shadow-inner cursor-zoom-in"
                referrerPolicy="no-referrer"
              />
              {product.stock <= 10 && product.stock > 0 && (
                <span className="absolute top-6 left-6 bg-amber-600 border border-amber-500 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide animate-pulse">
                  Scarce Batch: Only {product.stock} Left
                </span>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-white text-stone-800 font-mono font-bold text-xs p-3 rounded-xl uppercase tracking-wider shadow-lg border border-stone-200">
                    Apothecary Restocking
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnail Row */}
            {(() => {
              const allImages = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean)));
              if (allImages.length > 1) {
                return (
                  <div className="flex flex-wrap gap-2.5 justify-center mt-3 scale-[1.02] transform">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImg(imgUrl)}
                        className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                          (activeImg || product.image) === imgUrl
                            ? 'border-emerald-800 scale-105 shadow-md ring-1 ring-emerald-800'
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

            {/* Standard trust badges card on product page */}
            <div className="bg-white border border-light-beige/40 p-5 rounded-2xl grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-stone-700">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h6 className="text-[11px] font-bold font-sans text-emerald-950 uppercase tracking-wide">100% Organic</h6>
                  <p className="text-[10px] text-stone-500">Zero artificial fragrances.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <Award className="w-5 h-5 text-emerald-750 shrink-0" />
                <div>
                  <h6 className="text-[11px] font-bold font-sans text-emerald-950 uppercase tracking-wide">Made in India</h6>
                  <p className="text-[10px] text-stone-500">GMP certified compounding.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <HeartPulse className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h6 className="text-[11px] font-bold font-sans text-emerald-950 uppercase tracking-wide">Ayurvedic Text</h6>
                  <p className="text-[10px] text-stone-500">Sourced from Haridwar.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <RefreshCw className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h6 className="text-[11px] font-bold font-sans text-emerald-950 uppercase tracking-wide">Return Guarantee</h6>
                  <p className="text-[10px] text-stone-500">Within 7 days return option.</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Detailed purchase controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                GoAyu Therapeutic Line: {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 tracking-tight leading-tight pt-1">
                {product.name}
              </h1>
              <p className="text-sm text-stone-600 font-sans italic font-medium">
                “{product.tagline}”
              </p>
            </div>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-2 text-xs border-b border-light-beige/25 pb-4">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="font-bold text-emerald-950">{product.rating} Rating Stars</span>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500 underline cursor-pointer" onClick={() => {
                const el = document.getElementById('product-review-system');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>{product.reviews.length} Verified Patron Feedbacks</span>
            </div>

            {/* Price section */}
            <div className="bg-stone-100 p-4.5 rounded-xl flex items-center justify-between border border-stone-200/50">
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-mono tracking-wider font-bold">Standard Price</p>
                <div className="flex items-baseline space-x-2.5 mt-0.5">
                  <span className="text-2xl font-serif font-bold text-emerald-950">{formatINR(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through font-mono">{formatINR(product.originalPrice)}</span>
                  )}
                </div>
              </div>
              
              {product.originalPrice > product.price && (
                <div className="bg-emerald-900 text-white font-mono text-[10px] p-2 rounded-lg font-bold border border-emerald-950">
                  SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}% NOW
                </div>
              )}
            </div>

            {/* Primary description */}
            <p className="text-xs text-stone-650 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Quantity select & Add Bag */}
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-stone-105">
                <div className="flex items-center border border-stone-200 rounded-xl bg-white overflow-hidden max-w-max">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-3 px-4 font-bold text-stone-500 hover:bg-stone-50 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-mono text-sm px-4 font-bold text-emerald-950">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="p-3 px-4 font-bold text-stone-500 hover:bg-stone-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
                  <button
                    id="checkout-trigger-add-btn"
                    onClick={triggerAddToCart}
                    className="flex-1 bg-gradient-to-r from-stone-100 to-stone-200 hover:from-stone-200 hover:to-stone-300 text-[#0F172A] font-bold py-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wide border"
                  >
                    {addedAnimation ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        <span>Securing inside Bag...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4.5 h-4.5 text-emerald-800" />
                        <span>Add {qty} to Bag • {formatINR(product.price * qty)}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOrderNow ? onOrderNow(product, qty) : triggerAddToCart()}
                    className="flex-1 bg-gradient-to-r from-emerald-850 to-emerald-950 hover:from-emerald-950 hover:to-emerald-955 text-white font-serif font-black py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider border border-emerald-950"
                  >
                    <Sparkles className="w-4.5 h-4.5 text-amber-300 fill-amber-300" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs font-semibold text-amber-900 font-mono uppercase tracking-wide">
                Awaiting Slow-cooked Harvest: Out of Stock
              </div>
            )}

            {/* Multi-Tab Information (Benefits, Ingredients, Usage) */}
            <div className="border border-stone-200 rounded-xl bg-white shadow-xs overflow-hidden pt-4">
              <div className="flex border-b border-stone-200 text-xs font-mono font-bold uppercase tracking-wider px-4 gap-4">
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`pb-3 border-b-2 cursor-pointer ${
                    activeTab === 'benefits' ? 'border-amber-600 text-amber-700 font-extrabold' : 'border-transparent text-stone-450 hover:text-emerald-950'
                  }`}
                >
                  Therapeutic Benefits
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-3 border-b-2 cursor-pointer ${
                    activeTab === 'ingredients' ? 'border-amber-600 text-amber-700 font-extrabold' : 'border-transparent text-stone-450 hover:text-emerald-950'
                  }`}
                >
                  Ingredients & Formulas
                </button>
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`pb-3 border-b-2 cursor-pointer ${
                    activeTab === 'usage' ? 'border-amber-600 text-amber-700 font-extrabold' : 'border-transparent text-stone-450 hover:text-emerald-950'
                  }`}
                >
                  Usage Instructions
                </button>
              </div>

              <div className="p-5.5 min-h-[140px] text-xs leading-relaxed text-stone-650">
                {activeTab === 'benefits' && (
                  <ul className="space-y-2">
                    {product.benefits.map((ben, i) => (
                      <li key={i} className="flex items-start gap-1.5 font-medium text-emerald-950">
                        <span className="text-amber-500 font-bold">✓</span>
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'ingredients' && (
                  <ul className="space-y-2">
                    {product.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-1.5 font-medium text-emerald-950">
                        <span className="text-amber-500 font-bold">✦</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'usage' && (
                  <div className="space-y-3 font-medium text-emerald-950">
                    <p>{product.usage}</p>
                    <div className="bg-stone-50 p-3 rounded-lg text-[10px] text-stone-500 font-mono leading-relaxed uppercase border border-stone-105">
                      ⚠️ Medical Disclaimer: Consult Vaidya support in Dr. Ayu chat module if experiencing active fever imbalances or metabolic conditions before high daily intake.
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* REVIEWS INTEGRATION MODULE (Under) */}
        <div className="border-t border-stone-200 pt-12">
          <ReviewSystem reviews={product.reviews} onAddReview={handleAddReview} />
        </div>

      </div>
    </div>
  );
}
