import { motion } from 'framer-motion';
import { Layers, Cpu, Zap, Trophy } from 'lucide-react';

const setups = [
  {
    icon: Layers,
    name: 'Custom CNN',
    framework: 'PyTorch (Python)',
    approach: 'Trained from Scratch',
    color: 'border-blue-700/50',
    details: [
      'Initialization: Random weights (scratch baseline)',
      'Input Dimensions: 128 × 128 RGB',
      'Architecture: 4-stage Conv-BatchNorm-ReLU-Pool hierarchy',
      'Regularization: Dropout (p=0.5) + Weight Decay',
      'Performance: 98.55% Best Val Acc | 95.37% Test Acc',
    ],
  },
  {
    icon: Cpu,
    name: 'ResNet-50',
    framework: 'PyTorch (Python)',
    approach: 'Transfer Learning & Fine-Tuning',
    color: 'border-leaf-700/50',
    best: true,
    details: [
      'Initialization: ImageNet-1k Pretrained backbone',
      'Input Dimensions: 224 × 224 RGB (ImageNet norm)',
      'Head: 38-class Linear classification head',
      'Optimization: End-to-end fine-tuning with residual skip connections',
      'Performance: 99.70% Test Acc | 99.70% Macro F1 🏆',
    ],
  },
  {
    icon: Zap,
    name: 'EfficientNet-B0',
    framework: 'TensorFlow Lite',
    approach: 'Transfer Learning → TFLite Export',
    color: 'border-purple-700/50',
    details: [
      'Initialization: ImageNet Pretrained compound-scaled backbone',
      'Input Dimensions: 224 × 224 RGB',
      'Runtime: TensorFlow Lite FP32 FlatBuffer execution',
      'Deployment: Optimized for low memory footprint and edge devices',
      'Performance: 97.28% Test Acc | 97.27% Macro F1',
    ],
  },
];

export default function TrainingSetupSection() {
  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-leaf-400 font-semibold text-sm">02 / Training Setup</span>
          <h2 className="text-3xl font-display font-bold text-white mt-2 mb-3">Model Configurations & Specifications</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Architectural blueprints and training methodologies employed across the comparative study.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {setups.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl bg-gray-800/50 border ${s.color} p-6 relative flex flex-col justify-between`}
            >
              {s.best && (
                <div className="absolute -top-3 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-leaf-600 text-white text-xs font-bold shadow-md shadow-leaf-900/50">
                    <Trophy className="w-3 h-3" /> Top Performer
                  </span>
                </div>
              )}
              <div>
                <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-leaf-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{s.name}</h3>
                <p className="text-leaf-400 text-xs font-medium mb-1">{s.framework}</p>
                <p className="text-gray-400 text-sm mb-4 font-mono text-xs">{s.approach}</p>
                <ul className="space-y-2.5">
                  {s.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-leaf-400 mt-0.5 flex-shrink-0">✓</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
