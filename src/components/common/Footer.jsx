import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ExternalLink, X, Link2, Mail } from 'lucide-react';

const Footer = () => {
  const links = {
    Platform: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Quiz', path: '/quiz' },
      { name: 'Leaderboard', path: '/leaderboard' },
      { name: 'My Vault', path: '/vault' },
    ],
    Community: [
      { name: 'Echo Forum', path: '/echo' },
      { name: 'AI Tutor', path: '/assistant' },
      { name: 'About Us', path: '/about' },
    ],
  };

  const socials = [
    { icon: <ExternalLink className="w-4 h-4" />, href: '#', label: 'Code' },
    { icon: <X className="w-4 h-4" />, href: '#', label: 'Twitter / X' },
    { icon: <Link2 className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
    { icon: <Mail className="w-4 h-4" />, href: '#', label: 'Email' },
  ];

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-7 h-7 text-accent2" />
              <span className="font-display font-bold text-xl">SkillTrove</span>
            </Link>
            <p className="text-white/60 font-body text-sm leading-relaxed max-w-sm">
              An AI-powered secure assessment and adaptive learning platform for university students. Experience integrity and intelligence combined.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent/80 flex items-center justify-center transition-all hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-display font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-white/60 hover:text-accent2 text-sm font-body transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs font-body">
            © {new Date().getFullYear()} SkillTrove. All rights reserved. Built for learners, by learners.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/70 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
