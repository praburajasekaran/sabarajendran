import React, { useState } from 'react';
import { Menu, X, Home, FolderKanban, Languages, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { NavLink, Link, useNavigate } from 'react-router-dom';

// Custom Rising Sun Icon Component
const RisingSunIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M3 21h18" />
    <path d="M12 2v6" />
    <path d="M12 16v6" />
    <path d="M4.93 4.93l4.24 4.24" />
    <path d="M14.83 14.83l4.24 4.24" />
    <path d="M14.83 9.17l4.24-4.24" />
    <path d="M14.83 9.17l4.24-4.24" />
    <path d="M4.93 19.07l4.24-4.24" />
  </svg>
);

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { name: t.nav.home, path: '/', icon: Home },
    { name: t.nav.about, path: '/about', icon: User },
    { name: t.nav.projects, path: '/projects', icon: FolderKanban },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-primary-600 border border-primary-600">
                <RisingSunIcon size={24} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-black leading-tight">{t.nav.title}</h1>
                <p className="text-xs text-primary-700 font-bold tracking-wide uppercase">{t.nav.subtitle}</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'text-primary-700 bg-primary-50 font-bold'
                    : 'text-stone-600 hover:text-primary-600 hover:bg-stone-50'
                  }`}
              >
                <item.icon size={18} className="mr-1.5" />
                {item.name}
              </NavLink>
            ))}

            {/* Language Switcher */}
            <div className="h-6 w-px bg-stone-200 mx-2"></div>
            <button
              onClick={toggleLanguage}
              className="flex items-center px-3 py-2 rounded-full border border-stone-200 text-sm font-medium text-stone-700 hover:border-black hover:text-black transition-all bg-stone-50"
            >
              <Languages size={16} className="mr-2 text-primary-600" />
              <span className={language === 'ta' ? 'font-bold text-black' : ''}>தமிழ்</span>
              <span className="mx-1.5 text-stone-300">|</span>
              <span className={language === 'en' ? 'font-bold text-black' : ''}>EN</span>
            </button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-md text-primary-700 bg-primary-50 font-bold text-sm border border-primary-100"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-stone-400 hover:text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-200">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block w-full text-left pl-3 pr-4 py-3 rounded-md text-base font-medium ${isActive
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 border-l-4 border-transparent'
                  }`}
              >
                <div className="flex items-center">
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};