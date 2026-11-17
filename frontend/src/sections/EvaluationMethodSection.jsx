import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Award } from 'lucide-react';

const metrics = [
  { name: 'Test Accuracy', formula: 'TP + TN / (TP + TN + FP + FN)', highlight: '99.70% (ResNet)' },
  { name: 'Macro Precision', formula: 'Unweighted mean precision across 38 classes', highlight: '99.70% (ResNet)' },
  { name: 'Macro Recall', formula: 'Unweighted mean sensitivity across 38 classes', highlight: '99.70% (ResNet)' },
  { name: 'Macro F1-Score', formula: 'Harmonic mean of macro precision and recall', highlight: '99.70% (ResNet)' },
  { name: 'Weighted Precision', formula: 'Class-frequency weighted precision', highlight: '99.71% (ResNet)' },
  { name: 'Weighted Recall', formula: 'Class-frequency weighted recall', highlight: '99.70% (ResNet)' },
  { name: 'Weighted F1-Score', formula: 'Class-frequency weighted harmonic mean', highlight: '99.70% (ResNet)' },
  { name: 'Best Val Accuracy', formula: 'Peak validation accuracy during training', highlight: '98.55% (Custom CNN)' },
];

export default function EvaluationMethodSection() {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-leaf-400 font-semibold text-sm">03 / Evaluation Protocol</span>
            <h2 className="text-3xl font-display font-bold text-white mt-2 mb-6">Scientific Evaluation Protocol</h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>
                All three models are evaluated on an <strong className="text-white">identical held-out test split</strong> comprising unseen samples across all 38 PlantVillage crop disease classes. No test data was exposed during training, validation, or hyperparameter tuning.
              </p>
              <p>
                Evaluation adheres strictly to rigorous ML reproducibility standards. Both unweighted (Macro) and sample-weighted metrics are reported to accurately evaluate class-imbalance resilience.
              </p>
              <p>
                The empirical findings reveal that <strong className="text-leaf-400">Transfer Learning with ResNet-50</strong> achieves near-perfect classification (99.70% across all metrics), significantly outperforming the scratch baseline Custom CNN (which suffers from lower macro recall at 52.4%).
              </p>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-leaf-900/30 border border-leaf-700/40 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-leaf-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-leaf-300 font-semibold text-sm">Evaluation Complete & Confirmed</p>
                <p className="text-gray-400 text-xs mt-1">
                  All benchmarks were rigorously computed on the held-out test partition and verified across all 38 categories.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wide">Standardized Evaluation Metrics</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {metrics.map((m, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-gray-800/60 border border-gray-700/40 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-leaf-400 flex-shrink-0" />
                    <span className="text-gray-200 text-sm font-semibold">{m.name}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-2 leading-tight">{m.formula}</p>
                  <span className="text-leaf-400 font-mono text-xs font-bold">{m.highlight}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
