import React, { useState } from 'react';
import type { SiteConfig, Service } from '../types/website';

interface Props {
  navigation: SiteConfig['navigation'];
  services: Service[];
}

export default function MobileMenu({ navigation, services }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:text-action-dark transition-colors"
        aria-label="Toggle mobile menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm md:hidden">
          <div className="fixed right-0 top-0 w-[75%] max-w-sm h-screen bg-primary shadow-xl">
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white hover:text-action-dark transition-colors"
                  aria-label="Close mobile menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="px-4 py-8 space-y-4">
                {navigation.links.map((link) => {
                  if (link.text === "Services") {
                    return (
                      <div key={link.href} className="space-y-2">
                        <button
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                          className="flex items-center justify-between w-full py-2 text-lg font-medium text-white hover:text-action-dark transition-colors"
                        >
                          <span>Services</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isServicesOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {isServicesOpen && (
                          <div className="pl-4 space-y-2 border-l border-white/10">
                            {services.map((service) => (
                              <a
                                key={service.id}
                                href={`/services/${service.id}`}
                                className="block py-2 text-white/80 hover:text-action-dark transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                <i className={`fas fa-${service.icon} w-5 mr-2`}></i>
                                {service.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block py-2 text-lg font-medium text-white hover:text-action-dark transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.text}
                    </a>
                  );
                })}
                <a
                  href="/contact"
                  className="block w-full btn btn-primary text-center mt-6"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}