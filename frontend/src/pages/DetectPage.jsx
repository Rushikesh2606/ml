import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DetectHeroSection = lazy(() => import('../sections/DetectHeroSection'));
const ImageUploadSection = lazy(() => import('../sections/ImageUploadSection'));
const PredictionResultSection = lazy(() => import('../sections/PredictionResultSection'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner size="md" />
    </div>
  );
}

export default function DetectPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<SectionLoader />}>
        <DetectHeroSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ImageUploadSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <PredictionResultSection />
      </Suspense>
    </div>
  );
}
