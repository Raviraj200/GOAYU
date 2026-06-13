import { ShoppingBag, Search, User, Menu, X, Landmark, Compass, Award, Heart } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  wishlistCount?: number;
  userName: string | null;
  onLogout: () => void;
  isAdmin?: boolean;
  banner?: { title: string; subtitle: string; ctaText: string; link?: string } | null;
}

export default function Header({ currentView, onNavigate, cartCount, wishlistCount = 0, userName, onLogout, isAdmin = false, banner }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'Our Heritage', view: 'about' },
    { label: 'Blog', view: 'blog' },
    { label: 'Contact', view: 'contact' },
    { label: 'My Orders', view: 'my-orders' }
  ];

  return (
    <header id="goayu-main-navigation" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-amber-500/25 shadow-sm">
      {/* Announcement Ribbon */}
      {banner && (
        <div className="bg-emerald-950 text-white font-serif px-4 py-2 text-center text-xs tracking-wider border-b border-emerald-900 flex justify-center items-center flex-wrap gap-1">
          <span className="text-amber-400 font-extrabold font-sans uppercase text-[9px] bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded tracking-widest leading-none">PROMO</span>
          <span className="font-bold">{banner.title}</span>
          <span className="text-stone-400">&mdash;</span>
          <span className="italic text-amber-100 text-[11px]">{banner.subtitle}</span>
          <button 
            type="button"
            onClick={() => handleNav(banner.link || 'shop')} 
            className="text-[10px] font-mono text-amber-400 uppercase font-bold underline hover:text-amber-300 ml-1.5 cursor-pointer"
          >
            {banner.ctaText || 'Learn More'} &rarr;
          </button>
        </div>
      )}

      {/* Visual Indian Saffron Accent Top-Border */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-emerald-700 w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo with Cultural Traditional Styling */}
          <div className="flex items-center cursor-pointer select-none" onClick={() => handleNav('home')}>
            <Logo className="h-20 [&_img]:!w-[100px] [&_img]:!h-[100px] [&_img]:max-w-none flex items-center justify-center" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-8 font-sans font-medium text-sm text-emerald-900">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={`relative py-2 tracking-wide transition-all duration-200 cursor-pointer text-left ${
                  currentView === item.view
                    ? 'text-amber-700 font-semibold'
                    : 'text-emerald-950 hover:text-amber-505'
                }`}
              >
                {item.label}
                {currentView === item.view && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Icons Row */}
          <div className="flex items-center space-x-5">
            {/* PUBLIC ADMIN DESK SHORTCUT HAS BEEN REMOVED FOR SECURITY (Requirement #5) */}

            {/* Wishlist Indicator */}
            <button
              onClick={() => handleNav('wishlist')}
              className={`relative p-2.5 text-emerald-950 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50 border cursor-pointer ${
                currentView === 'wishlist' ? 'bg-rose-50 border-rose-300' : 'bg-stone-50 border-stone-200/50'
              }`}
              title="View Wishlist"
            >
              <Heart className={`w-5.5 h-5.5 ${currentView === 'wishlist' ? 'fill-rose-500 text-rose-600' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md scale-95 border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Indicator */}
            <button
              onClick={() => handleNav('cart')}
              className="relative p-2.5 text-emerald-950 hover:text-amber-600 transition-colors rounded-full hover:bg-emerald-55/10 bg-stone-50 border border-stone-200/50 cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-emerald-950 font-mono text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md scale-95 border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Drawer Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center space-x-1.5 p-2 px-3 text-emerald-950 hover:text-amber-600 transition-colors rounded-full hover:bg-stone-100 bg-stone-50 border ${
                  isAdmin ? 'border-amber-400/60 bg-amber-500/5' : 'border-stone-200/50'
                } cursor-pointer`}
              >
                <User className="w-5 h-5" />
                {userName && (
                  <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline">
                    {userName} {isAdmin && '👑'}
                  </span>
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-light-beige shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-stone-100 text-stone-500 text-[11px] uppercase tracking-wider font-semibold font-mono">
                    User Session
                  </div>
                  {userName ? (
                    <>
                      <div className="px-4 py-2.5 text-xs font-bold text-emerald-950">
                        {userName}
                        {isAdmin && <span className="block text-[9px] text-amber-700 uppercase font-mono font-bold">Authorized Priest/Admin</span>}
                      </div>
                      
                      {isAdmin && (
                        <button
                          onClick={() => {
                            handleNav('admin');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-amber-700 hover:bg-amber-50 font-black cursor-pointer border-y border-stone-100 flex items-center gap-1.5"
                        >
                          <Compass className="w-4 h-4 animate-spin-slow text-amber-600" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          handleNav('tracker');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-emerald-50/50 hover:text-emerald-900 cursor-pointer"
                      >
                        My Order Statuses
                      </button>
                      
                      <button
                        onClick={() => {
                          onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-semibold cursor-pointer border-t border-stone-100"
                      >
                        Log Out (Sign out)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          handleNav('login');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-emerald-950 hover:bg-emerald-50 font-bold tracking-wide cursor-pointer text-amber-700"
                      >
                        Pranam! Log In / Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-emerald-950 hover:text-amber-600 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white/98 flex flex-col p-4 space-y-3 shadow-lg transition-all duration-300">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNav(item.view)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === item.view
                  ? 'bg-amber-50 text-amber-700 font-bold'
                  : 'text-emerald-950 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {/* Show admin button only if verified admin (Requirement #5) */}
          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-700 bg-amber-500/10 font-mono font-bold border border-amber-600/20 flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Admin Control Center</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
