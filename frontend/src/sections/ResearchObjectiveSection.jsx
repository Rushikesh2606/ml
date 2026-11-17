import React from 'react';
import { motion } from 'framer-motion';
import { Award, BarChart3, Scan, FlaskConical, Layers } from 'lucide-react';
import clsx from 'clsx';

const objectives = [
  { Icon: Layers, text: 'Evaluate custom CNN performance from scratch' },
  { Icon: FlaskConical, text: 'Compare against transfer learning architectures' },
  { Icon: BarChart3, text: 'Measure accuracy, precision, recall, and F1-score' },
  { Icon: Scan, text: 'Provide live disease detection capability' },
  { Icon: Award, text: 'Establish comparative baseline for future research' },
];

export default function ResearchObjectiveSection() {
  return (
    <section className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Diagonal green accent line */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(22,163,74,0.06) 0%, transparent 50%), radial-gradient(ellipse 50% 70% at 10% 60%, rgba(74,222,128,0.07) 0%, transparent 70%)',
        }}
      />
      {/* Decorative top-left leaf pattern (pure CSS) */}
      <div className="absolute top-0 left-0 w-72 h-72 opacity-5 pointer-events-none">
        <svg viewBox="0 0 288 288" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M144 10 C200 40 260 110 240 180 C220 250 170 280 144 280 C118 280 68 250 48 180 C28 110 88 40 144 10Z"
            fill="#4ade80" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="flex items-center gap-3 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="h-px w-10 bg-leaf-400 rounded-full" />
          <span className="text-leaf-400 text-sm font-semibold uppercase tracking-widest">
            Objective
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex flex-col gap-6"
          >
            {/* Decorative number accent */}
            <div className="font-display text-8xl sm:text-9xl font-black text-leaf-900/40 leading-none select-none">
              01
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white -mt-6">
              Research Objective
            </h2>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              This research aims to rigorously compare the performance of distinct deep learning
              architectures — a custom-built convolutional neural network, ResNet, and EfficientNet
              — in detecting and classifying crop leaf diseases.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              Plant diseases are a major threat to global food security, causing significant
              agricultural losses each year. By leveraging AI-driven detection, farmers and
              researchers can identify diseases early, minimizing crop damage and reducing reliance
              on broad-spectrum pesticide application. This platform provides a reproducible,
              data-driven comparative framework to guide future research and real-world deployment.
            </p>
          </motion.div>

          {/* Right column — objective bullets */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {objectives.map(({ Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                className={clsx(
                  'flex items-start gap-4 p-4 rounded-xl',
                  'bg-white/4 border border-white/8 backdrop-blur-sm',
                  'hover:border-leaf-700/40 hover:bg-white/7 transition-all duration-200'
                )}
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-leaf-900/50 border border-leaf-800/40">
                  <Icon className="w-5 h-5 text-leaf-400" />
                </div>
                <span className="text-gray-200 text-sm sm:text-base leading-snug pt-0.5">
                  {text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
