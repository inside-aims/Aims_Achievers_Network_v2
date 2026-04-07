import React from 'react';
import { ArrowDown } from 'lucide-react';

export function ValuesSection() {
  const values = [
    { principle: "Access over exclusivity", description: "Mentorship shouldn't depend on who you know" },
    { principle: "Clarity over confusion", description: "Plain guidance, no jargon or gatekeeping" },
    { principle: "Connection over isolation", description: "Building a community, not just a platform" },
    { principle: "Growth over perfection", description: "Supporting students at every stage" }
  ];

  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            What guides us
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((value, index) => (
            <div key={index} className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all group">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-white/50 mt-2 group-hover:bg-blue-400 transition-colors flex-shrink-0"></div>
                <div>
                  <div className="font-bold mb-1">{value.principle}</div>
                  <div className="text-gray-400 text-sm">{value.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 font-mono mb-2">Scroll to learn more about us</p>
        <ArrowDown className="w-5 h-5 text-gray-500 mx-auto animate-bounce" />
      </div>
    </div>
  );
}