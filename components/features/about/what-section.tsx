import React from 'react';

export function WhatSection() {
  return (
    <div className="relative flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
          WHAT IS THIS?
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          AIMS Achievers Network connects students with mentors and opportunities
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          We bring together resources, guidance, and real connections to help motivated 
          students access mentorship, discover career pathways, and find opportunities 
          that match their ambitions.
        </p>
      </div>
    </div>
  );
}