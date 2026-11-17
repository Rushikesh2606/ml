import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DashboardHeaderSection = lazy(() => import('../sections/DashboardHeaderSection'));
const MetricsOverviewSection = lazy(() => import('../sections/MetricsOverviewSection'));
const ConfusionMatrixSection = lazy(() => import('../sections/ConfusionMatrixSection'));
const TrainingHistorySection = lazy(() => import('../sections/TrainingHistorySection'));
const ComparisonTableSection = lazy(() => import('../sections/ComparisonTableSection'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner size="md" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<SectionLoader />}>
        <DashboardHeaderSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <MetricsOverviewSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ConfusionMatrixSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TrainingHistorySection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ComparisonTableSection />
      </Suspense>
    </div>
  );
}
