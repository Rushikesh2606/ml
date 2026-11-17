import { motion } from 'framer-motion';
import { Layers, Cpu, Zap, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const CONFUSION_ANALYSIS = [
  {
    model: 'Custom CNN (Baseline)',
    accuracy: '95.37%',
    macroRecall: '52.40%',
    macroF1: '19.70%',
    statusColor: 'border-blue-700/40',
    summary: 'High overall accuracy driven by dominant majority classes, but suffers from false negatives on underrepresented diseases.',
    challengePair: 'Tomato Late Blight vs Septoria Leaf Spot',
    finding: 'Lacks deep spatial feature hierarchies needed to separate subtle foliar lesions without pretrained feature extractors.',
  },
  {
    model: 'ResNet-50 (Transfer Learning)',
    accuracy: '99.70%',
    macroRecall: '99.70%',
    macroF1: '99.70%',
    best: true,
    statusColor: 'border-leaf-600/60',
    summary: 'Virtually diagonal confusion matrix across all 38 classes. Negligible cross-disease false positives or false negatives.',
    challengePair: 'Apple Scab vs Black Rot vs Cedar Apple Rust',
    finding: 'Residual representations cleanly isolate distinctive necrotic lesion margins and fungal spore patterns.',
  },
  {
    model: 'EfficientNet-B0 (Edge ML)',
    accuracy: '97.28%',
    macroRecall: '97.28%',
    macroF1: '97.27%',
    statusColor: 'border-purple-700/40',
    summary: 'Uniformly high precision and recall across all plant species. Minimal confusion even in compressed TFLite format.',
    challengePair: 'Corn Common Rust vs Northern Leaf Blight',
    finding: 'MBConv compound scaling captures both fine vein texture and global leaf shape efficiently.',
  },
];

const COMMON_CHALLENGES = [
  { disease: 'Tomato Early Blight vs Late Blight', diff: 'Concentric rings vs water-soaked lesions', resnetScore: '99.8%', cnnScore: '89.2%' },
  { disease: 'Apple Scab vs Black Rot', diff: 'Velvety olive spots vs concentric pycnidia', resnetScore: '99.7%', cnnScore: '91.4%' },
  { disease: 'Pepper Bell Bacterial Spot vs Healthy', diff: 'Early micro-pustules on leaf undersides', resnetScore: '99.9%', cnnScore: '94.0%' },
  { disease: 'Corn Common Rust vs Leaf Blight', diff: 'Circular cinnamon pustules vs elongated lesions', resnetScore: '99.6%', cnnScore: '92.1%' },
];

export default function ConfusionMatrixSection() {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-leaf-900/40 border border-leaf-700/40 text-leaf-400 text-xs font-semibold mb-3">
            Error & Confusion Diagnostics
          </span>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Class-Level Confusion & Error Analysis</h2>
          <p className="text-gray-400 max-w-3xl">
            Detailed examination of classification boundaries across challenging foliar diseases and class imbalance sensitivity.
          </p>
        </motion.div>

        {/* 3 Model Diagnostic Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {CONFUSION_ANALYSIS.map((c, i) => (
            <motion.div
              key={c.model}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl bg-gray-800/60 border ${c.statusColor} p-6 flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold text-base">{c.model}</h3>
                  {c.best && (
                    <span className="px-2 py-0.5 rounded-full bg-leaf-600 text-white text-[11px] font-bold">
                      Top Matrix
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 my-4">
                  <div className="p-2 rounded-lg bg-gray-900/80 text-center">
                    <span className="text-[10px] text-gray-500 block">Accuracy</span>
                    <span className="text-xs font-bold text-white">{c.accuracy}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-900/80 text-center">
                    <span className="text-[10px] text-gray-500 block">Macro Recall</span>
                    <span className={`text-xs font-bold ${c.macroRecall.startsWith('99') ? 'text-leaf-400' : 'text-amber-400'}`}>
                      {c.macroRecall}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-900/80 text-center">
                    <span className="text-[10px] text-gray-500 block">Macro F1</span>
                    <span className={`text-xs font-bold ${c.macroF1.startsWith('99') ? 'text-leaf-400' : 'text-amber-400'}`}>
                      {c.macroF1}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed mb-4">{c.summary}</p>
              </div>

              <div className="pt-3 border-t border-gray-700/50 text-xs space-y-1">
                <span className="text-gray-500 block font-medium">Critical Discrimination Case:</span>
                <span className="text-leaf-300 font-semibold">{c.challengePair}</span>
                <p className="text-gray-400 text-[11px] leading-tight pt-1">{c.finding}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Challenging Pathologies Table */}
        <div className="rounded-2xl bg-gray-800/40 border border-gray-700/50 overflow-hidden">
          <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-sm">Fine-Grained Disease Separation</h3>
              <p className="text-gray-400 text-xs mt-0.5">Accuracy on visually similar and historically confusable plant pathologies</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-leaf-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-850 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-700/50">
                <tr>
                  <th className="px-5 py-3.5">Disease Pair Under Examination</th>
                  <th className="px-5 py-3.5">Differentiating Pathological Markers</th>
                  <th className="px-5 py-3.5 text-center">ResNet-50</th>
                  <th className="px-5 py-3.5 text-center">Custom CNN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {COMMON_CHALLENGES.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{item.disease}</td>
                    <td className="px-5 py-3 text-gray-400">{item.diff}</td>
                    <td className="px-5 py-3 text-center text-leaf-400 font-bold">{item.resnetScore}</td>
                    <td className="px-5 py-3 text-center text-gray-300 font-medium">{item.cnnScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
