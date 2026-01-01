import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BackgroundGLProps {
  hovering: boolean;
}

export function BackgroundGL({ hovering }: BackgroundGLProps) {
  const purpleGlowRef = useRef<HTMLDivElement>(null);
  const blueGlowRef = useRef<HTMLDivElement>(null);
  const dotGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate purple glow on mount
    gsap.fromTo(
      purpleGlowRef.current,
      { 
        scale: 0.8, 
        opacity: 0 
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      }
    );

    // Animate blue glow on mount with slight delay
    gsap.fromTo(
      blueGlowRef.current,
      { 
        scale: 0.8, 
        opacity: 0 
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        delay: 0.3,
        ease: "power2.out"
      }
    );

    // Subtle floating animation for purple glow
    gsap.to(purpleGlowRef.current, {
      y: "20px",
      x: "10px",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Subtle floating animation for blue glow (opposite direction)
    gsap.to(blueGlowRef.current, {
      y: "-20px",
      x: "-10px",
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Animate dot grid opacity
    gsap.fromTo(
      dotGridRef.current,
      { opacity: 0 },
      {
        opacity: 0.2,
        duration: 2,
        ease: "power1.inOut"
      }
    );
  }, []);

  useEffect(() => {
    // Animate glows based on hovering state
    if (hovering) {
      gsap.to(purpleGlowRef.current, {
        scale: 1.25,
        duration: 0.7,
        ease: "power2.out"
      });
      gsap.to(blueGlowRef.current, {
        scale: 1.25,
        duration: 0.7,
        ease: "power2.out"
      });
    } else {
      gsap.to(purpleGlowRef.current, {
        scale: 1,
        duration: 0.7,
        ease: "power2.out"
      });
      gsap.to(blueGlowRef.current, {
        scale: 1,
        duration: 0.7,
        ease: "power2.out"
      });
    }
  }, [hovering]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          hovering
            ? "bg-linear-to-br from-purple-900/20 via-blue-900/20 to-black"
            : "bg-linear-to-br from-black via-gray-900 to-black"
        }`}
      >
        {/* Dot grid */}
        <div ref={dotGridRef} className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Purple glow */}
        <div
          ref={purpleGlowRef}
          className={`
            absolute rounded-full blur-3xl transition-all duration-1000
            w-48 h-48 top-20 left-10
            sm:w-72 sm:h-72 sm:top-1/4 sm:left-1/4
            lg:w-96 lg:h-96
            ${
              hovering
                ? "bg-purple-500/30"
                : "bg-purple-500/10"
            }
          `}
        />

        {/* Blue glow */}
        <div
          ref={blueGlowRef}
          className={`
            absolute rounded-full blur-3xl transition-all duration-1000
            w-56 h-56 bottom-24 right-6
            sm:w-72 sm:h-72 sm:bottom-1/3 sm:right-1/4
            lg:w-96 lg:h-96
            ${
              hovering
                ? "bg-blue-500/30"
                : "bg-blue-500/10"
            }
          `}
        />
      </div>
    </div>
  );
}

// Demo wrapper
export default function Demo() {
  const [hovering, setHovering] = React.useState(false);

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <BackgroundGL hovering={hovering} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <button
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
        >
          Hover me to see effect
        </button>
      </div>
    </div>
  );
}