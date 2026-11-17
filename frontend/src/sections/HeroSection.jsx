import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import bgVideo from '../assets/bg1.mp4';

// Floating particle component
const Particle = ({ x, y, size, delay, duration }) => (
  <motion.div
    className="absolute rounded-full bg-leaf-400/40 pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.round((i * 37 + 11) % 97),
  y: Math.round((i * 53 + 7) % 95),
  size: (i % 3) + 3,
  delay: (i * 0.4) % 3,
  duration: 4 + (i % 4),
}));

// Abstract Leaf + Circuit SVG
const LeafCircuitSVG = () => (
  <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Glow filter */}
    <defs>
      <radialGradient id="leafGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#052e16" stopOpacity="0" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Background glow circle */}
    <circle cx="160" cy="160" r="130" fill="url(#leafGrad)" />

    {/* Leaf shape */}
    <path
      d="M160 60 C210 80 250 130 240 180 C230 230 190 265 160 270 C130 265 90 230 80 180 C70 130 110 80 160 60Z"
      fill="#16a34a" fillOpacity="0.15" stroke="#4ade80" strokeWidth="1.5" filter="url(#glow)"
    />
    {/* Leaf midrib */}
    <line x1="160" y1="65" x2="160" y2="265" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
    {/* Leaf veins */}
    {[80, 100, 120, 140, 160, 180, 200, 220].map((y, i) => (
      <g key={i}>
        <line x1="160" y1={y} x2={160 - 40 + i * 3} y2={y + 20} stroke="#4ade80" strokeWidth="0.8" opacity="0.4" />
        <line x1="160" y1={y} x2={160 + 40 - i * 3} y2={y + 20} stroke="#4ade80" strokeWidth="0.8" opacity="0.4" />
      </g>
    ))}

    {/* Circuit nodes */}
    {[
      [100, 110], [220, 110], [80, 180], [240, 180],
      [120, 240], [200, 240], [160, 90],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="5" fill="#4ade80" opacity="0.8" filter="url(#glow)" />
        <circle cx={cx} cy={cy} r="9" stroke="#4ade80" strokeWidth="0.8" opacity="0.3" fill="none" />
      </g>
    ))}

    {/* Circuit lines connecting nodes */}
    <polyline points="100,110 120,110 120,90 160,90" stroke="#4ade80" strokeWidth="0.8" opacity="0.5" fill="none" />
    <polyline points="220,110 200,110 200,90 160,90" stroke="#4ade80" strokeWidth="0.8" opacity="0.5" fill="none" />
    <polyline points="80,180 100,180 100,110" stroke="#4ade80" strokeWidth="0.8" opacity="0.5" fill="none" />
    <polyline points="240,180 220,180 220,110" stroke="#4ade80" strokeWidth="0.8" opacity="0.5" fill="none" />
    <polyline points="80,180 120,240" stroke="#4ade80" strokeWidth="0.8" opacity="0.5" fill="none" />
    <polyline points="240,180 200,240" stroke="#4ade80" strokeWidth="0.8" opacity="0.5" fill="none" />

    {/* Neural network dots grid in center */}
    {[140, 160, 180].map((cx) =>
      [130, 160, 190].map((cy, j) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#86efac" opacity="0.6" />
      ))
    )}

    {/* Outer decorative ring */}
    <circle cx="160" cy="160" r="135" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="6 10" opacity="0.3" />
  </svg>
);

const stats = [
  '3 Deep Architectures',
  '38 Crop Disease Classes',
  '🏆 99.70% Accuracy (ResNet-50)',
  '⚡ Real-Time Inference',
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-950 pt-20 pb-12">
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          src={bgVideo}
        />
        {/* Gradient overlays to blend video with dark theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-gray-950/60" />
      </div>

      {/* Radial gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(20,83,45,0.25) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(74,222,128,0.05) 0%, transparent 60%)',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* Left side — 60% */}
          <motion.div
            className="flex-1 lg:max-w-[60%] flex flex-col gap-6"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm w-fit text-sm text-leaf-300 font-medium">
              🌿 Agricultural AI Research Platform
            </div>

            {/* H1 */}
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
              Comparative Analysis of{' '}
              <span className="bg-gradient-to-r from-leaf-400 to-leaf-300 bg-clip-text text-transparent">
                Deep Learning
              </span>{' '}
              Architectures for Crop Leaf Disease Detection
            </h1>

            {/* Subtext */}
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              An AI-powered research platform exploring the effectiveness of custom convolutional
              neural networks and transfer learning architectures in identifying crop leaf diseases
              across agricultural datasets.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <NavLink
                to="/models"
                className={clsx(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm',
                  'bg-leaf-600 hover:bg-leaf-500 text-white transition-all duration-200',
                  'shadow-lg shadow-leaf-900/40 hover:shadow-leaf-800/50'
                )}
              >
                Explore Models <ChevronRight className="w-4 h-4" />
              </NavLink>
              <NavLink
                to="/detect"
                className={clsx(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm',
                  'bg-white/5 hover:bg-white/10 text-white border border-white/10',
                  'backdrop-blur-sm transition-all duration-200'
                )}
              >
                Try Disease Detector <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>

            {/* Quick stat pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              {stats.map((stat) => (
                <span
                  key={stat}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm text-gray-300 font-medium"
                >
                  {stat}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right side — 40% */}
          <motion.div
            className="flex-shrink-0 lg:max-w-[40%] w-full max-w-sm lg:max-w-none flex justify-center items-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          >
            {/* Pulse rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border border-leaf-400/20"
                style={{ width: 220 + ring * 60, height: 220 + ring * 60 }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{
                  duration: 3 + ring * 0.5,
                  delay: ring * 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Floating card */}
            <motion.div
              className={clsx(
                'relative z-10 w-72 h-72 sm:w-80 sm:h-80',
                'rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md',
                'shadow-2xl shadow-leaf-900/30 p-6 flex items-center justify-center'
              )}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LeafCircuitSVG />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="tracking-widest uppercase text-[10px]">Scroll</span>
        <motion.div
          className="w-0.5 h-6 bg-gradient-to-b from-leaf-400/50 to-transparent rounded-full"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
