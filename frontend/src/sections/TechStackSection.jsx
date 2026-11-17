import { motion } from 'framer-motion';

const stack = [
  { name: 'React', role: 'Frontend UI', color: 'bg-blue-900/40 border-blue-700/40 text-blue-300' },
  { name: 'Vite', role: 'Build Tool', color: 'bg-purple-900/40 border-purple-700/40 text-purple-300' },
  { name: 'Tailwind CSS', role: 'Styling', color: 'bg-cyan-900/40 border-cyan-700/40 text-cyan-300' },
  { name: 'Framer Motion', role: 'Animations', color: 'bg-pink-900/40 border-pink-700/40 text-pink-300' },
  { name: 'Recharts', role: 'Data Visualisation', color: 'bg-green-900/40 border-green-700/40 text-green-300' },
  { name: 'FastAPI', role: 'Backend API', color: 'bg-teal-900/40 border-teal-700/40 text-teal-300' },
  { name: 'PyTorch', role: 'CNN & ResNet Inference', color: 'bg-orange-900/40 border-orange-700/40 text-orange-300' },
  { name: 'TFLite Runtime', role: 'EfficientNet Inference', color: 'bg-yellow-900/40 border-yellow-700/40 text-yellow-300' },
  { name: 'scikit-learn', role: 'Evaluation Metrics', color: 'bg-red-900/40 border-red-700/40 text-red-300' },
  { name: 'Pillow / OpenCV', role: 'Image Processing', color: 'bg-indigo-900/40 border-indigo-700/40 text-indigo-300' },
];

export default function TechStackSection() {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Technology Stack</h2>
          <p className="text-gray-400">Open-source tools powering this research platform.</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3">
          {stack.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`px-4 py-3 rounded-xl border ${t.color} flex flex-col items-center`}
            >
              <span className="font-semibold text-sm">{t.name}</span>
              <span className="text-xs opacity-70 mt-0.5">{t.role}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-gray-800/40 border border-gray-700/50 text-center max-w-3xl mx-auto">
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-white">Academic Disclaimer:</strong> This platform is developed for academic research purposes.
            Predictions are for research evaluation only and should not be used for actual agricultural decision-making
            without expert consultation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
