'use client';

import React, { useState, useEffect, useRef } from 'react';

const RadavilleNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [counter, setCounter] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const menuRef = useRef(null);
  const menuItemsRef = useRef([]);

  // Counter animation on load
  useEffect(() => {
    if (!hasEntered) {
      const target = 100;
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCounter(target);
          clearInterval(timer);
        } else {
          setCounter(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [hasEntered]);

  // Menu animations
  useEffect(() => {
    if (isMenuOpen && !isMenuClosing) {
      // Animate menu background - entrance
      if (menuRef.current) {
        menuRef.current.style.opacity = '0';
        menuRef.current.style.transform = 'scale(0.95)';
        
        requestAnimationFrame(() => {
          menuRef.current.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          menuRef.current.style.opacity = '1';
          menuRef.current.style.transform = 'scale(1)';
        });
      }

      // Stagger menu items - entrance
      menuItemsRef.current.forEach((item, index) => {
        if (item) {
          item.style.opacity = '0';
          item.style.transform = 'translateY(40px)';
          
          setTimeout(() => {
            item.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 100 + 250);
        }
      });
    }
  }, [isMenuOpen, isMenuClosing]);

  const navItems = [
    { number: '01', title: 'Work', href: '/' },
    { number: '02', title: 'About', href: '/about' },
    { number: '03', title: 'Curation', href: '/curation' },
    { number: '04', title: 'Contact', href: '/contact' }
  ];

  const handleEnter = () => {
    setSoundEnabled(true);
    setHasEntered(true);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      // Close animation
      setIsMenuClosing(true);
      
      // Animate items out in reverse
      menuItemsRef.current.forEach((item, index) => {
        if (item) {
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-30px)';
          }, (menuItemsRef.current.length - 1 - index) * 80);
        }
      });

      // Animate background out
      setTimeout(() => {
        if (menuRef.current) {
          menuRef.current.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          menuRef.current.style.opacity = '0';
          menuRef.current.style.transform = 'scale(1.05)';
        }
      }, menuItemsRef.current.length * 80 + 100);

      // Remove menu from DOM after animation
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsMenuClosing(false);
      }, menuItemsRef.current.length * 80 + 700);
    } else {
      setIsMenuOpen(true);
    }
  };

  // if (!hasEntered) {
  //   return (
  //     <div className="fixed inset-0 bg-black text-white flex items-center justify-center overflow-hidden">
  //       <div className="text-center space-y-6 md:space-y-8 px-4 max-w-4xl mx-auto">
  //         <div className="space-y-3 md:space-y-4">
  //           <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight">
  //             Thinking Things
  //           </h1>
  //           <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tabular-nums">
  //             {counter}
  //           </div>
  //           <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight">
  //             Into Existence
  //           </h2>
  //         </div>
          
  //         <p className="text-base sm:text-lg md:text-xl font-light tracking-wider opacity-70 mt-8 md:mt-12 px-4">
  //           A multi-disciplinary design studio
  //         </p>
          
  //         <div className="space-y-2 mt-12 md:mt-16">
  //           <button
  //             onClick={handleEnter}
  //             className="group relative px-8 sm:px-10 md:px-12 py-3 md:py-4 text-base md:text-lg tracking-widest border border-white/30 hover:border-white transition-all duration-500 overflow-hidden"
  //           >
  //             <span className="relative z-10">Enter</span>
  //             <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
  //             <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500">
  //               Enter
  //             </span>
  //           </button>
  //         </div>

  //         <div className="absolute bottom-6 md:bottom-8 left-4 right-4 md:left-0 md:right-0 text-center px-4">
  //           <p className="text-xs sm:text-sm tracking-widest opacity-40 leading-relaxed">
  //             Elevating Spaces, Defining Aesthetics, Cultivating Brands
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between p-4 sm:p-6 md:p-8">
          <div className="text-xs sm:text-sm tracking-widest font-light">
            RADAVILLE STUDIO
          </div>
          
          <button
            onClick={toggleMenu}
            className="group relative text-xs sm:text-sm tracking-widest font-light hover:opacity-70 transition-opacity"
          >
            {isMenuOpen || isMenuClosing ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Full-screen Menu Overlay */}
      {(isMenuOpen || isMenuClosing) && (
        <div 
          ref={menuRef}
          className="fixed inset-0 bg-black z-40 flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          <nav className="absolute bottom-12 sm:bottom-4 p-2 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-2 w-full max-w-4xl">
            {navItems.map((item, index) => (
              <div
                key={item.number}
                ref={el => { menuItemsRef.current[index] = el; }}
                className="group cursor-pointer"
              >
                <a 
                  href={item.href}
                  className="flex items-baseline gap-4 sm:gap-6 md:gap-8 lg:gap-10"
                >
                  <span className="text-xs sm:text-sm md:text-base opacity-40 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                    {item.number}
                  </span>
                  <span className="text-5xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-light tracking-wide group-hover:tracking-wider transition-all duration-500 leading-tight">
                    {item.title}
                  </span>
                </a>
              </div>
            ))}
          </nav>

          {/* Menu Footer */}
          <div className="absolute top-28 right-4 sm:right-6 md:right-8">
            <div className="flex flex-col justify-between gap-6 md:gap-8 text-xs sm:text-sm opacity-60">
              <div className="space-y-1">
                <p className="tracking-widest">01 Services</p>
                <p className="font-light leading-relaxed">Interior Design · Art Direction · Branding</p>
              </div>
              <div className="space-y-1">
                <p className="tracking-widest">02 Location</p>
                <p className="font-light">Düsseldorf, Germany</p>
              </div>
              <div className="space-y-1">
                <p className="tracking-widest">03 Social</p>
                <p className="font-light">Instagram · Spotify</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-wide mb-12 md:mb-16 leading-tight">
            Thinking Things Into Existence.
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-light opacity-70 mb-20 md:mb-32 leading-relaxed">
            Turning Ideas Into Meaningful Products.
          </p>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-24 md:mb-32">
            {['Casa Paz', 'Hagi\'s Oldtown', 'Hagi\'s Downtown'].map((project, i) => (
              <div 
                key={i}
                className="group cursor-pointer aspect-[16/10] bg-zinc-900 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-zinc-800 transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"></div>
                <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                  <h3 className="text-2xl sm:text-3xl font-light tracking-wide">{project}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Year Badge */}
      <div className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 text-xs sm:text-sm tracking-widest opacity-40 mix-blend-difference">
        2024
      </div>

      {/* Scroll Indicator */}
      <div className="hidden md:block fixed right-6 lg:right-8 top-1/2 -translate-y-1/2 text-xs tracking-widest opacity-40 mix-blend-difference rotate-90">
        Scroll
      </div>
    </div>
  );
};

export default RadavilleNav;