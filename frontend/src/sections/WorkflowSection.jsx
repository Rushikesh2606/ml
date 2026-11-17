import { motion } from 'framer-motion';
import { Database, Settings, Layers, Cpu, BarChart3, Award, Scan, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Database, number: '01', title: 'Dataset', description: 'Agricultural crop leaf image dataset covering multiple disease categories and healthy samples.' },
  { icon: Settings, number: '02', title: 'Preprocessing', description: 'Image resizing, normalization, and augmentation (flip, rotation, color jitter) matched to each model\'s training config.' },
  { icon: Layers, number: '03', title: 'Architecture Design', description: 'Custom CNN from scratch. ResNet and EfficientNet adapted from ImageNet pretrained weights.' },
  { icon: Cpu, number: '04', title: 'Model Training', description: 'PyTorch for Custom CNN and ResNet. TensorFlow/Keras for EfficientNet, exported to TFLite.' },
  { icon: BarChart3, number: '05', title: 'Evaluation', description: 'Identical held-out test set for all three models. Metrics: Accuracy, Precision, Recall, F1, MCC, Cohen Kappa.' },
  { icon: Award, number: '06', title: 'Comparative Analysis', description: 'Side-by-side comparison under identical evaluation conditions. No cross-split metric comparisons.' },
  { icon: Scan, number: '07', title: 'Disease Detection', description: 'Live inference API for all available models via interactive web interface.' },
];

export default function WorkflowSection() {
  return (
    <section className="py-24 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-900/50 border border-leaf-700/50 text-leaf-400 text-sm font-medium mb-4">
            Research Pipeline
          </span>
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            Research <span className="text-gradient">Workflow</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A systematic pipeline from raw data to comparative analysis and live disease detection.
          </p>
        </motion.div>

        {/* Desktop: horizontal flow */}
        <div className="hidden lg:flex items-start gap-0 overflow-x-auto pb-4">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start min-w-0 flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex-1 flex flex-col items-center text-center px-3"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-leaf-700/40 flex items-center justify-center group-hover:border-leaf-500 transition-colors">
                    <step.icon className="w-7 h-7 text-leaf-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-leaf-700 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.description}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="flex-shrink-0 mt-8 text-leaf-700">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-4 p-4 rounded-2xl bg-gray-800/50 border border-gray-700/40"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800 border border-leaf-700/40 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-leaf-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-leaf-500">{step.number}</span>
                  <h3 className="text-white font-semibold text-sm">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
