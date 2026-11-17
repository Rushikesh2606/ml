import { Link } from 'react-router-dom';
import { Leaf, Github, ExternalLink } from 'lucide-react';

const navColumns = [
  {
    heading: 'Platform',
    links: [
      { to: '/', label: 'Home' },
      { to: '/models', label: 'Models' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/detect', label: 'Disease Detector' },
    ],
  },
  {
    heading: 'Research',
    links: [
      { to: '/methodology', label: 'Methodology' },
      { to: '/about', label: 'About the Project' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto bg-gray-950 border-t border-white/5 overflow-hidden">
      {/* Decorative leaf background element */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 opacity-[0.03]">
        <svg viewBox="0 0 200 200" fill="currentColor" className="text-leaf-400 w-full h-full">
          <path d="M100 10 C140 10, 190 50, 190 100 C190 150, 150 190, 100 190 C50 190, 10 150, 10 100 C10 60, 40 10, 100 10Z" />
          <path d="M100 10 L100 190 M10 100 L190 100" stroke="white" strokeWidth="1" fill="none" />
          <path d="M100 10 C80 60, 60 80, 10 100 C60 120, 80 140, 100 190 C120 140, 140 120, 190 100 C140 80, 120 60, 100 10Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-leaf-600/20 border border-leaf-500/30">
                <Leaf className="w-4 h-4 text-leaf-400" />
              </div>
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-leaf-400 to-leaf-300 text-base">
                PhytoTurboNet
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              A comparative study of deep learning architectures — Custom CNN, ResNet-50, and
              EfficientNet-B0 — applied to crop leaf disease detection using the PlantVillage
              dataset.
            </p>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-gray-500 hover:text-gray-200 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Disclaimer column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Disclaimer
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              This platform is developed for <span className="text-amber-500">academic research</span> purposes.
              Predictions are for research evaluation only and{' '}
              <span className="text-amber-500">should not be used</span> for actual agricultural
              decision-making without expert consultation.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span>© {year} PhytoTurboNet Research Project. For academic use only.</span>
          <span className="flex items-center gap-1">
            Built with <span className="text-leaf-500 mx-0.5">♥</span> for agricultural AI research
          </span>
        </div>
      </div>
    </footer>
  );
}
