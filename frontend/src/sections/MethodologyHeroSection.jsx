import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

export default function MethodologyHeroSection() {
  return (
    <section className="py-20 px-4 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-900/50 border border-leaf-700/50 text-leaf-400 text-sm font-medium mb-6">
            Research Methodology
          </span>
          <h1 className="text-5xl font-display font-bold text-white mb-6">
            Experimental <span className="text-gradient">Design</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            A rigorous, reproducible experimental framework ensuring fair comparison across all three deep learning architectures.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
