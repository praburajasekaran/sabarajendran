import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageLoader } from './components/PageLoader';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const ProjectsPage = lazy(() => import('./pages/Projects').then(module => ({ default: module.ProjectsPage })));
// const GrievancePage = lazy(() => import('./pages/Grievance').then(module => ({ default: module.GrievancePage })));
const GalleryPage = lazy(() => import('./pages/Gallery').then(module => ({ default: module.GalleryPage })));

import { LanguageProvider, LanguageSync } from './contexts/LanguageContext';
import { HelmetProvider } from 'react-helmet-async';

import { ScrollToTop } from './components/ScrollToTop';

const AppContent: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <LanguageSync>
        <div className="min-h-screen bg-secondary-50 font-sans flex flex-col">
          <Navbar />

          <main className="flex-grow flex flex-col">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Tamil routes (default - no prefix) */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<ProjectsPage />} />
                {/* <Route path="/grievance" element={<GrievancePage />} /> */}
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/projects/:blockSlug" element={<ProjectsPage />} />
                <Route path="/projects/:blockSlug/:panchayatSlug" element={<ProjectsPage />} />
                <Route path="/projects/:blockSlug/:panchayatSlug/:villageSlug" element={<ProjectsPage />} />

                {/* English routes */}
                <Route path="/en" element={<Home />} />
                <Route path="/en/about" element={<About />} />
                <Route path="/en/projects" element={<ProjectsPage />} />
                {/* <Route path="/en/grievance" element={<GrievancePage />} /> */}
                <Route path="/en/gallery" element={<GalleryPage />} />
                <Route path="/en/projects/:blockSlug" element={<ProjectsPage />} />
                <Route path="/en/projects/:blockSlug/:panchayatSlug" element={<ProjectsPage />} />
                <Route path="/en/projects/:blockSlug/:panchayatSlug/:villageSlug" element={<ProjectsPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />


        </div>
      </LanguageSync>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </LanguageProvider>
  );
};

export default App;