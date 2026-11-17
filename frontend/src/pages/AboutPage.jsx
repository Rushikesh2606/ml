import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AboutHeroSection = lazy(() => import('../sections/AboutHeroSection'));
const ProjectContextSection = lazy(() => import('../sections/ProjectContextSection'));
const TeamSection = lazy(() => import('../sections/TeamSection'));
const TechStackSection = lazy(() => import('../sections/TechStackSection'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner size="md" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<SectionLoader />}>
        <AboutHeroSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ProjectContextSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TeamSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TechStackSection />
      </Suspense>
    </div>
  );
}
