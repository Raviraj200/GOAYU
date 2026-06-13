import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Reel, Product } from '../types';

interface ReelCardProps {
  key?: string | number;
  reel: Reel;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ReelCard({ reel, products, onAddToCart }: ReelCardProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes || 420);
  const [added, setAdded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const linkedProduct = reel.productId ? products.find((p) => p.id === reel.productId) : null;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(!playing);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play().catch((err) => {
          console.log("Auto play prevented", err);
          setPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  return (
    <div className="w-full max-w-[280px] aspect-[9/16] relative bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-850 group hover:border-amber-500/50 transition-all duration-300">
      {/* Video element */}
      <video
        ref={videoRef}
        src={reel.url}
        loop
        muted={muted}
        playsInline
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Dark Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />

      {/* Top Right Mute Indicator */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMuted(!muted);
        }}
        className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/85 backdrop-blur-md rounded-full text-white cursor-pointer transition select-none z-10 border border-stone-880/20"
      >
        {muted ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
      </button>

      {/* Center Play Overlay Trigger */}
      <div
        onClick={handlePlayToggle}
        className="absolute inset-0 flex items-center justify-center cursor-pointer select-none"
      >
        {!playing && (
          <div className="p-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-full text-amber-300 transition duration-300 scale-95 group-hover:scale-100">
            <Play className="w-6 h-6 fill-amber-400 ml-0.5" />
          </div>
        )}
      </div>

      {/* Bottom overlay details */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-auto text-left space-y-2 select-none">
        
        {/* Linked product horizontal cart box */}
        {linkedProduct && (
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between border border-emerald-900/10 shadow-lg gap-2 pointer-events-auto animate-in fade-in duration-300 transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-2 min-w-0">
              <img 
                src={linkedProduct.image} 
                alt={linkedProduct.name} 
                className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-sans font-black text-emerald-950 truncate leading-tight">{linkedProduct.name}</p>
                <p className="text-[9px] font-mono font-extrabold text-amber-800 mt-0.5">₹{Math.round(linkedProduct.price * 80).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(linkedProduct);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
              className={`p-1.5 px-2.5 rounded-lg font-mono text-[9px] uppercase font-bold shrink-0 tracking-wider flex items-center justify-center transition-all ${
                added 
                  ? 'bg-emerald-800 text-white border border-emerald-800 scale-95' 
                  : 'bg-emerald-900 hover:bg-emerald-950 text-white cursor-pointer shadow-sm hover:shadow'
              }`}
            >
              {added ? 'Added! 🌿' : '+ Add'}
            </button>
          </div>
        )}

        <div className="flex justify-between items-end gap-2 pt-1">
          <div className="space-y-1 flex-grow min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[8px] bg-emerald-800/85 text-emerald-100 border border-emerald-600/30 px-1 py-0.5 rounded uppercase font-mono font-bold tracking-widest flex items-center gap-0.5">
                <Sparkles className="w-2 h-2 text-amber-300 animate-pulse" /> Live Wisdom
              </span>
            </div>
            <h3 className="font-serif font-black text-amber-100 text-xs tracking-wide line-clamp-1">{reel.title}</h3>
            {reel.tagline && <p className="text-[9px] text-stone-300 leading-normal line-clamp-1 mt-0.5">{reel.tagline}</p>}
          </div>

          {/* Floating actions column */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            {/* Like button */}
            <button
              type="button"
              onClick={handleLike}
              className="flex flex-col items-center gap-0.5 group/like cursor-pointer"
            >
              <div className={`p-1.5 rounded-full transition-colors border ${liked ? 'bg-rose-500/25 text-rose-400 border-rose-500/30' : 'bg-black/60 text-white border-stone-850 hover:text-rose-400'}`}>
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 stroke-rose-500 scale-110' : ''}`} />
              </div>
              <span className="text-[8px] font-mono font-bold text-stone-300">{likesCount}</span>
            </button>

            {/* Play/Pause indicator */}
            <button
              type="button"
              onClick={handlePlayToggle}
              className={`p-1.5 rounded-full border transition-colors ${playing ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-black/60 border-stone-850 text-stone-200 hover:text-amber-400'}`}
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
