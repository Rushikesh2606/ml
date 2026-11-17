import { motion } from 'framer-motion';
import { Target, Leaf, TrendingUp, Shield } from 'lucide-react';

export default function ProjectContextSection() {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-display font-bold text-white mb-6">Research Motivation</h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>
                Crop diseases are among the leading causes of agricultural yield loss worldwide. Early and accurate detection
                enables timely intervention and reduces crop damage, chemical use, and economic losses for farmers.
              </p>
              <p>
                Traditional disease identification relies on expert visual inspection — a process that is slow, expensive,
                and not scalable to the size of modern agriculture. Deep learning offers a path toward automated,
                scalable, and accessible disease detection.
              </p>
              <p>
                This research evaluates three deep learning architectures — a custom CNN built from scratch and two
                transfer-learning approaches (ResNet and EfficientNet) — to understand the trade-offs between model
                complexity, performance, and practical deployment.
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, title: 'Objective', desc: 'Comparative evaluation of CNN and transfer learning architectures for plant disease classification.' },
              { icon: Leaf, title: 'Domain', desc: 'Agricultural AI — automated crop leaf disease identification using computer vision.' },
              { icon: TrendingUp, title: 'Contribution', desc: 'Empirical benchmarks to guide architecture selection for future agricultural AI deployments.' },
              { icon: Shield, title: 'Integrity', desc: 'All results from verified experiments. No fabricated data or cross-split comparisons.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl bg-gray-800/50 border border-gray-700/50">
                <Icon className="w-6 h-6 text-leaf-400 mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
