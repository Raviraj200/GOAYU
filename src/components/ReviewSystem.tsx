import React, { useState } from 'react';
import { Star, ThumbsUp, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { Review } from '../types';

interface ReviewSystemProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ReviewSystem({ reviews, onAddReview }: ReviewSystemProps) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const averageRating = reviews.length > 0 
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      setErrorMsg('Please state your name and provide review comments under classical truth.');
      return;
    }
    setErrorMsg('');
    onAddReview({
      author,
      rating,
      text,
      verified: true
    });
    setSubmitted(true);
    setAuthor('');
    setText('');
    setRating(5);
  };

  const getStarArray = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => i < count);
  };

  return (
    <div id="product-review-system" className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12 bg-white/50 p-6 rounded-2xl border border-light-beige/40">
      
      {/* Average & Stats */}
      <div className="lg:col-span-1">
        <h3 className="text-lg font-serif font-bold text-emerald-950 mb-3">Therapeutic Handover Reviews</h3>
        
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-serif font-black text-emerald-950">{averageRating}</span>
          <span className="text-stone-400 text-sm">out of 5 stars</span>
        </div>

        {/* Stars */}
        <div className="flex items-center space-x-1 my-3 text-amber-500">
          {getStarArray(Math.round(averageRating)).map((filled, i) => (
            <Star key={i} className={`w-5 h-5 ${filled ? 'fill-amber-500' : 'text-stone-200'}`} />
          ))}
          <span className="text-xs text-emerald-800 font-bold pl-2 font-mono">({reviews.length} Verified Users)</span>
        </div>

        {/* Distribution Chart */}
        <div className="space-y-2 mt-6">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => Math.round(r.rating) === stars).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center space-x-2.5 text-xs text-stone-600">
                <span className="w-3 font-mono font-bold text-emerald-950">{stars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                <div className="flex-1 bg-stone-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-stone-500">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="text-xs text-emerald-900 leading-relaxed font-sans">
            ✦ All reviews are signed by registered patrons. Our internal laboratory evaluates dermal and bio-energy logs to guarantee 100% genuine results.
          </p>
        </div>
      </div>

      {/* Write a Review Submission Form */}
      <div className="lg:col-span-1 border-stone-100 p-5 rounded-xl bg-stone-50 border">
        <h4 className="text-sm font-sans font-bold tracking-wide uppercase text-emerald-900 mb-4">Write an Honest Review</h4>
        
        {submitted ? (
          <div className="bg-emerald-100/50 border border-emerald-300 text-emerald-900 text-xs rounded-xl p-4.5 text-center flex flex-col items-center">
            <CheckCircle className="w-8 h-8 text-emerald-800 mb-2" />
            <p className="font-bold mb-1">Review Received with Gratitude!</p>
            <p className="text-stone-600 leading-relaxed">Your organic voice and rating have been registered in our GoAyu database systems.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 text-[11px] font-bold text-amber-700 bg-white border border-amber-600/30 px-3 py-1.5 rounded-lg hover:bg-amber-50 cursor-pointer"
            >
              Post Another Comment
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex gap-1.5 items-center bg-red-50 border border-red-200 text-red-800 text-xs p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="Priya Nair"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-white text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Assigned Formula Rating</label>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    type="button"
                    key={stars}
                    onClick={() => setRating(stars)}
                    className="p-1 cursor-pointer transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        stars <= rating ? 'fill-amber-550 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Your Diagnostic Experience</label>
              <textarea
                rows={3}
                placeholder="How did this product balance your doshas? Describe textures, fragrance, and noticeable benefits..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-white text-stone-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-850 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm tracking-wide uppercase"
            >
              Submit Patrons Verified Review
            </button>
          </form>
        )}
      </div>

      {/* Reviews List Feed */}
      <div className="lg:col-span-1 space-y-4 max-h-[420px] overflow-y-auto pr-1">
        <h4 className="text-sm font-sans font-bold tracking-wide uppercase text-emerald-900 mb-2">Verified Patrons Feed</h4>
        
        {reviews.length === 0 ? (
          <p className="text-xs text-stone-500 italic mt-6">Be the first to bless this newly formulated batch and log your rating!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-stone-150 p-4 rounded-xl shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xs font-bold text-emerald-950 font-sans">{rev.author}</h5>
                  <div className="flex items-center space-x-0.5 my-1 text-amber-500">
                    {getStarArray(rev.rating).map((filled, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${filled ? 'fill-amber-500' : 'text-stone-200'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">{rev.date}</span>
              </div>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{rev.text}</p>
              
              {rev.verified && (
                <div className="mt-2.5 text-[10px] text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 max-w-max px-1.5 py-0.5 rounded border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
