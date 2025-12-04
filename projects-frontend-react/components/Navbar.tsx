import React, { useState } from 'react';
import { Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { NavLink, Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.projects, path: '/projects' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-accent-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo - Editorial Serif Style */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex flex-col cursor-pointer group"
              aria-label={t.nav.title}
            >
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 leading-tight tracking-tight group-hover:text-primary-600 transition-colors">
                {t.nav.title}
              </h1>
              <p className="text-xs text-accent-600 font-mono uppercase tracking-wider mt-0.5">
                {t.nav.subtitle}
              </p>
            </Link>
          </div>

          {/* Desktop Navigation - Text Only with Underline Expand */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative font-medium text-base transition-colors pb-1 ${
                    isActive
                      ? 'text-primary-600 font-bold'
                      : 'text-neutral-700 hover:text-neutral-900 link-expand'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Language Switcher - Minimal Pill */}
            <div className="h-8 w-px bg-accent-200 mx-2"></div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-accent-200 text-sm font-medium text-neutral-700 hover:border-accent-400 hover:bg-accent-50 transition-all"
              aria-label="Toggle language"
            >
              <Languages size={16} className="text-accent-600" />
              <span className={`${language === 'ta' ? 'font-bold text-neutral-900' : 'text-neutral-600'}`}>
                தமிழ்
              </span>
              <span className="text-accent-300">|</span>
              <span className={`${language === 'en' ? 'font-bold text-neutral-900' : 'text-neutral-600'}`}>
                EN
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-md text-accent-700 bg-accent-100 font-bold text-sm border border-accent-200 hover:bg-accent-200 transition-colors"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Editorial Style */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-accent-100">
          <div className="py-3 space-y-1 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? 'bg-accent-100 text-primary-700 font-bold border-l-4 border-primary-600'
                      : 'text-neutral-700 hover:bg-accent-50 hover:text-neutral-900 border-l-4 border-transparent'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
