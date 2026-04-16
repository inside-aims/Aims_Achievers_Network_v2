import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap } from 'gsap';

export function ProblemSection() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const challengeCardRef = useRef<HTMLDivElement>(null);
  const approachCardRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate badge
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8, y: -10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.5)"
        }
      );

      // Animate title with split words effect
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out"
        }
      );

      // Animate challenge card
      gsap.fromTo(
        challengeCardRef.current,
        { opacity: 0, x: -30, rotateY: -5 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power2.out"
        }
      );

      // Animate approach card
      gsap.fromTo(
        approachCardRef.current,
        { opacity: 0, x: 30, rotateY: 5 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.out"
        }
      );

      // Animate scroll hint
      gsap.fromTo(
        scrollHintRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 1,
          ease: "power2.out"
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-3">
          <div 
            ref={badgeRef}
            className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide"
          >
            WHY DOES IT EXIST?
          </div>
          <h2 
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            The problem we&apos;re solving
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div 
            ref={challengeCardRef}
            className="border border-red-500/30 rounded-lg p-6 space-y-3"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                borderColor: 'rgba(239, 68, 68, 0.5)',
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                borderColor: 'rgba(239, 68, 68, 0.3)',
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
              });
            }}
          >
            <h3 className="text-xl font-bold text-red-400">The Challenge</h3>
            <p className="text-gray-400 leading-relaxed">
              Access to meaningful mentorship and opportunities remains fragmented and uneven.
              Information is scattered, guidance is often out of reach, and many driven individuals regardless of background lack the clarity, direction, or trusted networks needed to move forward with confidence.
            </p>
          </div>

          <div 
            ref={approachCardRef}
            className="border border-blue-500/30 rounded-lg p-6 space-y-3"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                borderColor: 'rgba(59, 130, 246, 0.5)',
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                borderColor: 'rgba(59, 130, 246, 0.3)',
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
              });
            }}
          >
            <h3 className="text-xl font-bold text-blue-400">Our Approach</h3>
            <p className="text-gray-400 leading-relaxed">
              We are building an inclusive, globally connected ecosystem where individuals can access mentorship, discover opportunities, and engage with the right people at the right time. By bringing structure to scattered resources and fostering authentic connections, we make growth more accessible, intentional, and equitable.
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollHintRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="text-sm text-gray-500 font-mono mb-2">Scroll to learn more about us</p>
        <ArrowDown className="w-5 h-5 text-gray-500 mx-auto animate-bounce" />
      </div>
    </div>
  );
}

// Demo wrapper
export default function Demo() {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <ProblemSection />
    </div>
  );
}