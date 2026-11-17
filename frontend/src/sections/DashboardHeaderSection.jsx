import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Trophy } from 'lucide-react';

const HIGHLIGHTS = [
  { label: 'ResNet-50 Test Accuracy', value: '99.70%', color: 'text-leaf-400' },
  { label: 'EfficientNet Test Accuracy', value: '97.28%', color: 'text-purple-400' },
  { label: 'Custom CNN Test Accuracy', value: '95.37%', color: 'text-blue-400' },
];

export default function DashboardHeaderSection() {
  return (
    <section className="py-20 px-4 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-900/50 border border-leaf-700/50 text-leaf-400 text-sm font-medium mb-6">
            Research Dashboard
          </span>
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            Performance <span className="text-gradient">Comparison</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Verified evaluation results on the held-out PlantVillage test set across three deep learning architectures — Custom CNN, ResNet-50, and EfficientNet-B0.
          </p>

          {/* Quick accuracy pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {HIGHLIGHTS.map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-800/60 border border-gray-700/50 text-sm">
                <span className="text-gray-400">{label}:</span>
                <span className={`font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: BarChart3, label: 'Comparative Metrics' },
              { icon: TrendingUp, label: 'All 38 Classes' },
              { icon: Trophy, label: 'ResNet-50 Best Model' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/60 border border-gray-700/50 text-gray-300 text-sm">
                <Icon className="w-4 h-4 text-leaf-400" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
