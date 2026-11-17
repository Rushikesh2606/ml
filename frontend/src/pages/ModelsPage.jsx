import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ModelsHeroSection = lazy(() => import('../sections/ModelsHeroSection'));
const ModelsGridSection = lazy(() => import('../sections/ModelsGridSection'));
const ModelArchitectureSection = lazy(() => import('../sections/ModelArchitectureSection'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner size="md" />
    </div>
  );
}

export default function ModelsPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<SectionLoader />}>
        <ModelsHeroSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ModelsGridSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ModelArchitectureSection />
      </Suspense>
    </div>
  );
}
