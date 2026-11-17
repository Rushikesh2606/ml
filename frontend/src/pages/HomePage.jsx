import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HeroSection = lazy(() => import('../sections/HeroSection'));
const ModelsOverviewSection = lazy(() => import('../sections/ModelsOverviewSection'));
const ResearchObjectiveSection = lazy(() => import('../sections/ResearchObjectiveSection'));
const WorkflowSection = lazy(() => import('../sections/WorkflowSection'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner size="md" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<SectionLoader />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ModelsOverviewSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ResearchObjectiveSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WorkflowSection />
      </Suspense>
    </div>
  );
}
