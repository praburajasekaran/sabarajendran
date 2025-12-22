import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import {
    generateFilteredTitle,
    generateFilteredDescription,
    shouldIndexFilteredPage,
    generateCanonicalUrl,
    generateProjectStructuredData,
    generateBreadcrumbStructuredData
} from '../utils/seo';
import type { FilterState } from '../utils/urlBuilder';

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
        ? 'சபா இராசேந்திரன் | நெய்வேலி சட்டமன்ற உறுப்பினர்'
        : 'Saba. Rajendran | Neyveli MLA';

    const defaultDescription = language === 'ta'
        ? 'நெய்வேலி தொகுதியின் வளர்ச்சிப் பணிகள் மற்றும் திட்டங்கள்.'
        : 'Official website of Saba. Rajendran, MLA of Neyveli Constituency. Track development projects and updates.';

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || defaultDescription;
    const siteUrl = 'https://sabarajendran.com'; // Replace with actual domain

    // Determine current path and generate language alternates
    const currentPath = url || window.location.pathname;
    const isOnTamilPage = currentPath.startsWith('/ta');

    // Generate URLs for both languages
    const enPath = isOnTamilPage ? currentPath.replace(/^\/ta/, '') || '/' : currentPath;
    const taPath = isOnTamilPage ? currentPath : `/ta${currentPath}`;

    const fullUrl = `${siteUrl}${currentPath}`;
    const enUrl = `${siteUrl}${enPath}`;
    const taUrl = `${siteUrl}${taPath}`;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* HTML lang attribute */}
            <html lang={language} />

            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={fullUrl} />

            {/* Language Alternates */}
            <link rel="alternate" hrefLang="en" href={enUrl} />
            <link rel="alternate" hrefLang="ta" href={taUrl} />
            <link rel="alternate" hrefLang="x-default" href={enUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={`${title || siteTitle} - Neyveli Constituency`} />
            <meta property="og:locale" content={language === 'ta' ? 'ta_IN' : 'en_IN'} />
            <meta property="og:locale:alternate" content={language === 'ta' ? 'en_IN' : 'ta_IN'} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={fullImage} />
            <meta property="twitter:image:alt" content={`${title || siteTitle} - Neyveli Constituency`} />
        </Helmet>
    );
};

/**
 * SEO Component for Filtered Project Pages
 *
 * Generates dynamic SEO meta tags based on active filter state.
 * Implements strategic indexing for Meta ad campaigns and local SEO.
 */
interface ProjectsSEOProps {
    filters: FilterState;
    resultCount: number;
}

export const ProjectsSEO: React.FC<ProjectsSEOProps> = ({ filters, resultCount }) => {
    const { language } = useLanguage();

    // Generate dynamic SEO content
    const title = generateFilteredTitle(filters, language);
    const description = generateFilteredDescription(filters, resultCount, language);
    const canonicalUrl = generateCanonicalUrl(filters);
    const shouldIndex = shouldIndexFilteredPage(filters);

    // Determine if we're on a Tamil page and generate language alternates
    const currentPath = window.location.pathname;
    const isOnTamilPage = currentPath.startsWith('/ta');

    // Generate URLs for both languages
    const enPath = isOnTamilPage ? currentPath.replace(/^\/ta/, '') || '/' : currentPath;
    const taPath = isOnTamilPage ? currentPath : `/ta${currentPath}`;

    const siteUrl = 'https://sabarajendran.com';
    const enUrl = `${siteUrl}${enPath}${window.location.search}`;
    const taUrl = `${siteUrl}${taPath}${window.location.search}`;

    // Generate structured data
    const projectData = generateProjectStructuredData(filters, resultCount);
    const breadcrumbData = generateBreadcrumbStructuredData(filters);

    return (
        <Helmet>
            {/* HTML lang attribute */}
            <html lang={language} />

            {/* Standard Metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Language Alternates */}
            <link rel="alternate" hrefLang="en" href={enUrl} />
            <link rel="alternate" hrefLang="ta" href={taUrl} />
            <link rel="alternate" hrefLang="x-default" href={enUrl} />

            {/* Robots Meta - Strategic Indexing */}
            {!shouldIndex && <meta name="robots" content="noindex, follow" />}

            {/* Open Graph / Facebook (Critical for Meta Ads!) */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content="Saba. Rajendran MLA" />
            <meta property="og:locale" content={language === 'ta' ? 'ta_IN' : 'en_IN'} />
            <meta property="og:locale:alternate" content={language === 'ta' ? 'en_IN' : 'ta_IN'} />
            <meta property="og:image" content="https://sabarajendran.com/og-image.jpg" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Saba Rajendran - MLA Neyveli Constituency Projects" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content="https://sabarajendran.com/og-image.jpg" />
            <meta name="twitter:image:alt" content="Saba Rajendran - MLA Neyveli Constituency Projects" />

            {/* Structured Data - Project Information */}
            <script type="application/ld+json">
                {JSON.stringify(projectData)}
            </script>

            {/* Structured Data - Breadcrumbs (for location hierarchy) */}
            {breadcrumbData && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbData)}
                </script>
            )}
        </Helmet>
    );
};
