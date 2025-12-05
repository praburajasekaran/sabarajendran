import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-16 border-t-2 border-accent-500 relative overflow-hidden">
      {/* Subtle Kolam Texture Overlay */}
      <div className="absolute inset-0 kolam-texture opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: About */}
          <div>
            <h3 className="font-serif text-h3 font-bold text-white mb-4 pb-2 border-b border-accent-600/30">
              {t.footer.aboutTitle}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              {t.footer.aboutDesc}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/SabaMlaDMK"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-primary-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/rajendran_saba"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-primary-600 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/saba_rajendran_mla"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-primary-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Office Locations */}
          <div>
            <h3 className="font-serif text-h3 font-bold text-white mb-4 pb-2 border-b border-accent-600/30">
              {t.footer.officeTitle}
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="mt-0.5 text-accent-500 flex-shrink-0 group-hover:text-primary-500 transition-colors" />
                <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  MLA Office, Main Road, Neyveli Township, Tamil Nadu - 607801
                </span>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="mt-0.5 text-accent-500 flex-shrink-0 group-hover:text-primary-500 transition-colors" />
                <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  Camp Office, Vadalur, Cuddalore District
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-serif text-h3 font-bold text-white mb-4 pb-2 border-b border-accent-600/30">
              {t.footer.contactTitle}
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-accent-500 flex-shrink-0 group-hover:text-primary-500 transition-colors" />
                <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  +91 4142 222 333
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className="text-accent-500 flex-shrink-0 group-hover:text-primary-500 transition-colors" />
                <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  contact@neyvelimla.in
                </span>
              </li>
            </ul>

            {/* Quote Card - Editorial Style */}
            <div className="mt-6 p-4 bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-accent-600/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-transparent"></div>
              <p className="text-xs text-accent-300 italic font-medium relative z-10 leading-relaxed">
                "{t.footer.quote}"
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
                {language === 'ta' ? 'திராவிட மாடல் ஆட்சி' : 'Dravidian Model Governance'}
              </p>
            </div>
            <p className="text-xs text-neutral-600">
              &copy; {new Date().getFullYear()} {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
