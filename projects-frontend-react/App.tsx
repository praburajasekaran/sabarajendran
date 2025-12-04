import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { ProjectsPage } from './pages/Projects';

import { LanguageProvider } from './contexts/LanguageContext';
import { HelmetProvider } from 'react-helmet-async';

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />

        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:blockSlug" element={<ProjectsPage />} />
            <Route path="/projects/:blockSlug/:panchayatSlug" element={<ProjectsPage />} />
            <Route path="/projects/:blockSlug/:panchayatSlug/:villageSlug" element={<ProjectsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />


      </div>
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