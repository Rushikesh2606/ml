import { motion } from 'framer-motion';
import { Scan, Upload, Cpu } from 'lucide-react';

export default function DetectHeroSection() {
  return (
    <section className="py-20 px-4 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-900/50 border border-leaf-700/50 text-leaf-400 text-sm font-medium mb-6">
            Live Inference
          </span>
          <h1 className="text-5xl font-display font-bold text-white mb-6">
            Crop Leaf <span className="text-gradient">Disease Detector</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Upload a crop leaf image and select a model to run disease classification.
            Only models with uploaded weights are available for inference.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Upload, label: 'Upload leaf image' },
              { icon: Cpu, label: 'Select architecture' },
              { icon: Scan, label: 'Get prediction' },
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
