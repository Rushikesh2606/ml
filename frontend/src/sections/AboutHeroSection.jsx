import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function AboutHeroSection() {
  return (
    <section className="py-20 px-4 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-900/50 border border-leaf-700/50 text-leaf-400 text-sm font-medium mb-6">
            About the Research
          </span>
          <h1 className="text-5xl font-display font-bold text-white mb-6">
            About This <span className="text-gradient">Project</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            An academic research project exploring the application of deep learning for automated crop leaf disease identification.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
