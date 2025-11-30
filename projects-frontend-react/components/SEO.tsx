import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image = '/og-image.jpg', // Default image
    url,
    type = 'website'
}) => {
    const { language } = useLanguage();

    const siteTitle = language === 'ta'
        ? 'சபா ராஜேந்திரன் | நெய்வேலி சட்டமன்ற உறுப்பினர்'
        : 'Saba Rajendran | Neyveli MLA';

    const defaultDescription = language === 'ta'
        ? 'நெய்வேலி தொகுதியின் வளர்ச்சிப் பணிகள் மற்றும் திட்டங்கள்.'
        : 'Official website of Saba Rajendran, MLA of Neyveli Constituency. Track development projects and updates.';

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || defaultDescription;
    const siteUrl = 'https://sabarajendran.com'; // Replace with actual domain
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={fullImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={fullImage} />
        </Helmet>
    );
};
