import { motion } from 'framer-motion';
import { Clock, Trophy } from 'lucide-react';
import { useEvaluation } from '../hooks/useEvaluation';

const MODELS = ['custom_cnn', 'resnet', 'efficientnet'];

const MODEL_INFO = {
  custom_cnn:   { name: 'Custom CNN',       subtitle: 'Baseline — Trained from Scratch', color: 'border-blue-700/50',   badge: 'bg-blue-900/40 text-blue-300' },
  resnet:       { name: 'ResNet-50',         subtitle: 'Transfer Learning — ImageNet',    color: 'border-leaf-700/50',   badge: 'bg-leaf-900/40 text-leaf-300',  best: true },
  efficientnet: { name: 'EfficientNet-B0',   subtitle: 'Transfer Learning — ImageNet',    color: 'border-purple-700/50', badge: 'bg-purple-900/40 text-purple-300' },
};

const COLS = [
  { key: 'accuracy',         label: 'Test Accuracy' },
  { key: 'macro_precision',  label: 'Macro Precision' },
  { key: 'macro_recall',     label: 'Macro Recall' },
  { key: 'macro_f1',         label: 'Macro F1' },
  { key: 'weighted_f1',      label: 'Weighted F1' },
];

export default function ComparisonTableSection() {
  const { evaluation, loading } = useEvaluation();

  const val = (modelId, metric) => {
    const m = evaluation?.models?.find(x => x.model_id === modelId);
    return m?.metrics?.[metric] ?? null;
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Architecture Comparison</h2>
          <p className="text-gray-400">Side-by-side comparison of key performance metrics on the held-out test set.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {MODELS.map((modelId, i) => {
            const info = MODEL_INFO[modelId];
            return (
              <motion.div
                key={modelId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl bg-gray-800/50 border ${info.color} p-6 relative`}
              >
                {info.best && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-leaf-600 text-white text-xs font-bold">
                      <Trophy className="w-3 h-3" /> Best Model
                    </span>
                  </div>
                )}
                <h3 className="text-white font-bold text-lg mb-1">{info.name}</h3>
                <p className="text-gray-500 text-xs mb-4">{info.subtitle}</p>
                <div className="space-y-3">
                  {COLS.map(({ key, label }) => {
                    const v = val(modelId, key);
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{label}</span>
                        {loading
                          ? <span className="text-gray-600 text-xs">…</span>
                          : v !== null
                            ? <span className={`font-bold text-sm ${info.best ? 'text-leaf-400' : 'text-white'}`}>
                                {(v * 100).toFixed(2)}%
                              </span>
                            : <span className="inline-flex items-center gap-1 text-amber-400 text-xs">
                                <Clock className="w-3 h-3" />Pending
                              </span>
                        }
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
