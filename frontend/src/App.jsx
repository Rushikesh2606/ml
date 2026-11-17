import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { PageLoader } from './components/ui/LoadingSpinner';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ModelsPage = lazy(() => import('./pages/ModelsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DetectPage = lazy(() => import('./pages/DetectPage'));
const MethodologyPage = lazy(() => import('./pages/MethodologyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans antialiased">
        <Navbar />

        {/* Page content — padded for fixed navbar height */}
        <main className="flex-1 pt-16">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/models" element={<ModelsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/detect" element={<DetectPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
