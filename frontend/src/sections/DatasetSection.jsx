import { motion } from 'framer-motion';
import { Database, CheckCircle2, Sprout, Layers, Image } from 'lucide-react';

export default function DatasetSection() {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-leaf-400 font-semibold text-sm">01 / Dataset</span>
            <h2 className="text-3xl font-display font-bold text-white mt-2 mb-4">PlantVillage Crop Disease Benchmark</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              All three architectures were trained and evaluated on the standardized <strong className="text-white">PlantVillage</strong> dataset.
              The dataset contains over 54,000 high-resolution leaf images spanning 14 agricultural crop species
              across 38 distinct classes (including healthy foliage and 26 distinct plant pathologies).
            </p>
            <div className="p-4 rounded-xl bg-leaf-900/30 border border-leaf-700/40 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-leaf-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-leaf-300 font-semibold text-sm">Standardized 38-Class Taxonomy</p>
                <p className="text-gray-400 text-xs mt-1">
                  Covers Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-3">
            {[
              { label: 'Benchmark Dataset', value: 'PlantVillage (Crowdsourced Expert Verified)' },
              { label: 'Total Cataloged Images', value: '54,306 images' },
              { label: 'Classification Classes', value: '38 distinct categories' },
              { label: 'Crop Species Covered', value: '14 agricultural species' },
              { label: 'Split Protocol', value: '70% Train / 15% Val / 15% Held-Out Test' },
              { label: 'Source Resolution', value: '256 × 256 RGB' },
              { label: 'Model Input Dimensions', value: '128×128 (CNN) | 224×224 (ResNet / EfficientNet)' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center p-3.5 rounded-xl bg-gray-800/60 border border-gray-700/40">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className="text-gray-200 text-sm font-semibold text-right">{value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
