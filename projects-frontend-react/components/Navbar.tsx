import React, { useState } from 'react';
import { Menu, X, Languages, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Get language prefix for all links
  const langPrefix = language === 'en' ? '/en' : '';

  const navItems = [
    { name: t.nav.home, path: `${langPrefix}/` },
    { name: t.nav.about, path: `${langPrefix}/about` },
    { name: t.nav.projects, path: `${langPrefix}/projects` },
    { name: t.nav.gallery, path: `${langPrefix}/gallery` },
    // { name: t.nav.grievance, path: `${langPrefix}/grievance` },
  ];

  const toggleLanguage = () => {
    const currentPath = location.pathname;
    const searchParams = location.search; // Preserve query parameters

    if (language === 'ta') {
      // Switch to English: /projects → /en/projects
      const newPath = '/en' + currentPath;
      navigate(newPath + searchParams);
    } else {
      // Switch to Tamil: /en/projects → /projects
      const newPath = currentPath.replace(/^\/en/, '') || '/';
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
              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src="/assets/images/nav_logo.png"
                  alt="Saba. Rajendran Logo"
                  className="w-10 h-10 md:w-14 md:h-14 rounded-lg border-2 border-accent-400 shadow-md transform group-hover:scale-105 transition-transform object-cover"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="font-display text-xl md:text-3xl font-extrabold text-white leading-none tracking-tight uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
                    {t.nav.title}
                  </h1>
                  <p className="text-[10px] md:text-sm text-accent-200 font-bold uppercase tracking-wide leading-none mt-1">
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
                    ? 'bg-primary-600 text-white shadow-[4px_4px_0_0_#8B6F47]'
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

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 ml-2">
              <a
                href="https://www.instagram.com/saba_rajendran_mla"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-gradient-to-tr from-purple-600 to-pink-600 text-white hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={2.5} />
              </a>
              <a
                href="https://www.facebook.com/SabaMlaDMK"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-primary-600 text-white hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <Facebook size={18} strokeWidth={2.5} />
              </a>
              <a
                href="https://x.com/rajendran_saba"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-black text-white hover:scale-110 transition-transform"
                aria-label="X (Twitter)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                  className="stroke-current stroke-0"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
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

            {/* Social Media Section in Mobile Menu */}
            <div className="pt-4 mt-4 border-t border-neutral-800">
              <p className="text-accent-400 font-bold text-sm uppercase tracking-wider px-4 mb-3">
                {language === 'ta' ? 'சமூக ஊடகங்கள்' : 'Follow Us'}
              </p>
              <div className="flex gap-3 px-4">
                <a
                  href="https://www.instagram.com/saba_rajendran_mla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 bg-gradient-to-tr from-purple-600 to-pink-600 text-white rounded text-center hover:scale-105 transition-transform shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram size={24} strokeWidth={2.5} className="mx-auto" />
                </a>
                <a
                  href="https://www.facebook.com/SabaMlaDMK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 bg-primary-600 text-white rounded text-center hover:scale-105 transition-transform shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook size={24} strokeWidth={2.5} className="mx-auto" />
                </a>
                <a
                  href="https://x.com/rajendran_saba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 bg-black text-white rounded text-center hover:scale-105 transition-transform shadow-md"
                  aria-label="X (Twitter)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                    className="mx-auto stroke-current stroke-0"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
