import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = 'h-10', showText = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [customLogo, setCustomLogo] = useState<string>('');

  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => {
        if (data && data.logoUrl) {
          setCustomLogo(data.logoUrl);
        }
      })
      .catch(err => console.log('Logo load error:', err));
  }, []);

  // If there's no error, we try to render the uploaded company logo from the user
  if (!imageError) {
    return (
      <div id="goayu-brand-logo" className={`flex items-center gap-2 select-none ${className}`}>
        <img 
          src={customLogo || "/image/Adobe Express - file (47).png"} 
          alt="GoAyu" 
          className="h-10 w-auto object-contain select-none cursor-pointer text-white font-bold"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div id="goayu-brand-logo" className={`flex items-center gap-2 select-none ${className}`}>
      {/* Container for the unified logo fallback */}
      <div className="relative flex items-center">
        {/* If showText is false, we just render the beautiful leaves icon */}
        {!showText ? (
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 100 100"
              className="w-10 h-10 select-none animate-pulse-slow"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGreenLeft" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="logoGreenRight" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <path
                d="M 45,65 C 15,35 25,12 45,12 C 45,28 40,50 45,65 Z"
                fill="url(#logoGreenLeft)"
                stroke="#047857"
                strokeWidth="0.5"
              />
              <path
                d="M 55,65 C 85,35 75,12 55,12 C 55,28 60,50 55,65 Z"
                fill="url(#logoGreenRight)"
                stroke="#059669"
                strokeWidth="0.5"
              />
              {/* Small curving stem */}
              <path
                d="M 50,65 C 50,75 42,82 45,90"
                stroke="#047857"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        ) : (
          /* When showText is true, we display the integrated GoAyu wordmark with the leaves physically nesting on top of 'o' and 'A'! */
          <div className="flex flex-col select-none">
            <div className="relative flex items-baseline leading-none pt-3">
              {/* Floating Leaves placed precisely above 'o' and 'A' */}
              <div className="absolute top-[-8px] left-[26px] w-[34px] h-[34px] z-10 pointer-events-none">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="logoGreenLeftMain" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#15803D" />
                    </linearGradient>
                    <linearGradient id="logoGreenRightMain" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4ADE80" />
                      <stop offset="100%" stopColor="#16A34A" />
                    </linearGradient>
                  </defs>
                  {/* Left leaf curving leftwards */}
                  <path
                    d="M 42,70 C 10,35 22,10 45,10 C 45,25 38,50 42,70 Z"
                    fill="url(#logoGreenLeftMain)"
                    stroke="#15803D"
                    strokeWidth="0.5"
                  />
                  {/* Right leaf curving rightwards */}
                  <path
                    d="M 58,70 C 90,35 78,10 55,10 C 55,25 62,50 58,70 Z"
                    fill="url(#logoGreenRightMain)"
                    stroke="#16A34A"
                    strokeWidth="0.5"
                  />
                  {/* Little stem curving down beautifully */}
                  <path
                    d="M 50,70 C 50,82 43,90 46,95"
                    stroke="#15803D"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* The "GoAyu" letter text. Since the user's logo is in black, we write all letters in stone-950/black! */}
              <span className="text-3xl font-serif font-black tracking-tight text-[#0F172A] dark:text-black">
                GoAyu
              </span>

          
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
