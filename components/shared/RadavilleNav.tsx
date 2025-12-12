'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SquareMenu, X } from 'lucide-react';


  const navItems = [
    { number: '01', title: 'Home', href: '/' },
    { number: '02', title: 'About', href: '/about' },
    { number: '03', title: 'Events', href: '/events' },
    { number: '04', title: 'Contact', href: '/contact' }
  ];

const RadavilleNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const menuRef = useRef(null);
  const menuItemsRef = useRef([]);

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
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between p-4 sm:p-6 md:p-8">
          <div className="text-xs sm:text-sm tracking-widest font-light">
            AIMS ACHIEVERS NETWORK
          </div>
          
          <button
            onClick={toggleMenu}
            className="group relative text-xs sm:text-sm tracking-widest font-light hover:opacity-70 transition-opacity"
          >
            {isMenuOpen || isMenuClosing ? <X/> : <SquareMenu/>}
          </button>
        </div>
      </header>

      {/* Full-screen Menu Overlay */}
      {(isMenuOpen || isMenuClosing) && (
        <div 
          ref={menuRef}
          className="fixed inset-0 bg-background z-40 flex items-center justify-center p-4 sm:p-6 md:p-8"
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
        </div>
      )}
    </>
  );
};

export default RadavilleNav;