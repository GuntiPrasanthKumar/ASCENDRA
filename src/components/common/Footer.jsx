import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const productLinks = [
    { name: 'Learning Hub', path: '/learn' },
    { name: 'Practice Arena', path: '/practice' },
    { name: 'CodeLab Workspace', path: '/codelab' },
    { name: 'AI Interview Studio', path: '/interview' },
    { name: 'AI Mentor', path: '/ai-mentor' },
    { name: 'Career Insights', path: '/my-learning' },
  ];

  const resourceLinks = [
    { name: 'Documentation', path: '/learn' },
    { name: 'API Reference', path: '/codelab' },
    { name: 'Placement Guide', path: '/interview' },
    { name: 'Proctoring SLA', path: '/settings' },
    { name: 'Security & Privacy', path: '/settings' },
  ];

  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200/80 mt-auto relative z-10 font-body">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        
        {/* Top Header & Columns */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
          
          {/* Left Title */}
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-slate-900 tracking-tight leading-snug mb-3">
              Where intelligence meets ambition.
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Empowering the next generation of engineers with AI learning, code diagnostic engines, and proctored interview rehearsals.
            </p>
          </div>

          {/* Right Link Columns - Google Antigravity Style */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Product Column */}
            <div>
              <h4 className="font-display font-bold text-xs text-slate-900 tracking-tight mb-4">
                Product
              </h4>
              <ul className="space-y-2.5">
                {productLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-display font-bold text-xs text-slate-900 tracking-tight mb-4">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {resourceLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Massive Iconic Brand Typography - Google Antigravity Style */}
        <div className="w-full overflow-hidden select-none my-6 md:my-12">
          <h1 className="text-[14vw] font-display font-medium tracking-tighter text-slate-900 leading-none -ml-1 sm:-ml-2">
            Ascendra
          </h1>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-6 w-auto object-contain" />
            <span className="text-xs text-slate-400 font-medium">
              © {new Date().getFullYear()} ASCENDRA. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-slate-600 font-medium">
            <Link to="/about" className="hover:text-slate-900 transition-colors">About ASCENDRA</Link>
            <Link to="/learn" className="hover:text-slate-900 transition-colors">Platform Status</Link>
            <Link to="/settings" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="/settings" className="hover:text-slate-900 transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
