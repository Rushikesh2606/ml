import { motion } from 'framer-motion';
import {
  Cpu,
  Layers,
  Smartphone,
  CheckCircle2,
  Trophy,
  Activity,
  Zap,
} from 'lucide-react';

/* ─── card data ───────────────────────────────────────────── */
const MODEL_CARDS = [
  {
    id: 'custom_cnn',
    name: 'Custom CNN (Baseline)',
    icon: Layers,
    framework: 'PyTorch 2.x',
    frameworkColor: 'orange',
    approach: 'Trained from Scratch',
    runtime: 'TorchScript / Python CPU/CUDA',
    format: '.pth (State Dict)',
    inputSize: '128 × 128 × 3 (RGB)',
    extra: 'Custom 4-block deep CNN with BatchNorm, ReLU, Dropout(0.5), and AdaptiveAvgPool2d trained directly on PlantVillage.',
    metrics: [
      { label: 'Test Accuracy', val: '95.37%' },
      { label: 'Best Val Accuracy', val: '98.55%' },
      { label: 'Macro Precision', val: '96.50%' },
      { label: 'Macro Recall', val: '52.40%' },
      { label: 'Macro F1-Score', val: '19.70%' },
    ],
    verifiedFeatures: [
      'Input resolution standardized to 128×128',
      'Normalized via ImageNet standard tensors',
      'Channels-last memory format optimized',
      'Fully verified live inference in backend',
    ],
  },
  {
    id: 'resnet',
    name: 'ResNet-50 (Transfer Learning)',
    icon: Cpu,
    framework: 'PyTorch 2.x',
    frameworkColor: 'green',
    approach: 'Transfer Learning & Fine-Tuning',
    runtime: 'PyTorch TorchVision Backbone',
    format: '.pth (State Dict)',
    inputSize: '224 × 224 × 3 (RGB)',
    best: true,
    extra: 'Deep 50-layer residual network pretrained on ImageNet-1k, utilizing identity skip connections to conquer vanishing gradients.',
    metrics: [
      { label: 'Test Accuracy', val: '99.70%' },
      { label: 'Macro Precision', val: '99.70%' },
      { label: 'Macro Recall', val: '99.70%' },
      { label: 'Macro F1-Score', val: '99.70%' },
      { label: 'Weighted F1-Score', val: '99.70%' },
    ],
    verifiedFeatures: [
      '224×224 resolution with ImageNet norm',
      'Fine-tuned linear classification head (38 classes)',
      'Identical test split top-1 benchmark score',
      'Highest overall performance across all 38 classes',
    ],
  },
  {
    id: 'efficientnet',
    name: 'EfficientNet-B0 (Edge ML)',
    icon: Smartphone,
    framework: 'TensorFlow Lite',
    frameworkColor: 'blue',
    approach: 'Transfer Learning → TFLite Export',
    runtime: 'TFLite Interpreter / XNNPACK',
    format: '.tflite (FlatBuffer)',
    inputSize: '224 × 224 × 3 (RGB)',
    extra: 'Compound scaling of network depth, width, and resolution. Exported to TFLite FP32 for low-memory edge and mobile execution.',
    metrics: [
      { label: 'Test Accuracy', val: '97.28%' },
      { label: 'Macro Precision', val: '97.45%' },
      { label: 'Macro Recall', val: '97.28%' },
      { label: 'Macro F1-Score', val: '97.27%' },
      { label: 'Weighted F1-Score', val: '97.27%' },
    ],
    verifiedFeatures: [
      'Lightweight FlatBuffer format (.tflite)',
      'Mobile/edge inference via CPU XNNPACK delegate',
      'Fast inference latency with 97.28% test accuracy',
      'Robust generalization across PlantVillage leaves',
    ],
  },
];

function ModelCard({ card, index }) {
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className={`flex flex-col rounded-2xl border ${
        card.best ? 'border-leaf-500/50 bg-leaf-950/20' : 'border-white/10 bg-white/5'
      } backdrop-blur-sm overflow-hidden relative`}
    >
      {card.best && (
        <div className="bg-leaf-600 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-1.5 shadow-sm">
          <Trophy className="w-3.5 h-3.5" /> Best Performing Architecture
        </div>
      )}

      {/* header */}
      <div className="flex items-start justify-between gap-4 p-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-leaf-600/15 border border-leaf-600/25">
            <Icon className="w-5 h-5 text-leaf-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-base leading-tight">
              {card.name}
            </h3>
            <span className="text-xs text-leaf-400 font-mono mt-0.5 block">{card.framework}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-leaf-900/40 border border-leaf-700/40 text-leaf-400 text-xs font-semibold">
          <CheckCircle2 className="w-3 h-3" /> Ready & Live
        </span>
      </div>

      {/* body */}
      <div className="flex-1 p-5 space-y-4">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Approach:</span>
            <span className="text-gray-200 font-medium">{card.approach}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Runtime:</span>
            <span className="text-gray-200 font-medium">{card.runtime}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Input Resolution:</span>
            <span className="text-gray-200 font-medium font-mono">{card.inputSize}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-gray-400">Model Artifact:</span>
            <span className="text-leaf-400 font-mono">{card.format}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-leaf-600/40 pl-3">
          {card.extra}
        </p>

        {/* Verified Metrics Grid */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Verified Benchmarks (Test Set)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {card.metrics.map(m => (
              <div key={m.label} className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 block truncate">{m.label}</span>
                <span className={`text-xs font-bold ${card.best ? 'text-leaf-400' : 'text-white'}`}>
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Features */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Integration Status
          </p>
          <ul className="space-y-1">
            {card.verifiedFeatures.map(item => (
              <li key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-leaf-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function ModelArchitectureSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-600/10 border border-leaf-600/25 text-leaf-400 text-xs font-medium mb-4">
            <Activity className="w-3.5 h-3.5" />
            Verified Architectures
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Deep Learning Architectures
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            All three architectures are integrated with verified weights, tested live inference, and rigorous held-out test evaluations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MODEL_CARDS.map((card, i) => (
            <ModelCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
