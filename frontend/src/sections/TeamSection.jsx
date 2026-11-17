// TeamSection — placeholder for research team details
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function TeamSection() {
  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Research Team</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-10">Academic research project team details can be added here.</p>
          <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50">
            <div className="w-16 h-16 rounded-full bg-leaf-900/50 border border-leaf-700/40 flex items-center justify-center">
              <User className="w-8 h-8 text-leaf-400" />
            </div>
            <p className="text-gray-300 font-semibold">Research Author</p>
            <p className="text-gray-500 text-sm">Academic Institution — Department of Computer Science</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
