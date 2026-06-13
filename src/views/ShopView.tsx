import { Search, Star, SlidersHorizontal, CheckCircle2, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Product, Category, formatINR } from '../types';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  initialCategoryFilter?: string;
  initialSearchText?: string;
  onNavigate: (view: string, extraArgs?: any) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: string[];
  onOrderNow?: (product: Product) => void;
}

export default function ShopView({
  products,
  categories,
  initialCategoryFilter = 'all',
  initialSearchText = '',
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOrderNow
}: ShopViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [activeImages, setActiveImages] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState<string>(initialSearchText);
  const [sortBy, setSortBy] = useState<string>('featured');

  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setSelectedSubCategory('all');
  };

  // Subcategories specific to parent categories
  const subCategoriesData = useMemo(() => {
    if (selectedCategory === 'skincare') {
      return [
        { slug: 'all', name: 'All Skin' },
        { slug: 'face-oils', name: 'Facial Oils' },
        { slug: 'cleansers', name: 'Purifying Cleansers' }
      ];
    } else if (selectedCategory === 'haircare') {
      return [
        { slug: 'all', name: 'All Hair' },
        { slug: 'hair-oils', name: 'Therapeutic Oils' },
        { slug: 'shampoos', name: 'Shampoos & Tonics' }
      ];
    } else if (selectedCategory === 'wellness') {
      return [
        { slug: 'all', name: 'All Wellness' },
        { slug: 'immunity', name: 'Immunity & Ojas' },
        { slug: 'digestion', name: 'Digestion & Agni' }
      ];
    }
    return [];
  }, [selectedCategory]);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Subcategory Filter
    if (selectedCategory !== 'all' && selectedSubCategory !== 'all') {
      result = result.filter(p => p.subCategory === selectedSubCategory);
    }

    // Search text Filter
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.tagline.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    // Sort Handler
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, selectedSubCategory, searchText, sortBy]);

  return (
    <div id="goayu-shop-root" className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700 cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 stroke-[3px]" />
          <span className="text-emerald-950 font-bold">GoAyu Apothecary Shop</span>
        </div>

        {/* Title Intro */}
        <div className="border-b border-light-beige/30 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
            <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">slow-cooked organic wellness</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-emerald-950 tracking-tight">The Ayurvedic Herbarium</h1>
            <p className="text-xs text-stone-600 font-sans leading-relaxed max-w-xl">
              Restore biological humors with pure, cold-pressed oils, adaptogenic dropping tinctures, and swarna bhasma restorative jams constructed under certified Vaidya protocols.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>100% Saffron, Bhringraj, & adaptogens verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FILTERS CONTROLS (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Input Box */}
            <div className="bg-white border border-stone-200 rounded-xl p-4.5 shadow-xs">
              <h4 className="text-xs font-bold tracking-wide uppercase text-emerald-950 mb-3 block">Organic Search</h4>
              <div className="relative">
                <input
                  id="shop-product-search-input"
                  type="text"
                  placeholder="Seach saffron, bhringraj..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full text-xs p-3 pl-9 border border-stone-200 rounded-lg text-stone-850 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:bg-white bg-stone-50"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Category selection */}
            <div className="bg-white border border-stone-200 rounded-xl p-4.5 shadow-xs">
              <h4 className="text-xs font-bold tracking-wide uppercase text-emerald-950 mb-3 block">Therapeutic Linages</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleSelectCategory('all')}
                  className={`w-full text-left font-sans text-xs p-2.5 px-3 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-950 border-emerald-950 text-white font-bold'
                      : 'bg-stone-50 border-stone-150 hover:bg-stone-100 text-stone-750'
                  }`}
                >
                  <span>All Preparations</span>
                  <span className="font-mono text-[10px] opacity-70">({products.length})</span>
                </button>
                
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.slug).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.slug)}
                      className={`w-full text-left font-sans text-xs p-2.5 px-3 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCategory === cat.slug
                          ? 'bg-emerald-950 border-emerald-950 text-white font-bold'
                          : 'bg-stone-50 border-stone-150 hover:bg-stone-100 text-stone-750'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="font-mono text-[10px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Selection */}
            <div className="bg-white border border-stone-200 rounded-xl p-4.5 shadow-xs">
              <h4 className="text-xs font-bold tracking-wide uppercase text-emerald-950 mb-3 block">Order Sequence</h4>
              <select
                id="shop-product-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs p-3 border border-stone-200 rounded-lg text-stone-850 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:bg-white bg-stone-50"
              >
                <option value="featured">Vaidya Featured Choice</option>
                <option value="rating">Highest Star Rating</option>
                <option value="price-asc">Price: Low to Radiant High</option>
                <option value="price-desc">Price: High to Modest Low</option>
              </select>
            </div>

            {/* Safety Trust banner info */}
            <div className="bg-emerald-900 border border-emerald-950 text-white p-5 rounded-2xl space-y-3">
              <h5 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">GoAyu Security Cert</h5>
              <p className="text-[11px] leading-relaxed text-emerald-250">
                All containers feature holographic tamper seals. Bottles are medical amber glass to protect herbal volatile terpenes from sunlight oxidation.
              </p>
            </div>

          </div>

          {/* RIGHT PRODUCTS LIST (9 cols) */}
          <div className="lg:col-span-9">
            
            {/* Sub-categories Selection Tabs */}
            {selectedCategory !== 'all' && subCategoriesData.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 px-1 animate-in fade-in duration-350">
                <span className="text-[11px] uppercase font-mono font-bold text-stone-500 mr-1.5">Sub-Categories:</span>
                {subCategoriesData.map((sub) => (
                  <button
                    key={sub.slug}
                    onClick={() => setSelectedSubCategory(sub.slug)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSubCategory === sub.slug
                        ? 'bg-emerald-800 text-white border-emerald-950 shadow-md scale-[1.02]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-700/30 hover:bg-emerald-50/15 hover:text-emerald-900'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
            
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center shadow-xs">
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <h3 className="font-serif font-bold text-lg text-emerald-900">No Formulations Located</h3>
                <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  We currently do not possess anyslow-cooked entries matching your exact filters. Try adjusting search keywords of active ingredients.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchText('');
                  }}
                  className="mt-6 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Reset Apothecary Search
                </button>
              </div>
            ) : (
              <>
                {/* Result count metadata */}
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-xs text-stone-500 font-medium">
                    Showing <strong className="text-emerald-950 font-semibold">{filteredProducts.length}</strong> luxurious formulations
                  </span>
                  
                  {selectedCategory !== 'all' && (
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      Category: {selectedCategory}
                    </span>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white border border-light-beige/25 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div
                        className="relative h-56 bg-stone-100 p-2 overflow-hidden cursor-pointer"
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
                        
                        {prod.price < prod.originalPrice && (
                          <span className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow">
                            OFFER: {Math.round((1 - prod.price / prod.originalPrice) * 100)}% OFF
                          </span>
                        )}

                        {onToggleWishlist && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWishlist(prod);
                            }}
                            className="absolute bottom-3 left-3 p-1.5 bg-white/95 backdrop-blur-xs rounded-full border border-stone-150 shadow-xs hover:bg-white text-stone-700 cursor-pointer transition-transform hover:scale-110"
                            title="Toggle Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${wishlistIds.includes(prod.id) ? 'fill-rose-550 text-rose-550' : 'text-stone-400 hover:text-rose-550'}`} />
                          </button>
                        )}

                        <div className="absolute top-4 right-4 bg-emerald-950/80 backdrop-blur-md text-[#F5E6D3] text-[9px] font-mono font-bold px-2.5 py-1 rounded border border-emerald-850">
                          {prod.category.toUpperCase()}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-stone-500 mb-1.5">
                            <div className="flex text-amber-500 text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.round(prod.rating) ? 'fill-amber-550 text-amber-500' : 'text-stone-200'}`} />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono font-semibold">({prod.reviewsCount})</span>
                          </div>

                          <h3
                            onClick={() => onNavigate('product', { id: prod.id })}
                            className="hidden sm:block font-serif font-semibold text-emerald-950 text-base leading-snug cursor-pointer hover:text-amber-850 transition-colors tracking-tight"
                          >
                            {prod.name}
                          </h3>
                          
                          <p className="text-xs text-stone-600 font-sans italic">
                            {prod.tagline}
                          </p>

                          {/* 5 Option Product Using Points */}
                          {prod.usagePoints && prod.usagePoints.length > 0 && (
                            <div className="mt-2 bg-stone-50 border border-stone-105 p-2 rounded-lg text-[10px] text-stone-500 space-y-1">
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

                          <p className="text-[11px] text-stone-450 line-clamp-3 leading-relaxed pt-1.5 font-medium">
                            {prod.description.split(/\s+/).length > 37
                              ? prod.description.split(/\s+/).slice(0, 37).join(' ') + '... more than'
                              : prod.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-stone-55 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-base font-bold text-emerald-950 font-serif">{formatINR(prod.price)}</span>
                              {prod.originalPrice > prod.price && (
                                <span className="text-[11px] text-stone-400 line-through pl-1.5 font-mono">{formatINR(prod.originalPrice)}</span>
                              )}
                            </div>
                            
                            {!prod.stock && (
                              <span className="text-[10px] font-mono font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wide">
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
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
