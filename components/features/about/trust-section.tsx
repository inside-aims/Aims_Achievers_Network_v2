import React from 'react';

export function TrustSection() {
  const stats = [
    { value: "500+", label: "Students Connected" },
    { value: "200+", label: "Active Mentors" },
    { value: "50+", label: "Partner Organizations" }
  ];

  return (
    <div className="flex flex-col items-center justify-center px-6" >
      <div className="max-w-3xl w-full space-y-4">
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHY TRUST US?
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Built by people who&apos;ve been there
          </h2>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            AIMS is created by educators, students, and professionals who have lived the gaps they are solving.
            This is not theoretical. It is practical, grounded, and built from experience.
          </p>

          <p className="text-gray-500">
            We are not here to sell ambition. We are here to make progress navigable.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-400">
            Whether you&apos;re just starting your search or already on your path, 
            AIMS is here to support your journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-2.5 border border-white/30 rounded hover:bg-white hover:text-black transition-all duration-300 font-mono text-sm">
              [Join the Network]
            </button>
            <button className="px-6 py-2.5 border border-white/30 rounded hover:bg-white hover:text-black transition-all duration-300 font-mono text-sm">
              [Become a Mentor]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}