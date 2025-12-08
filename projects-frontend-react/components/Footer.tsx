import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-secondary-900 text-white pt-20 pb-8 border-t-8 border-accent-400 relative overflow-hidden">
      {/* Sun Rays Texture (Political) */}
      <div className="absolute inset-0 sun-rays-texture opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: About */}
          <div>
            <h3 className="font-display text-2xl font-extrabold text-accent-400 mb-6 uppercase tracking-wider border-l-4 border-primary-600 pl-3">
              {t.footer.aboutTitle}
            </h3>
            <p className="text-neutral-300 text-lg leading-relaxed mb-8 font-medium">
              {t.footer.aboutDesc}
            </p>
            {/* Social Links - Big & Bold */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/SabaMlaDMK"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-600 text-white hover:bg-white hover:text-primary-600 transition-all transform hover:-translate-y-1 shadow-[4px_4px_0_0_#000]"
                aria-label="Facebook"
              >
                <Facebook size={24} strokeWidth={2.5} />
              </a>
              <a
                href="https://x.com/rajendran_saba"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-black text-white hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-[4px_4px_0_0_#dc2626]"
                aria-label="Twitter"
              >
                <Twitter size={24} strokeWidth={2.5} />
              </a>
              <a
                href="https://www.instagram.com/saba_rajendran_mla"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-tr from-purple-600 to-pink-600 text-white hover:from-white hover:to-white hover:text-pink-600 transition-all transform hover:-translate-y-1 shadow-[4px_4px_0_0_#000]"
                aria-label="Instagram"
              >
                <Instagram size={24} strokeWidth={2.5} />
              </a>
            </div>
          </div>

          {/* Column 2: Office Locations */}
          <div>
            <h3 className="font-display text-2xl font-extrabold text-accent-400 mb-6 uppercase tracking-wider border-l-4 border-primary-600 pl-3">
              {t.footer.officeTitle}
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="p-2 bg-neutral-800 rounded text-accent-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <span className="text-lg text-neutral-200 group-hover:text-white font-bold transition-colors uppercase">
                  {t.footer.office1}
                </span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="p-2 bg-neutral-800 rounded text-accent-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <span className="text-lg text-neutral-200 group-hover:text-white font-bold transition-colors uppercase">
                  {t.footer.office2}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-display text-2xl font-extrabold text-accent-400 mb-6 uppercase tracking-wider border-l-4 border-primary-600 pl-3">
              {t.footer.contactTitle}
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-neutral-800 rounded text-accent-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <Phone size={24} />
                </div>
                <span className="text-2xl text-white font-bold tracking-tight">
                  +91 4142 222 333
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-neutral-800 rounded text-accent-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <span className="text-lg text-neutral-200 font-bold group-hover:text-white transition-colors">
                  contact@neyvelimla.in
                </span>
              </li>
            </ul>

            {/* Quote Card - Bold Political Statement */}
            <div className="mt-8 p-6 bg-primary-600 text-white relative shadow-lg border-2 border-black transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute -top-3 -left-3 text-4xl text-black font-serif">"</div>
              <p className="text-xl font-bold italic leading-tight text-center">
                {t.footer.quote}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 bg-neutral-800 px-6 py-3 rounded-full border border-neutral-700">
              <div className="h-3 w-3 rounded-full bg-primary-500 animate-pulse"></div>
              <p className="text-sm text-accent-400 font-bold uppercase tracking-widest">
                {language === 'ta' ? 'திராவிட மாடல் ஆட்சி' : 'Dravidian Model Governance'}
              </p>
            </div>
            <p className="text-sm text-neutral-500 font-mono">
              &copy; {new Date().getFullYear()} {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
