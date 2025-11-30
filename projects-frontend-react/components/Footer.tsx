import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-black text-stone-300 py-12 border-t-8 border-primary-600 relative overflow-hidden">
      {/* Giant Rising Sun Watermark */}
      <div className="absolute -bottom-24 -right-24 text-secondary-600 opacity-5 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" />
          <path d="M12 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4.93 4.93L7.05 7.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16.95 16.95L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M19 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4.93 19.07L7.05 16.95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16.95 7.05L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 uppercase tracking-wider border-l-4 border-secondary-500 pl-3">
              {t.footer.aboutTitle}
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              {t.footer.aboutDesc}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-500 hover:text-primary-500 transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="text-stone-500 hover:text-primary-500 transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="text-stone-500 hover:text-primary-500 transition-colors" aria-label="Website"><Globe size={20} /></a>
            </div>
            {/* Party Flag Colors Mini Strip */}
            <div className="mt-6 flex h-1 w-24">
              <div className="w-1/2 bg-black"></div>
              <div className="w-1/2 bg-primary-600"></div>
            </div>
          </div>

          {/* Column 2: Quick Links (Static for now) */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 uppercase tracking-wider border-l-4 border-secondary-500 pl-3">{t.footer.officeTitle}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={16} className="mt-1 mr-2 text-primary-600 flex-shrink-0" />
                <span>MLA Office, Main Road, Neyveli Township, Tamil Nadu - 607801</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mt-1 mr-2 text-primary-600 flex-shrink-0" />
                <span>Camp Office, Vadalur, Cuddalore District</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 uppercase tracking-wider border-l-4 border-secondary-500 pl-3">{t.footer.contactTitle}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-primary-600" />
                <span>+91 4142 222 333</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-primary-600" />
                <span>contact@neyvelimla.in</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-stone-900 rounded-lg border border-stone-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" />
                  <path d="M12 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-xs text-primary-500 italic font-medium relative z-10">{t.footer.quote}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-stone-900 pt-8 text-center">
          <p className="text-xs text-stone-500 mb-2">
            {language === 'ta' ? 'திராவிட மாடல் ஆட்சி' : 'Dravidian Model Governance'}
          </p>
          <p className="text-xs text-stone-600">&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};