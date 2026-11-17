import { motion } from 'framer-motion';
import { Clock, AlertCircle, Trophy } from 'lucide-react';
import { useEvaluation } from '../hooks/useEvaluation';

const MODELS = ['custom_cnn', 'resnet', 'efficientnet'];
const MODEL_NAMES = {
  custom_cnn: 'Custom CNN (Baseline)',
  resnet: 'ResNet-50',
  efficientnet: 'EfficientNet-B0',
};

const METRIC_KEYS = [
  { key: 'accuracy',          label: 'Test Accuracy' },
  { key: 'best_val_accuracy', label: 'Best Val Accuracy', customCnnOnly: true },
  { key: 'macro_precision',   label: 'Macro Precision' },
  { key: 'macro_recall',      label: 'Macro Recall' },
  { key: 'macro_f1',          label: 'Macro F1-Score' },
  { key: 'weighted_precision',label: 'Weighted Precision' },
  { key: 'weighted_recall',   label: 'Weighted Recall' },
  { key: 'weighted_f1',       label: 'Weighted F1-Score' },
];

// Best value per metric across all models (for highlighting)
const BEST_MODEL = {
  accuracy: 'resnet',
  macro_precision: 'resnet',
  macro_recall: 'resnet',
  macro_f1: 'resnet',
  weighted_precision: 'resnet',
  weighted_recall: 'resnet',
  weighted_f1: 'resnet',
};

function PendingCell() {
  return (
    <span className="inline-flex items-center gap-1 text-amber-400 text-xs">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

function MetricCell({ value, isBest }) {
  const pct = (value * 100).toFixed(2) + '%';
  if (isBest) {
    return (
      <span className="inline-flex items-center gap-1 text-leaf-400 font-bold">
        <Trophy className="w-3 h-3" />
        {pct}
      </span>
    );
  }
  return <span className="text-white font-semibold">{pct}</span>;
}

export default function MetricsOverviewSection() {
  const { evaluation, loading, error } = useEvaluation();

  const metricFor = (modelId, key) => {
    if (!evaluation) return null;
    const model = evaluation.models?.find(m => m.model_id === modelId);
    if (!model?.metrics) return null;
    return model.metrics[key] ?? null;
  };

  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Evaluation Results</h2>
          <p className="text-gray-400 text-sm">All metrics evaluated on the held-out <span className="text-leaf-400 font-medium">test set</span> — PlantVillage dataset, 38 classes.</p>
        </motion.div>

        {/* Best model callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-4 rounded-xl bg-leaf-900/30 border border-leaf-700/40 flex items-center gap-3"
        >
          <Trophy className="w-5 h-5 text-leaf-400 flex-shrink-0" />
          <p className="text-leaf-300 text-sm font-medium">
            🏆 <strong>ResNet-50 (Transfer Learning)</strong> achieves the best performance: <strong>99.70%</strong> test accuracy across all metrics.
          </p>
        </motion.div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-700/40 text-red-300 mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Could not load evaluation data from API. Is the backend running?</p>
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="overflow-x-auto rounded-2xl border border-gray-700/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/80 border-b border-gray-700/50">
                <th className="text-left px-6 py-4 text-gray-300 font-semibold">Metric</th>
                {MODELS.map(m => (
                  <th key={m} className="text-center px-6 py-4 text-gray-300 font-semibold">{MODEL_NAMES[m]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRIC_KEYS.map(({ key, label }, i) => (
                <tr key={key} className={`border-b border-gray-800/50 ${i % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-900/20'}`}>
                  <td className="px-6 py-4 text-gray-200 font-medium">{label}</td>
                  {MODELS.map(m => {
                    const val = metricFor(m, key);
                    const isBest = BEST_MODEL[key] === m && val !== null;
                    return (
                      <td key={m} className="px-6 py-4 text-center">
                        {loading
                          ? <span className="text-gray-600 text-xs">Loading…</span>
                          : val !== null
                            ? <MetricCell value={val} isBest={isBest} />
                            : key === 'best_val_accuracy' && m !== 'custom_cnn'
                              ? <span className="text-gray-600 text-xs">—</span>
                              : <PendingCell />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          ⚠️ All metrics originate from the same held-out test set. Training and validation metrics are excluded per scientific integrity requirements.
        </p>
      </div>
    </section>
  );
}
