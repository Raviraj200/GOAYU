import { useState } from 'react';
import { User, Clock, ArrowLeft, Heart, MessageSquare, ChevronRight } from 'lucide-react';
import { Blog } from '../types';

interface BlogViewProps {
  blogs: Blog[];
  initialSelectedId?: string | null;
  onNavigate: (view: string) => void;
}

export default function BlogView({ blogs, initialSelectedId = null, onNavigate }: BlogViewProps) {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(initialSelectedId);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const filteredBlogs = blogs.filter(b => {
    if (categoryFilter === 'all') return true;
    return b.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const activeBlog = blogs.find(b => b.id === selectedBlogId);

  const toggleLike = (id: string) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (activeBlog) {
    return (
      <div id="goayu-blog-reader" className="bg-stone-50 py-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          {/* Back button */}
          <button
            onClick={() => setSelectedBlogId(null)}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-950 font-bold mb-8 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-stone-400 stroke-[3px]" />
            <span>Return to Apothecary Library</span>
          </button>

          <article className="space-y-6">
            
            {/* Header tags */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {activeBlog.category} Sages Wisdom
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-emerald-950 tracking-tight leading-snug">
                {activeBlog.title}
              </h1>
            </div>

            {/* Author card */}
            <div className="flex items-center gap-3 py-3 border-y border-stone-200 text-xs font-mono text-stone-500">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 font-extrabold font-serif">
                {activeBlog.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-sans font-bold text-emerald-950">{activeBlog.author}</p>
                <div className="flex items-center space-x-2 text-[10px] mt-0.5">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Ayurvedic Scholar</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeBlog.readTime} Read</span>
                </div>
              </div>
            </div>

            {/* Immersive Image */}
            <div className="aspect-video rounded-2xl overflow-hidden border border-stone-150 relative bg-stone-105">
              <img
                src={activeBlog.image}
                alt={activeBlog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content paragraph splitter */}
            <div className="text-stone-700 space-y-5 leading-relaxed font-sans text-xs sm:text-sm prose prose-stone font-medium">
              <p className="text-emerald-950 font-serif font-semibold text-sm italic leading-relaxed bg-[#f3efe6] p-4.5 rounded-xl border-l-[4px] border-[#B58954]">
                “{activeBlog.summary}”
              </p>
              
              {/* Parse paragraph tags */}
              {activeBlog.content.split('\n\n').map((para, i) => (
                <p key={i} className="whitespace-pre-line text-stone-600 leading-relaxed font-sans text-xs sm:text-sm">{para}</p>
              ))}
            </div>

            {/* Footers controls */}
            <div className="flex items-center gap-4 py-8 border-t border-stone-200 pt-1">
              <button
                onClick={() => toggleLike(activeBlog.id)}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer border ${
                  liked[activeBlog.id] 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                <Heart className={`w-4.5 h-4.5 ${liked[activeBlog.id] ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
                <span>{liked[activeBlog.id] ? 'Vaidya Blessed ✓' : 'Bless this Article'}</span>
              </button>
            </div>

          </article>
        </div>
      </div>
    );
  }

  // Lists view as fallback
  const firstBlog = blogs[0];

  return (
    <div id="goayu-blog-list-root" className="bg-stone-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb line */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-8 border-b border-light-beige/25 pb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700 cursor-pointer">Home</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <span className="text-emerald-950 font-bold">GoAyu Literature Library</span>
        </div>

        {/* Title details */}
        <div className="text-left space-y-2 mb-10 pb-6 border-b border-light-beige/20">
          <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">authentic classical wisdom</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-emerald-950 tracking-tight">The Literary Herbarium</h1>
          <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
            Scribbled by our Haridwar Vaidyas, each read-up unravels seasonal eating recipes (Ritu Charya), doshic balancing guidelines, and natural compound properties.
          </p>
        </div>

        {/* Category selector row */}
        <div className="flex flex-wrap gap-2 mb-8 text-xs font-mono font-bold uppercase">
          {['all', 'skin lifestyle', 'wellness', 'cosmic beauty'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`p-2 px-4 rounded-full border transition-all cursor-pointer ${
                categoryFilter === cat 
                  ? 'bg-emerald-950 border-emerald-950 text-white font-extrabold' 
                  : 'bg-white text-stone-500 border-stone-200 hover:text-emerald-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Highlights block */}
        {categoryFilter === 'all' && firstBlog && (
          <div
            onClick={() => setSelectedBlogId(firstBlog.id)}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-light-beige/25 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer mb-12"
          >
            <div className="lg:col-span-12 h-64 lg:h-96 rounded-2xl overflow-hidden relative bg-stone-105">
              <img
                src={firstBlog.image}
                alt={firstBlog.title}
                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-12 flex flex-col justify-between py-2">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">Featured Study</span>
                <h2 className="font-serif font-extrabold text-[#0D2418] text-2xl lg:text-3xl leading-snug group-hover:text-amber-850 transition-colors">
                  {firstBlog.title}
                </h2>
                <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                  {firstBlog.summary}
                </p>
              </div>

              <div className="border-t border-stone-100 flex items-center justify-between text-[10px] font-mono text-stone-400 pt-4 mt-6 uppercase">
                <span>By {firstBlog.author}</span>
                <span>{firstBlog.readTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Multi-grid articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBlogId(b.id)}
              className="bg-white border rounded-2xl overflow-hidden cursor-pointer hover:shadow-md shadow-xs transition-shadow group flex flex-col justify-between"
            >
              <div className="h-52 overflow-hidden bg-stone-105 relative">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-100">
                    {b.category}
                  </span>
                  <h3 className="font-serif font-extrabold text-[#0D2418] text-base leading-snug group-hover:text-amber-880 pt-1.5">
                    {b.title}
                  </h3>
                  <p className="text-xs text-stone-550 leading-relaxed line-clamp-2">
                    {b.summary}
                  </p>
                </div>

                <div className="border-t border-stone-50 flex items-center justify-between text-[10px] text-stone-400 font-mono uppercase mt-5 pt-3.5 font-medium">
                  <span className="font-sans font-bold text-stone-500">By {b.author}</span>
                  <span>{b.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
