import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MethodologyHeroSection = lazy(() => import('../sections/MethodologyHeroSection'));
const DatasetSection = lazy(() => import('../sections/DatasetSection'));
const TrainingSetupSection = lazy(() => import('../sections/TrainingSetupSection'));
const EvaluationMethodSection = lazy(() => import('../sections/EvaluationMethodSection'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner size="md" />
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<SectionLoader />}>
        <MethodologyHeroSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <DatasetSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TrainingSetupSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <EvaluationMethodSection />
      </Suspense>
    </div>
  );
}
