import { motion } from 'framer-motion';
import { Layers, Cpu, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useModels } from '../hooks/useModels';

const MODEL_DEFS = [
  {
    id: 'custom_cnn',
    icon: Layers,
    name: 'Custom CNN (Baseline)',
    framework: 'PyTorch',
    frameworkColor: 'bg-orange-900/40 text-orange-300 border-orange-700/40',
    approach: 'Trained from Scratch',
    fileFormat: '.pth (PyTorch Checkpoint)',
    variant: '4-Stage ConvNet with Dropout',
    detail: 'Designed specifically as the research baseline. Evaluates performance without transfer learning priors.',
    accuracy: '95.37%',
    bestVal: '98.55%',
    macroF1: '19.70%',
    status: 'AVAILABLE',
  },
  {
    id: 'resnet',
    icon: Cpu,
    name: 'ResNet-50',
    framework: 'PyTorch',
    frameworkColor: 'bg-green-900/40 text-green-300 border-green-700/40',
    approach: 'Transfer Learning & Fine-Tuning',
    fileFormat: '.pth (PyTorch Checkpoint)',
    variant: 'ResNet-50 (50 Layers Deep)',
    detail: 'Pretrained on ImageNet-1k with deep residual skip connections. Achieves state-of-the-art results across all 38 classes.',
    accuracy: '99.70%',
    bestVal: '—',
    macroF1: '99.70%',
    best: true,
    status: 'AVAILABLE',
  },
  {
    id: 'efficientnet',
    icon: Zap,
    name: 'EfficientNet-B0',
    framework: 'TensorFlow Lite',
    frameworkColor: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
    approach: 'Transfer Learning → TFLite',
    fileFormat: '.tflite (FlatBuffer)',
    variant: 'EfficientNet-B0 FP32',
    detail: 'Compound scaled architecture optimized for edge devices and mobile deployment via TensorFlow Lite runtime.',
    accuracy: '97.28%',
    bestVal: '—',
    macroF1: '97.27%',
    status: 'AVAILABLE',
  },
];

export default function ModelsGridSection() {
  const { models } = useModels();

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Model Architectures & Status</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Live status and specifications for each deployed deep learning model.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {MODEL_DEFS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl bg-gray-800/50 border ${
                m.best ? 'border-leaf-500/50 shadow-lg shadow-leaf-950/50' : 'border-gray-700/50'
              } overflow-hidden flex flex-col justify-between`}
            >
              <div>
                {/* Header */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-900 border border-gray-700">
                      <m.icon className="w-6 h-6 text-leaf-400" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-leaf-900/50 border border-leaf-700/40 text-leaf-400 text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Ready & Active
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{m.name}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs border font-medium ${m.frameworkColor}`}>
                    {m.framework}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <p className="text-gray-400 text-sm leading-relaxed">{m.detail}</p>

                  <div className="space-y-2 text-xs border-t border-gray-700/40 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Approach:</span>
                      <span className="text-gray-300 font-medium">{m.approach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Variant:</span>
                      <span className="text-gray-300 font-medium">{m.variant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Format:</span>
                      <span className="text-leaf-400 font-mono">{m.fileFormat}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700/40">
                    <div className="p-2.5 rounded-xl bg-gray-900/70 border border-gray-700/40 text-center">
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Test Accuracy</span>
                      <span className={`text-sm font-bold ${m.best ? 'text-leaf-400' : 'text-white'}`}>{m.accuracy}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-900/70 border border-gray-700/40 text-center">
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Macro F1</span>
                      <span className="text-sm font-bold text-white">{m.macroF1}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <NavLink
                  to="/detect"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-700/40 hover:bg-leaf-600/20 hover:border-leaf-500/40 border border-gray-600/40 text-white text-xs font-semibold transition-all group"
                >
                  Test with Disease Detector <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
