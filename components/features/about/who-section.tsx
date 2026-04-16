import React from 'react';
import { ArrowDown } from 'lucide-react';

export function WhoSection() {
  const audiences = [
    {
      title: "Students & Emerging Talent",
      description: "Ambitious individuals seeking clarity, mentorship, and pathways to unlock their full potential."
    },
    {
      title: "Mentors & Industry Leaders",
      description: "Experienced professionals, educators, and thought leaders passionate about guiding and shaping the next generation of achievers."
    },
    {
      title: "Institutions & Organizations",
      description: "Forward-thinking schools, universities, and organizations looking to connect their communities with real-world opportunities and global networks."
    },
    {
      title: "Parents & Support Systems",
      description: "Families and guardians seeking trusted guidance, resources, and opportunities to support the journey of those they care about."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHO IS IT FOR?
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            AIMS Achievers Network is designed for individuals and organizations committed to growth, impact, and meaningful progress.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="group border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-2 relative inline-block">
                {audience.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {audience.description}
              </p>
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
