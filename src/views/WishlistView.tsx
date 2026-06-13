import React, { useState } from 'react';
import { Product, formatINR } from '../types';
import { Heart, ShoppingBag, ArrowLeft, Fuel, Sparkles } from 'lucide-react';

interface WishlistViewProps {
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOrderNow: (product: Product) => void;
  onNavigate: (view: string, args?: any) => void;
}

export default function WishlistView({
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOrderNow,
  onNavigate
}: WishlistViewProps) {
  const [activeImages, setActiveImages] = useState<Record<string, string>>({});
  
  // Truncate helper description to 37 words (Target 9)
  const truncateDesc = (desc: string, maxWords: number = 37) => {
    const words = desc.split(/\s+/);
    if (words.length <= maxWords) return desc;
    return words.slice(0, maxWords).join(' ') + '... more than';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-350">
      
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 mb-10 gap-4">
        <div>
          <button
            onClick={() => onNavigate('shop')}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-900 font-bold uppercase tracking-wider mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Elixirs</span>
          </button>
          <h1 className="text-3xl font-serif font-black text-emerald-950 tracking-tight flex items-center gap-2">
            My Sacred Wishlist
            <Heart className="w-6 h-6 text-rose-650 fill-rose-600 animate-pulse" />
          </h1>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest font-mono">
            Your saved Ayurvedic Preparations & Treatments
          </p>
        </div>
        
        <button
          onClick={() => onNavigate('shop')}
          className="bg-emerald-800 hover:bg-emerald-900 hover:scale-[1.02] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all uppercase tracking-wider"
        >
          Explore All Botanicals
        </button>
      </div>

      {wishlist.length === 0 ? (
        /* Empty State */
        <div className="bg-white border rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6 border border-rose-100">
            <Heart className="w-10 h-10 text-rose-400" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">No Wishlisted Formulations</h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto mb-8 font-medium">
            Pranam! Tap the sacred heart icon of any organic extract, oil or face cleanser to preserve your therapy selection here for later evaluation or quick checkout.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all uppercase tracking-widest animate-pulse"
          >
            Browse GoAyu Elixirs
          </button>
        </div>
      ) : (
        /* Grid of Liked products */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-stone-200/80 hover:border-emerald-800/20 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-lg flex flex-col justify-between relative"
            >
              {/* Image & Heart Toggle button */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-50 border mb-4">
                <img
                  src={activeImages[product.id] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Interactive Thumbnail Gallery Strip */}
                {(() => {
                  const allImages = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean)));
                  if (allImages.length > 1) {
                    return (
                      <div className="absolute top-1/2 -translate-y-1/2 right-2.5 flex flex-col gap-1 bg-white/70 backdrop-blur-xs p-1 rounded-lg shadow-sm z-10">
                        {allImages.map((imgUrl, imgIdx) => (
                          <button
                            key={imgIdx}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              setActiveImages(prev => ({ ...prev, [product.id]: imgUrl }));
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImages(prev => ({ ...prev, [product.id]: imgUrl }));
                            }}
                            className={`w-5 h-5 rounded border overflow-hidden transition-all duration-200 cursor-pointer ${
                              (activeImages[product.id] || product.image) === imgUrl
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
                <div className="absolute bottom-2 left-2 right-2 bg-emerald-950/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl text-[#F5E6D3] sm:hidden flex flex-col gap-0.5 pointer-events-none border border-emerald-900/50 shadow-md z-10">
                  <h3 className="font-serif font-black text-[10px] leading-tight line-clamp-2 uppercase tracking-wide text-white">
                    {product.name}
                  </h3>
                  <span className="text-[8px] text-amber-300 font-sans italic leading-none line-clamp-1">{product.tagline}</span>
                </div>
                
                {/* Heart Toggle Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full border border-stone-100 shadow-md hover:bg-white text-rose-600 cursor-pointer transition-all hover:scale-110"
                  title="Remove from Wishlist"
                >
                  <Heart className="w-4 h-4 fill-rose-600" />
                </button>

                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-stone-100/90 backdrop-blur-xs flex items-center justify-center">
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-stone-850 text-stone-100 py-1.5 px-3 rounded-lg font-bold border border-stone-704 shadow-inner">
                      Apothecary Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Description and Info */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="hidden sm:block font-serif font-bold text-[#0D2418] text-base group-hover:text-emerald-900 transition-colors uppercase tracking-wide leading-tight">
                      {product.name}
                    </h3>
                    <span className="shrink-0 text-emerald-950 font-serif font-black text-sm text-right">
                      {formatINR(product.price)}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-amber-700 font-mono font-bold uppercase tracking-wider mb-2">
                    🌿 {product.category}
                  </p>

                  <p className="text-xs text-stone-500 leading-relaxed font-medium mb-4">
                    {truncateDesc(product.description, 37)}
                  </p>
                </div>

                {/* Actions row: Order now (Target 8) AND Add to Bag */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <button
                    disabled={product.stock <= 0}
                    onClick={() => onAddToCart(product)}
                    className="flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-[#0f172a] text-[10.5px] uppercase tracking-wider font-bold p-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    disabled={product.stock <= 0}
                    onClick={() => onOrderNow(product)}
                    className="bg-emerald-800 hover:bg-emerald-900 hover:scale-[1.02] disabled:opacity-50 text-white font-serif font-black text-[11px] uppercase tracking-wider p-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md hover:shadow-emerald-900/10"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
