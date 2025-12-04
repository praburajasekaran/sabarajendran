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

    // Generate structured data
    const projectData = generateProjectStructuredData(filters, resultCount);
    const breadcrumbData = generateBreadcrumbStructuredData(filters);

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Robots Meta - Strategic Indexing */}
            {!shouldIndex && <meta name="robots" content="noindex, follow" />}

            {/* Open Graph / Facebook (Critical for Meta Ads!) */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content="Saba Rajendran MLA" />
            <meta property="og:locale" content={language === 'ta' ? 'ta_IN' : 'en_IN'} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

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
