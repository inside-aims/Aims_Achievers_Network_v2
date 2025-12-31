import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export function ContactSection() {
  const contactMethods = [
    {
      icon: Mail,
      label: "info@aims.network",
      link: "mailto:info@aims.network"
    },
    {
      icon: Phone,
      label: "+233 123 456 789",
      link: "tel:+233123456789"
    },
    {
      icon: MapPin,
      label: "Accra, Ghana",
      link: "#"
    },
    {
      icon: Globe,
      label: "Website",
      link: "https://aims.network"
    }
  ];

  return (
    <div className="flex items-center justify-center px-6 h-full">
      <div className="max-w-6xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Contact Form */}
          <div className="space-y-8 py-10">
            <div className='absolute top-0'>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-2">Contact</h2>
            </div>

            <form className="space-y-6 mt-28">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full name</label>
                <input
                  type="text"
                  className="w-full px-0 py-3 bg-transparent border-b border-white/20 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email address</label>
                <input
                  type="email"
                  className="w-full px-0 py-3 bg-transparent border-b border-white/20 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-0 py-3 bg-transparent border-b border-white/20 focus:border-white focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-8 py-3 mb-10  bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Right Side - Contact Info Card */}
          <div className="flex items-center justify-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-full max-w-md">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Get in touch with our team</h3>
              </div>

              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.link}
                      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm group-hover:text-white transition-colors">
                        {method.label}
                      </span>
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