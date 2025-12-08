import React, { useState } from 'react';
import { Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Get language prefix for all links
  const langPrefix = language === 'ta' ? '/ta' : '';

  const navItems = [
    { name: t.nav.home, path: `${langPrefix}/` },
    { name: t.nav.about, path: `${langPrefix}/about` },
    { name: t.nav.projects, path: `${langPrefix}/projects` },
  ];

  const toggleLanguage = () => {
    const currentPath = location.pathname;
    const searchParams = location.search; // Preserve query parameters

    if (language === 'en') {
      // Switch to Tamil: /projects → /ta/projects
      const newPath = '/ta' + currentPath;
      navigate(newPath + searchParams);
    } else {
      // Switch to English: /ta/projects → /projects
      const newPath = currentPath.replace(/^\/ta/, '') || '/';
      navigate(newPath + searchParams);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-secondary-900 to-secondary-800 border-b-4 border-primary-500 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo - Political Bold Style */}
          <div className="flex items-center">
            <Link
              to={`${langPrefix}/`}
              className="flex-shrink-0 flex flex-col cursor-pointer group"
              aria-label={t.nav.title}
            >
              <div className="flex items-baseline gap-2">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center border-2 border-accent-400 shadow-md transform group-hover:scale-110 transition-transform">
                  {/* Rising Sun Icon Representation */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-500 to-accent-300"></div>
                </div>
                <div>
                  <h1 className="font-display text-3xl md:text-3xl font-extrabold text-white leading-none tracking-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
                    {t.nav.title}
                  </h1>
                  <p className="text-sm text-accent-400 font-bold uppercase tracking-widest mt-1">
                    {t.nav.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Bold Blocks */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === `${langPrefix}/`}
                className={({ isActive }) =>
                  `px-4 py-2 rounded font-bold text-lg uppercase tracking-wide transition-all transform hover:-translate-y-0.5 ${isActive
                    ? 'bg-primary-600 text-white shadow-[4px_4px_0_0_#fbbf24]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Language Switcher - Solid */}
            <div className="h-8 w-px bg-neutral-700 mx-4"></div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded bg-neutral-800 border border-neutral-600 text-sm font-bold text-white hover:border-accent-400 hover:text-accent-400 transition-all"
              aria-label="Toggle language"
            >
              <Languages size={18} className="text-accent-500" />
              <span className={`${language === 'ta' ? 'text-accent-400' : 'text-neutral-400'}`}>
                தமிழ்
              </span>
              <span className="text-neutral-600">|</span>
              <span className={`${language === 'en' ? 'text-accent-400' : 'text-neutral-400'}`}>
                EN
              </span>
            </button>
          </div>

          {/* Mobile Menu Button - High Contrast */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded bg-neutral-800 text-accent-400 font-bold text-sm border border-neutral-700 hover:border-accent-400 transition-colors"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded bg-primary-600 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-400 shadow-md"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Solid Political Block */}
      {isOpen && (
        <div className="md:hidden bg-secondary-900 border-t border-neutral-800">
          <div className="py-2 space-y-1 px-2 pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === `${langPrefix}/`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block w-full text-left px-4 py-4 rounded text-xl font-bold uppercase tracking-wider transition-all border-b border-neutral-800 ${isActive
                    ? 'bg-primary-600 text-white border-l-8 border-accent-400 pl-2'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white hover:pl-6'
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
