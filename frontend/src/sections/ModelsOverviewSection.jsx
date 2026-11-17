import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Layers, Cpu, Zap, ChevronRight, Trophy } from 'lucide-react';
import clsx from 'clsx';

const architectures = [
  {
    id: 'custom-cnn',
    Icon: Layers,
    title: 'Custom CNN',
    badge: 'PyTorch',
    tag: 'Trained from Scratch',
    description:
      'A custom convolutional neural network architecture designed and trained from scratch on PlantVillage. Provides baseline performance without pretrained feature extraction.',
    testAccuracy: '95.37%',
    macroF1: '19.7%',
    weighted: '19.8%',
    note: 'Best Val Acc: 98.55%',
    color: 'border-blue-700/30',
    accentColor: 'text-blue-400',
  },
  {
    id: 'resnet',
    Icon: Cpu,
    title: 'ResNet-50',
    badge: 'PyTorch',
    tag: 'Transfer Learning',
    description:
      'ResNet-50 pretrained on ImageNet and fine-tuned for 38-class crop disease classification. Achieves top performance via deep residual connections and ImageNet features.',
    testAccuracy: '99.70%',
    macroF1: '99.70%',
    weighted: '99.70%',
    note: 'Best performing model',
    best: true,
    color: 'border-leaf-700/40',
    accentColor: 'text-leaf-400',
  },
  {
    id: 'efficientnet',
    Icon: Zap,
    title: 'EfficientNet-B0',
    badge: 'TensorFlow Lite',
    tag: 'Transfer Learning',
    description:
      'EfficientNet-B0 fine-tuned on PlantVillage and exported to TFLite format. Delivers strong accuracy with compound model scaling and efficient inference.',
    testAccuracy: '97.28%',
    macroF1: '97.27%',
    weighted: '97.27%',
    note: 'Most portable — runs as TFLite',
    color: 'border-purple-700/30',
    accentColor: 'text-purple-400',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.15, ease: 'easeOut' },
  }),
};

export default function ModelsOverviewSection() {
  return (
    <section className="relative py-24 bg-gray-900 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(74,222,128,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-14 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-leaf-400 rounded-full" />
            <span className="text-leaf-400 text-sm font-semibold uppercase tracking-widest">
              Architectures
            </span>
            <span className="h-px w-10 bg-leaf-400 rounded-full" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Research Architectures
          </h2>
          <p className="text-gray-400 max-w-xl text-base sm:text-lg">
            Three distinct deep learning approaches evaluated under identical conditions on PlantVillage (38 classes)
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {architectures.map((arch, i) => {
            const { Icon } = arch;
            return (
              <motion.div
                key={arch.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 32px 0 rgba(74,222,128,0.12)' }}
                className={clsx(
                  'group relative flex flex-col gap-5 p-6 rounded-2xl',
                  'bg-white/5 border backdrop-blur-sm',
                  arch.color,
                  'transition-all duration-300'
                )}
              >
                {arch.best && (
                  <div className="absolute -top-3 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-leaf-600 text-white text-xs font-bold">
                      <Trophy className="w-3 h-3" /> Best
                    </span>
                  </div>
                )}

                {/* Icon + badge row */}
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-leaf-900/40 border border-leaf-800/40 group-hover:border-leaf-600/40 transition-colors">
                    <Icon className="w-6 h-6 text-leaf-400" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-gray-800 border border-gray-700 text-xs text-gray-300 font-medium">
                    {arch.badge}
                  </span>
                </div>

                {/* Title + tag */}
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">{arch.title}</h3>
                  <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-leaf-900/50 text-leaf-300 border border-leaf-800/50">
                    {arch.tag}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed flex-1">{arch.description}</p>

                {/* Real metrics */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Test Accuracy</span>
                    <span className={`font-bold ${arch.accentColor}`}>{arch.testAccuracy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Macro F1</span>
                    <span className="text-white font-semibold">{arch.macroF1}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 pt-1">
                    <span>{arch.note}</span>
                  </div>
                </div>

                {/* View details link */}
                <NavLink
                  to="/models"
                  className="inline-flex items-center gap-1 text-leaf-400 hover:text-leaf-300 text-sm font-medium transition-colors group-hover:gap-2"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </NavLink>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
