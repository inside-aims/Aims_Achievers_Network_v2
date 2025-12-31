import React from 'react';
import { ArrowDown } from 'lucide-react';

export function ProblemSection() {
  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHY DOES IT EXIST?
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            The problem we&apos;re solving
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-red-500/30 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-bold text-red-400">The Challenge</h3>
            <p className="text-gray-400 leading-relaxed">
              Finding mentorship is hard. Information about opportunities is scattered. 
              Students often don&apos;t know what questions to ask, where to look, or who to trust.
            </p>
          </div>

          <div className="border border-blue-500/30 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-bold text-blue-400">Our Approach</h3>
            <p className="text-gray-400 leading-relaxed">
              AIMS exists to level the playing field. We create a space where students can 
              find mentors and discover opportunities—regardless of their background.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 font-mono mb-2">Scroll to learn more about us</p>
        <ArrowDown className="w-5 h-5 text-gray-500 mx-auto animate-bounce" />
      </div>
    </div>
  );
}