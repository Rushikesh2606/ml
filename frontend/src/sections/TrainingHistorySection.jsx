import { motion } from 'framer-motion';
import { TrendingUp, Award, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

const CONVERGENCE_DATA = [
  {
    model: 'Custom CNN (Baseline)',
    init: 'Random (Scratch)',
    valAcc: 98.55,
    testAcc: 95.37,
    gap: -3.18,
    epochs: '50 Epochs',
    learningDynamics: 'Gradual convergence from scratch. Susceptible to class imbalance with significant generalization gap on rare disease classes.',
    color: 'from-blue-500 to-indigo-600',
    barColor: 'bg-blue-500',
  },
  {
    model: 'ResNet-50 (Transfer Learning)',
    init: 'ImageNet Pretrained',
    valAcc: 99.85,
    testAcc: 99.70,
    gap: -0.15,
    epochs: '25 Epochs',
    learningDynamics: 'Rapid convergence within initial epochs. Residual connections preserve feature gradients and eliminate overfitting.',
    color: 'from-leaf-500 to-emerald-600',
    barColor: 'bg-leaf-500',
    best: true,
  },
  {
    model: 'EfficientNet-B0 (Edge ML)',
    init: 'ImageNet Pretrained',
    valAcc: 98.10,
    testAcc: 97.28,
    gap: -0.82,
    epochs: '30 Epochs',
    learningDynamics: 'Compound scaling allows fast optimization with low parameter count. Balanced accuracy across all crop pathologies.',
    color: 'from-purple-500 to-violet-600',
    barColor: 'bg-purple-500',
  },
];

export default function TrainingHistorySection() {
  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-leaf-900/40 border border-leaf-700/40 text-leaf-400 text-xs font-semibold mb-3">
            Empirical Convergence Analysis
          </span>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Training Dynamics & Generalization</h2>
          <p className="text-gray-400 max-w-3xl">
            Comparative analysis of validation convergence vs held-out test generalization across random scratch initialization and ImageNet transfer learning.
          </p>
        </motion.div>

        {/* Convergence cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {CONVERGENCE_DATA.map((item, i) => (
            <motion.div
              key={item.model}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl bg-gray-900/60 border ${
                item.best ? 'border-leaf-500/50 shadow-lg shadow-leaf-950/50' : 'border-gray-800'
              } p-6 flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-base">{item.model}</h3>
                    <span className="text-xs text-gray-500">{item.init}</span>
                  </div>
                  {item.best && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-leaf-600 text-white text-[11px] font-bold">
                      <Award className="w-3 h-3" /> Top Convergence
                    </span>
                  )}
                </div>

                {/* Progress bars */}
                <div className="space-y-4 my-6">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Best Validation Accuracy</span>
                      <span className="text-white font-bold">{item.valAcc.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.valAcc}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Held-Out Test Accuracy</span>
                      <span className="text-leaf-400 font-bold">{item.testAcc.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div className="h-full rounded-full bg-leaf-400" style={{ width: `${item.testAcc}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-800/40 border border-gray-800 text-xs text-gray-300 leading-relaxed mb-4">
                  {item.learningDynamics}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-800/60">
                <span className="text-gray-500">Generalization Delta:</span>
                <span className={`font-mono font-semibold ${item.gap > -1 ? 'text-leaf-400' : 'text-amber-400'}`}>
                  {item.gap.toFixed(2)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scientific Insights Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-850 border border-gray-800 flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-leaf-600/20 border border-leaf-500/40 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-leaf-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm mb-1">Key Research Takeaway: Transfer Learning Superiority</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Pretraining on large-scale visual features (ImageNet-1k) drastically reduces generalization error on agricultural datasets.
              ResNet-50 and EfficientNet-B0 required 50% fewer optimization iterations while achieving nearly zero generalization loss compared to random initialization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
