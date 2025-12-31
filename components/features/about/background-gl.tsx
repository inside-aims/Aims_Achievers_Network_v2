import React from 'react';

interface BackgroundGLProps {
  hovering: boolean;
}

export function BackgroundGL({ hovering }: BackgroundGLProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div 
        className={`absolute inset-0 transition-all duration-700 ${
          hovering 
            ? 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black' 
            : 'bg-gradient-to-br from-black via-gray-900 to-black'
        }`}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}></div>
        </div>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          hovering ? 'bg-purple-500/30 scale-125' : 'bg-purple-500/10 scale-100'
        }`}></div>
        <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          hovering ? 'bg-blue-500/30 scale-125' : 'bg-blue-500/10 scale-100'
        }`}></div>
      </div>
    </div>
  );
}