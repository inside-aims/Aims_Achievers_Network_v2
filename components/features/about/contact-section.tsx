import React, { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { gsap } from "gsap";

export function ContactSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contactItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const contactMethods = [
    { icon: Mail, label: "info@aims.network", link: "mailto:info@aims.network" },
    { icon: Phone, label: "+233 123 456 789", link: "tel:+233123456789" },
    { icon: MapPin, label: "Accra, Ghana", link: "#" },
    { icon: Globe, label: "Website", link: "https://aims.network" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        }
      );

      // Animate form inputs with stagger
      gsap.fromTo(
        formRef.current?.querySelectorAll("div") || [],
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out"
        }
      );

      // Animate contact card
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: 30, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.2)"
        }
      );

      // Animate contact items with stagger
      gsap.fromTo(
        contactItemsRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.6,
          ease: "power2.out"
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex items-center justify-center px-6 py-12 mb-10 lg:mb-0 min-h-[calc(100vh-80px)] lg:min-h-screen">
      <div className="max-w-6xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left Side - Contact Form */}
          <div className="space-y-6">
            <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-2">Contact</h2>

            <form ref={formRef} className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full name</label>
                <input
                  type="text"
                  className="w-full px-0 py-2 bg-transparent border-b border-white/20 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-0 py-2 bg-transparent border-b border-white/20 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea
                  rows={3}
                  className="w-full px-0 py-2 bg-transparent border-b border-white/20 focus:border-white focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 font-semibold"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }}
              >
                Send
              </button>
            </form>
          </div>

          {/* Right Side - Contact Info Card */}
          <div className="flex items-center justify-center">
            <div 
              ref={cardRef}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4"
            >
              <h3 className="text-xl font-bold">Get in touch</h3>

              <div className="space-y-3">
                {contactMethods.map((method, idx) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={idx}
                      ref={(el) => { contactItemsRef.current[idx] = el; }}
                      href={method.link}
                      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                      onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, {
                          x: 5,
                          duration: 0.3,
                          ease: "power2.out"
                        });
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, {
                          x: 0,
                          duration: 0.3,
                          ease: "power2.out"
                        });
                      }}
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm group-hover:text-white transition-colors">{method.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Demo wrapper
export default function Demo() {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <ContactSection />
    </div>
  );
}